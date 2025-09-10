export default function buildPiecePath({ x, y, w, h, top, right, bottom, left }) {
    // Control how deep the knobs are (relative to w/h)
    const knobW = w * 0.35;
    const knobH = h * 0.35;
    const midX = x + w / 2;
    const midY = y + h / 2;
  
    const p = [];
    p.push(`M ${x} ${y}`);
  
    // Top edge
    if (top === 0) {
      p.push(`L ${x + w} ${y}`);
    } else {
      const dir = top; // 1 out, -1 in
      const kx1 = midX - knobW / 2, kx2 = midX + knobW / 2;
      const ky = y - dir * knobH;
      p.push(`L ${kx1} ${y}`);
      p.push(`C ${kx1} ${y} ${kx1} ${ky} ${midX} ${ky}`);
      p.push(`C ${kx2} ${ky} ${kx2} ${y} ${kx2} ${y}`);
      p.push(`L ${x + w} ${y}`);
    }
  
    // Right edge
    if (right === 0) {
      p.push(`L ${x + w} ${y + h}`);
    } else {
      const dir = right;
      const kyMid1 = midY - knobH / 2, kyMid2 = midY + knobH / 2;
      const kx = x + w + dir * knobW;
      p.push(`L ${x + w} ${kyMid1}`);
      p.push(`C ${x + w} ${kyMid1} ${kx} ${kyMid1} ${kx} ${midY}`);
      p.push(`C ${kx} ${kyMid2} ${x + w} ${kyMid2} ${x + w} ${kyMid2}`);
      p.push(`L ${x + w} ${y + h}`);
    }
  
    // Bottom edge
    if (bottom === 0) {
      p.push(`L ${x} ${y + h}`);
    } else {
      const dir = bottom;
      const kx1 = midX + knobW / 2, kx2 = midX - knobW / 2;
      const ky = y + h + dir * knobH;
      p.push(`L ${kx1} ${y + h}`);
      p.push(`C ${kx1} ${y + h} ${kx1} ${ky} ${midX} ${ky}`);
      p.push(`C ${kx2} ${ky} ${kx2} ${y + h} ${kx2} ${y + h}`);
      p.push(`L ${x} ${y + h}`);
    }
  
    // Left edge
    if (left === 0) {
      p.push(`Z`);
    } else {
      const dir = left;
      const kyMid1 = midY + knobH / 2, kyMid2 = midY - knobH / 2;
      const kx = x - dir * knobW;
      p.push(`L ${x} ${kyMid1}`);
      p.push(`C ${x} ${kyMid1} ${kx} ${kyMid1} ${kx} ${midY}`);
      p.push(`C ${kx} ${kyMid2} ${x} ${kyMid2} ${x} ${kyMid2}`);
      p.push(`Z`);
    }
  
    return p.join(" ");
  }