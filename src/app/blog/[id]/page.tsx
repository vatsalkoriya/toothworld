"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User, Calendar, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { findMany } from "@/integrations/mongodb/utils";

export default function BlogPostPage() {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            //findMany with filter for _id
            const { data } = await findMany("blog_posts", { _id: id });
            if (data && data.length > 0) setPost(data[0]);
            setLoading(false);
        };
        if (id) fetchPost();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!post) return <div className="min-h-screen flex flex-col items-center justify-center">Post not found <Link href="/blog" className="text-primary">Back to blog</Link></div>;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <article className="pt-32 pb-20 max-w-3xl mx-auto px-6">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Link>

                <header className="mb-10">
                    <span className="section-tag mb-4">{post.category}</span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>{post.title}</h1>
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
                        <div className="flex items-center gap-2"><User className="w-4 h-4" /> {post.author}</div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {post.created_at ? new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent Post"}
                        </div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {Math.ceil((post.content?.length || 0) / 800) || 3} min read</div>
                    </div>

                    {post.images && post.images.length > 0 && (
                        <div className="mb-10 rounded-3xl overflow-hidden border border-border aspect-[16/9]">
                            <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                </header>

                <div className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-700">
                    {post.content?.split('\n').map((para: string, i: number) => (
                        <p key={i} className="mb-4">{para}</p>
                    ))}
                </div>
            </article>
            <Footer />
        </div>
    );
}
