import React, { useState, useEffect } from 'react';
import { Button } from './components/Button';
import { Particles } from './components/Particles'; 
import { ConstellationTreeViewer } from './components/ConstellationTreeViewer'; 
import { StaticRootTree } from './components/StaticRootTree'; 
import { TimelineView } from './components/TimelineView'; 
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { SubscriptionSection } from './components/SubscriptionSection'; 
import { SignupPage } from './components/SignupPage';
import { SEO } from './components/SEO'; 
import { Logo } from './components/Logo'; 
import { LoginModal } from './components/LoginModal';
import { PhotoAnimator } from './components/PhotoAnimator';
import { HintsNotification } from './components/HintsNotification';
import { 
  Mic, Share2, Star, Clock, LogOut, User, ShieldCheck, Sparkles, Layout
} from 'lucide-react';
import { FamilyMember } from './types';

const INITIAL_FAMILY_DATA: FamilyMember = {
  id: "1",
  name: "Patriarch Ahmed",
  img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop",
  children: [
    {
      id: "2",
      name: "Grandfather Ahmed",
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&h=150&auto=format&fit=crop",
      children: [
         {
           id: "3",
           name: "Karim Khan",
           img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop"
         }
      ] 
    }
  ]
};

type AppView = 'HOME' | 'FEATURES' | 'PRICING' | 'DASHBOARD' | 'SIGNUP';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showStaticTree, setShowStaticTree] = useState(false); 
  const [showTimeline, setShowTimeline] = useState(false);
  const [showAnimator, setShowAnimator] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('shijra_logged_in');
    if (authStatus === 'true') {
      setIsLoggedIn(true);
      setCurrentView('DASHBOARD');
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('DASHBOARD');
    localStorage.setItem('shijra_logged_in', 'true');
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('HOME');
    localStorage.removeItem('shijra_logged_in');
  };

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans text-slate-200 bg-navy-950 selection:bg-gold-500/30">
      <SEO title={isLoggedIn ? "Archive | Shijra Sanctuary" : "Shijra | Digital Family Sanctuary"} />
      <Particles />

      {/* Modern Navigation */}
      <nav className="fixed w-full z-50 top-0 bg-navy-950/40 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <button onClick={() => navigateTo('HOME')} className="hover:opacity-80 transition-opacity">
            <Logo withText={true} className="w-8 h-8" />
          </button>

          <div className="hidden md:flex items-center gap-10">
            {!isLoggedIn ? (
              <>
                <button onClick={() => navigateTo('FEATURES')} className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">Features</button>
                <button onClick={() => navigateTo('PRICING')} className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">Pricing</button>
                <div className="h-4 w-px bg-white/10" />
                <Button variant="ghost" onClick={() => setShowLoginModal(true)} className="!py-2 !px-5 text-[10px] uppercase font-bold">Login</Button>
                <Button variant="secondary" onClick={() => navigateTo('SIGNUP')} className="!py-2 !px-6 text-[10px] uppercase font-black shadow-lg shadow-gold-500/20">Initialize Sanctuary</Button>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <HintsNotification treeId="ahmed-archive" />
                <button onClick={() => navigateTo('DASHBOARD')} className={`text-[10px] font-bold uppercase tracking-widest ${currentView === 'DASHBOARD' ? 'text-gold-400' : 'text-slate-500 hover:text-white'}`}>Vault Home</button>
                <button onClick={() => setShowTimeline(true)} className="text-slate-500 hover:text-emerald-400 transition-colors"><Clock size={18} /></button>
                <div className="h-6 w-px bg-white/10 mx-2" />
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors"><LogOut size={18} /></button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20">
        {currentView === 'HOME' && (
          <div className="animate-fade-in">
            <HeroSection 
              onStartRecord={() => navigateTo('SIGNUP')} 
              onViewDemo={() => setShowDemo(true)} 
            />
            <FeaturesSection />
          </div>
        )}

        {currentView === 'FEATURES' && <FeaturesSection />}
        {currentView === 'PRICING' && <SubscriptionSection />}
        {currentView === 'SIGNUP' && <SignupPage onLogin={handleLogin} />}

        {currentView === 'DASHBOARD' && isLoggedIn && (
          <div className="max-w-7xl mx-auto px-8 py-16 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
               <div>
                 <div className="flex items-center gap-2 text-gold-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                   <Sparkles size={12} /> Archival Session Active
                 </div>
                 <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-none italic">Ahmed <span className="text-slate-600 not-italic font-light">Archive</span></h1>
               </div>
               <div className="flex gap-4">
                 <Button variant="outline" onClick={() => setShowStaticTree(true)} className="!py-4 !px-8 !text-[10px] font-bold uppercase tracking-widest bg-navy-900/50">Topology Map</Button>
                 <Button variant="secondary" onClick={() => setShowAnimator(true)} className="!py-4 !px-8 !text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gold-500/20">Animate Portrait</Button>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
               {[
                 { label: "Archived Kin", value: "142", icon: User, color: "text-blue-400" },
                 { label: "Oral Records", value: "28", icon: Mic, color: "text-emerald-400" },
                 { label: "Integrity Score", value: "98%", icon: Star, color: "text-gold-400" },
                 { label: "Vault Security", value: "Locked", icon: ShieldCheck, color: "text-cyan-400" }
               ].map((s, i) => (
                 <div key={i} className="dreamy-glass p-10 rounded-[3rem] group hover:bg-white/5 transition-all duration-700">
                    <div className={`${s.color} mb-8 opacity-40 group-hover:opacity-100 transition-opacity`}><s.icon size={28} /></div>
                    <div className="text-5xl font-bold text-white mb-2 tracking-tighter">{s.value}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{s.label}</div>
                 </div>
               ))}
            </div>

            <div className="dreamy-glass rounded-[4rem] aspect-video relative overflow-hidden shadow-2xl group border-white/10">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e293b_0%,_transparent_70%)] opacity-20" />
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/5 flex items-center justify-center mb-10 ring-1 ring-emerald-500/10 group-hover:scale-110 transition-transform duration-[2s]">
                     <Share2 className="text-emerald-400" size={42} />
                  </div>
                  <h2 className="text-4xl font-serif text-white font-bold mb-6 italic">Interactive Constellation</h2>
                  <p className="text-slate-400 max-w-md mb-12 text-base leading-relaxed font-light">Explore your family's cosmic history through our neural-link visualization engine.</p>
                  <Button variant="primary" onClick={() => setShowDemo(true)} className="!px-16 !py-6 shadow-2xl shadow-emerald-900/40 text-[11px] font-black uppercase tracking-[0.4em]">Launch Simulation</Button>
               </div>
               <div className="absolute bottom-10 left-10 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">React 19 Pure Browser Runtime</span>
               </div>
            </div>
          </div>
        )}
      </main>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />}
      {showDemo && <ConstellationTreeViewer onClose={() => setShowDemo(false)} />}
      {showTimeline && <TimelineView onClose={() => setShowTimeline(false)} />}
      {showAnimator && <PhotoAnimator onClose={() => setShowAnimator(false)} isPremium={true} onUpgrade={() => navigateTo('PRICING')} />}
      {showStaticTree && <StaticRootTree data={INITIAL_FAMILY_DATA} onClose={() => setShowStaticTree(false)} />}

      <footer className="bg-navy-950/80 backdrop-blur-3xl border-t border-white/5 py-24 mt-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="flex flex-col items-start">
            <Logo withText={true} vertical={true} className="w-24 h-24 mb-10" />
            <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest leading-loose text-center md:text-left">The digital sanctuary for ancestral permanence.</p>
          </div>
          <div>
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em] mb-8">Capabilities</h4>
            <ul className="space-y-4 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <li><button onClick={() => navigateTo('FEATURES')} className="hover:text-gold-400 transition-colors">Abilities</button></li>
              <li><button onClick={() => navigateTo('PRICING')} className="hover:text-gold-400 transition-colors">Vault Plans</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em] mb-8">Sanctuary</h4>
            <ul className="space-y-4 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <li><button className="hover:text-gold-400 transition-colors">Security Citadel</button></li>
              <li><button className="hover:text-gold-400 transition-colors">Ethics Charter</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em] mb-8">Sovereignty</h4>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-6">Shijra Sanctuary © {new Date().getFullYear()}</p>
            <div className="flex gap-4 opacity-50">
               <ShieldCheck size={20} className="text-emerald-500" />
               <Layout size={20} className="text-gold-500" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}