import React, { useEffect, useRef } from 'react';

export const Particles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { x: number; y: number; r: number; dx: number; dy: number; opacity: number; pulseSpeed: number }[] = [];
    // Increased particle count from 50 to 80 to fill the void of the removed aurora
    const particleCount = 80; 

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5, 
        // Keep movement very slow (calm starry night)
        dx: (Math.random() - 0.5) * 0.05, 
        dy: (Math.random() - 0.5) * 0.05, 
        opacity: Math.random(),
        // Keep pulsing slow so it doesn't look like lightning
        pulseSpeed: 0.002 + Math.random() * 0.003
      });
    }

    let animationFrameId: number;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p) => {
        p.opacity += p.pulseSpeed;
        // Smoothly reverse opacity when hitting limits
        if (p.opacity >= 1 || p.opacity <= 0.1) p.pulseSpeed = -p.pulseSpeed;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(p.opacity)})`; 
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        // Wrap around screen
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};