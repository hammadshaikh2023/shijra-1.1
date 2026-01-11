import React, { useEffect, useRef } from 'react';

export const AuroraBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); 
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    setSize();
    window.addEventListener('resize', setSize);

    // Aurora Configuration
    const curtains = [
      {
        baseX: 0.2, 
        color: 'rgba(6, 95, 70, 0.4)', 
        speed: 0.001,
        amplitude: 100,
        frequency: 0.002,
        width: 300
      },
      {
        baseX: 0.5,
        color: 'rgba(30, 27, 75, 0.5)', 
        speed: 0.002,
        amplitude: 150,
        frequency: 0.001,
        width: 400
      },
      {
        baseX: 0.8,
        color: 'rgba(15, 23, 42, 0.6)', 
        speed: 0.001,
        amplitude: 80,
        frequency: 0.003,
        width: 250
      },
      {
        baseX: 0.35,
        color: 'rgba(6, 78, 59, 0.3)', 
        speed: 0.003,
        amplitude: 120,
        frequency: 0.002,
        width: 350
      }
    ];

    let time = 0;
    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;

      // Solid Deep Navy Background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'source-over';

      curtains.forEach((curtain, i) => {
        ctx.beginPath();
        
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.3, curtain.color);
        gradient.addColorStop(0.7, curtain.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        
        let x = width * curtain.baseX;
        
        ctx.moveTo(x + Math.sin(0 * curtain.frequency + time * curtain.speed) * curtain.amplitude, 0);

        for (let y = 0; y <= height; y += 60) { 
          const wave = Math.sin(y * curtain.frequency + time * curtain.speed + i) * curtain.amplitude;
          const sway = Math.cos(time * 0.5 + y * 0.001) * 50;
          ctx.lineTo(x + wave + sway + curtain.width, y);
        }

        ctx.lineTo(x + Math.sin(height * curtain.frequency + time * curtain.speed) * curtain.amplitude, height);

        for (let y = height; y >= 0; y -= 60) {
          const wave = Math.sin(y * curtain.frequency + time * curtain.speed + i) * curtain.amplitude;
          const sway = Math.cos(time * 0.5 + y * 0.001) * 50;
          ctx.lineTo(x + wave + sway, y);
        }

        ctx.closePath();
        ctx.fill();
      });

      // Slowed down time increment from 1 to 0.5
      time += 0.5;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 blur-[60px] opacity-60"
    />
  );
};