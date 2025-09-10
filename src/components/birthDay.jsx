import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Heart , Images  } from "lucide-react";
import FloatingHearts from "./FloatingHearts";
import Countdown from "./jsx_BirthDay/Countdown";
import NavbarControls from "./jsx_BirthDay/NavbarControls";
import ReasonsGrid from "./jsx_BirthDay/ReasonsGrid";
import Carousel from "./jsx_BirthDay/Carousel";
import LoveLetter from "./jsx_BirthDay/LoveLetter";
import SiteFooter from "./jsx_BirthDay/SiteFooter";
import ImageGridPlaceholders from "./jsx_BirthDay/ImageGridPlaceholders";

export default function BirthdaySite({
  celebrant = "LookNut",    
  fromName = "Boss",           
  birthday: inputBirthday,
  images = [],
  heroImage,                
  songUrl = "",
  reasons = DEFAULT_REASONS,
  themePrimary = "#e11d48",
  reasonsImages = [],
  loveVideoUrl = "",
  loveVideoPoster = "",
}) {
  const birthday = useMemo(
    () => inputBirthday ?? new Date(new Date().getFullYear(), 10, 10),  
    [inputBirthday]
  );
  const { d, h, m, s, isPast } = useCountdown(birthday);

  const [confetti, setConfetti] = useState(false);
  const [confettiOnce, setConfettiOnce] = useState(false); 
  const [play, setPlay] = useState(false);
  const audioRef = useRef(null);

  // Play/pause background song
  useEffect(() => {
    if (!audioRef.current) return;
    if (play) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [play]);


  useEffect(() => {
    if (isPast && !confettiOnce) {
      setConfetti(true);
      setConfettiOnce(true);
      const t = setTimeout(() => setConfetti(false), 5000);
      return () => clearTimeout(t);
    }
  }, [isPast, confettiOnce]);

  const mainHero = heroImage || images[0] || null;  

  return (
    <div id="top" className="birthday-site" style={{ position: "relative" }}>
      <AnimatePresence>
        {confetti && <Confetti numberOfPieces={300} recycle={false} />}
      </AnimatePresence>

      <FloatingHearts count={18} />

      <NavbarControls
        play={play}
        setPlay={setPlay}
        onConfetti={() => setConfetti(true)}
        celebrant={celebrant}      
        fromName={fromName}
      />

      <main>
        <Hero
          celebrant={celebrant}
          isPast={isPast}
          d={d}
          h={h}
          m={m}
          s={s}
          heroImage={mainHero}    // +++ hero image hook-up
        />
        <Gallery images={images} />
        <ReasonsGrid reasons={reasons} reasonsImages={reasonsImages} />
        <LoveLetter celebrant={celebrant} loveVideoUrl={loveVideoUrl} loveVideoPoster={loveVideoPoster} />
      </main>

      <SiteFooter celebrant={celebrant} fromName={fromName} /> {/* +++ */}

      {songUrl && <audio ref={audioRef} src={songUrl} loop preload="none" />}

      {/* Accent color hook */}
      <style>{`:root{ --bd-theme:${themePrimary}; }`}</style>
    </div>
  );
}

// ===================== Components ===================== //

function Hero({ celebrant, isPast, d, h, m, s, heroImage }) {
  return (
    <header className="bd-container bd-py-hero">
      <div className="bd-grid-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bd-fade-up"
        >
          <h1 className="bd-title-xl">
            Happy Birthday,
            <span className="bd-title-accent"> {celebrant} ❤️</span>
          </h1>
          <p className="bd-lead">
            Every day with you is my favorite. Today we celebrate YOU — your kindness,
            your smile, and all our little moments.
          </p>
          <Countdown isPast={isPast} d={d} h={h} m={m} s={s} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
            <a href="#gallery" className="bd-btn bd-btn-ghost" style={{ textDecoration: "none" }}>
              <Images size={16} color="#e11d48" /> Memories
            </a>
            <a href="#letter" className="bd-btn bd-btn-primary" style={{ textDecoration: "none" }}>
              <Heart size={16} /> Open Love Letter
            </a>
            <a href="/jigsaw" className="bd-btn bd-btn-primary" style={{ textDecoration: "none" }}>
              <Heart size={16} /> Play Jigsaw
            </a>
          </div>
        </motion.div>

        {/* Hero: use provided heroImage if available; else show placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bd-hero-media">
            {heroImage ? (
              <img src={heroImage} alt="hero" />
            ) : (
              <div className="bd-image-placeholder" data-label="Hero Photo" data-ratio="16/9"></div>
            )}
            <div className="bd-hero-gradient" />
            <div className="bd-hero-caption">
              <div style={{ opacity: 0.9, fontSize: ".9rem" }}>To my favorite person</div>
              <div style={{ fontWeight: 700, fontSize: "1.25rem" }}>You make life sweeter</div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}



function Gallery({ images }) {
  return (
    <section id="gallery" className="bd-container" style={{ paddingBottom: "4rem" }}>
      <h2 className="bd-section-title">
        <Images size={22} color="#e11d48" /> Our Favorite Moments
      </h2>

      {images && images.length > 0 ? <Carousel images={images} /> : <ImageGridPlaceholders count={6} />}

      <div style={{ marginTop: 12, fontSize: 14, color: "#6b7280" }}>
        Tip: put your photos in <code>public/</code> and pass paths like <code>"/us1.jpg"</code> via the <code>images</code> prop.
      </div>
    </section>
  );
}

 
function useCountdown(targetDate) {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
      const t = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(t);
    }, []);
    const diff = targetDate - now;
    const clamped = Math.max(0, diff);
    const d = Math.floor(clamped / (1000 * 60 * 60 * 24));
    const h = Math.floor((clamped / (1000 * 60 * 60)) % 24);
    const m = Math.floor((clamped / (1000 * 60)) % 60);
    const s = Math.floor((clamped / 1000) % 60);
    return { d, h, m, s, isPast: diff <= 0 };
  }
  
  export const DEFAULT_REASONS = [
    { title: "Your smile", text: "It’s the sunshine that brightens every room." },
    { title: "Your kindness", text: "You make people feel seen and loved." },
    { title: "Your courage", text: "You chase dreams with a brave heart." },
    { title: "Your laugh", text: "Contagious and my favorite sound." },
    { title: "Your patience", text: "You always choose understanding." },
    { title: "Your honesty", text: "Real, gentle, and powerful." },
    { title: "Your passion", text: "You give your whole heart." },
    { title: "Your creativity", text: "You see magic in small things." },
    { title: "Your hugs", text: "Home. Always." },
    { title: "Your love", text: "It makes me better every day." },
  ];





