import React, { useEffect, useRef } from 'react';

export default function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Node count based on screen size
    const nodeCount = Math.min(65, Math.floor((width * height) / 25000));
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseX: number;
      baseY: number;
    }[] = [];

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      nodes.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        baseX: x,
        baseY: y,
      });
    }

    // Handle Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Dampened mouse parallax
      const mouse = mouseRef.current;
      if (mouse.targetX !== -1000) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      // Draw subtle ambient glow near mouse if active
      if (mouse.x !== -1000) {
        const glowGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          180
        );
        glowGrad.addColorStop(0, 'rgba(139, 92, 246, 0.035)');
        glowGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move nodes
        node.x += node.vx;
        node.y += node.vy;

        // Bounce on borders
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Keep inside bounds
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));

        // Interaction with mouse
        if (mouse.x !== -1000) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            // Push nodes away slightly
            const force = (180 - dist) / 180;
            node.x += (dx / dist) * force * 1.2;
            node.y += (dy / dist) * force * 1.2;
          }
        }

        // Draw node points
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${0.12 + Math.sin(Date.now() / 1000 + i) * 0.06})`;
        ctx.fill();
      }

      // Draw connecting mesh lines
      ctx.lineWidth = 0.65;
      const connectionDist = 130;

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.11;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);

            // Subtle color gradient or matching purple accent
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div id="cinematic-bg-container" className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#07070A]">
      {/* Interactive Node Mesh */}
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* Soft Noise Texture Overlay */}
      <div id="noise-pattern-layer" className="absolute inset-0 noise-overlay opacity-80 mix-blend-overlay pointer-events-none" />

      {/* Master Aurora Lighting & Glows */}
      <div 
        id="aurora-top-center" 
        className="absolute top-[-20%] left-[25%] w-[50vw] h-[50vw] rounded-full bg-[#8B5CF6]/7 blur-[140px] mix-blend-screen pointer-events-none" 
      />
      <div 
        id="aurora-bottom-right" 
        className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#A855F7]/5 blur-[120px] mix-blend-screen pointer-events-none" 
      />
      <div 
        id="aurora-sidebar-left" 
        className="absolute top-[20%] left-[-15%] w-[35vw] h-[35vw] rounded-full bg-[#8B5CF6]/6 blur-[100px] mix-blend-screen pointer-events-none" 
      />
    </div>
  );
}
