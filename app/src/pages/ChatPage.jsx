import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Inline SVG Icons ---
const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function ChatPage() {
  const [messages, setMessages] = useState([{ role: 'model', text: 'Hello! Ask me anything about your project.' }]);
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
      setMessages(prev => [...prev, { role: 'model', text: 'Error: Could not reach the backend.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] bg-slate-50 font-sans antialiased text-slate-900">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 text-white rounded-lg"><BotIcon /></div>
          <h1 className="font-semibold text-lg tracking-tight">Club Assistant</h1>
        </div>
      </header>

      {/* Message List */}

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {/* 1. Added max-w-full and overflow-hidden to the wrapper */}
            <div className={`flex max-w-[90%] md:max-w-[75%] gap-3 overflow-hidden ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                {msg.role === 'user' ? <UserIcon /> : <BotIcon />}
              </div>

              {/* 2. Added break-words and overflow-hidden to the bubble */}
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm overflow-hidden break-words ${msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}>
                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert text-white' : 'text-slate-800'}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                      code: ({ node, inline, className, children, ...props }) => {
                        return inline ? (
                          // 3. Added break-all to inline code to prevent line-breaking issues
                          <code className="bg-slate-100 px-1 rounded text-pink-600 font-mono break-all" {...props}>
                            {children}
                          </code>
                        ) : (
                          // 4. Ensure block code has horizontal scroll and doesn't push the width
                          <code className="block bg-slate-800 text-slate-100 p-3 rounded-lg my-2 overflow-x-auto font-mono custom-scrollbar" {...props}>
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
          <div className="flex justify-start items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><BotIcon /></div>
            <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <LoadingSpinner />
              <span className="text-sm text-slate-500 font-medium">Gemini is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Bar */}
      <footer className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            autoFocus
            className="flex-1 bg-slate-100 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 active:scale-95 transition-all disabled:bg-slate-300 disabled:scale-100"
          >
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
}