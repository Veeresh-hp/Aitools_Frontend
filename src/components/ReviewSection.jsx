import React, { useState, useEffect } from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const ReviewSection = ({ toolId }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    // Auth check
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const { t } = useLanguage();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const fetchReviews = () => {
        fetch(`${API_URL}/api/reviews/${toolId}`)
            .then(res => res.json())
            .then(data => {
                if(Array.isArray(data)) setReviews(data);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        if(toolId) fetchReviews();
    }, [toolId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return;
        setSubmitting(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ toolId, rating, comment })
            });
            const data = await res.json();
            
            if (res.ok) {
                setComment('');
                setRating(5);
                fetchReviews(); // Refresh list
            } else {
                setError(data.error || 'Failed to post review');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#12121A] rounded-3xl p-8 border border-white/10 mt-8">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <FaStar className="text-yellow-400" /> User Reviews ({reviews.length})
            </h3>

            {/* Write Review */}
            {token ? (
                <form onSubmit={handleSubmit} className="mb-10 bg-white/5 p-6 rounded-xl border border-white/5">
                    <h4 className="text-white font-semibold mb-4">Write a review as {username}</h4>
                    
                    {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                    <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-2xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this tool..."
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-blue-500 outline-none mb-4 min-h-[100px]"
                        required
                    />

                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-500 transition-colors disabled:opacity-50"
                    >
                        {submitting ? 'Posting...' : 'Post Review'}
                    </button>
                </form>
            ) : (
                <div className="mb-10 p-6 bg-white/5 rounded-xl border border-white/5 text-center">
                    <p className="text-gray-400">Please <span className="text-white font-bold">Log In</span> to leave a review.</p>
                </div>
            )}

            {/* List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev._id} className="border-b border-white/5 last:border-0 pb-6 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                                        {rev.username[0].toUpperCase()}
                                    </div>
                                    <span className="text-white font-semibold text-sm">{rev.username}</span>
                                </div>
                                <span className="text-gray-500 text-xs">{new Date(rev.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex text-yellow-400 text-xs mb-2">
                                {[...Array(rev.rating)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{rev.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
