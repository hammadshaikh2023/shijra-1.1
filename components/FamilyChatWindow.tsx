import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, X, Users, User, Minimize2, MoreHorizontal, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  isOwn: boolean;
}

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { id: string; name: string };
  treeId: string;
}

// Initialize socket outside component to prevent reconnection on re-renders
let socket: Socket;

export const FamilyChatWindow: React.FC<ChatProps> = ({ isOpen, onClose, currentUser, treeId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'GROUP' | 'DM'>('GROUP');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- SOCKET CONNECTION ---
  useEffect(() => {
    // In production, use your actual backend URL
    socket = io('http://localhost:5000'); 

    socket.on('connect', () => {
      console.log('Connected to Family Chat');
      socket.emit('join_tree', treeId);
    });

    socket.on('receive_message', (msg: any) => {
      const newMsg: Message = {
        ...msg,
        isOwn: msg.senderId === currentUser.id
      };
      setMessages((prev) => [...prev, newMsg]);
      scrollToBottom();
    });

    socket.on('user_typing', ({ userName, isTyping }: { userName: string; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (isTyping && userName !== currentUser.name) {
          newSet.add(userName);
        } else {
          newSet.delete(userName);
        }
        return newSet;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [treeId, currentUser.id]);

  // --- HANDLERS ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const msgData = {
      treeId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: inputText,
      recipientId: activeTab === 'DM' ? 'target_user_id' : undefined // Simplified for DM
    };

    // Optimistic Update
    const optimisticMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: inputText,
      createdAt: new Date().toISOString(),
      isOwn: true
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    
    socket.emit('send_message', msgData);
    setInputText('');
    scrollToBottom();
    handleTyping(false); // Stop typing immediately
  };

  const handleTyping = (isTyping: boolean) => {
    if (isTyping) {
       socket.emit('typing_start', { treeId, userName: currentUser.name });
       
       // Debounce stopping typing
       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
       typingTimeoutRef.current = setTimeout(() => {
         socket.emit('typing_end', { treeId, userName: currentUser.name });
       }, 2000);
    } else {
       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
       socket.emit('typing_end', { treeId, userName: currentUser.name });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[90] w-full max-w-sm md:w-[400px] h-[600px] animate-[fadeInUp_0.4s_ease-out]">
      
      {/* --- GLASS CONTAINER --- */}
      <div className="w-full h-full bg-navy-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="p-4 bg-navy-950/50 border-b border-white/5 flex justify-between items-center cursor-move">
           <div className="flex items-center gap-2">
              <div className="relative">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full absolute -top-0.5 -right-0.5 animate-pulse" />
                 <Users className="text-gold-400" size={18} />
              </div>
              <h3 className="text-white font-serif font-bold text-sm tracking-wide">Family Room</h3>
           </div>
           <div className="flex gap-2 text-slate-400">
              <button className="hover:text-white transition-colors"><Minimize2 size={16} /></button>
              <button onClick={onClose} className="hover:text-red-400 transition-colors"><X size={16} /></button>
           </div>
        </div>

        {/* TABS (Group vs Direct) */}
        <div className="flex p-2 gap-2 bg-navy-950/30">
           <button 
             onClick={() => setActiveTab('GROUP')}
             className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'GROUP' ? 'bg-white/10 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Tree Chat
           </button>
           <button 
             onClick={() => setActiveTab('DM')}
             className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'DM' ? 'bg-white/10 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Direct Messages
           </button>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-navy-950/30 scrollbar-thin scrollbar-thumb-white/10">
           {messages.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <Sparkles size={32} className="text-gold-400 mb-2 animate-spin-slow" />
                <p className="text-xs text-slate-300">Start the conversation...</p>
             </div>
           ) : (
             messages.map((msg, idx) => (
               <div key={idx} className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                  {!msg.isOwn && <span className="text-[10px] text-slate-500 ml-1 mb-1">{msg.senderName}</span>}
                  <div className={`
                    max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm border
                    ${msg.isOwn 
                      ? 'bg-gradient-to-br from-gold-500/80 to-gold-600/80 text-navy-950 rounded-tr-none border-gold-400/50' 
                      : 'bg-white/5 text-slate-200 rounded-tl-none border-white/10'}
                  `}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-slate-600 mt-1 mx-1 opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
               </div>
             ))
           )}
           
           {/* Typing Indicator */}
           {typingUsers.size > 0 && (
             <div className="flex items-center gap-2 text-[10px] text-slate-400 ml-2 animate-pulse">
                <div className="flex gap-1">
                   <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}} />
                   <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}} />
                   <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}} />
                </div>
                {Array.from(typingUsers).join(', ')} is typing...
             </div>
           )}
           
           <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-3 bg-navy-950/80 border-t border-white/10">
           <div className="relative flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-gold-400 transition-colors">
                 <MoreHorizontal size={18} />
              </button>
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => {
                   setInputText(e.target.value);
                   handleTyping(true);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all placeholder-slate-600"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className={`!p-2.5 !rounded-full !min-w-0 ${!inputText.trim() ? 'opacity-50 grayscale' : ''}`}
              >
                 <Send size={16} />
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
};