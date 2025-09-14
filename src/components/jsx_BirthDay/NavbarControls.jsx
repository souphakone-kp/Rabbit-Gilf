import { Music, Gift, PartyPopper } from "lucide-react";

export default function NavbarControls({
  play,
  setPlay,
  onConfetti,
  celebrant,
  fromName,
}) {
  return (
    <nav className="bd-navbar">
      <div className="bd-container bd-nav-row">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 600,
          }}
        >
          <PartyPopper size={20} color="#e11d48" />
          <span>
            Happy Birthday {celebrant}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setPlay((p) => !p)}
            className="bd-btn bd-btn-ghost"
          >
            <Music size={16} color={play ? "#e11d48" : "#6b7280"} />
            <span style={{ fontSize: 12 }}>
              {play ? "Pause song" : "Play song"}
            </span>
          </button>
          <button onClick={onConfetti} className="bd-btn bd-btn-primary">
            <Gift size={16} />
            <span style={{ fontSize: 12 }}>Confetti</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
