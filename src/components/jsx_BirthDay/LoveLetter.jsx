import { motion } from "framer-motion";

import { Heart } from "lucide-react";

export default function LoveLetter({
  celebrant,
  loveVideoUrl,
  loveVideoPoster,
}) {
  return (
    <section
      id="letter"
      className="bd-container"
      style={{ paddingBottom: "4rem" }}
    >
      <div className="bd-card" style={{ padding: "1.25rem" }}>
        <h2 className="bd-section-title">
          <Heart size={22} color="#e11d48" /> My Love Letter to You
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.75 }}>
          To {celebrant},<br />
          Thank you for being my safe place and my greatest adventure. You light
          up my world with your laughter, your patience, and your heart.
        </p>
        <p style={{ marginTop: 12, color: "#374151" }}>
          Happiest Birthday, my love. 🎂💫
        </p>

        {loveVideoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            style={{ marginTop: 16 }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
                border: "1px solid #fee2e2",
              }}
            >
              <div style={{ position: "relative", paddingTop: "56.25%" }}>
                <video
                  src={loveVideoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
