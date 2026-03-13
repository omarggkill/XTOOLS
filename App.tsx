/**
 * XTOOLS - Discord Server Cloner
 * Fixed & Improved Version v2
 */

import React, { useState, useEffect } from 'react';
import {
  Shield, Terminal, BarChart3, ChevronRight,
  LayoutDashboard, LogOut, Lock, User, ExternalLink,
  Copy, CheckCircle2, AlertCircle, Sun, Moon, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Page = 'home' | 'tools' | 'admin' | 'cloner';
interface SiteContent { aboutUs: string; discordLink: string; }
interface DiscordUser { id: string; username: string; avatar: string; }
interface DiscordGuild { id: string; name: string; icon: string; owner: boolean; permissions: string; }

const INITIAL_CONTENT: SiteContent = {
  aboutUs: 'نحن نقدم أفضل الأدوات لنسخ وإدارة سيرفرات الديسكورد بدقة عالية وأمان تام. يمكنك الاعتماد علينا في تنظيم مجتمعك الرقمي.',
  discordLink: 'https://discord.gg/xtools',
};

const detectStaticHost = (): boolean => {
  const h = window.location.hostname;
  return h.includes('github.io') || h.includes('netlify.app') || h.includes('vercel.app') ||
    h.includes('pages.dev') || h.includes('surge.sh') || h.includes('tiiny.site');
};

const Navbar = ({ onNavigate, onAdminClick, currentPage, user, onLogout, discordLink, darkMode, toggleDark }: {
  onNavigate: (p: Page) => void; onAdminClick: () => void; currentPage: Page;
  user: DiscordUser | null; onLogout: () => void; discordLink: string;
  darkMode: boolean; toggleDark: () => void;
}) => (
  <header className="flex items-center justify-between border-b border-solid border-white/5 px-6 md:px-20 py-4 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
    <div className="flex flex-col text-emerald-500 cursor-pointer select-none group" onClick={() => onNavigate('home')}>
      <div className="flex items-center gap-2">
        <div className="text-xl font-serif group-hover:rotate-12 transition-transform" onClick={(e) => { e.stopPropagation(); onAdminClick(); }}>◈</div>
        <h2 className="text-slate-100 text-2xl font-black leading-none tracking-tighter">XTOOLS</h2>
      </div>
      <span className="text-[9px] font-bold tracking-[0.4em] text-emerald-500/80 ml-7">COPY SERVER</span>
    </div>
    <div className="flex flex-1 justify-end gap-6 items-center">
      <nav className="hidden md:flex items-center gap-9">
        <button onClick={() => onNavigate('home')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentPage === 'home' ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500'}`}>الرئيسية</button>
        <button onClick={() => onNavigate('tools')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentPage === 'tools' ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500'}`}>الأدوات</button>
      </nav>
      <button onClick={toggleDark} className="text-slate-400 hover:text-emerald-500 transition-colors p-2 rounded-full hover:bg-slate-800">
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      {user ? (
        <div className="flex items-center gap-3 bg-slate-900/50 p-1 pr-4 rounded-full border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs border border-emerald-500/30">{user.username[0].toUpperCase()}</div>
          <span className="text-slate-100 text-sm font-bold">{user.username}</span>
          <button onClick={onLogout} className="text-slate-500 hover:text-red-400 transition-colors"><LogOut size={16} /></button>
        </div>
      ) : (
        <button onClick={() => onNavigate('tools')} className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest transition-all hover:bg-emerald-400 active:scale-95">دخول</button>
      )}
    </div>
  </header>
);

const Hero = ({ onExplore }: { onExplore: () => void }) => (
  <section className="py-16 md:py-32 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[150px]"></div>
    </div>
    <div className="flex flex-col gap-12 items-center text-center">
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex justify-center">
          <span className="text-emerald-500 font-bold tracking-[0.2em] text-[10px] uppercase bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">Advanced Infrastructure</span>
        </div>
        <h1 className="text-slate-100 text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter">
          Architect Your <br /><span className="text-emerald-500">Digital Realm</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Precision-engineered tools for Discord server management. Clone, organize, and automate with absolute control.
        </p>
      </div>
      <div className="flex flex-wrap gap-6 justify-center">
        <button onClick={onExplore} className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-10 bg-emerald-500 text-slate-950 text-base font-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] active:scale-95">Launch Dashboard</button>
        <a href="https://discord.gg/xtools" target="_blank" rel="noopener noreferrer" className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-10 border border-slate-800 bg-slate-900/50 text-slate-100 text-base font-bold hover:bg-slate-800 transition-all active:scale-95">Join Discord</a>
      </div>
    </div>
  </section>
);

const Features = () => (
  <section className="py-16 border-t border-white/5">
    <div className="flex flex-col gap-4 mb-14 text-center">
      <h2 className="text-slate-100 text-4xl font-black tracking-tight">Engineered for <span className="text-emerald-500">Excellence</span></h2>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto">Built to handle demanding server environments with zero compromise on speed or security.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        { icon: <Copy />, title: 'Server Replication', desc: 'Advanced cloning engine that replicates categories, channels, roles, and permissions with 1:1 precision.' },
        { icon: <Shield />, title: 'End-to-End Security', desc: 'All operations use secure API channels. Your credentials are never stored or logged.' },
        { icon: <BarChart3 />, title: 'Emoji Management', desc: 'Clone or add emojis (animated & static) from any server instantly.' },
        { icon: <CheckCircle2 />, title: 'Verified Cloning', desc: 'After every clone, a verification check confirms roles, channels, and emojis match the source.' },
      ].map((f, i) => (
        <div key={i} className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/30 p-10 hover:border-emerald-500/30 transition-all group">
          <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-2xl w-fit group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">{f.icon}</div>
          <div className="flex flex-col gap-3">
            <h3 className="text-slate-100 text-2xl font-bold">{f.title}</h3>
            <p className="text-slate-400 text-base leading-relaxed">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const AboutUs = ({ content, discordLink }: { content: string; discordLink: string }) => (
  <section className="py-24" id="about">
    <div className="flex flex-col gap-12 max-w-4xl mx-auto text-center">
      <div className="flex flex-col gap-4">
        <h2 className="text-slate-100 text-5xl md:text-7xl font-black tracking-tighter">من نحن</h2>
        <div className="h-1.5 w-24 bg-emerald-500 mx-auto rounded-full"></div>
      </div>
      <p className="text-slate-400 text-xl md:text-2xl leading-relaxed font-medium" style={{ direction: 'rtl' }}>{content}</p>
      <div className="flex justify-center mt-4">
        <a href={discordLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-500 font-black hover:bg-slate-800 transition-all">
          انضم إلينا على ديسكورد <ExternalLink size={20} />
        </a>
      </div>
    </div>
  </section>
);

const ToolsPage = ({ onSelectTool }: { onSelectTool: (tool: string) => void }) => (
  <div className="py-20">
    <div className="flex flex-col items-center mb-16 text-center">
      <div className="size-20 text-emerald-500 mb-6 bg-emerald-500/10 p-5 rounded-3xl border border-emerald-500/20"><Terminal size={40} /></div>
      <h1 className="text-6xl font-black text-slate-100 mb-6 tracking-tight">System Tools</h1>
      <p className="text-slate-400 max-w-xl text-lg">Access our suite of professional server management utilities.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[{ id: 'cloner', title: 'Server Architect', desc: 'Full-scale server replication. Copies hierarchy, permissions, and structure with 100% accuracy.', type: 'User Token' }].map((tool) => (
        <motion.div key={tool.id} whileHover={{ y: -8, borderColor: '#10b981' }} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 flex flex-col gap-6 transition-all">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-slate-100">{tool.title}</h3>
            <span className="text-[10px] uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-black border border-emerald-500/20">{tool.type}</span>
          </div>
          <p className="text-slate-400 text-base leading-relaxed">{tool.desc}</p>
          <button onClick={() => onSelectTool(tool.id)} className="mt-auto w-full py-4 rounded-2xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-100 font-black transition-all flex items-center justify-center gap-3 group">
            Initialize Tool <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      ))}
    </div>
  </div>
);

const ServerCloner = ({ user, userToken, onLogin }: { user: DiscordUser | null; userToken: string | null; onLogin: (token: string, user: DiscordUser) => void; }) => {
  const [token, setToken] = useState('');
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [sourceGuild, setSourceGuild] = useState<string | null>(null);
  const [destGuild, setDestGuild] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'cloning' | 'success' | 'error'>('idle');
  const [cloningType, setCloningType] = useState<'full' | 'emojis' | 'add-emojis'>('full');
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isStaticHost] = useState(() => detectStaticHost());

  useEffect(() => {
    if (status === 'cloning') {
      const interval = setInterval(() => {
        setProgress((prev) => prev >= 90 ? prev : prev + Math.random() * 2.5);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleLogin = async () => {
    if (!token.trim()) return;
    setStatus('loading');
    setErrorMessage('');
    try {
      const meRes = await fetch('/api/discord/me', { headers: { Authorization: token } });
      if (!meRes.ok) throw new Error('Token غير صحيح');
      const userData = await meRes.json();
      const guildsRes = await fetch('/api/discord/guilds', { headers: { Authorization: token } });
      if (!guildsRes.ok) throw new Error('فشل في جلب السيرفرات');
      const guildsData = await guildsRes.json();
      onLogin(token, {
        id: userData.id, username: userData.username,
        avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png',
      });
      setGuilds(guildsData);
      setStatus('idle');
    } catch (e: any) {
      setErrorMessage(e.message || 'حدث خطأ غير متوقع');
      setStatus('error');
    }
  };

  const startCloning = async (type: 'full' | 'emojis' | 'add-emojis' = 'full') => {
    if (!sourceGuild || !destGuild || !userToken) return;
    setStatus('cloning'); setCloningType(type); setProgress(5);
    const logsMap: Record<string, string[]> = {
      full: ['[SYSTEM] تشغيل محرك النسخ...', '[AUTH] التحقق من الـ Token...', '[CLEANUP] حذف المحتوى القديم...', '[ROLES] إنشاء الـ Roles...', '[CHANNELS] إنشاء الـ Channels...', '[EMOJIS] نسخ الـ Emojis...', '[VERIFY] التحقق من اكتمال النسخ...'],
      emojis: ['[SYSTEM] تشغيل محرك نسخ الـ Emojis...', '[CLEANUP] حذف الـ Emojis القديمة...', '[COPY] نسخ الـ Emojis...'],
      'add-emojis': ['[SYSTEM] تشغيل محرك إضافة الـ Emojis...', '[COPY] إضافة الـ Emojis...'],
    };
    setLog(logsMap[type]);
    try {
      const endpointMap = { full: '/api/discord/clone', emojis: '/api/discord/clone-emojis', 'add-emojis': '/api/discord/add-emojis' };
      const response = await fetch(endpointMap[type], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userToken, sourceId: sourceGuild, targetId: destGuild }),
      });
      if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'فشلت عملية النسخ'); }
      const result = await response.json();
      if (type === 'full' && result.verification) {
        const v = result.verification;
        setLog(prev => [...prev, `[VERIFY] Roles: ${v.roles.source} → ${v.roles.target}`, `[VERIFY] Channels: ${v.channels.source} → ${v.channels.target}`, `[VERIFY] Emojis: ${v.emojis.source} → ${v.emojis.target}`, '[SUCCESS] تمت عملية النسخ بنجاح! ✅']);
      } else {
        setLog(prev => [...prev, `[SUCCESS] تم بنجاح! ${result.count || ''} emojis ✅`]);
      }
      setProgress(100); setStatus('success');
    } catch (e: any) {
      setLog(prev => [...prev, `[ERROR] ${e.message}`]);
      setStatus('error');
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-500"><User size={40} /></div>
            <div>
              <h2 className="text-2xl font-black text-slate-100">تسجيل الدخول</h2>
              <p className="text-slate-400 mt-2 text-sm">أدخل الـ User Token الخاص بك.</p>
            </div>
            {isStaticHost && (
              <div className="w-full p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-xl text-center">
                <div className="font-bold flex items-center justify-center gap-2 mb-1"><AlertCircle size={12} /> تنبيه: استضافة ثابتة</div>
                <p>هذه الاستضافة لا تدعم الـ Backend. استخدم Glitch أو Replit للتشغيل الكامل.</p>
              </div>
            )}
            {errorMessage && <div className="w-full p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">{errorMessage}</div>}
            <div className="w-full space-y-4">
              <input type="password" placeholder="User Token" value={token} onChange={(e) => setToken(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors text-sm" />
              <button onClick={handleLogin} disabled={status === 'loading' || !token.trim()} className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {status === 'loading' ? <><Loader2 size={16} className="animate-spin" /> جاري الاتصال...</> : 'تسجيل الدخول'}
              </button>
            </div>
            <div className="flex items-start gap-2 text-amber-500 bg-amber-500/10 p-3 rounded-lg text-xs w-full">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>تحذير: استخدام User Tokens ضد Discord ToS. استخدم حساباً ثانياً.</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-12 gap-6">
        <div className="flex flex-col">
          <h1 className="text-4xl font-black text-slate-100 tracking-tighter">XTOOLS</h1>
          <p className="text-emerald-500 text-xs font-bold uppercase tracking-[0.3em]">System Core</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/50 px-6 py-3 rounded-full border border-white/5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">01. السيرفر المصدر</label>
            {sourceGuild && <span className="text-[10px] text-emerald-500 font-black">محدد ✓</span>}
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-4 h-[400px] overflow-y-auto space-y-2">
            {guilds.length === 0 && <div className="flex items-center justify-center h-full text-slate-600 text-sm">لا توجد سيرفرات</div>}
            {guilds.map(g => (
              <button key={g.id} onClick={() => setSourceGuild(g.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${sourceGuild === g.id ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'bg-slate-800/20 border-transparent text-slate-400 hover:bg-slate-800/40'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl overflow-hidden ${sourceGuild === g.id ? 'bg-slate-950 text-emerald-500' : 'bg-slate-800'}`}>
                  {g.icon ? <img src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`} alt="" className="w-full h-full object-cover" /> : g.name[0]}
                </div>
                <div className="text-left flex-1 truncate">
                  <div className="font-black text-base truncate">{g.name}</div>
                  <div className="text-[10px] uppercase tracking-widest opacity-60">{g.owner ? 'Owner' : 'Member'}</div>
                </div>
                {sourceGuild === g.id && <CheckCircle2 size={20} />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">02. السيرفر الهدف</label>
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 space-y-4">
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-emerald-500/80 text-xs flex gap-3">
              <Shield className="shrink-0" size={16} />
              <p>يجب أن تكون مالك السيرفر الهدف. سيتم مسح كل شيء فيه واستبداله.</p>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {guilds.filter(g => g.owner).length === 0 && <div className="text-slate-600 text-sm text-center py-8">لا توجد سيرفرات تملكها</div>}
              {guilds.filter(g => g.owner).map(g => (
                <button key={g.id} onClick={() => setDestGuild(g.id)} disabled={g.id === sourceGuild} className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all border ${destGuild === g.id ? 'bg-emerald-500 border-emerald-500 text-slate-950' : g.id === sourceGuild ? 'opacity-30 cursor-not-allowed bg-slate-800/10 border-transparent' : 'bg-slate-800/20 border-transparent text-slate-400 hover:bg-slate-800/40'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm overflow-hidden ${destGuild === g.id ? 'bg-slate-950 text-emerald-500' : 'bg-slate-800'}`}>
                    {g.icon ? <img src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`} alt="" className="w-full h-full object-cover" /> : g.name[0]}
                  </div>
                  <div className="text-left flex-1 truncate font-black text-sm uppercase tracking-tight">{g.name}</div>
                  {destGuild === g.id && <CheckCircle2 size={18} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {(status === 'cloning' || status === 'success' || status === 'error') ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 shadow-2xl">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-100 tracking-tighter">{cloningType === 'full' ? 'NODE REPLICATION' : 'ASSET EXTRACTION'}</h3>
              <p className="text-slate-500 text-xs uppercase tracking-[0.2em] mt-1">{status === 'success' ? 'اكتملت' : status === 'error' ? 'خطأ' : 'جاري العمل...'}</p>
            </div>
            <span className={`text-4xl font-black tracking-tighter ${status === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden mb-8">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full rounded-full ${status === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
          </div>
          <div className="bg-slate-950 rounded-2xl p-6 h-56 overflow-y-auto font-mono text-xs text-emerald-500/80 space-y-2 border border-white/5">
            {log.map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                <span className="opacity-30 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                <span className={l.includes('ERROR') ? 'text-red-400' : l.includes('SUCCESS') ? 'text-green-400' : ''}>{l}</span>
              </motion.div>
            ))}
          </div>
          {(status === 'success' || status === 'error') && (
            <motion.button initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={() => { setStatus('idle'); setProgress(0); setLog([]); }} className={`mt-6 w-full py-4 rounded-2xl text-lg font-black hover:scale-[1.02] transition-all ${status === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-slate-950'}`}>
              {status === 'error' ? 'حدث خطأ — حاول مرة أخرى' : 'اكتملت العملية ✅ — العودة'}
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="mt-12 space-y-4">
          <button onClick={() => startCloning('full')} disabled={!sourceGuild || !destGuild} className="w-full py-7 rounded-[2rem] bg-emerald-500 text-slate-950 text-2xl font-black hover:bg-emerald-400 active:scale-[0.99] transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-4 group">
            <Copy size={28} className="group-hover:rotate-12 transition-transform" /> نسخ كامل للسيرفر
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => startCloning('emojis')} disabled={!sourceGuild || !destGuild} className="w-full py-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-lg font-black hover:bg-emerald-500/10 transition-all disabled:opacity-20 flex items-center justify-center gap-3">
              <BarChart3 size={22} /> نسخ Emojis فقط
            </button>
            <button onClick={() => startCloning('add-emojis')} disabled={!sourceGuild || !destGuild} className="w-full py-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 text-blue-400 text-lg font-black hover:bg-blue-500/10 transition-all disabled:opacity-20 flex items-center justify-center gap-3">
              <BarChart3 size={22} /> إضافة Emojis بدون مسح
            </button>
          </div>
          <div className="flex items-center justify-center gap-8 mt-4 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Hierarchy</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Permissions</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Assets</div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = ({ content, onUpdate, onLogout }: { content: SiteContent; onUpdate: (c: SiteContent) => void; onLogout: () => void; }) => {
  const [about, setAbout] = useState(content.aboutUs);
  const [link, setLink] = useState(content.discordLink);
  const [saved, setSaved] = useState(false);
  const handleSave = () => { onUpdate({ aboutUs: about, discordLink: link }); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="py-12 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500"><LayoutDashboard size={28} /></div>
          <h1 className="text-3xl font-black text-slate-100">Admin Dashboard</h1>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all text-sm"><LogOut size={16} /> خروج</button>
      </div>
      <div className="space-y-6 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">نص "من نحن"</label>
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 h-40 focus:outline-none focus:border-emerald-500 transition-colors text-sm resize-none" />
        </div>
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">رابط Discord</label>
          <input type="text" value={link} onChange={(e) => setLink(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors text-sm" />
        </div>
        <button onClick={handleSave} className={`w-full py-4 rounded-xl font-black transition-all text-sm ${saved ? 'bg-green-500 text-white' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'}`}>
          {saved ? '✅ تم الحفظ!' : 'حفظ التغييرات'}
        </button>
      </div>
    </div>
  );
};

const AdminLogin = ({ onLogin, onClose }: { onLogin: () => void; onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const ADMIN_EMAIL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_EMAIL) || 'admin@xtools.com';
  const ADMIN_PASS = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_PASS) || 'admin123';
  const handleLogin = () => { email === ADMIN_EMAIL && password === ADMIN_PASS ? onLogin() : setError('بيانات خاطئة'); };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center gap-5">
          <div className="p-4 bg-red-500/10 rounded-full text-red-500"><Lock size={28} /></div>
          <h2 className="text-xl font-black text-slate-100">Admin Access</h2>
          {error && <div className="w-full p-3 bg-red-500/10 text-red-500 text-xs rounded-lg text-center font-bold">{error}</div>}
          <div className="w-full space-y-3">
            <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors text-sm" />
            <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors text-sm" />
            <button onClick={handleLogin} className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 transition-all text-sm">دخول</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-100'} text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-300`}>
      <Navbar onNavigate={setPage} onAdminClick={() => setShowAdminLogin(true)} currentPage={page} user={user} onLogout={() => { setUser(null); setUserToken(null); setPage('home'); }} discordLink={content.discordLink} darkMode={darkMode} toggleDark={() => setDarkMode(!darkMode)} />
      <main className="max-w-[1200px] mx-auto px-6">
        <AnimatePresence mode="wait">
          {page === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Hero onExplore={() => setPage('tools')} />
              <Features />
              <AboutUs content={content.aboutUs} discordLink={content.discordLink} />
            </motion.div>
          )}
          {page === 'tools' && (
            <motion.div key="tools" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ToolsPage onSelectTool={(id) => setPage(id as Page)} />
            </motion.div>
          )}
          {page === 'cloner' && (
            <motion.div key="cloner" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
              <ServerCloner user={user} userToken={userToken} onLogin={(t, u) => { setUser(u); setUserToken(t); }} />
            </motion.div>
          )}
          {page === 'admin' && isAdmin && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminPanel content={content} onUpdate={(c) => { setContent(c); setPage('home'); }} onLogout={() => { setIsAdmin(false); setPage('home'); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="bg-slate-950 border-t border-white/5 py-12 px-6 md:px-20 mt-24">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div><h2 className="text-slate-100 text-xl font-black tracking-tighter">XTOOLS</h2><span className="text-[8px] font-bold tracking-[0.3em] text-emerald-500/60">COPY SERVER</span></div>
          <div className="flex gap-10">
            <a className="text-slate-500 hover:text-emerald-500 transition-colors text-xs font-bold uppercase tracking-widest" href="#">Privacy</a>
            <a className="text-slate-500 hover:text-emerald-500 transition-colors text-xs font-bold uppercase tracking-widest" href="#">Terms</a>
          </div>
          <div className="text-slate-700 text-[10px] font-mono">© 2026 XTOOLS CORE</div>
        </div>
      </footer>
      {showAdminLogin && <AdminLogin onLogin={() => { setIsAdmin(true); setShowAdminLogin(false); setPage('admin'); }} onClose={() => setShowAdminLogin(false)} />}
    </div>
  );
}
