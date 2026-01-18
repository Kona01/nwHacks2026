import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Effect to handle searching whenever the 'query' state changes
  useEffect(() => {
    // If query is too short, don't search
    if (query.length < 2) {
      setResults([]);
      return;
    }

    // Debouncing: Wait 300ms after the user stops typing
    const delayDebounceFn = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async (searchTerm) => {
    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:5000/api/clubs/search?q=${searchTerm}`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#002145] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-blue-300 hover:underline mb-8 inline-block">← Back to Directory</Link>
        
        <h1 className="text-4xl font-bold mb-8">Search Clubs</h1>
        
        {/* Search Input */}
        <div className="relative mb-12">
          <input
            type="text"
            placeholder="Type a club name (e.g. 'Chess' or 'Science')..."
            className="w-full p-5 rounded-2xl bg-white text-gray-900 text-xl shadow-2xl focus:ring-4 focus:ring-blue-400 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isSearching && (
            <div className="absolute right-5 top-5">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((club) => (
            <Link 
              key={club.id} 
              to={`/clubs/${club.id}`}
              className="bg-white/10 p-6 rounded-xl hover:bg-white/20 transition-colors border border-white/10"
            >
              <h2 className="text-xl font-bold mb-2">{club.name}</h2>
              <p className="text-gray-300 line-clamp-2 text-sm">{club.description}</p>
            </Link>
          ))}
        </div>

        {query.length >= 2 && results.length === 0 && !isSearching && (
          <p className="text-center text-gray-400 mt-10">No clubs found matching "{query}"</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;