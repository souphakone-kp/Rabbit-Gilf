import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, Sparkles, Eye, EyeOff, TimerReset, Shuffle, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import generateEdges from "./jsx_Jixsaw/generateEdges";
import buildPiecePath from "./jsx_Jixsaw/buildPiecePath";
import HeartLoading from "./HeartLoading";

// ปรับ 100vh บนมือถือ (ใช้เป็น utility ทั่วหน้า)
function useViewportVH() {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);
    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);
}

export default function Jigsaw({ images = [], defaultPieces = 5 }) {
  useViewportVH();

  const containerRef = useRef(null);
  const [pieceCount, setPieceCount] = useState(defaultPieces);
  const [imgIndex, setImgIndex] = useState(0);
  const [pieces, setPieces] = useState([]);
  const [dragId, setDragId] = useState(null);
  const [dragging, setDragging] = useState(false);      // ← ใหม่: ใช้สลับ touchAction
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [win, setWin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const chosenSrc = useMemo(() => {
    if (!images?.length) return null;
    return images[Math.min(imgIndex, images.length - 1)];
  }, [images, imgIndex]);

  // คำนวณ grid จากจำนวนชิ้น
  const grid = useMemo(() => {
    const n = Math.max(1, Math.min(100, Number(pieceCount) || 1));
    const rows = Math.floor(Math.sqrt(n));
    const cols = Math.ceil(n / rows);
    return { rows, cols, n: rows * cols };
  }, [pieceCount]);

  // ขนาด world ภายใน SVG (อัตราส่วน 16:9)
  const W = 1280;
  const H = Math.round((W * 9) / 16);
  const cellW = W / grid.cols;
  const cellH = H / grid.rows;

  const edges = useMemo(() => generateEdges(grid.rows, grid.cols), [grid.rows, grid.cols]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // สร้างชิ้นส่วนใหม่ทุกครั้งที่รูปหรือ grid เปลี่ยน
  useEffect(() => {
    if (!chosenSrc) return;
    const p = [];
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const id = r * grid.cols + c;
        const x = c * cellW;
        const y = r * cellH;
        const path = buildPiecePath({
          x, y, w: cellW, h: cellH,
          top: edges.top[r][c],
          right: edges.right[r][c],
          bottom: edges.bottom[r][c],
          left: edges.left[r][c],
        });
        // ตำแหน่งเริ่ม random ภายใน world
        const rx = Math.random() * (W - cellW);
        const ry = Math.random() * (H - cellH);
        p.push({ id, row: r, col: c, path, destX: x, destY: y, x: rx, y: ry, locked: false });
      }
    }
    setPieces(p);
    setWin(false);
    setMoves(0);
    setSeconds(0);
  }, [chosenSrc, grid.rows, grid.cols, cellW, cellH, edges]);

  // นับเวลาเมื่อยังไม่ชนะ
  useEffect(() => {
    if (win) return;
    const i = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [win]);

  // เช็คชนะ
  useEffect(() => {
    if (!pieces.length) return;
    const solved = pieces.every((pc) => pc.locked);
    setWin(solved);
    if (solved) {
      try { navigator.vibrate?.(80); } catch {}
    }
  }, [pieces]);

  function onShuffle() {
    setPieces((prev) =>
      prev.map((pc) => ({
        ...pc,
        locked: false,
        x: Math.random() * (W - cellW),
        y: Math.random() * (H - cellH),
      }))
    );
    setWin(false);
    setMoves(0);
    setSeconds(0);
  }

  function worldPointFromEvent(e) {
    const isTouch = e.touches && e.touches.length;
    const point = isTouch ? (e.touches[0] ?? e.changedTouches?.[0]) : e;
    if (!point || !containerRef.current) return { px: 0, py: 0 };
    const bbox = containerRef.current.getBoundingClientRect();
    const px = ((point.clientX - bbox.left) / bbox.width) * W;
    const py = ((point.clientY - bbox.top) / bbox.height) * H;
    return { px, py };
  }

  function onPointerDown(e, id) {
    const idx = pieces.findIndex((p) => p.id === id);
    const pc = pieces[idx];
    if (!pc || pc.locked) return;

    // bring to top
    setPieces((prev) => {
      const next = prev.slice();
      const [picked] = next.splice(idx, 1);
      next.push(picked);
      return next;
    });

    const { px, py } = worldPointFromEvent(e);
    setDragId(id);
    setDragging(true);
    setOffset({ x: px - pc.x, y: py - pc.y });
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (dragId == null) return;
    const { px, py } = worldPointFromEvent(e);
    setPieces((prev) =>
      prev.map((pc) => (pc.id === dragId ? { ...pc, x: px - offset.x, y: py - offset.y } : pc))
    );
  }

  function endDrag() {
    if (dragId == null) return;
    setPieces((prev) => {
      const SNAP = Math.min(cellW, cellH) * 0.2;
      let snapped = false;
      const next = prev.map((pc) => {
        if (pc.id !== dragId) return pc;
        const dx = pc.x - pc.destX;
        const dy = pc.y - pc.destY;
        const dist = Math.hypot(dx, dy);
        if (dist <= SNAP) {
          snapped = true;
          return { ...pc, x: pc.destX, y: pc.destY, locked: true };
        }
        return pc;
      });
      setMoves((m) => m + 1);
      if (snapped) { try { navigator.vibrate?.(30); } catch {} }
      return next;
    });
    setDragId(null);
    setDragging(false);
  }

  const solvedCount = pieces.filter((p) => p.locked).length;
  const timeFmt = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100svh",
          display: "grid",
          placeItems: "center",
          background:
            "radial-gradient(600px 380px at 20% 0%, #fff7f9 0%, transparent 70%), radial-gradient(600px 360px at 80% 0%, #fff1f5 0%, transparent 70%), #ffffff",
        }}
      >
        <HeartLoading size={100} color="#e11d48" />
      </div>
    );
  }

  if (!chosenSrc) return null;

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(600px 380px at 20% 0%, #fff7f9 0%, transparent 70%), radial-gradient(600px 360px at 80% 0%, #fff1f5 0%, transparent 70%), #ffffff",
      }}
    >
      {/* NAV (sticky) */}
      <motion.nav
        className="bd-navbar"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ position: "sticky", top: 0, zIndex: 10 }}
      >
        <div className="bd-container bd-nav-row">
          <Link
            to="/"
            className="bd-btn bd-btn-primary"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              minHeight: 36,
              paddingInline: 12,
            }}
          >
            <Heart size={16} /> Return
          </Link>
        </div>
      </motion.nav>

      {/* CONTENT (scroll ได้) */}
      <section
        className="bd-container"
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: "10px 12px 24px",
          gap: "clamp(8px, 1.2vw, 16px)",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "clamp(8px, 1.4vw, 16px)",
            width: "min(1100px, 92vw)",
            marginInline: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1vw, 12px)" }}>
            <div
              className="bd-title-chip"
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <Sparkles size={14} />
              <span style={{ marginLeft: 6, fontSize: "clamp(12px, 1.4vw, 14px)" }}>Play</span>
            </div>
            <h2
              className="bd-section-title bd-gradient-text"
              style={{ margin: 0, fontSize: "clamp(18px, 2.1vw, 26px)" }}
            >
              Jigsaw Rabbit
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1.2vw, 14px)" }}>
            <div title="Time" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: "clamp(12px, 1.6vw, 14px)" }}>
              <TimerReset size={16} /> {timeFmt}
            </div>
            <div title="Moves" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: "clamp(12px, 1.6vw, 14px)" }}>
              <Trophy size={16} /> {moves}
            </div>
            <div className="bd-progress" style={{ width: "clamp(72px, 14vw, 140px)", height: 6, borderRadius: 999, background: "#fde2e7", overflow: "hidden" }}>
              <div
                className="bd-progress-fill"
                style={{
                  width: `${pieces.length ? Math.round((solvedCount / pieces.length) * 100) : 0}%`,
                  height: "100%",
                  background: "#fb7185",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          className="bd-card bd-toolbar"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          style={{
            width: "min(1100px, 92vw)",
            display: "flex",
            flexWrap: "wrap",
            rowGap: 8,
            columnGap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            padding: "clamp(8px, 1.2vw, 12px) clamp(10px, 1.6vw, 14px)",
            borderRadius: "clamp(12px, 1.6vw, 14px)",
            marginInline: "auto",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            {images?.length > 1 && (
              <>
                <label style={{ fontSize: 13, color: "#6b7280" }}>Image:</label>
                <select
                  value={imgIndex}
                  onChange={(e) => setImgIndex(Number(e.target.value))}
                  className="bd-input"
                  style={{
                    padding: ".4rem .6rem",
                    borderRadius: 10,
                    border: "1px solid var(--bd-border)",
                    minHeight: 34,
                  }}
                >
                  {images.map((_, i) => (
                    <option key={i} value={i}>#{i + 1}</option>
                  ))}
                </select>
              </>
            )}
            <label style={{ fontSize: 13, color: "#6b7280" }}>Pieces (1–100):</label>
            <input
              type="number"
              min={1}
              max={100}
              value={pieceCount}
              onChange={(e) => setPieceCount(e.target.value)}
              className="bd-input"
              style={{ width: 96, padding: ".4rem .6rem", borderRadius: 10, minHeight: 34 }}
            />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="bd-btn"
              onClick={() => setShowHint((v) => !v)}
              title={showHint ? "Hide hint" : "Show hint"}
              style={{ minHeight: 36, paddingInline: 12 }}
            >
              {showHint ? <EyeOff size={16} /> : <Eye size={16} />} {showHint ? "Hide Hint" : "Hint"}
            </button>
            <button
              className="bd-btn bd-btn-primary"
              onClick={onShuffle}
              style={{ minHeight: 36, paddingInline: 12 }}
            >
              <Shuffle size={16} /> Shuffle
            </button>
          </div>
        </motion.div>

        {/* กล่องเกม (เลื่อนหน้าได้ + รูป cover) */}
        <div
          ref={containerRef}
          onMouseMove={onPointerMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchMove={onPointerMove}
          onTouchEnd={endDrag}
          onPointerCancel={endDrag}
          className="bd-jigsaw"
          style={{
            position: "relative",
            width: "min(1100px, 92vw)",
            height: "clamp(260px, 56vw, 720px)",     // ทำให้กล่องมีความสูงชัดเจน → เกิดพื้นที่ scroll ด้านล่างได้
            borderRadius: "clamp(14px, 2vw, 24px)",
            overflow: "hidden",
            border: "1px solid #fecdd3",
            boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
            margin: "0 auto",
            touchAction: dragging ? "none" : "pan-y", // ← ปกติสกรอลล์ได้, ตอนลากห้ามสกรอลล์
            background:
              "radial-gradient(600px 380px at 20% 0%, #fff7f9 0%, transparent 70%), radial-gradient(600px 360px at 80% 0%, #fff1f5 0%, transparent 70%), #ffffff",
          }}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"   // รูป cover เต็มกล่อง
            style={{ display: "block" }}
          >
            <defs>
              <pattern id="imgPattern" x="0" y="0" width="1" height="1" patternUnits="objectBoundingBox">
                <image
                  href={chosenSrc}
                  x="0" y="0" width="100%" height="100%"
                  preserveAspectRatio="xMidYMid slice"
                  style={{ opacity: showHint ? 0.35 : 1 }}
                />
              </pattern>
              <filter id="pieceShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.2" />
              </filter>
              <filter id="glow">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#fb7185" floodOpacity=".45" />
              </filter>
            </defs>

            {pieces.map((pc) => {
              const isDragging = pc.id === dragId;
              const dx = Math.abs(pc.x - pc.destX);
              const dy = Math.abs(pc.y - pc.destY);
              const near = Math.hypot(dx, dy) < Math.min(cellW, cellH) * 0.35 && !pc.locked;
              return (
                <g
                  key={pc.id}
                  onMouseDown={(e) => onPointerDown(e, pc.id)}
                  onTouchStart={(e) => onPointerDown(e, pc.id)}
                  style={{ cursor: pc.locked ? "default" : "grab" }}
                >
                  <path
                    d={pc.path}
                    transform={`translate(${pc.x - pc.destX} ${pc.y - pc.destY})`}
                    fill="url(#imgPattern)"
                    stroke={pc.locked ? "#ffffff" : near ? "#fb7185" : "#fca5a5"}
                    strokeWidth={pc.locked ? 1 : 1.2}
                    filter={isDragging ? "url(#glow)" : "url(#pieceShadow)"}
                  />
                </g>
              );
            })}
          </svg>

          {win && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="win-overlay"
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,.75)",
                backdropFilter: "blur(4px)",
              }}
            >
              <motion.div
                className="bd-card"
                style={{ padding: "1rem 1.25rem", textAlign: "center" }}
                initial={{ scale: 0.95, y: 6 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16a34a" }}>You Win! 🎉</div>
                <div style={{ marginTop: 8, color: "#6b7280" }}>Great job solving the puzzle.</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onShuffle}
                    className="bd-btn bd-btn-primary"
                    style={{ minHeight: 36, paddingInline: 14 }}
                  >
                    Play Again
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* เติมเนื้อหาด้านล่างเล็กน้อยเพื่อโชว์สกรอลล์ */}
        <div style={{ height: 32 }} />
      </section>
    </div>
  );
}