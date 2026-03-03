import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Menu, Video, Bell, User, Settings, MessageSquare, 
  Code, GraduationCap, Award, Play, Home, Compass, 
  Library, History, ThumbsUp, ChevronRight, X, Send,
  Terminal, CheckCircle2, Download, LogOut, Plus
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import Markdown from 'react-markdown';
import { User as UserType, Video as VideoType, Message, AppState, Conversation } from './types';
import { MOCK_VIDEOS, LANGUAGES, INTERNSHIP_NOTES } from './constants';

// --- Components ---

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0a0a0a] z-[100] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-8xl font-bold text-white mb-8 relative z-10"
        >
          <span className="text-emerald-500">C</span>#
        </motion.div>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"
        />
      </div>
      
      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
        />
      </div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-emerald-500/60 font-mono text-sm tracking-widest uppercase"
      >
        Initializing System.Runtime...
      </motion.p>
    </motion.div>
  );
};

const LoginScreen = ({ onLogin }: { onLogin: (user: UserType) => void }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  useEffect(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(result);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captcha.toUpperCase() !== captchaValue) {
      alert('Invalid Captcha!');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username })
      });
      const user = await res.json();
      onLogin(user);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl border border-white/5 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">coders<span className="text-emerald-500">.in</span></h1>
          <p className="text-white/50 text-sm italic">Where code meets community</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Google Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="name@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="coder_ninja"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Captcha</label>
            <div className="flex gap-4 items-center">
              <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 text-emerald-500 font-mono text-xl tracking-widest select-none line-through decoration-emerald-500/50">
                {captchaValue}
              </div>
              <input
                type="text"
                required
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="w-24 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-center focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Code"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            Enter Workspace
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Header = ({ user, onAction }: { user: UserType, onAction: (state: AppState) => void }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f] flex items-center justify-between px-4 z-50 border-bottom border-white/5">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/10 rounded-full text-white">
          <Menu size={20} />
        </button>
        <div 
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => onAction('home')}
        >
          <Code className="text-emerald-500" size={24} />
          <span className="text-xl font-bold text-white tracking-tighter">coders.in</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-8 hidden md:flex">
        <div className="flex w-full">
          <input 
            type="text" 
            placeholder="Search programming tutorials..."
            className="w-full bg-[#121212] border border-white/10 rounded-l-full px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
          <button className="bg-white/10 border border-l-0 border-white/10 rounded-r-full px-6 hover:bg-white/20 text-white">
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 hover:bg-white/10 rounded-full text-white hidden sm:block">
          <Video size={20} />
        </button>
        <button 
          className="p-2 hover:bg-white/10 rounded-full text-white"
          onClick={() => onAction('chat')}
        >
          <MessageSquare size={20} />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-full text-white">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-white">{user.username}</p>
            <p className="text-[10px] text-white/50">{user.coders_count} coders</p>
          </div>
          <button 
            className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500/50"
            onClick={() => onAction('internship')}
          >
            <img src={user.avatar} alt="avatar" referrerPolicy="no-referrer" />
          </button>
        </div>
      </div>
    </header>
  );
};

