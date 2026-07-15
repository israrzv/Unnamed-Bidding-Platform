"use client";

import { useEffect, useRef } from "react";

/**
 * App-wide interactive background: a slow drifting field of particles linked by
 * thin lines. The cursor pushes nearby particles away and brightens the links
 * around it. Rendered fixed behind all content.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const mouse = { x: null as number | null, y: null as number | null, radius: 160 };

    class Particle {
      x: number;
      y: number;
      dx: number;
      dy: number;
      size: number;
      constructor(x: number, y: number, dx: number, dy: number, size: number) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
      }
      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx!.fillStyle = "rgba(52, 211, 153, 0.6)";
        ctx!.fill();
      }
      update() {
        if (this.x > canvas!.width || this.x < 0) this.dx = -this.dx;
        if (this.y > canvas!.height || this.y < 0) this.dy = -this.dy;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius + this.size) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 4;
            this.y -= (dy / dist) * force * 4;
          }
        }

        this.x += this.dx;
        this.y += this.dy;
        this.draw();
      }
    }

    let particles: Particle[] = [];

    function init() {
      particles = [];
      const count = Math.min(150, (canvas!.width * canvas!.height) / 12000);
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (canvas!.width - size * 4) + size * 2;
        const y = Math.random() * (canvas!.height - size * 4) + size * 2;
        const dx = Math.random() * 0.4 - 0.2;
        const dy = Math.random() * 0.4 - 0.2;
        particles.push(new Particle(x, y, dx, dy, size));
      }
    }

    function connect() {
      const maxDistSq = (canvas!.width / 7) * (canvas!.height / 7);
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dxp = particles[a].x - particles[b].x;
          const dyp = particles[a].y - particles[b].y;
          const distSq = dxp * dxp + dyp * dyp;
          if (distSq < maxDistSq) {
            const opacity = 1 - distSq / 20000;
            if (opacity <= 0) continue;

            let nearMouse = false;
            if (mouse.x !== null && mouse.y !== null) {
              const mdx = particles[a].x - mouse.x;
              const mdy = particles[a].y - mouse.y;
              nearMouse = Math.sqrt(mdx * mdx + mdy * mdy) < mouse.radius;
            }
            ctx!.strokeStyle = nearMouse
              ? `rgba(224, 242, 254, ${opacity})`
              : `rgba(45, 212, 191, ${opacity * 0.5})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }
      }
    }

    function animate() {
      raf = requestAnimationFrame(animate);
      ctx!.fillStyle = "#09090b"; // zinc-950 to match the app
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      for (const p of particles) p.update();
      connect();
    }

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      init();
    }

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
