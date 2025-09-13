import { motion } from "framer-motion";
import { Gift } from "lucide-react";

export default function ReasonsGrid({ reasons = [], reasonsImages = [] }) {
  const list = reasons.length ? reasons : DEFAULT_REASONS;
  return (
    <section  id="10reason" className="bd-container" style={{ paddingBottom: "4rem" }}>
      <h2 className="bd-section-title">
        <Gift size={22} color="#e11d48" /> 10 Reasons I Love You
      </h2>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
        }}
      >
        {list.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            className="bd-card"
            style={{ padding: "1rem" }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              {reasonsImages[i] && (
                <img
                  src={reasonsImages[i]}
                  alt={`reason ${i + 1}`}
                  width={56}
                  height={56}
                  style={{
                    width: 56,
                    height: 56,
                    objectFit: "cover",
                    borderRadius: 8,
                    flex: "0 0 auto",
                  }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
              <div>
                <div style={{ color: "#9f1239", fontWeight: 600 }}>
                  {r.title}
                </div>
                <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
                  {r.text}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
