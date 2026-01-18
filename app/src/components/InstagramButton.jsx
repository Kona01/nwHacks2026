const InstagramButton = ({ handle, url }) => {
  // If there is no instagram data, we don't want to render an empty box
  if (!handle || !url) return null;

  return (
    <div className="mt-2">
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
      >
        {/* Simple Camera Icon (Unicode or SVG) */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
        
        <span>{handle}</span>
      </a>
    </div>
  );
};

export default InstagramButton;