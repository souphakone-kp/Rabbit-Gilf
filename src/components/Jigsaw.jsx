import { useEffect, useMemo, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import ConfettiBurst from "./jsx_Jixsaw/ConfettiBurst";
import generateEdges from "./jsx_Jixsaw/generateEdges";
import buildPiecePath from "./jsx_Jixsaw/buildPiecePath";

// Real jigsaw-piece SVG implementation with drag, snap, and win detection
export default function Jigsaw({ images = [], defaultPieces = 16 }) {
  const containerRef = useRef(null);
    const [pieceCount, setPieceCount] = useState(defaultPieces);
  const [imgIndex, setImgIndex] = useState(0);
  const [pieces, setPieces] = useState([]); // {id,row,col,path,destX,destY,x,y,locked}
  const [dragId, setDragId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [win, setWin] = useState(false);
 
  // Choose image by index
  const chosenSrc = useMemo(() => {
    if (!images || images.length === 0) return null;
    return images[Math.min(imgIndex, images.length - 1)];
  }, [images, imgIndex]);

  // Compute rows/cols near square for N pieces
  const grid = useMemo(() => {
    const n = Math.max(1, Math.min(100, Number(pieceCount) || 1));
    const rows = Math.floor(Math.sqrt(n));
    const cols = Math.ceil(n / rows);
    return { rows, cols, n: rows * cols };
  }, [pieceCount]);

  // Container virtual size (maintain responsive with viewBox)
  const W = 1280; // base width (larger for more detail)
  const H = Math.round((W * 9) / 16); // 16:9
  const cellW = W / grid.cols;
  const cellH = H / grid.rows;

  // Precompute random tab directions for edges so pieces interlock
  const edges = useMemo(() => generateEdges(grid.rows, grid.cols), [grid.rows, grid.cols]);

  // Build pieces on changes
  useEffect(() => {
    if (!chosenSrc) return;
    const p = [];
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const id = r * grid.cols + c;
        const x = c * cellW;
        const y = r * cellH;
        const path = buildPiecePath({
          x,
          y,
          w: cellW,
          h: cellH,
          top: edges.top[r][c],
          right: edges.right[r][c],
          bottom: edges.bottom[r][c],
          left: edges.left[r][c],
        });
        // random start position
        const rx = Math.random() * (W - cellW) * 0.8 + W * 0.1;
        const ry = Math.random() * (H - cellH) * 0.8 + H * 0.1;
        p.push({ id, row: r, col: c, path, destX: x, destY: y, x: rx, y: ry, locked: false });
      }
    }
    setPieces(p);
    setWin(false);
  }, [chosenSrc, grid.rows, grid.cols, cellW, cellH, edges]);

  // Win check
  useEffect(() => {
    if (!pieces.length) return;
    const solved = pieces.every((pc) => pc.locked);
    setWin(solved);
  }, [pieces]);

  function onShuffle() {
    setPieces((prev) =>
      prev.map((pc) => ({
        ...pc,
        locked: false,
        x: Math.random() * (W - cellW) * 0.8 + W * 0.1,
        y: Math.random() * (H - cellH) * 0.8 + H * 0.1,
      }))
    );
    setWin(false);
  }

  function onPointerDown(e, id) {
    const isTouch = e.touches && e.touches.length;
    const point = isTouch ? e.touches[0] : e;
    const bbox = containerRef.current.getBoundingClientRect();
    const px = ((point.clientX - bbox.left) / bbox.width) * W;
    const py = ((point.clientY - bbox.top) / bbox.height) * H;
    const idx = pieces.findIndex((p) => p.id === id);
    const pc = pieces[idx];
    if (!pc || pc.locked) return;
    // bring piece to top by moving to end of array
    setPieces((prev) => {
      const next = prev.slice();
      const [picked] = next.splice(idx, 1);
      next.push(picked);
      return next;
    });
    setDragId(id);
    setOffset({ x: px - pc.x, y: py - pc.y });
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (dragId == null) return;
    const isTouch = e.touches && e.touches.length;
    const point = isTouch ? (e.touches[0] ?? e.changedTouches?.[0]) : e;
    if (!point) return;
    const bbox = containerRef.current.getBoundingClientRect();
    const px = ((point.clientX - bbox.left) / bbox.width) * W;
    const py = ((point.clientY - bbox.top) / bbox.height) * H;
    setPieces((prev) => prev.map((pc) => (pc.id === dragId ? { ...pc, x: px - offset.x, y: py - offset.y } : pc)));
  }

  function onPointerUp() {
    if (dragId == null) return;
    setPieces((prev) => {
      const SNAP = Math.min(cellW, cellH) * 0.2; // slightly stronger snap
      return prev.map((pc) => {
        if (pc.id !== dragId) return pc;
        const dx = pc.x - pc.destX;
        const dy = pc.y - pc.destY;
        const dist = Math.hypot(dx, dy);
        if (dist <= SNAP) {
          return { ...pc, x: pc.destX, y: pc.destY, locked: true };
        }
        return pc;
      });
    });
    setDragId(null);
  }

  const solvedCount = pieces.filter((p) => p.locked).length;

  if (!chosenSrc) return null;

  return (
    <>
      <motion.nav className="bd-navbar" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="bd-container bd-nav-row">
          <div style={{ display: "flex", gap: 8 }}>
            <a href="/" className="bd-btn bd-btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Heart size={16} /> Return
            </a>
          </div>
        </div>
      </motion.nav>

      <section className="bd-container" style={{ paddingBottom: "4rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <h2 className="bd-section-title">Jigsaw Rabbit</h2>
          <div style={{ color: "#6b7280", fontSize: 14 }}>Solved: <strong style={{ color: "#111827" }}>{solvedCount}</strong> / {pieces.length}</div>
        </div>

        <motion.div className="bd-card bd-toolbar" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 12 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {images && images.length > 1 && (
              <>
                <label style={{ fontSize: 14, color: "#6b7280" }}>Image:</label>
                <select
                  value={imgIndex}
                  onChange={(e) => setImgIndex(Number(e.target.value))}
                  className="bd-input"
                  style={{ padding: ".35rem .5rem", borderRadius: 8, border: "1px solid var(--bd-border)" }}
                >
                  {images.map((_, i) => (
                    <option key={i} value={i}>#{i + 1}</option>
                  ))}
                </select>
              </>
            )}
            <label style={{ fontSize: 14, color: "#6b7280" }}>Pieces (1–100):</label>
            <input
              type="number"
              min={1}
              max={100}
              value={pieceCount}
              onChange={(e) => setPieceCount(e.target.value)}
              className="bd-input"
              style={{ width: 90 }}
            />
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={onShuffle} className="bd-btn bd-btn-primary">Shuffle</motion.button>
          </div>
          {win && <span style={{ color: "#16a34a", fontWeight: 700 }}>You solved it! 🎉</span>}
        </motion.div>

        <div
          ref={containerRef}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
          className="bd-jigsaw"
          style={{
            position: "relative",
            width: "min(1120px, 96vw)",
            aspectRatio: "16/9",
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid #fecdd3",
            boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
            marginInline: "auto",
            background: "radial-gradient(600px 380px at 20% 0%, #fff7f9 0%, transparent 70%), radial-gradient(600px 360px at 80% 0%, #fff1f5 0%, transparent 70%), #ffffff",
          }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display: "block" }}>
            <defs>
              <pattern id="imgPattern" x="0" y="0" width={W} height={H} patternUnits="userSpaceOnUse">
                <image href={chosenSrc} x="0" y="0" width={W} height={H} preserveAspectRatio="xMidYMid slice" />
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
              // proximity glow when near snap
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
              <motion.div className="bd-card" style={{ padding: "1rem 1.25rem", textAlign: "center" }} initial={{ scale: 0.95, y: 6 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16a34a" }}>You Win! 🎉</div>
                <div style={{ marginTop: 8, color: "#6b7280" }}>Great job solving the puzzle.</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} onClick={onShuffle} className="bd-btn bd-btn-primary">Play Again</motion.button>
                </div>
              </motion.div>
              <ConfettiBurst />
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}




 