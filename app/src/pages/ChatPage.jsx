import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Inline SVG Icons (Updated colors for theme) ---
const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-[#6EC4E8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function ChatPage() {
  const [messages, setMessages] = useState([{ role: 'model', text: 'Hello! I am your UBC Club Assistant. How can I help you discover campus life today?' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: '**Error:** I couldn’t reach the club database. Please check your connection.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-4.5rem)] text-white" style={{
      background: 'linear-gradient(135deg, #002145 0%, #0055B7 100%)',
    }}>
      {/* Chat Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#002145]/80 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#6EC4E8] to-[#0055B7] text-white rounded-xl shadow-md">
            <BotIcon />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide">Club Assistant</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-[#6EC4E8] font-medium uppercase tracking-tighter">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Message List */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`flex max-w-[90%] md:max-w-[80%] gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-[#6EC4E8] text-[#002145]' 
                    : 'bg-white/10 backdrop-blur-md border border-white/20 text-[#6EC4E8]'
                }`}>
                  {msg.role === 'user' ? <UserIcon /> : <BotIcon />}
                </div>

                {/* Bubble */}
                <div className={`px-5 py-3.5 rounded-2xl text-[0.95rem] leading-relaxed shadow-xl break-words transition-all ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-[#0055B7] to-[#002145] text-white rounded-tr-none border border-white/10'
                    : 'bg-white/10 backdrop-blur-lg text-gray-100 rounded-tl-none border border-white/10'
                }`}>
                  <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert text-white' : 'prose-invert text-gray-100'}`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc ml-5 mb-3" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal ml-5 mb-3" {...props} />,
                        a: ({ node, ...props }) => <a className="text-[#6EC4E8] underline hover:text-white transition-colors" {...props} />,
                        code: ({ node, inline, className, children, ...props }) => {
                          return inline ? (
                            <code className="bg-black/30 px-1.5 py-0.5 rounded text-[#6EC4E8] font-mono text-xs break-all" {...props}>
                              {children}
                            </code>
                          ) : (
                            <code className="block bg-[#001529] text-gray-200 p-4 rounded-xl my-3 overflow-x-auto font-mono text-xs border border-white/5" {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#6EC4E8] border border-white/10">
                <BotIcon />
              </div>
              <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                <LoadingSpinner />
                <span className="text-sm text-[#6EC4E8] font-semibold tracking-wide">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Bar */}
      <footer className="p-6 bg-[#002145]/80 backdrop-blur-xl border-t border-white/10">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
          <input
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#6EC4E8]/50 focus:bg-white/10 transition-all disabled:opacity-50 pr-16 shadow-inner"
            placeholder="Ask about clubs, events, or membership..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-[#6EC4E8] to-[#0055B7] text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 shadow-lg"
          >
            <SendIcon />
          </button>
        </form>
        <p className="text-center text-[10px] text-white/30 mt-3 uppercase tracking-[0.2em]">
          Powered by Gemini AI • UBC Club Finder 2026
        </p>
      </footer>

      {/* Internal Custom Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(110, 196, 232, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(110, 196, 232, 0.4);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}