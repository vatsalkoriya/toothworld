"use client";

import { useState, useEffect, memo, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, User, ChevronLeft, ChevronRight, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { findMany, insertOne } from "@/integrations/mongodb/utils";
import { useToast } from "@/hooks/use-toast";

const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

const services = [
    "General Checkup", "Teeth Cleaning", "Teeth Whitening", "Fillings",
    "Root Canal", "Orthodontic Consultation", "Dental Implant Consultation", "Emergency Care",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type Dentist = { _id: string; id: number; name: string; specialty: string; avatar: string; rating?: number; reviews?: number; };

const CalendarPicker = memo(({ selected, onChange }: { selected: Date | null; onChange: (d: Date) => void }) => {
    const [view, setView] = useState(() => {
        const d = new Date();
        return { month: d.getMonth(), year: d.getFullYear() };
    });

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const firstDay = useMemo(() => new Date(view.year, view.month, 1).getDay(), [view.month, view.year]);
    const daysInMonth = useMemo(() => new Date(view.year, view.month + 1, 0).getDate(), [view.month, view.year]);

    const prev = useCallback(() => {
        setView(v => v.month === 0 ? { month: 11, year: v.year - 1 } : { ...v, month: v.month - 1 });
    }, []);
    const next = useCallback(() => {
        setView(v => v.month === 11 ? { month: 0, year: v.year + 1 } : { ...v, month: v.month + 1 });
    }, []);

    return (
        <div className="rounded-2xl border border-border p-4" style={{ background: "hsl(var(--card))" }}>
            <div className="flex items-center justify-between mb-4">
                <button onClick={prev} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-sm">{MONTHS[view.month]} {view.year}</span>
                <button onClick={next} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map(d => <div key={d} className="text-center text-xs font-medium py-1" style={{ color: "hsl(var(--muted-foreground))" }}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(view.year, view.month, day);
                    const isPast = date < today;
                    const isSelected = selected?.toDateString() === date.toDateString();
                    const isToday = date.toDateString() === today.toDateString();
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                    return (
                        <button
                            key={day}
                            disabled={isPast || isWeekend}
                            onClick={() => onChange(date)}
                            className={`h-8 w-8 mx-auto rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center
                ${isPast || isWeekend ? "opacity-30 cursor-not-allowed" : "hover:bg-accent cursor-pointer"}
                ${isSelected ? "text-white" : ""}
                ${isToday && !isSelected ? "border font-bold" : ""}
              `}
                            style={{
                                background: isSelected ? "hsl(var(--primary))" : undefined,
                                borderColor: isToday ? "hsl(var(--primary))" : undefined,
                                color: isSelected ? "white" : isToday ? "hsl(var(--primary))" : undefined,
                            }}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
});
CalendarPicker.displayName = "CalendarPicker";

export default function BookAppointment() {
    const [step, setStep] = useState(1);
    const [dentists, setDentists] = useState<Dentist[]>([]);
    const [loadingDentists, setLoadingDentists] = useState(true);
    const [selectedDentist, setSelectedDentist] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<string>("");
    const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchDentists = async () => {
            const { data } = await findMany("dentists", {}, { sort: { id: 1 } });
            if (data) setDentists(data);
            setLoadingDentists(false);
        };
        fetchDentists();
    }, []);

    const fetchUnavailableSlots = useCallback(async () => {
        if (!selectedDentist || !selectedDate) return;
        setLoadingSlots(true);
        const dayName = DAYS[selectedDate.getDay()];
        const dentistObj = dentists.find(d => d._id === selectedDentist);
        const dateString = selectedDate.toDateString();

        const [blockedRes, appointmentsRes] = await Promise.all([
            findMany("blocked_slots", { dentist_id: selectedDentist, day: dayName }),
            findMany("appointments", {
                dentist: dentistObj?.name ?? "",
                date: dateString,
                status: { $in: ["pending", "confirmed"] }
            }),
        ]);
        const blocked = (blockedRes.data || []).map((r: { slot: string }) => r.slot);
        const booked = (appointmentsRes.data || []).map((r: { time: string }) => r.time);
        setBookedSlots(Array.from(new Set([...blocked, ...booked])));
        setLoadingSlots(false);
    }, [selectedDentist, selectedDate, dentists]);

    useEffect(() => {
        fetchUnavailableSlots();
        const interval = setInterval(fetchUnavailableSlots, 30000);
        return () => clearInterval(interval);
    }, [fetchUnavailableSlots]);

    const canNext = () => {
        if (step === 1) return selectedDentist !== null;
        if (step === 2) return selectedDate !== null && selectedSlot !== null;
        if (step === 3) return selectedService !== "";
        if (step === 4) return form.name !== "" && form.email !== "" && form.phone !== "";
        return false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canNext()) return;

        const dentist = dentists.find(d => d._id === selectedDentist);
        setSubmitting(true);
        setSubmitError(null);

        const { error } = await insertOne("appointments", {
            patient: form.name,
            patient_email: form.email,
            patient_phone: form.phone,
            dentist: dentist?.name ?? "",
            date: selectedDate?.toDateString() ?? "",
            time: selectedSlot ?? "",
            service: selectedService,
            status: "pending",
            created_at: new Date()
        });

        if (error) {
            setSubmitError("Failed to book appointment. Please try again.");
        } else {
            setSubmitted(true);
        }
        setSubmitting(false);
    };

    const dentist = dentists.find(d => d._id === selectedDentist);
    const steps = ["Choose Dentist", "Pick Date & Time", "Select Service", "Your Details"];

    if (submitted) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="min-h-screen flex items-center justify-center px-4 pt-16">
                    <div className="text-center animate-scale-in max-w-md">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                            style={{ background: "hsl(var(--primary-light))" }}>
                            <CheckCircle className="w-10 h-10" style={{ color: "hsl(var(--primary))" }} />
                        </div>
                        <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Appointment Booked!</h2>
                        <p className="text-muted-foreground mb-2">
                            Your appointment with <strong>{dentist?.name}</strong> has been successfully requested.
                        </p>
                        <p className="text-sm text-muted-foreground mb-8">
                            {selectedDate?.toDateString()} at {selectedSlot} · {selectedService}
                        </p>
                        <div className="p-6 rounded-2xl mb-8 text-left" style={{ background: "hsl(var(--secondary))" }}>
                            <p className="text-sm font-medium mb-1">Confirmation will be sent to:</p>
                            <p className="text-sm text-muted-foreground">{form.email}</p>
                        </div>
                        <Link href="/" className="btn-primary">Back to Home</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
                <div className="text-center mb-10">
                    <span className="section-tag mb-3">Online Booking</span>
                    <h1 className="text-4xl font-bold mt-4" style={{ fontFamily: "'DM Serif Display', serif" }}>Book Your Appointment</h1>
                    <p className="text-muted-foreground mt-3">Simple, fast, and convenient scheduling in just a few steps.</p>
                </div>

                <div className="flex items-center justify-center mb-10 gap-0">
                    {steps.map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${step > i + 1 ? "text-white" : step === i + 1 ? "text-white" : "text-muted-foreground"}`}
                                    style={{
                                        background: step > i + 1 ? "hsl(var(--primary))" : step === i + 1 ? "hsl(var(--primary))" : "hsl(var(--muted))",
                                        boxShadow: step === i + 1 ? "0 0 0 4px hsl(var(--primary) / 0.2)" : undefined,
                                    }}>
                                    {step > i + 1 ? "✓" : i + 1}
                                </div>
                                <span className={`text-xs mt-1.5 hidden sm:block font-medium ${step === i + 1 ? "" : "text-muted-foreground"}`}
                                    style={{ color: step === i + 1 ? "hsl(var(--primary))" : undefined }}>
                                    {s}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className="w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-all duration-300"
                                    style={{ background: step > i + 1 ? "hsl(var(--primary))" : "hsl(var(--border))" }} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="animate-fade-in">
                    {step === 1 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <User className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> Choose Your Dentist
                            </h3>
                            {loadingDentists ? (
                                <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Loading dentists...
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {dentists.map(d => (
                                        <button key={d._id} onClick={() => setSelectedDentist(d._id)}
                                            className="card-dental text-left"
                                            style={{ outline: selectedDentist === d._id ? `2px solid hsl(var(--primary))` : undefined }}>
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-4"
                                                style={{ background: "var(--gradient-primary)" }}>
                                                {d.avatar}
                                            </div>
                                            <h4 className="font-bold text-base">{d.name}</h4>
                                            <p className="text-xs text-muted-foreground mt-1 mb-3">{d.specialty}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> Pick a Date & Time
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <CalendarPicker selected={selectedDate} onChange={(d) => { setSelectedDate(d); setSelectedSlot(null); }} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium mb-3 text-muted-foreground">
                                        {selectedDate ? `Available Slots — ${selectedDate.toDateString()}` : "Select a date first"}
                                    </p>
                                    {selectedDate && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {timeSlots.map(slot => (
                                                <button key={slot} disabled={bookedSlots.includes(slot)} onClick={() => setSelectedSlot(slot)}
                                                    className={`slot-btn ${selectedSlot === slot ? "selected" : ""} ${bookedSlots.includes(slot) ? "booked" : ""}`}>
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-6 text-primary">Select Service</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {services.map(s => (
                                    <button key={s} onClick={() => setSelectedService(s)}
                                        className={`rounded-xl border p-3 text-sm font-medium text-left transition-all ${selectedService === s ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <form onSubmit={handleSubmit}>
                            <h3 className="text-xl font-semibold mb-6">Your Details</h3>
                            <div className="rounded-2xl p-5 mb-6 text-sm bg-accent/30 border border-accent">
                                <p className="font-semibold mb-3">Appointment Summary</p>
                                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                                    <span>Dentist:</span><span className="font-medium text-foreground">{dentist?.name}</span>
                                    <span>Date:</span><span className="font-medium text-foreground">{selectedDate?.toDateString()}</span>
                                    <span>Time:</span><span className="font-medium text-foreground">{selectedSlot}</span>
                                    <span>Service:</span><span className="font-medium text-foreground">{selectedService}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input className="input-dental" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                <input className="input-dental" placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                                <input className="input-dental" placeholder="Phone +91..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                                <input className="input-dental" placeholder="Notes (Optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                            </div>
                            <button type="submit" className="btn-primary w-full mt-6" disabled={submitting}>
                                {submitting ? "Booking..." : "Confirm Appointment"}
                            </button>
                        </form>
                    )}
                </div>

                {step < 4 && (
                    <div className="flex justify-between mt-8">
                        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="btn-outline">Back</button>
                        <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="btn-primary">Continue</button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
