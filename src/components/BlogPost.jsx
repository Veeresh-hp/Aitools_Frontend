import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendar, FaUser, FaTag } from 'react-icons/fa';

const BlogPost = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetch(`${API_URL}/api/articles/${slug}`)
            .then(res => res.json())
            .then(data => {
                if(data && !data.error) setArticle(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug, API_URL]);

    if (loading) return <div className="text-center text-white py-20">Loading article...</div>;
    if (!article) return <div className="text-center text-white py-20">Article not found.</div>;

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
             {/* Progress Bar (Optional) could go here */}
             
             <article className="max-w-4xl mx-auto px-6">
                <Link to="/blog" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <FaArrowLeft className="mr-2" /> Back to Blog
                </Link>

                <header className="mb-12 text-center">
                    <div className="inline-flex items-center gap-4 text-sm text-blue-400 font-bold uppercase tracking-wider mb-6 justify-center">
                        <span className="flex items-center gap-2"><FaCalendar /> {new Date(article.createdAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        <span className="flex items-center gap-2"><FaUser /> {article.author}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                        {article.title}
                    </h1>
                    {article.image && (
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video relative mb-12">
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                </header>

                <div 
                    className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: article.content }} 
                />

                {article.tags && article.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-2">
                        {article.tags.map((tag, i) => (
                            <span key={i} className="px-4 py-2 bg-white/5 rounded-full text-sm text-gray-300 border border-white/5 flex items-center gap-2">
                                <FaTag className="text-xs" /> {tag}
                            </span>
                        ))}
                    </div>
                )}
             </article>
        </div>
    );
};

export default BlogPost;
