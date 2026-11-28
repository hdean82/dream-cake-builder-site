/* Dream Cake Builder: tiny QR code maker (byte mode, error correction M, versions 1–10, up to 213 characters).
   DCBQR.matrix(text) -> array of rows (true = dark); DCBQR.svg(text, {dark, light}) -> SVG markup. */
(function (g) {
  // [data codewords per block (short), short blocks, long blocks, EC codewords per block] for level M, versions 1–10
  const BLK = [null, [16, 1, 0, 10], [28, 1, 0, 16], [44, 1, 0, 26], [32, 2, 0, 18], [43, 2, 0, 24], [27, 4, 0, 16], [31, 4, 0, 18], [38, 2, 2, 22], [36, 3, 2, 22], [43, 4, 1, 26]];
  const ALIGN = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
  const mul = (x, y) => { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11d); z ^= ((y >>> i) & 1) * x; } return z & 255; };
  function divisor(deg) { const r = new Array(deg).fill(0); r[deg - 1] = 1; let root = 1;
    for (let i = 0; i < deg; i++) { for (let j = 0; j < deg; j++) { r[j] = mul(r[j], root); if (j + 1 < deg) r[j] ^= r[j + 1]; } root = mul(root, 2); } return r; }
  function remainder(data, div) { const r = new Array(div.length).fill(0);
    for (const b of data) { const f = b ^ r.shift(); r.push(0); div.forEach((c, i) => { r[i] ^= mul(c, f); }); } return r; }

  function matrix(text) {
    const bytes = Array.from(new TextEncoder().encode(String(text)));
    let ver = 0, cap = 0;
    for (let v = 1; v <= 10; v++) { const [d, s, l] = BLK[v]; cap = d * s + (d + 1) * l; const need = 4 + (v < 10 ? 8 : 16) + 8 * bytes.length; if (need <= cap * 8) { ver = v; break; } }
    if (!ver) throw new Error('Text too long for a QR code');
    const bits = []; const put = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach((b) => put(b, 8));
    put(0, Math.min(4, cap * 8 - bits.length)); while (bits.length % 8) bits.push(0);
    const data = []; for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2));
    for (let p = 0; data.length < cap; p ^= 1) data.push(p ? 0x11 : 0xec);
    // split into blocks, add error correction, interleave
    const [d, s, l, ec] = BLK[ver], div = divisor(ec), blocks = []; let k = 0;
    for (let i = 0; i < s + l; i++) { const n = d + (i < s ? 0 : 1); const part = data.slice(k, k + n); k += n; blocks.push([part, remainder(part, div)]); }
    const out = [];
    for (let i = 0; i <= d; i++) blocks.forEach(([dt]) => { if (i < dt.length) out.push(dt[i]); });
    for (let i = 0; i < ec; i++) blocks.forEach(([, e]) => out.push(e[i]));

    const N = 17 + 4 * ver, M = [...Array(N)].map(() => new Array(N).fill(false)), F = [...Array(N)].map(() => new Array(N).fill(false));
    const set = (x, y, v) => { M[y][x] = !!v; F[y][x] = true; };
    for (let i = 0; i < N; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    [[3, 3], [N - 4, 3], [3, N - 4]].forEach(([cx, cy]) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy, dist = Math.max(Math.abs(dx), Math.abs(dy)); if (x >= 0 && x < N && y >= 0 && y < N) set(x, y, dist !== 2 && dist !== 4); } });
    const A = ALIGN[ver], last = A.length - 1;
    A.forEach((ay, i) => A.forEach((ax, j) => { if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }));
    const fmt = (mask) => { const dat = (0 << 3) | mask; let r = dat; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537); const b = ((dat << 10) | r) ^ 0x5412, bit = (i) => (b >>> i) & 1;
      for (let i = 0; i <= 5; i++) set(8, i, bit(i)); set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8)); for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
      for (let i = 0; i < 8; i++) set(N - 1 - i, 8, bit(i)); for (let i = 8; i < 15; i++) set(8, N - 15 + i, bit(i)); set(8, N - 8, 1); };
    fmt(0);
    if (ver >= 7) { let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1f25); const b = (ver << 12) | r;
      for (let i = 0; i < 18; i++) { const bit = (b >>> i) & 1, a = N - 11 + (i % 3), c = Math.floor(i / 3); set(a, c, bit); set(c, a, bit); } }
    // place the codewords in the zigzag
    let i = 0;
    for (let right = N - 1; right >= 1; right -= 2) { if (right === 6) right = 5;
      for (let v = 0; v < N; v++) for (let j = 0; j < 2; j++) { const x = right - j, up = ((right + 1) & 2) === 0, y = up ? N - 1 - v : v;
        if (!F[y][x] && i < out.length * 8) { M[y][x] = ((out[i >>> 3] >>> (7 - (i & 7))) & 1) === 1; i++; } } }
    // try all 8 masks, keep the one with the lowest penalty
    const MASKS = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0, (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => (x * y) % 2 + (x * y) % 3 === 0, (x, y) => ((x * y) % 2 + (x * y) % 3) % 2 === 0, (x, y) => ((x + y) % 2 + (x * y) % 3) % 2 === 0];
    const apply = (m) => { for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!F[y][x] && MASKS[m](x, y)) M[y][x] = !M[y][x]; };
    const penalty = () => { let p = 0, dark = 0;
      for (let y = 0; y < N; y++) { let run = 1; for (let x = 0; x < N; x++) { if (M[y][x]) dark++; if (x && M[y][x] === M[y][x - 1]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (let x = 0; x < N; x++) { let run = 1; for (let y = 1; y < N; y++) { if (M[y][x] === M[y - 1][x]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (let y = 0; y < N - 1; y++) for (let x = 0; x < N - 1; x++) { const c = M[y][x]; if (c === M[y][x + 1] && c === M[y + 1][x] && c === M[y + 1][x + 1]) p += 3; }
      const pat = (a) => a.join('') === '10111010000' || a.join('') === '00001011101';
      for (let y = 0; y < N; y++) for (let x = 0; x + 11 <= N; x++) { if (pat(M[y].slice(x, x + 11).map(Number))) p += 40; }
      for (let x = 0; x < N; x++) { const col = M.map((r) => +r[x]); for (let y = 0; y + 11 <= N; y++) if (pat(col.slice(y, y + 11))) p += 40; }
      p += Math.floor(Math.abs(dark * 20 - N * N * 10) / (N * N)) * 10; return p; };
    let best = 0, bestP = Infinity;
    for (let m = 0; m < 8; m++) { apply(m); fmt(m); const p = penalty(); if (p < bestP) { bestP = p; best = m; } apply(m); }
    apply(best); fmt(best);
    return M;
  }
  function svg(text, o) { o = o || {}; const M = matrix(text), N = M.length, q = 4, dark = o.dark || '#000', light = o.light || '#fff'; let d = '';
    M.forEach((row, y) => row.forEach((on, x) => { if (on) d += `M${x + q} ${y + q}h1v1h-1z`; }));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${N + 2 * q} ${N + 2 * q}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="${light}"/><path d="${d}" fill="${dark}"/></svg>`; }
  g.DCBQR = { matrix, svg };
})(typeof window !== 'undefined' ? window : globalThis);