const Sidebar = ({ activeState, onAction }: { activeState: AppState, onAction: (state: AppState) => void }) => {
  const items = [
    { icon: Home, label: 'Home', state: 'home' as AppState },
    { icon: Compass, label: 'Explore', state: 'home' as AppState },
    { icon: GraduationCap, label: 'Internship', state: 'internship' as AppState },
    { icon: Terminal, label: 'Compilers', state: 'compiler' as AppState },
    { icon: Library, label: 'Library', state: 'home' as AppState },
    { icon: History, label: 'History', state: 'home' as AppState },
  ];

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-16 lg:w-64 bg-[#0f0f0f] overflow-y-auto hidden sm:block border-r border-white/5">
      <div className="p-2 space-y-1">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => onAction(item.state)}
            className={`w-full flex flex-col lg:flex-row items-center gap-0 lg:gap-6 p-3 rounded-xl transition-colors ${
              activeState === item.state ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <item.icon size={22} className={activeState === item.state ? 'text-emerald-500' : ''} />
            <span className="text-[10px] lg:text-sm mt-1 lg:mt-0">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="hidden lg:block p-4 mt-4 border-t border-white/5">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 px-2">Subscriptions</h3>
        <div className="space-y-2">
          {['React Master', 'Python Pro', 'C# Ninja'].map((sub, i) => (
            <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-500 font-bold">
                {sub[0]}
              </div>
              <span className="text-sm text-white/80">{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

const VideoCard = ({ video }: { video: VideoType }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="flex flex-col gap-3 cursor-pointer group"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1a1a1a]">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
          12:45
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex-shrink-0 flex items-center justify-center text-emerald-500 font-bold">
          {video.language[0]}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight mb-1 group-hover:text-emerald-400 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-white/50 mb-0.5">{video.language} Coders</p>
          <p className="text-xs text-white/50">{video.views} views • {video.timestamp}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ChatView = ({ user, socket }: { user: UserType, socket: Socket | null }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!socket || !selectedConv) return;
    
    socket.emit('join_conversation', selectedConv.id);
    fetchMessages(selectedConv.id);
    
    socket.on('receive_message', (msg: Message) => {
      if (msg.conversation_id === selectedConv.id) {
        setMessages(prev => [...prev, msg]);
      }
      // Update last message in conversation list
      setConversations(prev => prev.map(c => 
        c.id === msg.conversation_id ? { ...c, last_message: msg.content } : c
      ));
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket, selectedConv]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    const res = await fetch(`/api/conversations/${user.id}`);
    const data = await res.json();
    setConversations(data);
    if (data.length > 0 && !selectedConv) setSelectedConv(data[0]);
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data.filter((u: UserType) => u.id !== user.id));
  };

  const fetchMessages = async (convId: string) => {
    const res = await fetch(`/api/messages/${convId}`);
    const data = await res.json();
    setMessages(data);
  };

  const startNewChat = async (targetUser: UserType) => {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: targetUser.username,
        is_group: false,
        members: [user.id, targetUser.id]
      })
    });
    const newConv = await res.json();
    setConversations(prev => [...prev, newConv]);
    setSelectedConv(newConv);
    setShowNewChat(false);
  };

  const sendMessage = () => {
    if (!input.trim() || !socket || !selectedConv) return;
    
    const msg: Message = {
      conversation_id: selectedConv.id,
      sender_id: user.id,
      content: input
    };
    
    socket.emit('send_message', msg);
    setInput('');
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-[#0f0f0f] overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-bold text-white">Messages</h2>
          <button 
            onClick={() => setShowNewChat(true)}
            className="p-2 hover:bg-white/10 rounded-full text-emerald-500"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors ${
                selectedConv?.id === conv.id ? 'bg-white/10' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
                {conv.name[0]}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-white">{conv.name}</p>
                <p className="text-xs text-white/50 line-clamp-1">{conv.last_message || 'No messages yet'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                {selectedConv.name[0]}
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">{selectedConv.name}</h2>
                <p className="text-[10px] text-emerald-500">Active conversation</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-2xl ${
                    msg.sender_id === user.id 
                      ? 'bg-emerald-600 text-white rounded-tr-none' 
                      : 'bg-white/10 text-white rounded-tl-none'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-[8px] mt-1 opacity-50 text-right">
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-[#1a1a1a] border-t border-white/5">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
                <button 
                  onClick={sendMessage}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/30">
            <MessageSquare size={64} className="mb-4 opacity-20" />
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChat && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-full max-w-md bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-white">New Chat</h3>
                <button onClick={() => setShowNewChat(false)}><X size={20} /></button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => startNewChat(u)}
                    className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
                  >
                    <img src={u.avatar} className="w-10 h-10 rounded-full" alt="" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{u.username}</p>
                      <p className="text-xs text-white/50">{u.coders_count} coders</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CompilerView = () => {
  const [selectedLang, setSelectedLang] = useState('JavaScript');
  const [code, setCode] = useState('// Write your code here...\nconsole.log("Hello, Coders!");');
  const [output, setOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);

  const langConfigs: Record<string, { defaultCode: string, color: string }> = {
    'JavaScript': { defaultCode: 'console.log("Hello from JavaScript!");', color: 'text-yellow-400' },
    'Python': { defaultCode: 'print("Hello from Python!")', color: 'text-blue-400' },
    'Java': { defaultCode: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java!");\n  }\n}', color: 'text-red-400' },
    'C++': { defaultCode: '#include <iostream>\n\nint main() {\n  std::cout << "Hello from C++!" << std::endl;\n  return 0;\n}', color: 'text-blue-500' },
    'C#': { defaultCode: 'using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello from C#!");\n  }\n}', color: 'text-purple-400' }
  };

  useEffect(() => {
    setCode(langConfigs[selectedLang]?.defaultCode || '');
  }, [selectedLang]);

  const runCode = () => {
    setIsCompiling(true);
    setOutput('Compiling...\n');
    setTimeout(() => {
      setIsCompiling(false);
      setOutput(`[${selectedLang} Output]\n> Hello from ${selectedLang}!\n> Execution successful (0.02s)\n> Memory used: 12MB`);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap gap-3">
        {Object.keys(langConfigs).map(lang => (
          <button
            key={lang}
            onClick={() => setSelectedLang(lang)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              selectedLang === lang 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'
            }`}
          >
            <Code size={16} />
            {lang}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        <div className="flex flex-col bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-3 bg-black/30 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs font-mono text-white/30 ml-2">{selectedLang.toLowerCase()}_workspace.src</span>
            </div>
            <button 
              onClick={runCode}
              disabled={isCompiling}
              className={`flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-lg transition-all ${
                isCompiling ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Play size={14} fill="currentColor" /> {isCompiling ? 'Running...' : 'Run Code'}
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`flex-1 bg-transparent p-6 font-mono text-sm focus:outline-none resize-none ${langConfigs[selectedLang]?.color || 'text-emerald-400'}`}
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-3 bg-black/30 border-b border-white/5 flex items-center gap-2">
            <Terminal size={14} className="text-white/30" />
            <span className="text-xs font-mono text-white/30">Debug Console</span>
          </div>
          <div className="flex-1 p-6 font-mono text-sm text-white/70 whitespace-pre-wrap overflow-y-auto">
            {output || 'Ready to compile. Output will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
};

const InternshipView = ({ user }: { user: UserType }) => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [showTest, setShowTest] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [certName, setCertName] = useState(user.username);

  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Background
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Border
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    
    // Content
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(40);
    doc.text('CERTIFICATE OF COMPLETION', 148.5, 60, { align: 'center' });
    
    doc.setFontSize(20);
    doc.text('This is to certify that', 148.5, 90, { align: 'center' });
    
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(35);
    doc.text(certName.toUpperCase(), 148.5, 115, { align: 'center' });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('has successfully completed the 3-week Full-Stack Internship at', 148.5, 140, { align: 'center' });
    
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(25);
    doc.text('coders.in', 148.5, 160, { align: 'center' });
    
    doc.save('coders-in-certificate.pdf');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#ffffff', '#059669']
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Developer Internship Program</h1>
        <p className="text-white/50">Complete 3 weeks of intensive learning to earn your verified certificate.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INTERNSHIP_NOTES.map((note) => (
          <button
            key={note.week}
            onClick={() => setCurrentWeek(note.week)}
            className={`p-6 rounded-2xl border transition-all text-left ${
              currentWeek === note.week 
                ? 'bg-emerald-600/20 border-emerald-500 shadow-lg shadow-emerald-500/10' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="text-xs font-bold text-emerald-500 mb-2 uppercase tracking-widest">Week {note.week}</div>
            <h3 className="text-lg font-bold text-white mb-2">{note.title}</h3>
            <p className="text-xs text-white/50 line-clamp-2">{note.content}</p>
          </button>
        ))}
      </div>

      <motion.div 
        key={currentWeek}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Week {currentWeek}: {INTERNSHIP_NOTES[currentWeek-1].title}</h2>
        <div className="prose prose-invert max-w-none mb-8">
          <p className="text-white/70 leading-relaxed">
            {INTERNSHIP_NOTES[currentWeek-1].content}
            <br /><br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
        
        {currentWeek === 3 && !testCompleted && (
          <button 
            onClick={() => setShowTest(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all"
          >
            Attempt Final Test
          </button>
        )}

        {testCompleted && (
          <div className="space-y-6">
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
              <CheckCircle2 className="text-emerald-500" size={32} />
              <div>
                <h4 className="text-white font-bold">Test Passed!</h4>
                <p className="text-white/50 text-sm">You are eligible for the certificate.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest">Name for Certificate</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                />
                <button 
                  onClick={generateCertificate}
                  className="bg-white text-black font-bold px-8 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2"
                >
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showTest && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg bg-[#1a1a1a] p-8 rounded-3xl border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Final Assessment</h2>
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-white font-medium">1. What is the time complexity of a binary search?</p>
                  {['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'].map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setTestCompleted(true);
                        setShowTest(false);
                      }}
                      className="w-full text-left p-4 bg-white/5 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/50 rounded-xl text-white/70 hover:text-white transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HomeView = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchVideos = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/videos?page=${page}`);
      const data = await res.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setVideos(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          fetchVideos();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {videos.map((video, i) => (
          <VideoCard key={`${video.id}-${i}`} video={video} />
        ))}
      </div>
      
      {/* Infinite Scroll Loader */}
      <div ref={loaderRef} className="py-10 flex justify-center">
        {loading && (
          <div className="flex gap-1">
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-emerald-500 rounded-full" />
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-emerald-500 rounded-full" />
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-emerald-500 rounded-full" />
          </div>
        )}
        {!hasMore && <p className="text-white/20 text-xs uppercase tracking-widest">End of the line, coder.</p>}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [user, setUser] = useState<UserType | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user) {
      const newSocket = io();
      setSocket(newSocket);
      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const handleLogin = (userData: UserType) => {
    setUser(userData);
    setAppState('loading');
  };

  const renderContent = () => {
    switch (appState) {
      case 'home':
        return <HomeView />;
      case 'chat':
        return <ChatView user={user!} socket={socket} />;
      case 'compiler':
        return <CompilerView />;
      case 'internship':
        return <InternshipView user={user!} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">
        {appState === 'login' && (
          <LoginScreen key="login" onLogin={handleLogin} />
        )}

        {appState === 'loading' && (
          <LoadingScreen key="loading" onComplete={() => setAppState('home')} />
        )}

        {(appState !== 'login' && appState !== 'loading') && user && (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-14 sm:pl-16 lg:pl-64"
          >
            <Header user={user} onAction={setAppState} />
            <Sidebar activeState={appState} onAction={setAppState} />
            
            <main className="min-h-[calc(100vh-3.5rem)]">
              {renderContent()}
            </main>

            {/* Bottom Floating Compilers Access (Mobile) */}
            <div className="fixed bottom-4 right-4 sm:hidden z-50">
              <button 
                onClick={() => setAppState('compiler')}
                className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/40 border border-emerald-400/20"
              >
                <Terminal size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
