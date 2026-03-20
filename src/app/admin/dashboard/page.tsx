"use client";

import { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
    LayoutDashboard, Calendar, Users, FileText,
    LogOut, ChevronRight, Plus, Trash2, Edit, Check, X,
    Clock, CheckCircle, TrendingUp, Stethoscope, Menu, Loader2, AlertCircle,
    ImagePlus, ChevronLeft, ChevronRight as ChevronRightIcon, Image, Images,
    Video, Play, Star
} from "lucide-react";
import { findMany, updateOne, insertOne, deleteOne, stringToObjectId } from "@/integrations/mongodb/utils";
import { sendWhatsAppNotification } from "@/lib/whatsapp";
import { useToast } from "@/hooks/use-toast";

// --- Types ---
type Appointment = {
    _id: string; id: number; patient: string; patient_email: string | null;
    patient_phone: string | null; dentist: string; date: string;
    time: string; service: string; status: string; created_at: string;
};
type BlogPost = {
    _id: string; id: number; title: string; category: string; author: string;
    content: string | null; published: boolean; created_at: string;
    images: string[] | null;
};
type Dentist = { _id: string; id: number; name: string; specialty: string; avatar: string; };
type VideoReview = {
    _id: string;
    clientName: string;
    videoUrl: string;
    category: string;
    thumbnailUrl?: string;
    created_at: string;
};
type BlockedSlots = Record<string, Record<string, string[]>>;

