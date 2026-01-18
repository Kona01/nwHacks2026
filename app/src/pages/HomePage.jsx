import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    // Fetch 50 random clubs from the backend API
    fetch('http://localhost:5000/api/clubs/random')
      .then((response) => response.json())
      .then((data) => {
        setClubs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching clubs:", err);
        setLoading(false);
      });
  }, []);

  const handleLuckyClick = () => {
    if (clubs.length === 0) return;
    const cards = gridRef.current.querySelectorAll('.club-card-wrapper');
    const randomIndex = Math.floor(Math.random() * cards.length);
    const selectedCard = cards[randomIndex];
    
    selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Trigger pulse animation
    selectedCard.classList.add('animate-pulse-once');
    setTimeout(() => selectedCard.classList.remove('animate-pulse-once'), 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#002145]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6EC4E8]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-gray-800" style={{
      background: 'linear-gradient(135deg, #002145 0%, #0055B7 100%)',
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <header className="pt-16 pb-12 px-4 text-center bg-gradient-to-b from-black/20 to-transparent">
        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
          Discover Campus Clubs
        </h1>
        <p className="text-xl text-gray-200 font-light">
          Explore {clubs.length} featured organizations and share your experiences.
        </p>
      </header>

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto px-8 pb-20">
        <div 
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8"
        >
          {clubs.map((club) => (
            <div key={club.id} className="club-card-wrapper transition-all duration-300">
              <Link 
                to={`/clubs/${club.id}`} 
                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 club-card-shadow"
              >
                {/* Logo Thumbnail Container */}
                <div className="aspect-[4/3] w-full flex items-center justify-center p-6 relative bg-gradient-to-br from-[#f5f5f5] to-[#e0e0e0]">
                   {/* Light Overlay like reference */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#002145]/5 to-[#0055B7]/5" />
                  <img
                    src={club.logo_url || 'https://ires.ubc.ca/files/2019/10/ubc-logo.png'} 
                    alt={`${club.name} logo`} 
                    loading="lazy"
                    className="max-w-[80%] max-h-[80%] object-contain z-10 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Club Info */}
                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="font-bold text-[#002145] text-lg leading-tight mb-2 group-hover:text-[#0055B7]">
                    {club.name}
                  </h2>
                  
                  {club.instagram_handle && (
                    <p className="text-sm text-[#0055B7] font-semibold mb-3">
                      @{club.instagram_handle.replace('@', '')}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {club.description || <span className="italic text-gray-400 font-light">No description provided</span>}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {clubs.length === 0 && (
          <div className="text-center py-24 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10">
            <p className="text-white/60 text-xl font-light">No clubs found in the database.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;