import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react'; // Optional: npm install lucide-react

const LuckyButton = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRandomClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/clubs/random-id');
      const data = await response.json();

      if (data.id) {
        // Adding a tiny artificial delay for better "rolling" feel
        setTimeout(() => {
          navigate(`/clubs/${data.id}`);
          setIsLoading(false);
        }, 600);
      }
    } catch (error) {
      console.error("Luck ran out:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRandomClick}
      disabled={isLoading}
      className="group relative inline-flex items-center gap-2 px-5 py-2 font-semibold text-white transition-all duration-300 ease-in-out 
                 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                 rounded-full shadow-lg hover:shadow-purple-500/50 hover:scale-105 active:scale-95 disabled:opacity-70"
    >
      {/* Background Glow Effect */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 blur-md opacity-0 group-hover:opacity-40 transition-opacity"></span>

      {/* Button Content */}
      <span className="relative flex items-center gap-2">
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
        )}
        <span className="whitespace-nowrap">
          {isLoading ? "Finding Magic..." : "Feeling Lucky?"}
        </span>
      </span>
    </button>
  );
};

export default LuckyButton;