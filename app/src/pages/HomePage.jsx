import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('random'); // Default set to random
  const gridRef = useRef(null);

  const fetchClubs = (pageNum, sortType) => {
    setLoading(true);

    const url = sortType === 'random'
      ? `http://localhost:5000/api/clubs/random`
      : `http://localhost:5000/api/clubs?page=${pageNum}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (sortType === 'random') {
          setClubs(data);
          setHasMore(false);
          // Scroll to top on random shuffle
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          if (data.length < 50) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          setClubs(prev => pageNum === 1 ? data : [...prev, ...data]);

          // Only scroll to top if we are loading the very first page of Alphabetical
          if (pageNum === 1) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching clubs:", err);
        setLoading(false);
      });
  };

  // Initial load and listener for sort changes
  useEffect(() => {
    setPage(1);
    fetchClubs(1, sortBy);
  }, [sortBy]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchClubs(nextPage, sortBy);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="min-h-screen font-sans text-gray-800" style={{
      background: 'linear-gradient(135deg, #002145 0%, #0055B7 100%)',
    }}>
      <header className="pt-16 pb-12 px-4 text-center bg-gradient-to-b from-black/20 to-transparent">
        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Discover Campus Clubs</h1>
        <p className="text-xl text-gray-200 font-light mb-8">
          {sortBy === 'random'
            ? "Showing a random selection of organizations."
            : `Browsing ${clubs.length} organizations in alphabetical order.`}
        </p>

        {/* Sort Dropdown */}
        <div className="flex justify-center items-center gap-3">
          <label htmlFor="sort" className="text-white font-medium">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
            className="bg-white/10 text-white border border-white/30 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#6EC4E8] backdrop-blur-md cursor-pointer transition-all"
          >
            <option value="random" className="text-gray-900">Random Shuffled</option>
            <option value="alphabetical" className="text-gray-900">Alphabetical (A-Z)</option>
          </select>
        </div>

        {sortBy === 'random' && !loading && (
          <button
            onClick={() => fetchClubs(1, 'random')}
            className="px-8 py-3 mt-10 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full transition-all backdrop-blur-md"
          >
            🔀 Shuffle Again
          </button>
        )}

      </header>

      <main className="max-w-[1400px] mx-auto px-8 pb-20">
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {clubs.map((club) => (
            <div key={club.id} className="club-card-wrapper transition-all duration-300">
              <Link to={`/clubs/${club.id}`} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 club-card-shadow">
                <div className="aspect-[4/3] w-full flex items-center justify-center p-6 relative bg-gradient-to-br from-[#f5f5f5] to-[#e0e0e0]">
                  <img
                    src={club.logo_url || 'https://ires.ubc.ca/files/2019/10/ubc-logo.png'}
                    alt={club.name}
                    className="max-w-[80%] max-h-[80%] object-contain z-10"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="font-bold text-[#002145] text-lg mb-2">{club.name}</h2>
                  <p className="text-sm text-gray-600 line-clamp-3">{club.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {clubs.length === 0 && !loading && (
          <div className="text-center py-24 bg-white/10 rounded-3xl backdrop-blur-sm">
            <p className="text-white/60 text-xl font-light">No clubs found.</p>
          </div>
        )}

        <div className="mt-16 flex flex-col items-center gap-4">
          {loading && (
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
          )}

          {!loading && hasMore && sortBy === 'alphabetical' && (
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-[#6EC4E8] hover:bg-[#5db3d7] text-[#002145] font-bold rounded-full transition-all shadow-lg active:scale-95"
            >
              Load More Clubs
            </button>
          )}

          {sortBy === 'random' && !loading && (
            <button
              onClick={() => fetchClubs(1, 'random')}
              className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full transition-all backdrop-blur-md"
            >
              🔀 Shuffle Again
            </button>
          )}

          {!hasMore && sortBy === 'alphabetical' && clubs.length > 0 && (
            <p className="text-white/50 italic">You've reached the end of the directory.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;