const ALL_SLOTS = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// --- Stat Card ---
function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
    return (
        <div className="card-dental p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: color }}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

// --- Dashboard ---
const Dashboard = memo(({ appointments, loading }: { appointments: Appointment[]; loading: boolean }) => {
    const pending = useMemo(() => appointments.filter(a => a.status === "pending").length, [appointments]);
    const confirmed = useMemo(() => appointments.filter(a => a.status === "confirmed").length, [appointments]);
    const today = useMemo(() => appointments.slice(0, 5), [appointments]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>Dashboard Overview</h2>
                <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening at Tooth World today.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users className="w-6 h-6 text-white" />} label="Total Appointments"
                    value={loading ? "—" : String(appointments.length)} sub="All time" color="hsl(var(--primary))" />
                <StatCard icon={<Clock className="w-6 h-6 text-white" />} label="Pending"
                    value={loading ? "—" : String(pending)} sub="Awaiting confirmation" color="hsl(38 92% 55%)" />
                <StatCard icon={<CheckCircle className="w-6 h-6 text-white" />} label="Confirmed"
                    value={loading ? "—" : String(confirmed)} sub="Confirmed bookings" color="hsl(142 71% 45%)" />
                <StatCard icon={<TrendingUp className="w-6 h-6 text-white" />} label="Satisfaction"
                    value="98%" sub="Based on 5-star reviews" color="hsl(262 80% 65%)" />
            </div>

            <div className="card-dental p-6">
                <h3 className="font-bold mb-5 flex items-center gap-2">
                    <Calendar className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> Recent Appointments
                </h3>
                {loading ? (
                    <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Loading appointments...
                    </div>
                ) : today.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No appointments yet. They'll appear here once patients book.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {today.map(apt => (
                            <div key={apt._id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                                        style={{ background: "var(--gradient-primary)" }}>
                                        {apt.patient[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{apt.patient}</p>
                                        <p className="text-xs text-muted-foreground">{apt.dentist} · {apt.service}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{apt.time}</p>
                                    <p className="text-xs text-muted-foreground">{apt.date}</p>
                                </div>
                                <span className={`ml-4 text-xs font-medium px-2.5 py-1 rounded-full ${apt.status === "confirmed" ? "bg-green-100 text-green-700" :
                                    apt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                        "bg-red-100 text-red-600"}`}>
                                    {apt.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});
Dashboard.displayName = "Dashboard";

// --- Appointments Manager ---
const AppointmentsManager = memo(({ appointments, loading, onUpdateStatus }: {
    appointments: Appointment[];
    loading: boolean;
    onUpdateStatus: (id: string, status: string) => Promise<void>;
}) => {
    const [filter, setFilter] = useState("all");
    const [updating, setUpdating] = useState<string | null>(null);

    const filtered = useMemo(() => filter === "all" ? appointments : appointments.filter(a => a.status === filter), [appointments, filter]);

    const handleUpdate = useCallback(async (id: string, status: string) => {
        setUpdating(id);
        await onUpdateStatus(id, status);
        setUpdating(null);
    }, [onUpdateStatus]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Appointments</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage all patient appointments · WhatsApp notifications sent automatically on accept/decline
                </p>
            </div>

            <div className="flex gap-2 flex-wrap">
                {["all", "pending", "confirmed", "cancelled"].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${filter === f ? "text-white" : "border border-border hover:border-primary/50"}`}
                        style={{ background: filter === f ? "hsl(var(--primary))" : undefined }}>
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading...
                </div>
            ) : filtered.length === 0 ? (
                <div className="card-dental p-10 text-center text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No appointments found.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(apt => (
                        <div key={apt._id} className="card-dental p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                                    style={{ background: "var(--gradient-primary)" }}>
                                    {apt.patient[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{apt.patient}</p>
                                    <p className="text-xs text-muted-foreground">{apt.service}</p>
                                    {apt.patient_email && <p className="text-xs text-muted-foreground">{apt.patient_email}</p>}
                                    {apt.patient_phone && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            📱 {apt.patient_phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{apt.dentist}</span><span>·</span><span>{apt.date} {apt.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${apt.status === "confirmed" ? "bg-green-100 text-green-700" :
                                    apt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                        "bg-red-100 text-red-600"}`}>
                                    {apt.status}
                                </span>
                                {apt.status === "pending" && (
                                    <>
                                        <button onClick={() => handleUpdate(apt._id, "confirmed")} disabled={updating === apt._id}
                                            className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50">
                                            {updating === apt._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                        </button>
                                        <button onClick={() => handleUpdate(apt._id, "cancelled")} disabled={updating === apt._id}
                                            className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});
AppointmentsManager.displayName = "AppointmentsManager";

// --- Calendar & Slots Manager ---
const CalendarManager = memo(({ dentists }: { dentists: Dentist[] }) => {
    const [selectedDentist, setSelectedDentist] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<string>("Mon");
    const [blockedSlots, setBlockedSlots] = useState<BlockedSlots>({});
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState<string | null>(null);

    useEffect(() => {
        if (dentists.length > 0 && !selectedDentist) setSelectedDentist(dentists[0]._id);
    }, [dentists, selectedDentist]);

    const fetchBlockedSlots = useCallback(async (isInitial = false) => {
        if (isInitial) setLoading(true);
        const { data } = await findMany("blocked_slots");
        if (data) {
            const map: BlockedSlots = {};
            data.forEach((row: any) => {
                const key = String(row.dentist_id);
                if (!map[key]) map[key] = {};
                if (!map[key][row.day]) map[key][row.day] = [];
                map[key][row.day].push(row.slot);
            });
            setBlockedSlots(map);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchBlockedSlots(true);
        const interval = setInterval(() => fetchBlockedSlots(false), 30000);
        return () => clearInterval(interval);
    }, [fetchBlockedSlots]);

    const toggleSlot = async (slot: string) => {
        if (!selectedDentist) return;
        const key = String(selectedDentist);
        const isBlocked = blockedSlots[key]?.[selectedDay]?.includes(slot);
        setToggling(slot);

        if (isBlocked) {
            await deleteOne("blocked_slots", { dentist_id: selectedDentist, day: selectedDay, slot });
            setBlockedSlots(prev => ({
                ...prev,
                [key]: { ...prev[key], [selectedDay]: (prev[key]?.[selectedDay] || []).filter(s => s !== slot) }
            }));
        } else {
            await insertOne("blocked_slots", { dentist_id: selectedDentist, day: selectedDay, slot });
            setBlockedSlots(prev => ({
                ...prev,
                [key]: { ...prev[key], [selectedDay]: [...(prev[key]?.[selectedDay] || []), slot] }
            }));
        }
        setToggling(null);
    };

    const dentist = useMemo(() => dentists.find(d => d._id === selectedDentist), [dentists, selectedDentist]);
    const currentBlocked = useMemo(() => blockedSlots[String(selectedDentist)]?.[selectedDay] || [], [blockedSlots, selectedDentist, selectedDay]);
    const blockedCount = currentBlocked.length;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Calendar & Slots</h2>
                <p className="text-sm text-muted-foreground mt-1">Block or unblock time slots for each dentist. Updates in real-time.</p>
            </div>

            <div className="flex gap-3 flex-wrap">
                {dentists.map(d => (
                    <button key={d._id} onClick={() => setSelectedDentist(d._id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${selectedDentist === d._id ? "text-white border-transparent" : "border-border hover:border-primary/50"}`}
                        style={{ background: selectedDentist === d._id ? "hsl(var(--primary))" : undefined }}>
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                                background: selectedDentist === d._id ? "hsl(0 0% 100% / 0.2)" : "hsl(var(--secondary))",
                                color: selectedDentist === d._id ? "white" : "hsl(var(--primary))"
                            }}>
                            {d.avatar}
                        </span>
                        {d.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading slots...
                </div>
            ) : dentist ? (
                <div className="card-dental p-6 space-y-5">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                style={{ background: "var(--gradient-primary)" }}>
                                {dentist.avatar}
                            </div>
                            <div>
                                <p className="font-semibold">{dentist.name}</p>
                                <p className="text-xs text-muted-foreground">{dentist.specialty}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "hsl(var(--primary) / 0.15)", border: "1px solid hsl(var(--primary) / 0.4)" }} />
                                Available
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm inline-block bg-red-100" style={{ border: "1px solid hsl(0 84% 80%)" }} />
                                Blocked
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {DAYS.map(day => {
                            const cnt = (blockedSlots[String(selectedDentist)]?.[day] || []).length;
                            return (
                                <button key={day} onClick={() => setSelectedDay(day)}
                                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${selectedDay === day ? "text-white border-transparent" : "border-border hover:border-primary/40"
                                        }`}
                                    style={{ background: selectedDay === day ? "hsl(var(--primary))" : undefined }}>
                                    {day}
                                    {cnt > 0 && (
                                        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold ${selectedDay === day ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                                            }`}>
                                            {cnt}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground mb-3">
                            {blockedCount === 0
                                ? `All ${ALL_SLOTS.length} slots available on ${selectedDay}`
                                : `${blockedCount} slot${blockedCount > 1 ? "s" : ""} blocked on ${selectedDay} — click to toggle`}
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                            {ALL_SLOTS.map(slot => {
                                const isBlocked = currentBlocked.includes(slot);
                                const isToggling = toggling === slot;
                                return (
                                    <button
                                        key={slot}
                                        onClick={() => toggleSlot(slot)}
                                        disabled={isToggling}
                                        className={`py-3 px-3 rounded-xl text-sm font-medium border transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-1.5 ${isBlocked
                                            ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                                            : "hover:border-primary/60"
                                            }`}
                                        style={
                                            !isBlocked
                                                ? { background: "hsl(var(--primary) / 0.06)", borderColor: "hsl(var(--primary) / 0.25)", color: "hsl(var(--primary))" }
                                                : undefined
                                        }>
                                        {isToggling ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : isBlocked ? (
                                            <X className="w-3.5 h-3.5" />
                                        ) : (
                                            <Check className="w-3.5 h-3.5" />
                                        )}
                                        {slot}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
});
CalendarManager.displayName = "CalendarManager";

// --- Blog Manager ---
const BlogManager = memo(({ dentists }: { dentists: Dentist[] }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", category: "Oral Health", content: "" });
    const [pendingImages, setPendingImages] = useState<string[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [previewSlide, setPreviewSlide] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const categories = ["Oral Health", "Patient Guide", "Cosmetic Dentistry", "Dental Implants", "Pediatric", "General"];
    const defaultAuthor = dentists[0]?.name || "Dr. Admin";

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        const { data } = await findMany("blog_posts", {}, { sort: { created_at: -1 } });
        if (data) setPosts(data as BlogPost[]);
        setLoading(false);
    }, []);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const handleCreate = async () => {
        if (!newPost.title.trim()) return;
        setSaving(true);
        const { data } = await insertOne("blog_posts", {
            title: newPost.title,
            category: newPost.category,
            author: defaultAuthor,
            content: newPost.content,
            published: false,
            images: pendingImages, // Save base64 images
        });

        if (data) {
            setPosts(prev => [data as BlogPost, ...prev]);
        }
        setCreating(false);
        setNewPost({ title: "", category: "Oral Health", content: "" });
        setPendingImages([]);
        setSaving(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setUploadingImages(true);
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPendingImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
        setUploadingImages(false);
    };

    const togglePublish = async (id: string, current: boolean) => {
        await updateOne("blog_posts", { _id: id }, { published: !current });
        fetchPosts();
    };

    const deletePost = async (id: string) => {
        await deleteOne("blog_posts", { _id: id });
        fetchPosts();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Blog Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">Create and manage your dental health articles</p>
                </div>
                <button onClick={() => setCreating(true)} className="btn-primary text-sm">
                    <Plus className="w-4 h-4" /> New Post
                </button>
            </div>

            {creating && (
                <div className="card-dental p-6 animate-scale-in border-2" style={{ borderColor: "hsl(var(--primary) / 0.3)" }}>
                    <h3 className="font-bold mb-5 flex items-center gap-2">
                        <Edit className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} /> New Blog Post
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Post Title *</label>
                            <input className="input-dental" placeholder="Enter a compelling title..."
                                value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select className="input-dental" value={newPost.category}
                                onChange={e => setNewPost({ ...newPost, category: e.target.value })}>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Content</label>
                            <textarea className="input-dental min-h-[140px] resize-y" placeholder="Write your article content here..."
                                value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Post Images</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {pendingImages.map((img, i) => (
                                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button onClick={() => setPendingImages(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => fileInputRef.current?.click()}
                                    className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary transition-all">
                                    <Plus className="w-4 h-4" />
                                    <span className="text-[10px]">Add</span>
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleCreate} className="btn-primary text-sm" disabled={!newPost.title.trim() || saving}>
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                {saving ? "Saving..." : "Save as Draft"}
                            </button>
                            <button onClick={() => { setCreating(false); }} className="btn-outline text-sm">
                                <X className="w-4 h-4" /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading posts...
                </div>
            ) : posts.length === 0 ? (
                <div className="card-dental p-10 text-center text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No blog posts yet. Click "New Post" to create your first article.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {posts.map(post => (
                        <div key={post._id} className="card-dental p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                    style={{ background: "hsl(var(--secondary))" }}>📄</div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="section-tag text-xs">{post.category}</span>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                            {post.published ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-sm truncate">{post.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        By {post.author} · {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => togglePublish(post._id, post.published)}
                                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 ${post.published
                                        ? "border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100"
                                        : "border-green-200 text-green-600 bg-green-50 hover:bg-green-100"
                                        }`}>
                                    {post.published ? "Unpublish" : "Publish"}
                                </button>
                                <button onClick={() => deletePost(post._id)}
                                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});
BlogManager.displayName = "BlogManager";

// --- Gallery Manager ---
const GalleryManager = memo(() => {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [caption, setCaption] = useState("");
    const [url, setUrl] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchImages = useCallback(async () => {
        setLoading(true);
        const { data } = await findMany("gallery_images", {}, { sort: { created_at: -1 } });
        if (data) setImages(data);
        setLoading(false);
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => { fetchImages(); }, [fetchImages]);

    const handleAdd = async () => {
        if (!url) return;
        setUploading(true);
        await insertOne("gallery_images", { url, caption: caption.trim() || null, created_at: new Date().toISOString() });
        setUrl("");
        setCaption("");
        fetchImages();
        setUploading(false);
    };

    const handleDelete = async (id: string) => {
        await deleteOne("gallery_images", { _id: id });
        fetchImages();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Gallery Manager</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage clinic photos shown on the public gallery page.</p>
            </div>

            <div className="card-dental p-6 border-2" style={{ borderColor: "hsl(var(--primary) / 0.25)" }}>
                <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
                    <ImagePlus className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} /> Add New Photo
                </h3>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium mb-1.5 opacity-70">Image URL</label>
                            <input className="input-dental" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} />
                        </div>
                        <div className="w-px h-12 bg-border self-end mb-2" />
                        <div className="flex-1">
                            <label className="block text-xs font-medium mb-1.5 opacity-70">Or Upload Image</label>
                            <button onClick={() => fileRef.current?.click()} className="btn-outline w-full h-11 text-xs">
                                <ImagePlus className="w-3.5 h-3.5" /> Select File
                            </button>
                            <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                        </div>
                    </div>
                    {url && url.startsWith('data:') && (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-primary/30">
                            <img src={url} className="w-full h-full object-cover" />
                            <button onClick={() => setUrl("")} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                    <input className="input-dental" placeholder="Caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} />
                    <button onClick={handleAdd} disabled={!url || uploading} className="btn-primary text-sm">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add to Gallery
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map(img => (
                        <div key={img._id} className="group relative rounded-2xl overflow-hidden border border-border">
                            <img src={img.url} alt={img.caption || "Gallery"} className="w-full aspect-square object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleDelete(img._id)} className="p-2 rounded-full bg-red-500 text-white">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});
GalleryManager.displayName = "GalleryManager";

// --- Reviews Manager ---
const ReviewsManager = memo(() => {
    const [reviews, setReviews] = useState<VideoReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newReview, setNewReview] = useState({ clientName: "", videoUrl: "", category: "General", thumbnailUrl: "" });
    const categories = ["Smile Makeover", "Dental Implants", "Orthodontics", "General", "Full Mouth Rehab"];

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        const { data } = await findMany("video_reviews", {}, { sort: { created_at: -1 } });
        if (data) setReviews(data as VideoReview[]);
        setLoading(false);
    }, []);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);

    const handleAdd = async () => {
        if (!newReview.clientName || !newReview.videoUrl) return;
        setSaving(true);
        await insertOne("video_reviews", {
            ...newReview,
            created_at: new Date().toISOString()
        });
        setNewReview({ clientName: "", videoUrl: "", category: "General", thumbnailUrl: "" });
        fetchReviews();
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        await deleteOne("video_reviews", { _id: id });
        fetchReviews();
    };
    
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?\/]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Video Reviews Manager</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage video testimonials from your patients. Organise by service category.</p>
            </div>

            <div className="card-dental p-6 border-2" style={{ borderColor: "hsl(var(--primary) / 0.25)" }}>
                <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
                    <Video className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} /> Add New Video Review
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-medium mb-1.5 opacity-70">Patient/Client Name</label>
                        <input className="input-dental" placeholder="e.g. John Doe" 
                            value={newReview.clientName} onChange={e => setNewReview({ ...newReview, clientName: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1.5 opacity-70">Category</label>
                        <select className="input-dental" value={newReview.category} 
                            onChange={e => setNewReview({ ...newReview, category: e.target.value })}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium mb-1.5 opacity-70">Video URL (YouTube/Direct Link)</label>
                        <input className="input-dental" placeholder="https://youtube.com/watch?v=..." 
                            value={newReview.videoUrl} onChange={e => setNewReview({ ...newReview, videoUrl: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1.5 opacity-70">Thumbnail URL (Optional)</label>
                        <input className="input-dental" placeholder="https://..." 
                            value={newReview.thumbnailUrl} onChange={e => setNewReview({ ...newReview, thumbnailUrl: e.target.value })} />
                    </div>
                    <button onClick={handleAdd} disabled={!newReview.clientName || !newReview.videoUrl || saving} className="btn-primary text-sm">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add Review
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="aspect-video rounded-2xl bg-muted animate-pulse" />)}
                </div>
            ) : reviews.length === 0 ? (
                <div className="card-dental p-10 text-center text-muted-foreground">
                    <Video className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No video reviews yet. Add your first patient testimonial.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map(review => {
                        const youtubeId = getYoutubeId(review.videoUrl);
                        const finalThumb = review.thumbnailUrl || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null);
                        return (
                            <div key={review._id} className="card-dental overflow-hidden group">
                                <div className="aspect-video relative bg-slate-100 flex items-center justify-center">
                                    {finalThumb ? (
                                        <img
                                            src={finalThumb}
                                            alt={review.clientName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                if (!youtubeId) return;
                                                const target = e.currentTarget;
                                                if (target.dataset.fallbackApplied) return;
                                                target.dataset.fallbackApplied = "true";
                                                target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                                            }}
                                        />
                                    ) : (
                                        <Video className="w-10 h-10 text-slate-300" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <a href={review.videoUrl} target="_blank" rel="noopener noreferrer" 
                                           className="p-3 rounded-full bg-white text-primary hover:scale-110 transition-transform">
                                            <Play className="w-5 h-5 fill-current" />
                                        </a>
                                    </div>
                                    <div className="absolute top-2 left-2">
                                        <span className="section-tag bg-white/90 backdrop-blur shadow-sm">{review.category}</span>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-border flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-sm">{review.clientName}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Patient Testimonial</p>
                                    </div>
                                    <button onClick={() => handleDelete(review._id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
});
ReviewsManager.displayName = "ReviewsManager";

const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "appointments", label: "Appointments", icon: <Users className="w-4 h-4" /> },
    { id: "calendar", label: "Calendar & Slots", icon: <Calendar className="w-4 h-4" /> },
    { id: "blog", label: "Blog", icon: <FileText className="w-4 h-4" /> },
    { id: "gallery", label: "Gallery", icon: <Images className="w-4 h-4" /> },
    { id: "reviews", label: "Reviews", icon: <Star className="w-4 h-4" /> },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [dentists, setDentists] = useState<Dentist[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const session = localStorage.getItem('adminSession');
        if (!session) {
            router.push('/admin');
            return;
        }
        fetchInitialData();
    }, [router]);

    const fetchInitialData = async () => {
        setLoading(true);
        const [aptRes, dentRes] = await Promise.all([
            findMany("appointments", {}, { sort: { created_at: -1 } }),
            findMany("dentists", {}, { sort: { id: 1 } })
        ]);
        if (aptRes.data) setAppointments(aptRes.data);
        if (dentRes.data) setDentists(dentRes.data);
        setLoading(false);
    };

    const updateAppointmentStatus = async (id: string, status: string) => {
        const { data } = await updateOne("appointments", { _id: id }, { status });
        if (data) {
            // Find the appointment details for notification
            const apt = appointments.find(a => a._id === id);
            if (apt && apt.patient_phone) {
                toast({
                    title: `Sending WhatsApp...`,
                    description: `Sending ${status} notification to ${apt.patient}.`,
                });

                const sent = await sendWhatsAppNotification(
                    apt.patient_phone,
                    status as 'confirmed' | 'cancelled',
                    {
                        patientName: apt.patient,
                        patientPhone: apt.patient_phone,
                        dentist: apt.dentist,
                        date: apt.date,
                        time: apt.time,
                        service: apt.service,
                    }
                );

                if (sent) {
                    toast({
                        title: "WhatsApp Sent ✅",
                        description: `Notification for ${apt.patient} has been sent.`,
                    });
                }
            }
            fetchInitialData();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminSession');
        router.push('/admin');
    };

    return (
        <div className="min-h-screen flex" style={{ background: "hsl(var(--muted))" }}>
            <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex-shrink-0 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
                style={{ background: "hsl(var(--card))", borderRight: "1px solid hsl(var(--border))" }}>
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>Tooth World</p>
                            <p className="text-xs text-muted-foreground">Admin Panel</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-1 flex-1">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                            className={`admin-sidebar-link w-full ${activeTab === item.id ? "active" : ""}`}>
                            {item.icon}
                            <span>{item.label}</span>
                            {activeTab !== item.id && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <button onClick={handleLogout} className="admin-sidebar-link w-full text-red-500 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                <header className="border-b border-border px-6 py-4 flex items-center justify-between" style={{ background: "hsl(var(--card))" }}>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg"><Menu className="w-5 h-5" /></button>
                        <h1 className="font-bold text-base capitalize">{activeTab}</h1>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--gradient-primary)" }}>AD</div>
                </header>

                <main className="flex-1 p-6 overflow-auto animate-fade-in">
                    {activeTab === "dashboard" && <Dashboard appointments={appointments} loading={loading} />}
                    {activeTab === "appointments" && <AppointmentsManager appointments={appointments} loading={loading} onUpdateStatus={updateAppointmentStatus} />}
                    {activeTab === "calendar" && <CalendarManager dentists={dentists} />}
                    {activeTab === "blog" && <BlogManager dentists={dentists} />}
                    {activeTab === "gallery" && <GalleryManager />}
                    {activeTab === "reviews" && <ReviewsManager />}
                </main>
            </div>
        </div>
    );
}
