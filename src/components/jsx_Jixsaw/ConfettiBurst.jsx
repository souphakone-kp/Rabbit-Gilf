export default function ConfettiBurst() {
    // simple CSS confetti dots
    const dots = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      size: Math.random() * 8 + 6,
      color: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"][i % 5],
      duration: 1.2 + Math.random() * 0.8,
    }));
    return (
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {dots.map((d) => (
          <div
            key={d.id}
            style={{
              position: "absolute",
              top: -20,
              left: `${d.left}%`,
              width: d.size,
              height: d.size,
              borderRadius: 2,
              background: d.color,
              animation: `fall ${d.duration}s linear ${d.delay}s both`,
            }}
          />
        ))}
        <style>{`@keyframes fall { from { transform: translateY(-20px) rotate(0deg); opacity: 1 } to { transform: translateY(110%) rotate(360deg); opacity: 0.7 } }`}</style>
      </div>
    );
  }