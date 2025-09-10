export default function generateEdges(rows, cols) {
    const top = Array.from({ length: rows }, () => Array(cols).fill(0));
    const right = Array.from({ length: rows }, () => Array(cols).fill(0));
    const bottom = Array.from({ length: rows }, () => Array(cols).fill(0));
    const left = Array.from({ length: rows }, () => Array(cols).fill(0));
  
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // top edge
        if (r === 0) top[r][c] = 0; else top[r][c] = -bottom[r - 1][c];
        // left edge
        if (c === 0) left[r][c] = 0; else left[r][c] = -right[r][c - 1];
        // right edge (random, synchronized with neighbor)
        if (c === cols - 1) right[r][c] = 0; else right[r][c] = Math.random() < 0.5 ? 1 : -1;
        // bottom edge (random, synchronized with neighbor)
        if (r === rows - 1) bottom[r][c] = 0; else bottom[r][c] = Math.random() < 0.5 ? 1 : -1;
      }
    }
    return { top, right, bottom, left };
  }