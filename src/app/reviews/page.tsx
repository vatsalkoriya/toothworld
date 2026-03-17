"use client";

import { useState, useEffect, useMemo } from "react";
import { Play, Star, Video, ArrowRight, Filter, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { findMany } from "@/integrations/mongodb/utils";
import Link from "next/link";

type VideoReview = {
    _id: string;
    clientName: string;
    videoUrl: string;
    category: string;
    thumbnailUrl?: string;
    created_at: string;
};

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<VideoReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    const categories = ["All", "Smile Makeover", "Dental Implants", "Orthodontics", "General", "Full Mouth Rehab"];

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        const { data } = await findMany("video_reviews", {}, { sort: { created_at: -1 } });
        if (data) setReviews(data as VideoReview[]);
        setLoading(false);
    };

    const filteredReviews = useMemo(() => reviews.filter(r => {
        const matchesCategory = filter === "All" || r.category === filter;
        const matchesSearch = r.clientName.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    }), [reviews, filter, search]);

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=2070&auto=format&fit=crop" 
                         className="w-full h-full object-cover" 
                         alt="Clinic Interior"
                         loading="eager"
                         fetchPriority="high" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
                </div>
                
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-up"
                        style={{ background: "hsl(175 65% 38% / 0.25)", color: "hsl(175 65% 75%)", border: "1px solid hsl(175 65% 38% / 0.4)" }}>
                        <Star className="w-3 h-3 fill-current" /> Patient Success Stories
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-up animate-delay-100"
                        style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Real Smiles, <span className="text-primary-foreground" style={{ color: "hsl(175 65% 65%)" }}>Real Stories</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-10 animate-fade-up animate-delay-200">
                        Watch how we've helped our patients achieve their dream smiles. These video testimonials showcase the life-changing results of our dental treatments.
                    </p>
                </div>
            </section>

            {/* Filter & Search Bar */}
            <section className="sticky top-16 z-40 py-6 border-b border-border transition-all duration-300" 
                     style={{ background: "hsl(var(--background) / 0.8)", backdropFilter: "blur(12px)" }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                                        ${filter === cat 
                                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                                            : "bg-secondary text-muted-foreground hover:bg-secondary/80 border border-transparent hover:border-border"}`}
                                    style={{ background: filter === cat ? "hsl(var(--primary))" : undefined }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative group min-w-[280px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search patients..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-secondary/50 border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Grid */}
            <section className="py-20 min-h-[60vh]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="space-y-4">
                                    <div className="aspect-video rounded-3xl bg-secondary animate-pulse" />
                                    <div className="h-4 w-1/3 bg-secondary rounded animate-pulse" />
                                    <div className="h-6 w-2/3 bg-secondary rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="text-center py-20 bg-secondary/30 rounded-3xl border-2 border-dashed border-border">
                            <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                            <h3 className="text-xl font-bold">No reviews found</h3>
                            <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
                            <button onClick={() => { setFilter("All"); setSearch(""); }} className="mt-6 text-primary font-medium hover:underline">
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredReviews.map((review, i) => {
                                const youtubeId = getYoutubeId(review.videoUrl);
                                const finalThumb = review.thumbnailUrl || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null);
                                
                                return (
                                    <div key={review._id} className="group animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className="card-dental p-0 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-border/50">
                                            <div className="aspect-video relative overflow-hidden bg-slate-100">
                                                {finalThumb ? (
                                                    <img src={finalThumb} alt={review.clientName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                                                        <Video className="w-12 h-12 text-muted-foreground opacity-20" />
                                                    </div>
                                                )}
                                                
                                                {/* Play Button Overlay */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <a 
                                                        href={review.videoUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="w-16 h-16 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-primary shadow-2xl scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-white hover:scale-110"
                                                    >
                                                        <Play className="w-8 h-8 fill-current ml-1" />
                                                    </a>
                                                </div>
                                                
                                                {/* Category Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                                                        {review.category}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="p-6">
                                                <div className="flex gap-1 mb-3">
                                                    {[1, 2, 3, 4, 5].map(j => (
                                                        <Star key={j} className="w-3.5 h-3.5 fill-current text-amber-500" />
                                                    ))}
                                                </div>
                                                <h3 className="font-bold text-lg mb-1" style={{ color: "hsl(var(--foreground))" }}>
                                                    {review.clientName}
                                                </h3>
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Verified Patient Success</p>
                                                
                                                <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between">
                                                    <span className="text-[10px] text-muted-foreground">{new Date(review.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                                    <a href={review.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group/link">
                                                        Watch Story <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-secondary/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Join Our List of Happy Patients
                    </h2>
                    <p className="text-muted-foreground text-lg mb-10">
                        At Tooth World, we don't just treat teeth — we change lives by restoring confidence and health. Ready to share your own success story?
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/book" className="btn-primary px-10 py-4 text-base shadow-xl shadow-primary/20">
                            Book Your Consultation
                        </Link>
                        <Link href="/services" className="btn-outline px-10 py-4 text-base">
                            Explore Treatments
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
