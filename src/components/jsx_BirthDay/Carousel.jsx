import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Carousel({ images = [] }) {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    if (!images.length) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div className="bd-carousel">
      <div className="bd-carousel-viewport">
        <AnimatePresence initial={false}>
          <motion.img
            key={index}
            src={images[index]}
            alt="memory"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",  
              backgroundColor: "#f8fafc", 
            }}
          />
        </AnimatePresence>
      </div>
      <div className="bd-carousel-ctrl">
        <button onClick={prev} aria-label="Previous">
          ◀
        </button>
        <button onClick={next} aria-label="Next">
          ▶
        </button>
      </div>
      <div className="bd-carousel-dots">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`bd-dot ${i === index ? "is-active" : ""}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
