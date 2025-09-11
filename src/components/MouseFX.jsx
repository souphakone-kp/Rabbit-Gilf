import { useEffect, useRef } from "react";

export default function MouseFX() {
  const glowRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const handleMove = (e) => {
      const { clientX, clientY } = e;
      glow.style.setProperty("--mx", `${clientX}px`);
      glow.style.setProperty("--my", `${clientY}px`);
    };

    const handleLeave = () => {
      glow.style.setProperty("--mx", `-9999px`);
      glow.style.setProperty("--my", `-9999px`);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    ctx.scale(DPR, DPR);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);
    };
    window.addEventListener("resize", resize);

    const particles = [];
    const maxParticles = 60; // reduced for subtlety and performance

    const colors = [
      "rgba(225,29,72,",
      "rgba(244,63,94,",
      "rgba(251,113,133,",
      "rgba(248,113,113,",
    ];

    function spawn(x, y) {
      const amount = 1 + Math.floor(Math.random() * 2); // fewer particles per spawn
      for (let i = 0; i < amount; i++) {
        if (particles.length > maxParticles) particles.shift();
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.25 + Math.random() * 0.45; // slower
        const life = 500 + Math.random() * 600; // shorter
        const size = 1.25 + Math.random() * 2.25; // smaller
        const hue = colors[Math.floor(Math.random() * colors.length)];
        const sparkle = Math.random() < 0.15; // fewer sparkles
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          size,
          color: hue,
          sparkle,
          rotate: Math.random() * Math.PI,
          gravity: 0.012 + Math.random() * 0.01, // lighter
        });
      }
    }

    let lastTime = 0;

    const onMove = (e) => {
      spawn(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    function drawHeart(cx, cy, r, rot) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let t = 0; t < Math.PI; t += 0.2) {
        const x = r * 16 * Math.pow(Math.sin(t), 3) * 0.06;
        const y = -r * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.06;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    const animate = (ts) => {
      const dt = Math.min(32, ts - lastTime);
      lastTime = ts;

      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;

        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = Math.pow(alpha, 0.8);

        if (!p.sparkle) {
          ctx.fillStyle = `${p.color}${0.35})`; // lower opacity
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
          grd.addColorStop(0, `${p.color}0.15)`); // softer glow
          grd.addColorStop(1, `rgba(255,255,255,0)`);
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `${p.color}0.6)`; // dim sparkle
          drawHeart(p.x, p.y, p.size * 1.8, p.rotate); // smaller heart
        }
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="bd-mouse-glow" aria-hidden="true" />
      <canvas ref={canvasRef} className="bd-mouse-sparkle" aria-hidden="true" />
    </>
  );
} 