import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import InstagramButton from '../components/InstagramButton';

const ReviewsPage = () => {
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [club, setClub] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  
  // Form State
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const { clubId } = useParams();

  // Helper to fetch both reviews and the average score
  const refreshReviewData = useCallback(async () => {
    try {
      const [reviewsRes, avgRes] = await Promise.all([
        fetch(`http://localhost:5000/api/club/${clubId}/reviews`),
        fetch(`http://localhost:5000/api/club/${clubId}/average-rating`)
      ]);
      
      const reviewsData = await reviewsRes.json();
      const avgData = await avgRes.json();
      
      setReviews(reviewsData);
      setAvgRating(avgData.average);
    } catch (err) {
      console.error("Error refreshing review data:", err);
    }
  }, [clubId]);

  // Initial Data Load
  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/club/${clubId}`);
        const data = await response.json();
        setClub(data);
        await refreshReviewData();
        setLoading(false);
      } catch (err) {
        console.error("Error fetching club:", err);
      }
    };
    fetchClub();
  }, [clubId, refreshReviewData]);

  // Toast Auto-hide
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/club/${clubId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: rating, comment: reviewText }),
    });

    if (response.ok) {
      setShowToast(true);
      setIsModalOpen(false);
      setReviewText("");
      setRating(0);
      // Refresh data to show the new review and updated average
      await refreshReviewData();
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#002145] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#6EC4E8]"></div>
    </div>
  );

  return (
    <div className="min-h-screen text-white pt-24 pb-20 px-4" style={{
      background: 'linear-gradient(135deg, #002145 0%, #0055B7 100%)',
    }}>
      
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
          <div className="bg-[#6EC4E8] text-[#002145] px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold">
            <span>✨ Review shared with the community!</span>
          </div>
        </div>
      )}

      {/* Hero / Club Profile Header */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <div className="inline-block p-1 rounded-full bg-gradient-to-tr from-[#6EC4E8] to-[#0055B7] mb-6 shadow-xl">
            <img 
                src={club.logo_url || 'https://ires.ubc.ca/files/2019/10/ubc-logo.png'} 
                alt="Logo" 
                className="w-32 h-32 rounded-full object-contain bg-white p-2"
            />
        </div>
        <h1 className="text-4xl font-bold mb-2 drop-shadow-md">{club.name}</h1>
        
        {/* NEW: Average Rating Display */}
        <div className="flex flex-col items-center mb-4">
            <div className="flex items-center gap-3">
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-2xl ${i < Math.round(avgRating) ? "text-[#6EC4E8]" : "text-white/20"}`}>
                            ★
                        </span>
                    ))}
                </div>
                <span className="text-2xl font-bold text-white">{avgRating > 0 ? avgRating : "0.0"}</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6EC4E8] font-bold mt-1 opacity-80">
                Community Rating
            </p>
        </div>

        <InstagramButton
          handle={club.instagram_handle} 
          url={club.instagram_url} 
        />
        <p className="text-[#E0E0E0] max-w-2xl mx-auto font-light leading-relaxed mt-4">
            {club.description || "A featured organization at the University of British Columbia."}
        </p>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-8 bg-gradient-to-r from-[#6EC4E8] to-[#0055B7] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
        >
          + Write a Review
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-semibold">User Experiences</h2>
            <span className="bg-white/10 px-4 py-1 rounded-full text-sm font-medium">
                {reviews.length} total reviews
            </span>
        </div>
        
        <div className="grid gap-6">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xl ${i < rev.rating ? "text-[#6EC4E8]" : "text-white/20"}`}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-[#6EC4E8] font-bold tracking-widest uppercase">
                    {new Date(rev.date_created).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-100 leading-relaxed italic">"{rev.comment}"</p>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
                <p className="text-white/50 italic">No stories shared yet. Be the first to tell us about {club.name}!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#002145]/80 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#002145] mb-1">Rate your experience</h2>
            <p className="text-gray-500 mb-6 text-sm">How was your time with {club.name}?</p>
            
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center mb-8 text-4xl gap-2">
                {[...Array(5)].map((_, i) => {
                  const val = i + 1;
                  return (
                    <button
                      type="button" key={val}
                      className={`transition-colors ${val <= (hover || rating) ? "text-[#0055B7]" : "text-gray-200"}`}
                      onClick={() => setRating(val)}
                      onMouseEnter={() => setHover(val)}
                      onMouseLeave={() => setHover(0)}
                    >★</button>
                  );
                })}
              </div>
              
              <textarea
                className="w-full border-2 border-gray-100 p-4 rounded-2xl h-40 outline-none focus:border-[#6EC4E8] transition-colors text-gray-800"
                placeholder="What did you love? What should new members know?"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
              
              <div className="flex flex-col gap-3 mt-8">
                <button 
                    type="submit" 
                    disabled={rating === 0} 
                    className="w-full py-4 bg-[#002145] text-white rounded-xl font-bold shadow-xl disabled:bg-gray-300 transition-all hover:bg-[#0055B7]"
                >
                    Post Review
                </button>
                <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="w-full py-2 text-gray-400 font-medium hover:text-gray-600 transition-colors"
                >
                    Maybe later
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;