"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroDental from "@/assets/hero-dental.jpg";
import founderPortrait from "@/assets/e6fa8df3-6c6a-4b50-bfc2-30c94abebe32.jpg";

const services = [
  {
    icon: "🦷",
    title: "General Dentistry",
    desc: "Comprehensive checkups, cleanings, and preventive care to keep your teeth healthy for life.",
    features: ["Annual checkups", "Teeth cleanings", "Cavity fillings", "Gum disease treatment"],
    price: "From $80",
    images: [
      { src: "https://images.unsplash.com/photo-1626736985932-c0df2ae07a2e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R2VuZXJhbCUyMERlbnRpc3RyeXxlbnwwfHwwfHx8MA%3D%3D" },
      { src: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fEdlbmVyYWwlMjBEZW50aXN0cnl8ZW58MHx8MHx8fDA%3D" },
    ],
  },
  {
    icon: "✨",
    title: "Teeth Whitening",
    desc: "Professional in-office whitening treatments that brighten your smile by up to 8 shades in just one visit.",
    features: ["In-office treatment", "Take-home kits", "Long-lasting results", "Safe & pain-free"],
    price: "From $250",
    images: [
      { src: "https://images.unsplash.com/photo-1655807946138-811bb2340d34?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VGVldGglMjBXaGl0ZW5pbmd8ZW58MHx8MHx8fDA%3D" },
      { src: "https://plus.unsplash.com/premium_photo-1674179075503-1ae4d0c278dd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ],
  },
  {
    icon: "🔬",
    title: "Orthodontics",
    desc: "Modern braces and clear aligners to straighten your teeth comfortably and discreetly.",
    features: ["Traditional braces", "Clear aligners", "Retainers", "Monthly monitoring"],
    price: "From $1,800",
    images: [
      { src: "https://plus.unsplash.com/premium_photo-1681997203595-e45e06abe034?q=80&w=1124&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { src: "https://plus.unsplash.com/premium_photo-1664298998038-d36d0d40f16b?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { src: "https://plus.unsplash.com/premium_photo-1677174625625-fb6f183af447?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ],
  },
  {
    icon: "🏥",
    title: "Dental Implants",
    desc: "Permanent, natural-looking tooth replacement solutions that restore your smile and confidence.",
    features: ["Single implants", "Implant bridges", "Full arch solutions", "Lifetime support"],
    price: "From $1,200",
    images: [
      { src: "https://www.orthosquare.com/blogs/wp-content/uploads/2024/11/full-mouth-dental-implants-.jpg" },
      { src: "https://www.orthosquare.com/blogs/wp-content/uploads/2024/11/full-mouth-dental-implants-.jpg" },
    ],
  },
  {
    icon: "🚨",
    title: "Emergency Care",
    desc: "Same-day emergency appointments for urgent dental issues.",
    features: ["Same-day appointments", "Tooth pain relief", "Broken tooth repair", "Lost filling/crown"],
    price: "From $120",
    images: [
      { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqFbPgtIoszKKbsfJ7Z6G0zFOxhuQflVhCrA&s" },
      { src: "https://smilemastersindia.com/upload/treatments/Emergency-Dental.jpg" },
    ],
  },
  {
    icon: "👶",
    title: "Pediatric Dentistry",
    desc: "Gentle, fun dental care designed specifically for children.",
    features: ["First visit prep", "Sealants", "Fluoride treatment", "Kid-friendly environment"],
    price: "From $60",
    images: [
      { src: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&auto=format&fit=crop&q=60" },
    ],
  },
  {
    icon: "🌟",
    title: "Cosmetic Dentistry",
    desc: "Transform your smile with veneers and makeovers.",
    features: ["Porcelain veneers", "Dental bonding", "Smile makeovers", "Gum contouring"],
    price: "From $400",
    images: [
      { src: "https://www.bertagnollidental.com/wp-content/uploads/cosmetic-denistry-768x768.jpg" },
    ],
  },
  {
    icon: "🔧",
    title: "Restorative Dentistry",
    desc: "Repair damaged teeth and restore full function.",
    features: ["Dental crowns", "Bridges", "Dentures", "Root canals"],
    price: "From $500",
    images: [
      { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZuseLUV_JSbv2Gc0H-30GRduMJPEMwk_KPQ&s" },
      { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFTezXgJC7rZ1Ja2aTsOxWXZ4BdInODSD71A&s" },
      { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr-vf1YV0T79VR4xGfgS3y59pq76LBE_4s6A&s" },
    ],
  },
  {
    icon: "PS",
    title: "Prosthodontic",
    desc: "Precision restorations for function and aesthetics.",
    features: ["Crown & bridge", "Complete denture", "RPD", "Bite restoration"],
    price: "From $350",
    images: [
      { src: "https://cdn.prod.website-files.com/66a3dc2cdbd9d880915faf16/66c149e255ae75fec48802aa_Dental-bridge-min.jpeg" },
      { src: "https://www.robertmarcdental.com/hub_sites/schulman-robert/www/assets/uploads/images/Prosthodontic-case-photo.jpg" },
    ],
  },
  {
    icon: "OS",
    title: "Oral Surgery",
    desc: "Safe surgical care for complex dental needs.",
    features: ["Extractions", "Minor surgery", "TMJ problems", "Post-op care"],
    price: "From $180",
    images: [
      { src: "https://images.squarespace-cdn.com/content/v1/5634c78fe4b06374b2db01f7/127c5ed7-6bb8-4a01-8934-57087488599d/Oral+Surgery.jpg?format=2500w" },
      { src: "https://fusiondentalcare.com/wp-content/uploads/2019/12/Fusion-Dental-Care-Raleigh-NC-Oral-Surgery-scaled.jpeg" },
    ],
  },
  {
    icon: "DD",
    title: "Digital Dentistry",
    desc: "Advanced diagnostics and precision tools.",
    features: ["Digital X-ray", "Intraoral camera", "Endo motor", "Chairside guidance"],
    price: "From $90",
    images: [
      { src: "https://bocadelraypediatricdentistry.com/wp-content/uploads/2024/09/Laser-Dentistry-in-Delray-Beach.jpg" },
    ],
  },
];

const process = [
    { step: "01", title: "Book Online", desc: "Choose your service, dentist, and preferred time in minutes." },
    { step: "02", title: "Consultation", desc: "Meet your dentist for a thorough exam and personalized treatment plan." },
    { step: "03", title: "Treatment", desc: "Receive world-class care in our comfortable, modern clinic." },
    { step: "04", title: "Follow-Up", desc: "We check in to ensure you're healing well and smiling brighter." },
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 text-center" style={{ background: "var(--gradient-hero)" }}>
                <div className="max-w-3xl mx-auto px-4">
                    <span className="section-tag mb-4">What We Offer</span>
                    <h1 className="text-5xl font-bold mt-4 mb-4" style={{ fontFamily: "'DM Serif Display', serif", color: "hsl(var(--foreground))" }}>
                        Complete Dental Services
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        From routine prevention to complex restorations — every service delivered with expertise and genuine care.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((s, i) => (
                            <ServiceCard key={s.title} service={s} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="py-20" style={{ background: "hsl(var(--secondary))" }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <span className="section-tag mb-4">How It Works</span>
                        <h2 className="text-4xl font-bold mt-4" style={{ fontFamily: "'DM Serif Display', serif", color: "hsl(var(--foreground))" }}>
                            Your Care Journey
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {process.map((p, i) => (
                            <div key={p.step} className="text-center animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 text-white"
                                    style={{ background: "var(--gradient-primary)", fontFamily: "'DM Serif Display', serif" }}>
                                    {p.step}
                                </div>
                                <h3 className="font-bold text-lg mb-2" style={{ color: "hsl(var(--foreground))" }}>{p.title}</h3>
                                <p className="text-sm text-muted-foreground">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="rounded-3xl p-12 text-center text-white relative overflow-hidden"
                        style={{ background: "var(--gradient-primary)" }}>
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "white", transform: "translate(30%, -30%)" }} />
                        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: "white", transform: "translate(-30%, 30%)" }} />
                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                Ready to Get Started?
                            </h2>
                            <p className="text-white/80 mb-8 max-w-md mx-auto">
                                Book your appointment today. Our friendly team will guide you to the right service for your needs.
                            </p>
                            <Link href="/book"
                                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                                style={{ background: "white", color: "hsl(var(--primary))", boxShadow: "0 8px 25px hsl(0 0% 0% / 0.2)" }}>
                                Book Appointment <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

type Service = (typeof services)[number];

function ServiceCard({ service, index }: { service: Service; index: number }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!service.images?.length) return;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % service.images.length);
        }, 3500);
        return () => clearInterval(timer);
    }, [service.images.length]);

    return (
        <div className={`card-dental overflow-hidden animate-fade-up animate-delay-${(index % 4) * 100}`}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
                {service.images.map((img, imgIndex) => (
                    <img
                        key={`${service.title}-${imgIndex}`}
                        src={img.src}
                        alt={`${service.title} preview ${imgIndex + 1}`}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${imgIndex === activeIndex ? "opacity-100" : "opacity-0"}`}
                        loading="lazy"
                    />
                ))}
                <div className="absolute left-4 bottom-4 flex items-center gap-2">
                    {service.images.map((_, dotIndex) => (
                        <span
                            key={`${service.title}-dot-${dotIndex}`}
                            className={`h-2 w-2 rounded-full transition-all ${dotIndex === activeIndex ? "bg-white shadow" : "bg-white/50"}`}
                        />
                    ))}
                </div>
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-900 shadow">
                    <span className="text-lg">{service.icon}</span>
                    {service.title}
                </div>
            </div>
            <div className="pt-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-xl" style={{ color: "hsl(var(--foreground))" }}>{service.title}</h3>
                    <span className="text-sm font-semibold flex-shrink-0 px-3 py-1 rounded-full"
                        style={{ background: "hsl(var(--primary-light))", color: "hsl(var(--primary))" }}>
                        {service.price}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.desc}</p>
                <ul className="grid grid-cols-2 gap-1.5 mb-4">
                    {service.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-foreground/75">
                            <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                            {f}
                        </li>
                    ))}
                </ul>
                <Link href="/book" className="inline-flex items-center gap-1 text-sm font-medium"
                    style={{ color: "hsl(var(--primary))" }}>
                    Book This Service <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
}

