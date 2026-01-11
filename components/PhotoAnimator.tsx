import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Wand2, Play, Download, Lock, Crown, ScanFace, Sparkles, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface PhotoAnimatorProps {
  onClose: () => void;
  isPremium: boolean; // True if 'Archivist' tier
  onUpgrade: () => void;
}

export const PhotoAnimator: React.FC<PhotoAnimatorProps> = ({ onClose, isPremium, onUpgrade }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processingState, setProcessingState] = useState<'IDLE' | 'SCANNING' | 'GENERATING' | 'COMPLETE'>('IDLE');
  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);
  
  // Animation Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResultVideoUrl(null);
      setProcessingState('IDLE');
    }
  };

  // API Interaction
  const startAnimation = async () => {
    if (!isPremium) return;
    if (!file) return;

    setProcessingState('SCANNING');

    try {
      const formData = new FormData();
      formData.append('photo', file);

      // Simulate Scanning Phase for visual effect (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessingState('GENERATING');

      // Call Backend
      // Note: In a real environment, replace with: await fetch('/api/photo/animate', ...);
      // We are simulating the network call delay here as the backend code is provided but not running in this browser env.
      
      const response = await new Promise<{success: boolean, data: { videoUrl: string }}>((resolve) => {
         setTimeout(() => {
            resolve({
                success: true,
                data: { videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-smiling-woman-close-up-12165-large.mp4" } // Mock Video
            });
         }, 3000);
      });

      if (response.success) {
        setResultVideoUrl(response.data.videoUrl);
        setProcessingState('COMPLETE');
      } else {
        alert("Animation failed. Please try again.");
        setProcessingState('IDLE');
      }

    } catch (error) {
      console.error(error);
      setProcessingState('IDLE');
    }
  };

  // Luminous Face Mesh Animation Logic
  useEffect(() => {
    if (processingState !== 'SCANNING' && processingState !== 'GENERATING') return;

    const canvas = canvasRef.current;
    if (!canvas || !previewUrl) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let particles: {x: number, y: number, vx: number, vy: number}[] = [];
    
    // Setup Canvas Dimensions
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
       canvas.width = rect.width;
       canvas.height = rect.height;
    }

    // Initialize Particles (Face landmarks simulation)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for(let i=0; i<30; i++) {
       particles.push({
          x: centerX + (Math.random() - 0.5) * 150,
          y: centerY + (Math.random() - 0.5) * 200,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
       });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Connections (Luminous Web)
      ctx.lineWidth = 1;
      
      particles.forEach((p, i) => {
          // Move
          p.x += p.vx;
          p.y += p.vy;

          // Bounce
          if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if(p.y < 0 || p.y > canvas.height) p.vy *= -1;

          // Draw Nodes
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#fbbf24'; // Gold
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#fbbf24';
          ctx.fill();

          // Connect nearby nodes
          particles.forEach((p2, j) => {
             if (i === j) return;
             const dx = p.x - p2.x;
             const dy = p.y - p2.y;
             const dist = Math.sqrt(dx*dx + dy*dy);

             if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(34, 211, 238, ${1 - dist/100})`; // Cyan fading
                ctx.stroke();
             }
          });
      });
      
      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrame);
  }, [processingState, previewUrl]);

  return (
    <div className="fixed inset-0 z-[80] bg-navy-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in-up">
      
      {/* Container */}
      <div className="relative w-full max-w-5xl bg-navy-900 border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(251,191,36,0.15)] overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[650px]">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors border border-white/5">
          <X size={20} />
        </button>

        {/* LEFT SIDE: VISUALIZER */}
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden group">
          
          {/* Background Grid Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

          {previewUrl ? (
            <div className="relative w-full h-full flex items-center justify-center p-8">
              
              {/* Media Container */}
              <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-navy-950">
                
                {/* Result Video or Input Image */}
                {processingState === 'COMPLETE' && resultVideoUrl ? (
                   <video 
                     src={resultVideoUrl} 
                     autoPlay 
                     loop 
                     controls 
                     className="w-full h-full object-cover animate-[fadeIn_1s_ease-out]" 
                   />
                ) : (
                   <img 
                     src={previewUrl} 
                     alt="Original" 
                     className={`w-full h-full object-cover transition-all duration-1000 ${processingState !== 'IDLE' ? 'opacity-40 grayscale blur-sm' : ''}`} 
                   />
                )}

                {/* ANIMATION: LUMINOUS MESH OVERLAY */}
                {(processingState === 'SCANNING' || processingState === 'GENERATING') && (
                  <canvas ref={canvasRef} className="absolute inset-0 z-20 w-full h-full pointer-events-none" />
                )}

                {/* LOADING TEXT OVERLAY */}
                {processingState === 'SCANNING' && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
                    <ScanFace size={48} className="text-cyan-400 animate-pulse drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                    <p className="mt-4 text-cyan-200 font-mono text-sm tracking-widest uppercase animate-pulse">Scanning Features...</p>
                  </div>
                )}
                
                {processingState === 'GENERATING' && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
                    <div className="relative">
                       <div className="absolute inset-0 bg-gold-400 rounded-full blur-xl opacity-20 animate-ping" />
                       <Sparkles size={48} className="text-gold-400 animate-spin-slow relative z-10" />
                    </div>
                    <p className="mt-4 text-gold-200 font-serif text-lg tracking-wide animate-pulse text-center">
                      Weaving Time & Memory...
                    </p>
                  </div>
                )}

                {/* SUCCESS BADGE */}
                {processingState === 'COMPLETE' && (
                   <div className="absolute top-4 left-4 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                     <CheckCircle2 size={14} /> Restoration Complete
                   </div>
                )}

              </div>
            </div>
          ) : (
            <div className="text-center p-10 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 mx-8 hover:bg-white/10 transition-colors">
               <div className="w-20 h-20 rounded-full bg-navy-800 flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                 <Upload className="text-slate-400" size={32} />
               </div>
               <p className="text-slate-200 font-serif text-xl mb-2">Upload Portrait</p>
               <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Select a clear frontal photo of your ancestor. Supported formats: JPG, PNG.</p>
               <div className="relative">
                 <Button variant="outline" className="text-sm px-8">Browse Files</Button>
                 <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
               </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: CONTROLS */}
        <div className="w-full md:w-[400px] bg-navy-950 p-8 flex flex-col border-l border-white/10 relative z-10">
          
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
               <div className="p-2 bg-gold-500/10 rounded-lg">
                 <Wand2 className="text-gold-400" size={24} />
               </div>
               <h2 className="text-3xl font-serif font-bold text-white">Deep Nostalgia™</h2>
            </div>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Our advanced AI reconstructs facial geometry to simulate realistic movement. Witness your ancestors smile, blink, and look around as if they were here today.
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-4">
             
             {/* IDLE STATE */}
             {processingState === 'IDLE' && (
                <div className="relative space-y-4">
                  {!isPremium && (
                    <div className="bg-navy-900/90 border border-gold-500/20 p-5 rounded-2xl text-center shadow-lg relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />
                      <Lock className="text-gold-500 mb-2 mx-auto" size={24} />
                      <h4 className="text-gold-200 font-bold mb-1">Eternal Legacy Exclusive</h4>
                      <p className="text-xs text-slate-400 mb-4">Upgrade your plan to unlock AI Photo Animation.</p>
                      <Button onClick={onUpgrade} variant="secondary" className="!py-2.5 !text-xs !bg-gradient-to-r !from-gold-400 !to-gold-600 !border-none !text-navy-950 shadow-lg shadow-gold-500/20">
                        <Crown size={14} className="mr-1.5" fill="currentColor" /> Upgrade to Access
                      </Button>
                    </div>
                  )}

                  <div className={!isPremium ? 'opacity-40 pointer-events-none blur-[1px]' : ''}>
                    <Button 
                        fullWidth 
                        disabled={!file} 
                        onClick={startAnimation}
                        variant="primary" 
                        className="!py-4 text-lg shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                    >
                        <Wand2 className="mr-2" /> Bring to Life
                    </Button>
                    <p className="text-center text-[10px] text-slate-500 mt-3">Estimated processing time: 10-15 seconds</p>
                  </div>
                </div>
             )}

             {/* PROCESSING STATE */}
             {(processingState === 'SCANNING' || processingState === 'GENERATING') && (
               <div className="text-center py-8">
                 <div className="inline-block relative mb-4">
                    <div className="w-16 h-16 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gold-400">AI</div>
                 </div>
                 <h4 className="text-white font-medium animate-pulse">
                    {processingState === 'SCANNING' ? 'Analyzing Facial Structure' : 'Synthesizing Motion'}
                 </h4>
                 <p className="text-xs text-slate-500 mt-2">Please do not close this window.</p>
               </div>
             )}

             {/* COMPLETE STATE */}
             {processingState === 'COMPLETE' && (
               <div className="space-y-3 animate-[fadeInUp_0.4s_ease-out]">
                 <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center mb-2">
                    <p className="text-emerald-400 text-sm font-medium">✨ Animation Successful</p>
                 </div>
                 
                 <a href={resultVideoUrl || '#'} download="ancestor_animated.mp4" className="block">
                    <Button fullWidth variant="secondary" className="!py-3 bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-lg shadow-gold-500/20">
                    <Download size={18} className="mr-2" /> Download Video
                    </Button>
                 </a>
                 
                 <Button fullWidth variant="outline" onClick={() => { setFile(null); setPreviewUrl(null); setResultVideoUrl(null); setProcessingState('IDLE'); }}>
                   <RefreshCcw size={16} className="mr-2" /> Animate Another Photo
                 </Button>
               </div>
             )}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
             <div className="flex items-center gap-3 opacity-70">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px] shadow-lg">AI</div>
               <div className="text-[10px] text-slate-500 leading-tight">
                 <p className="text-slate-300 font-medium">Secure & Private</p>
                 <p>Photos are processed ephemerally and not stored permanently.</p>
               </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};
