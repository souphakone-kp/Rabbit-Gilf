import { useMemo } from "react";
import { motion } from "framer-motion";

export default function FloatingHearts({ count = 14, style = {} }) {
  const hearts = useMemo(() => (
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 10 + Math.random() * 10,
      delay: Math.random() * 4,
      duration: 8 + Math.random() * 8,
      opacity: 0.2 + Math.random() * 0.35,
      hue: [350, 345, 355, 0, 5][i % 5],
    }))
  ), [count]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0, ...style }}>
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: ["110%", "-10%"], opacity: [0, h.opacity, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", left: `${h.left}%` }}
        >
          <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill={`hsl(${h.hue} 80% 60%)`} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.08))" }}>
            <path d="M12 21s-6.716-4.37-9.2-8.114C1.21 10.29 2.1 7.6 4.5 6.5c1.88-.9 3.97-.2 5.1 1.2C10.73 6.3 12.82 5.6 14.7 6.5c2.4 1.1 3.29 3.79 1.7 6.386C18.716 16.63 12 21 12 21z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
