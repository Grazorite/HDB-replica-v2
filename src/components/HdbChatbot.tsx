import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";

export default function HdbChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content: "Hello! I am **Ask HDB**, your digital AI Assistant. I can help answer your queries on HDB housing eligibility, CPF housing grants, BTO launches, and season parking.\n\nWhat would you like to know today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  const quickQuestions = [
    { label: "BTO Grants", query: "What CPF Housing Grants are available for first-time buyers?" },
    { label: "Check HFE Eligibility", query: "Who is eligible to apply for an HDB Flat Eligibility (HFE) letter?" },
    { label: "Renew Season Parking", query: "How do I renew my season parking and what is the cost?" }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setError("");
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Gather conversation history for Gemini context
      const formattedHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: formattedHistory })
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the Ask HDB AI server.");
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: "model",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setError("Unable to connect with AI assistant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Basic formatter for HDB chatbot replies (handles bold, bullets and newlines)
  const formatMessageText = (text: string) => {
    return text.split("\n").map((paragraph, index) => {
      if (!paragraph.trim()) return <div key={index} className="h-2" />;

      // List item detection
      if (paragraph.trim().startsWith("- ") || paragraph.trim().startsWith("* ")) {
        const cleanItem = paragraph.trim().substring(2);
        return (
          <li key={index} className="ml-4 list-disc text-xs leading-relaxed mb-1">
            {parseBoldText(cleanItem)}
          </li>
        );
      }

      return (
        <p key={index} className="text-xs leading-relaxed mb-1.5">
          {parseBoldText(paragraph)}
        </p>
      );
    });
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) return <strong key={i} className="font-extrabold text-gray-900">{part}</strong>;
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99] flex flex-col items-end">
      {/* Floating Chat window */}
      {isOpen && (
        <div className="bg-white rounded-2xl w-[360px] h-[500px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5 fade-in duration-200">
          
          {/* Header Banner */}
          <div className="bg-primary p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-[#91f2f7]" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-wide">Ask HDB</h4>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-white/80">AI Assistant Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex gap-2.5 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                {msg.role === "model" && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/10">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div className="space-y-0.5">
                  <div className={`p-3 rounded-2xl ${
                    msg.role === "user" 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white text-gray-800 border border-gray-200/80 rounded-tl-none shadow-sm"
                  }`}>
                    {msg.role === "user" ? (
                      <p className="text-xs leading-relaxed">{msg.content}</p>
                    ) : (
                      formatMessageText(msg.content)
                    )}
                  </div>
                  <span className={`text-[9px] text-gray-400 block px-1 ${msg.role === "user" ? "text-right" : ""}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 max-w-[80%]">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/10">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{error}</p>
                  <button 
                    onClick={() => handleSendMessage(messages[messages.length - 1].content)}
                    className="text-red-900 underline font-bold mt-1 block"
                  >
                    Retry Sending
                  </button>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-2 border-t border-gray-100 bg-white flex flex-wrap gap-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.query)}
                  className="bg-gray-100 hover:bg-primary/5 hover:text-primary transition-all text-[10px] font-semibold text-gray-600 px-2.5 py-1.5 rounded-full border border-gray-200"
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          {/* Form Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
              placeholder="Ask me a question about HDB..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
              className="bg-primary text-on-primary p-2 rounded-xl hover:opacity-90 active:scale-95 transition-all shrink-0 flex items-center justify-center disabled:bg-gray-200 disabled:text-gray-400 disabled:scale-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#00686c] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-primary transition-all duration-200 border border-white/20 relative group active:scale-95"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-in spin-in-45 duration-150" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 animate-in zoom-in-50 duration-150" />
            <span className="absolute right-0 -top-1 bg-[#bc0001] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full animate-bounce">
              AI
            </span>
          </>
        )}
      </button>
    </div>
  );
}
