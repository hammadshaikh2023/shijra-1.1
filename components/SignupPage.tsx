
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Globe, Users, ShieldCheck, 
  ArrowRight, Sparkles, Fingerprint, Crown, Star, 
  ChevronDown, MapPin, Building, Info, Phone, Calendar, Home, Map, RefreshCw
} from 'lucide-react';
import { Button } from './Button';

interface SignupPageProps {
  onLogin: () => void;
}

const REGIONS = [
  'Punjab, Pakistan', 'Punjab, India', 'Sindh', 'Khyber Pakhtunkhwa', 
  'Balochistan', 'Kashmir', 'Middle East Diaspora', 'Western Diaspora', 'Other'
];

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

const ROLES = [
  { id: 'keeper', label: 'Primary Keeper', desc: 'Main administrator' },
  { id: 'contributor', label: 'Contributor', desc: 'Add records' },
  { id: 'observer', label: 'Elder', desc: 'Read-only access' }
];

const TIERS = [
  { id: 'stardust', name: 'Stardust', price: '$0', icon: <Star size={14} />, color: 'text-slate-400' },
  { id: 'constellation', name: 'Constellation', price: '$9.99', icon: <Sparkles size={14} />, color: 'text-emerald-400' },
  { id: 'legacy', name: 'Eternal Legacy', price: '$19.99', icon: <Crown size={14} />, color: 'text-gold-400' }
];

export const SignupPage: React.FC<SignupPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    gender: 'Male',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: 'Pakistan',
    familyArchiveName: '',
    region: 'Punjab, Pakistan',
    role: 'keeper',
    tier: 'constellation'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-32 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold-900/5 rounded-full blur-[160px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase mb-10">
              <Fingerprint size={14} /> Start Your Eternal Archive
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-serif font-bold text-white mb-6 italic tracking-tight underline decoration-gold-500/20">Initialize Your Sanctuary</h1>
          </div>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-navy-900/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-12 shadow-2xl">
                <h3 className="text-2xl font-serif font-bold text-white mb-10 flex items-center gap-3">
                  <User className="text-emerald-400" size={24} /> Archival Identity
                </h3>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                      <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-navy-950 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-emerald-500/50" placeholder="Ahmed Karim Khan" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Vault Email</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-navy-950 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-emerald-500/50" placeholder="email@legacy.com" />
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Archive Key</label>
                      <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-navy-950 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-emerald-500/50" placeholder="••••••••" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact No.</label>
                      <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-navy-950 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-emerald-500/50" placeholder="+92 300 1234567" />
                   </div>
                </div>

                <h3 className="text-2xl font-serif font-bold text-white mb-10 mt-16 flex items-center gap-3 border-t border-white/5 pt-10">
                  <MapPin className="text-emerald-400" size={24} /> Physical Anchor
                </h3>
                <div className="space-y-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Street Address</label>
                      <input type="text" value={formData.streetAddress} onChange={(e) => setFormData({...formData, streetAddress: e.target.value})} className="w-full bg-navy-950 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-emerald-500/50" placeholder="123 Legacy St, Lahore" />
                   </div>
                   <div className="grid md:grid-cols-3 gap-6">
                      <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-navy-950 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-emerald-500/50" />
                      <input type="text" placeholder="Zip" value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} className="w-full bg-navy-950 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-emerald-500/50" />
                      <input type="text" placeholder="Country" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full bg-navy-950 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-emerald-500/50" />
                   </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-8">
               <div className="bg-navy-900/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-12 shadow-2xl flex-1">
                  <h3 className="text-2xl font-serif font-bold text-white mb-10">Archive Capacity</h3>
                  <div className="space-y-4">
                    {TIERS.map(tier => (
                      <button key={tier.id} type="button" onClick={() => setFormData({...formData, tier: tier.id})} className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all ${formData.tier === tier.id ? 'bg-white/5 border-gold-500/50 ring-1 ring-gold-500/20' : 'bg-navy-950/30 border-white/5 hover:border-white/10'}`}>
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl bg-navy-950 ${formData.tier === tier.id ? tier.color : 'text-slate-600'}`}>{tier.icon}</div>
                            <div className="text-left">
                               <div className={`text-sm font-bold ${formData.tier === tier.id ? 'text-white' : 'text-slate-400'}`}>{tier.name}</div>
                            </div>
                         </div>
                         <div className="text-lg font-bold text-white">{tier.price}</div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-12 pt-10 border-t border-white/5">
                     <Button fullWidth variant="secondary" type="submit" disabled={isSubmitting} className="!py-6 !text-base !bg-gold-500 !text-navy-950 !font-black !rounded-2xl uppercase tracking-[0.3em]">
                       {isSubmitting ? <RefreshCw className="animate-spin" /> : "Initialize Sanctuary"}
                     </Button>
                  </div>
               </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
