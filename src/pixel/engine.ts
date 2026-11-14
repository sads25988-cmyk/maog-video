// Pixel-art engine: draw at low resolution (e.g. 270×480), then snap every pixel to a
// curated palette with 4×4 Bayer dithering, and upscale with nearest-neighbour.

export type RGB = [number, number, number];

export const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// ---------------------------------------------------------------- palette
export const P = {
  // night sky (dark → horizon)
  sky0: "#070f1a",
  sky1: "#0b1727",
  sky2: "#0f2036",
  sky3: "#142a45",
  sky4: "#1a3553",
  sky5: "#224361",
  sky6: "#2c5373",
  sky7: "#3b6787",
  sky8: "#5a86a2",
  moon: "#e6efe6",
  moon2: "#b9cfcf",
  star: "#9fb6c6",
  // shadow / neutral darks
  k0: "#08080c",
  k1: "#121219",
  k2: "#1b1b24",
  k3: "#25252f",
  k4: "#30303b",
  k5: "#3f3e48",
  k6: "#524f58",
  k7: "#6a6670",
  // warm wall ramp (lamp-lit stucco)
  w0: "#2c2530",
  w1: "#3a3036",
  w2: "#4b3d3d",
  w3: "#5f4c45",
  w4: "#77604f",
  w5: "#917458",
  w6: "#ab8862",
  w7: "#c49c6d",
  w8: "#d9b17c",
  w9: "#ebc892",
  // light
  l0: "#f2a85a",
  l1: "#ffc477",
  l2: "#ffdc9e",
  l3: "#fff2cf",
  // wood
  d0: "#2a1a14",
  d1: "#3f281c",
  d2: "#5a3a26",
  d3: "#7a5133",
  d4: "#9a6a42",
  // greens (palm)
  g0: "#111a14",
  g1: "#1a281c",
  g2: "#263824",
  g3: "#36492c",
  g4: "#4f5f35",
  g5: "#6e7a44",
  // metal / white car / pot
  m0: "#5d6470",
  m1: "#7d8590",
  m2: "#a3aab3",
  m3: "#c6ccd3",
  m4: "#e4e8ec",
  // cool walls (moonlit)
  c0: "#1d2533",
  c1: "#273142",
  c2: "#334054",
  c3: "#435169",
  // people
  s0: "#5e3a2a",
  s1: "#8a5a40",
  s2: "#b07a56",
  s3: "#cf9a70",
  r0: "#3d1714",
  r1: "#5e2420",
  r2: "#83352b",
  r3: "#a64b37",
  r4: "#c46a4a",
  cloth0: "#1a1418",
  cloth1: "#2a2026",
  cloth2: "#3c2f36",
  // brand
  b0: "#0b3a85",
  b1: "#1557c0",
  b2: "#1e6fde",
  b3: "#5faaf7",
  b4: "#a9d3ff",
  y0: "#c98a10",
  y1: "#ffc83d",
  y2: "#ffe28a",
  white: "#f6f4ee",
  // smoke
  sm0: "#2b2a2e",
  sm1: "#403e43",
  sm2: "#5a575c",
  // flame
  f0: "#2a5bd8",
  f1: "#6aa7ff",
} as const;

export type PColor = keyof typeof P;
const PALETTE: RGB[] = Object.values(P).map(hex);

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

/** Snap canvas to palette with ordered dithering. */
export const quantize = (ctx: CanvasRenderingContext2D, w: number, h: number, ditherStrength = 1) => {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const n = PALETTE.length;
  const cache = new Map<number, [number, number, number]>();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const key = (r << 16) | (g << 8) | b;
      let hit = cache.get(key);
      if (!hit) {
        let b1 = 0;
        let b2 = 0;
        let d1 = Infinity;
        let d2 = Infinity;
        for (let k = 0; k < n; k++) {
          const p = PALETTE[k];
          const dr = r - p[0];
          const dg = g - p[1];
          const db = b - p[2];
          const dist = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11;
          if (dist < d1) {
            d2 = d1;
            b2 = b1;
            d1 = dist;
            b1 = k;
          } else if (dist < d2) {
            d2 = dist;
            b2 = k;
          }
        }
        const s1 = Math.sqrt(d1);
        const s2 = Math.sqrt(d2);
        hit = [b1, b2, s1 + s2 === 0 ? 0 : s1 / (s1 + s2)];
        cache.set(key, hit);
      }
      const t = BAYER[(y & 3) * 4 + (x & 3)];
      const pick = hit[2] * ditherStrength > t ? hit[1] : hit[0];
      const p = PALETTE[pick];
      d[i] = p[0];
      d[i + 1] = p[1];
      d[i + 2] = p[2];
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
};

