"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Award, GraduationCap, Stethoscope, Heart, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { findMany } from "@/integrations/mongodb/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import img1 from "../../assets/e6fa8df3-6c6a-4b50-bfc2-30c94abebe32.jpg"
interface Dentist {
    _id: string;
    name: string;
    specialty: string;
    avatar: string;
}

export default function AboutPage() {
    const [dentist, setDentist] = useState<Dentist | null>(null);

    useEffect(() => {
        findMany("dentists", {}, { limit: 1 })
            .then(({ data }) => {
                if (data && data.length > 0) {
                    setDentist(data[0]);
                }
            });
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl -z-10" />

                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
                                <Image
                                    src={img1}
                                    alt="Doctor"
                                    className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent">
                                    <p className="text-blue-400 font-bold mb-1 tracking-widest text-sm uppercase">Chief Dental Surgeon</p>
                                    <h3 className="text-3xl font-bold text-white tracking-tight">
                                        {dentist?.name || "Dr. Maya Meena"}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary/10 text-primary rounded-full">
                                    Meet the Founder
                                </span>
                                <h1
                                    className="text-5xl md:text-6xl font-bold leading-tight mb-6"
                                    style={{ fontFamily: "'DM Serif Display', serif" }}
                                >
                                    Your Smile is in <span className="text-primary italic">Expert Hands.</span>
                                </h1>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    With over 10 years of clinical excellence, <strong>{dentist?.name || "Dr. Maya Meena"}</strong> has established a reputation for precision and care in Jaipur.
                                    Specializing in {dentist?.specialty || "Advanced Cosmetic Dentistry"}, our clinic uses state-of-the-art
                                    technology to ensure every treatment is painless, efficient, and tailored to your needs.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-hover hover:bg-white hover:shadow-md">
                                    <GraduationCap className="text-primary w-8 h-8" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 uppercase tracking-tighter">BDS Graduate</p>
                                        <p className="text-xs text-slate-500">Expert Specialist</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-hover hover:bg-white hover:shadow-md">
                                    <Heart className="text-rose-500 w-8 h-8" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 uppercase tracking-tighter">5000+ Smiles</p>
                                        <p className="text-xs text-slate-500">Trusted by Many</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h4 className="font-bold text-slate-900 text-lg">Why Choose Our Clinic?</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {["Painless Protocols", "Modern Digital X-Rays", "Sterilized Environment", "Patient-First Approach"].map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-slate-700 font-medium bg-slate-50/50 p-2 rounded-lg">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-slate-50/50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1 space-y-8">
                            <div>
                                <h2 className="text-4xl font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                    Visit Us
                                </h2>
                                <p className="text-slate-500">We are located in the heart of Jagatpura.</p>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Clinic Address</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            Shop No. 43, Dr. Maya Meena,<br />
                                            Tapovan Vihar Colony, CBI Fatak,<br />
                                            Jagatpura, Jaipur, RJ 302017
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Get In Touch</h4>
                                        <p className="text-sm text-slate-500">📞 083021 15319</p>
                                        <p className="text-sm text-slate-500">📧 hello@dentacare.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="rounded-[2.5rem] overflow-hidden h-[500px] shadow-2xl border-8 border-white">
                                <iframe
                                    title="Tooth World Dental Clinic Location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3551.2!2d75.8468067!3d26.8346961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9f833232bb5%3A0xa897af70e16fa48c!2sTooth+world+dental+clinic!5e0!3m2!1sen!2sin!4v1730000000000!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
