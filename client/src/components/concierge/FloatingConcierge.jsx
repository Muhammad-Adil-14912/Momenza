import { Bot, ChevronDown, Send, Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useEvents } from '../../context/EventContext';
import api from '../../services/api';

const FloatingConcierge = () => {
  const { activeEvent } = useEvents();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello, I am your MOMENZA Concierge. Whether you need to trim ₹20,000 from your budget, refine catering tasting menus, or design a weather backup plan, I'm here to curate every detail with you."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'How can I reduce my wedding budget by ₹20,000?',
    'Suggest decorations under ₹15,000.',
    'Create a vegetarian menu for 100 guests.',
    'What tasks are pending?',
    'Suggest a rainy-day backup plan.'
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || isTyping) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/ai/concierge-chat', {
        eventContext: activeEvent || {
          eventName: 'Curated Celebration',
          eventType: 'Wedding',
          guestCount: 300,
          totalBudget: 800000,
          location: 'Lucknow, India'
        },
        question: text,
        conversationHistory: messages.slice(-4)
      });

      if (res.data?.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I apologize, I could not complete your request at this moment. Please try again shortly.'
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I am temporarily experiencing a connection delay. Please verify your internet or try asking again.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Sparkle Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-[#252522] hover:bg-[#C47B62] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group border border-[#FAF9F6]/20"
          aria-label="Open MOMENZA Concierge"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#FAF9F6] transition-transform duration-500 group-hover:rotate-45" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C47B62] rounded-full animate-ping opacity-75"></span>
          </div>
          <span className="text-sm font-medium tracking-wide">Concierge</span>
        </button>
      )}

      {/* Slide-Over Conversational Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#EAE8E2] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="bg-[#FAF9F6] p-4 border-b border-[#EAE8E2] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#C47B62]/10 flex items-center justify-center text-[#C47B62]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-semibold text-[#252522]">MOMENZA Concierge</h3>
                <p className="text-[11px] text-[#85847F] truncate max-w-[220px]">
                  {activeEvent ? `${activeEvent.eventName} • ₹${(activeEvent.totalBudget / 100000).toFixed(1)}L` : 'Active Context: Global Assistant'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#85847F] hover:text-[#252522] hover:bg-[#F1EDE5] rounded-full transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-[#FAF9F6]/50 px-3 py-2 border-b border-[#EAE8E2] overflow-x-auto no-scrollbar flex space-x-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap text-[11px] bg-white border border-[#EAE8E2] hover:border-[#C47B62] text-[#252522] hover:text-[#C47B62] px-2.5 py-1 rounded-full transition-colors shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF9F6]/20">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] text-xs sm:text-sm rounded-2xl px-4 py-3 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#252522] text-white rounded-br-none'
                      : 'bg-white border border-[#EAE8E2] text-[#252522] shadow-xs rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#EAE8E2] px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center space-x-1.5 text-xs text-[#85847F]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C47B62] animate-spin" />
                  <span>MOMENZA is contemplating...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[#EAE8E2] bg-white flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your celebration..."
              className="flex-1 bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-full px-4 py-2 text-xs sm:text-sm text-[#252522] placeholder:text-[#85847F]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-full bg-[#C47B62] hover:bg-[#A9614A] disabled:opacity-40 text-white flex items-center justify-center transition shadow-sm shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingConcierge;