// ---------------------------------------------------------------- drawing helpers
export class Gfx {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public w: number,
    public h: number,
  ) {}

  col(c: PColor | string) {
    return c in P ? P[c as PColor] : c;
  }
  rect(x: number, y: number, w: number, h: number, c: PColor | string) {
    this.ctx.fillStyle = this.col(c);
    this.ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }
  px(x: number, y: number, c: PColor | string) {
    this.rect(x, y, 1, 1, c);
  }
  poly(pts: number[], c: PColor | string) {
    const ctx = this.ctx;
    ctx.fillStyle = this.col(c);
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.closePath();
    ctx.fill();
  }
  /** pixel-perfect filled circle */
  circle(cx: number, cy: number, r: number, c: PColor | string) {
    this.ctx.fillStyle = this.col(c);
    for (let y = -r; y <= r; y++) {
      const hw = Math.floor(Math.sqrt(r * r - y * y) + 0.35);
      this.ctx.fillRect(Math.round(cx - hw), Math.round(cy + y), hw * 2 + 1, 1);
    }
  }
  ellipse(cx: number, cy: number, rx: number, ry: number, c: PColor | string) {
    this.ctx.fillStyle = this.col(c);
    for (let y = -ry; y <= ry; y++) {
      const hw = Math.floor(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))) + 0.35);
      this.ctx.fillRect(Math.round(cx - hw), Math.round(cy + y), hw * 2 + 1, 1);
    }
  }
  /** 1px Bresenham line (or thicker) */
  line(x0: number, y0: number, x1: number, y1: number, c: PColor | string, t = 1) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    this.ctx.fillStyle = this.col(c);
    const o = Math.floor(t / 2);
    for (;;) {
      this.ctx.fillRect(x0 - o, y0 - o, t, t);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }
  /** quadratic curve rasterised as short lines */
  curve(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, c: PColor | string, t = 1) {
    const steps = 24;
    let px = x0;
    let py = y0;
    for (let i = 1; i <= steps; i++) {
      const s = i / steps;
      const x = (1 - s) * (1 - s) * x0 + 2 * (1 - s) * s * cx + s * s * x1;
      const y = (1 - s) * (1 - s) * y0 + 2 * (1 - s) * s * cy + s * s * y1;
      this.line(px, py, x, y, c, t);
      px = x;
      py = y;
    }
  }
  vgrad(x: number, y: number, w: number, h: number, stops: [number, PColor | string][]) {
    const g = this.ctx.createLinearGradient(0, y, 0, y + h);
    for (const [o, c] of stops) g.addColorStop(o, this.col(c));
    this.ctx.fillStyle = g;
    this.ctx.fillRect(x, y, w, h);
  }
  /** additive light (screen-like). color as rgb string, strength 0..1 */
  glow(cx: number, cy: number, r: number, color: string, a: number, mode: GlobalCompositeOperation = "lighter", ry?: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = mode;
    if (ry && ry !== r) {
      ctx.translate(cx, cy);
      ctx.scale(1, ry / r);
      ctx.translate(-cx, -cy);
    }
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, rgba(color, a));
    g.addColorStop(0.45, rgba(color, a * 0.45));
    g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.restore();
  }
  /** darken a region with multiply */
  shade(x: number, y: number, w: number, h: number, color: string, a: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = a;
    ctx.fillStyle = this.col(color);
    ctx.fillRect(x, y, w, h);
    ctx.restore();
  }
  with(fn: () => void, opts: { alpha?: number; mode?: GlobalCompositeOperation; clip?: number[] }) {
    const ctx = this.ctx;
    ctx.save();
    if (opts.alpha !== undefined) ctx.globalAlpha = opts.alpha;
    if (opts.mode) ctx.globalCompositeOperation = opts.mode;
    if (opts.clip) {
      ctx.beginPath();
      ctx.rect(opts.clip[0], opts.clip[1], opts.clip[2], opts.clip[3]);
      ctx.clip();
    }
    fn();
    ctx.restore();
  }
}

/** Draw into an offscreen layer (so lights can be limited to its pixels), then composite. */
export const layer = (g: Gfx, fn: (lg: Gfx) => void, light?: (lg: Gfx) => void) => {
  const cv = document.createElement("canvas");
  cv.width = g.w;
  cv.height = g.h;
  const ctx = cv.getContext("2d");
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  const lg = new Gfx(ctx, g.w, g.h);
  fn(lg);
  if (light) light(lg);
  g.ctx.drawImage(cv, 0, 0);
};

export const rgba = (h: string, a: number) => {
  const c = h in P ? hex(P[h as PColor]) : hex(h);
  return `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a))})`;
};

// deterministic noise
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
