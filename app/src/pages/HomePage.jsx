import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Discover Campus Clubs
        </h1>
        <p className="text-lg text-gray-600">
          Explore {clubs.length} featured organizations and share your experiences.
        </p>
      </header>

      {/* Grid of Clubs */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {clubs.map((club) => (
          <Link 
            key={club.id} 
            to={`/clubs/${club.id}`} 
            className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
          >
            {/* Logo Thumbnail Container */}
            <div className="aspect-square w-full flex items-center justify-center p-4 overflow-hidden bg-white">
              <img
                className='bg-'
                src={club.logo_url || 'https://ires.ubc.ca/files/2019/10/ubc-logo.png'} 
                alt={`${club.name} logo`} 
                loading='lazy'
                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Club Info */}
            <div className="p-4 flex-grow border-t border-gray-50">
              <h2 className="font-bold text-gray-800 text-sm truncate group-hover:text-blue-600">
                {club.name}
              </h2>
              {club.instagram_handle && (
                <p className="text-xs text-pink-600 font-medium mt-1">
                  {club.instagram_handle}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">
                {club.description || "No description provided."}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {clubs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">No clubs found in the database.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;