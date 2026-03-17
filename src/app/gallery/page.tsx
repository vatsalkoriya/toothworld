"use client";

import { useState, useEffect, useCallback } from "react";
import { findMany } from "@/integrations/mongodb/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface GalleryImage {
    _id: string;
    id: number;
    url: string;
    caption: string | null;
    created_at: string;
}

const DEMO_IMAGES = [
    { url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop", caption: "Modern treatment room" },
    { url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop", caption: "Our friendly dental team" },
    { url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070&auto=format&fit=crop", caption: "State-of-the-art equipment" },
];

export default function GalleryPage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<any | null>(null);

    const fetchImages = useCallback(async () => {
        const { data } = await findMany("gallery_images", {}, { sort: { created_at: -1 } });
        if (data) setImages(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchImages();
        const interval = setInterval(fetchImages, 30000);
        return () => clearInterval(interval);
    }, [fetchImages]);

    const displayImages = images.length > 0 ? images : DEMO_IMAGES;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 text-center" style={{ background: "var(--gradient-hero)" }}>
                <div className="max-w-3xl mx-auto px-4">
                    <span className="section-tag mb-4">Our Clinic</span>
                    <h1 className="text-5xl font-bold mt-4 mb-4" style={{ fontFamily: "'DM Serif Display', serif", color: "hsl(var(--foreground))" }}>
                        Clinic Gallery
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Take a virtual tour of our modern facilities, treatment rooms, and the smiles we've transformed.
                    </p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {displayImages.map((img, i) => (
                                <div
                                    key={img._id || i}
                                    className="break-inside-avoid cursor-pointer group overflow-hidden rounded-2xl border border-border"
                                    style={{ boxShadow: "var(--shadow-card)" }}
                                    onClick={() => setSelected(img)}
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={img.url}
                                            alt={img.caption || "Gallery image"}
                                            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        {img.caption && (
                                            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-300 flex items-end">
                                                <p className="translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-white text-sm font-medium px-4 py-3 w-full">
                                                    {img.caption}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "hsl(210 25% 10% / 0.92)" }}
                    onClick={() => setSelected(null)}
                >
                    <div className="relative max-w-4xl w-full animate-scale-in" onClick={e => e.stopPropagation()}>
                        <img src={selected.url} alt={selected.caption || ""} className="w-full rounded-2xl object-contain max-h-[80vh]" />
                        {selected.caption && (
                            <p className="text-center text-white/80 mt-4 text-sm">{selected.caption}</p>
                        )}
                        <button
                            className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white text-foreground flex items-center justify-center font-bold text-lg hover:scale-110 transition-transform"
                            onClick={() => setSelected(null)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
