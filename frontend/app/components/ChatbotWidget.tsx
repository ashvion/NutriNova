"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

import { API_URL } from "../../config";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I'm your NutriNova AI assistant. How can I help you with your diet today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          history: messages,
        }),
      });
      const data = await response.json();
      
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.response }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", text: `Error: ${data.error}` }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I'm having trouble connecting to the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 focus:outline-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 h-[500px] bg-base-100 shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-base-200 transition-all duration-300">
          {/* Header */}
          <div className="bg-primary text-primary-content p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <h3 className="font-bold text-lg">NutriNova AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="btn btn-ghost btn-sm btn-circle text-primary-content hover:bg-primary-focus outline-none">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}>
                <div className="chat-image avatar">
                  <div className="w-8 rounded-full bg-base-300 flex items-center justify-center shadow-sm">
                    {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-primary" />}
                  </div>
                </div>
                <div className={`chat-bubble shadow-sm ${msg.role === "user" ? "chat-bubble-primary text-primary-content" : "bg-base-100 text-base-content"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-8 rounded-full bg-base-300 flex items-center justify-center shadow-sm">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="chat-bubble bg-base-100 text-base-content flex items-center gap-1 shadow-sm">
                  <span className="loading loading-dots loading-xs text-primary"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-base-100 border-t border-base-200 flex gap-2">
            <input
              type="text"
              placeholder="Ask about nutrition..."
              className="input input-bordered input-sm flex-1 rounded-full h-11 px-4 outline-none focus:border-primary"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm btn-circle h-11 w-11 shrink-0 shadow-md transition-transform hover:scale-105 active:scale-95"
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-4 h-4 ml-[-2px]" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn btn-circle btn-lg shadow-2xl transition-transform hover:scale-105 duration-300 outline-none border-none ${isOpen ? 'bg-base-300 text-base-content hover:bg-base-300' : 'bg-primary text-primary-content hover:bg-primary focus:bg-primary'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-7 h-7" />}
      </button>
    </div>
  );
}
