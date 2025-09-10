import { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";

export default function Countdown({ isPast, d, h, m, s }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const start = useMemo(() => new Date(2023, 10, 10, 0, 0, 0), []); // Nov 10, 2023
  const elapsedMs = Math.max(0, now - start);
  const days = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((elapsedMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((elapsedMs / (1000 * 60)) % 60);
  const seconds = Math.floor((elapsedMs / 1000) % 60);

  return (
    <div className="bd-card" style={{ padding: "1rem", marginTop: "1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#be123c",
          marginBottom: 12,
        }}
      >
        <Calendar size={18} />
        <span style={{ fontWeight: 600 }}>Be Happy Anniversary</span>
      </div>
      <div style={{ fontSize: "0.95rem", color: "#374151", marginBottom: 12 }}>
        We've been in love for
      </div>
      <div className="bd-countdown">
        {[
          { label: "Days", value: days },
          { label: "Hours", value: hours },
          { label: "Minutes", value: minutes },
          { label: "Seconds", value: seconds },
        ].map((t) => (
          <div key={t.label} className="bd-count-tile">
            <div className="bd-count-num">{t.value}</div>
            <div className="bd-count-label">{t.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
        since 11/10/2023
      </div>
    </div>
  );
}
