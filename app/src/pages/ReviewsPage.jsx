import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ReviewsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  const { clubId } = useParams();

  useEffect(() => {
    // Fetch club details from your Python API
    console.log("ClubID: " + clubId)
    fetch(`http://localhost:5000/api/club/${clubId}`)
      .then(response => response.json())
      .then(data => {
        setClub(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching club:", err));
  }, [clubId]);

  // Initial mock reviews (In a real app, fetch these from your SQLite DB)
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
  fetch(`http://localhost:5000/api/club/${clubId}/reviews`)
    .then(res => res.json())
    .then(data => setReviews(data));
}, [clubId]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (loading) return <div>Loading...</div>;
  if (!club) return <div>Club not found.</div>;

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
    // Refresh reviews list
    const updatedReviews = await fetch(`http://localhost:5000/api/club/${clubId}/reviews`).then(res => res.json());
    setReviews(updatedReviews);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 z-[100] animate-fade-in-down">
          <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <span>✓ Review submitted!</span>
          </div>
        </div>
      )}

      {/* Club Card */}
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-6">
          <img src={club.logo_url} alt="Logo" className="w-24 h-24 rounded-full border shadow-sm"/>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{club.name}</h1>
            <p className="text-gray-600 mt-2 text-sm">{club.description}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Write a Review
        </button>
      </div>

      {/* Reviews Section */}
      <div className="max-w-2xl w-full mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          User Reviews <span className="text-sm font-normal text-gray-500">({reviews.length})</span>
        </h2>
        
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < rev.rating ? "text-yellow-400" : "text-gray-200"}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{rev.date}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{rev.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No reviews yet. Be the first to write one!</p>
          )}
        </div>
      </div>

      {/* Modal logic remains the same as previous response... */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-2">Review {club.name}</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex mb-4 text-3xl">
                {[...Array(5)].map((_, i) => {
                  const val = i + 1;
                  return (
                    <button
                      type="button" key={val}
                      className={val <= (hover || rating) ? "text-yellow-400" : "text-gray-300"}
                      onClick={() => setRating(val)}
                      onMouseEnter={() => setHover(val)}
                      onMouseLeave={() => setHover(0)}
                    >★</button>
                  );
                })}
              </div>
              <textarea
                className="w-full border p-3 rounded-md h-32 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                <button type="submit" disabled={rating === 0} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;