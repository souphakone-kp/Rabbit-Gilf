import { motion } from "framer-motion";
import { Link } from "react-router-dom";
 
import { Heart, Images } from "lucide-react";

import Countdown from "./jsx_BirthDay/Countdown";

export default function Hero({ celebrant, isPast, d, h, m, s, heroImage }) {
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
            Every day with you is my favorite. Today we celebrate YOU — your
            kindness, your smile, and all our little moments.
          </p>
          <Countdown isPast={isPast} d={d} h={h} m={m} s={s} />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 12,
            }}
          >
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" }); }}
              className="bd-btn bd-btn-ghost"
              style={{ textDecoration: "none" }}
              role="button"
            >
              <Images size={16} color="#e11d48" /> Memories
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); document.getElementById("letter")?.scrollIntoView({ behavior: "smooth" }); }}
              className="bd-btn bd-btn-primary"
              style={{ textDecoration: "none" }}
              role="button"
            >
              <Heart size={16} /> Open Love Letter
            </a>
            <Link
              to="/jigsaw"
              className="bd-btn bd-btn-primary"
              style={{ textDecoration: "none" }}
            >
              <Heart size={16} /> Play Jigsaw
            </Link>
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
              <div
                className="bd-image-placeholder"
                data-label="Hero Photo"
                data-ratio="16/9"
              ></div>
            )}
            <div className="bd-hero-gradient" />
            <div className="bd-hero-caption">
              <div style={{ opacity: 0.9, fontSize: ".9rem" }}>
                To my favorite person
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.25rem" }}>
                You make life sweeter
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
