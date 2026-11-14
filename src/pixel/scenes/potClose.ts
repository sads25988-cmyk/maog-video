import { Gfx, layer, rnd } from "../engine";

const CX = 135;
const CY = 290;

const crustPath = (g: Gfx) => {
  // irregular burnt crust (pixel blob)
  for (let y = -70; y <= 70; y++) {
    const base = Math.sqrt(Math.max(0, 1 - (y / 72) ** 2)) * 80;
    const wob = Math.sin(y * 0.09) * 6 + Math.sin(y * 0.045 + 1) * 6;
    const w = Math.max(0, base + wob);
    g.rect(CX - w, CY + y, w * 2, 1, "k1");
  }
  // texture: charred lumps, cracks, stuck rice
  for (let i = 0; i < 60; i++) {
    const a = rnd(i + 3) * Math.PI * 2;
    const r = Math.sqrt(rnd(i + 30)) * 64;
    const x = CX + Math.cos(a) * r;
    const y = CY + Math.sin(a) * r * 0.85;
    g.rect(x, y, 2 + Math.floor(rnd(i) * 3), 2, i % 3 === 0 ? "k0" : i % 3 === 1 ? "k2" : "d0");
  }
  for (let i = 0; i < 14; i++) {
    const a = rnd(i + 90) * Math.PI * 2;
    const r = Math.sqrt(rnd(i + 91)) * 58;
    g.rect(CX + Math.cos(a) * r, CY + Math.sin(a) * r * 0.85, 3, 1, "d1");
  }
  g.line(CX - 40, CY - 10, CX - 22, CY - 16, "k3");
  g.line(CX - 22, CY - 16, CX - 12, CY - 6, "k3");
  g.line(CX + 10, CY + 20, CX + 30, CY + 14, "k3");
  g.line(CX + 30, CY + 14, CX + 44, CY + 26, "k3");
};

export const drawPotClose = (
  g: Gfx,
  frame: number,
  o: { mode: "old" | "moaj"; wave?: number; scrubPhase?: number; shine?: number },
) => {
  const t = frame / 30;
  const wave = o.wave ?? 0; // 0..1 how far the clean wave has travelled
  const shine = o.shine ?? 0;
  const ph = o.scrubPhase ?? t * 5;

  layer(
    g,
    (lg) => {
      // counter stone
      lg.rect(0, 0, 270, 480, "w6");
      for (let i = 0; i < 160; i++) lg.px(rnd(i) * 270, rnd(i + 500) * 480, i % 2 ? "w5" : "w7");
      // pot shadow + body (seen from above)
      lg.circle(CX + 6, CY + 8, 124, "w3");
      lg.circle(CX, CY, 122, "m4");
      lg.circle(CX, CY, 114, "m2");
      lg.circle(CX, CY, 108, "m1");
      lg.circle(CX - 2, CY + 2, 96, "m2");
      lg.circle(CX, CY + 6, 88, "m3");
      // handles
      lg.rect(CX - 146, CY - 10, 26, 20, "m2");
      lg.rect(CX + 120, CY - 10, 26, 20, "m2");
      lg.rect(CX - 146, CY - 10, 26, 3, "m4");
      lg.rect(CX + 120, CY - 10, 26, 3, "m4");
      // clean metal highlights (only visible where the crust is gone)
      lg.curve(CX - 70, CY - 20, CX - 40, CY - 74, CX + 30, CY - 72, "m4", 5);
      lg.curve(CX - 40, CY + 50, CX, CY + 66, CX + 50, CY + 44, "m4", 3);
    },
    (lg) => {
      lg.glow(150, 60, 380, "#ffc183", 0.35, "source-atop");
    },
  );

  // ---------- the crust, clipped by the cleaning wave
  const front = CX - 96 + wave * 196; // x of the wave front
  const ctx = g.ctx;
  ctx.save();
  ctx.beginPath();
  // everything right of the (wavy) front stays dirty
  ctx.moveTo(front, 0);
  for (let y = 0; y <= 480; y += 8) ctx.lineTo(front + Math.sin(y * 0.09 + t * 6) * 6, y);
  ctx.lineTo(300, 480);
  ctx.lineTo(300, 0);
  ctx.closePath();
  ctx.clip();
  crustPath(g);
  ctx.restore();

  // ---------- old sponge scrubbing in circles (nothing happens)
  if (o.mode === "old") {
    const sx = CX + Math.cos(ph) * 22;
    const sy = CY + Math.sin(ph) * 14;
    // sleeve + hand from bottom-right
    g.line(270, 480, sx + 30, sy + 34, "r1", 26);
    g.line(270, 480, sx + 30, sy + 34, "r2", 22);
    g.line(sx + 44, sy + 50, sx + 34, sy + 38, "r0", 22);
    // sponge (yellow-green, crumbling)
    g.rect(sx - 22, sy - 14, 44, 28, "g4");
    g.rect(sx - 22, sy - 14, 44, 10, "g3");
    for (let i = 0; i < 10; i++) g.px(sx - 18 + rnd(i) * 36, sy - 2 + rnd(i + 9) * 14, "g2");
    g.rect(sx + 16, sy - 14, 6, 6, "w6"); // chunk missing
    g.circle(sx + 26, sy + 22, 10, "s3"); // hand
    g.rect(sx + 22, sy + 14, 12, 4, "s2");
    // crumbs flying
    for (let i = 0; i < 8; i++) {
      const a = rnd(i + Math.floor(ph * 2)) * Math.PI * 2;
      const d = 30 + rnd(i + 70 + Math.floor(ph)) * 40;
      g.rect(sx + Math.cos(a) * d, sy + Math.sin(a) * d, 3, 2, i % 2 ? "g4" : "g3");
    }
  }

  // ---------- Moaj: the wave + sponge riding it
  if (o.mode === "moaj" && wave > 0 && wave < 1.02) {
    for (let y = CY - 96; y <= CY + 96; y += 1) {
      const wx = front + Math.sin(y * 0.09 + t * 6) * 6;
      g.rect(wx - 7, y, 7, 1, "b2");
      g.rect(wx - 10, y, 3, 1, "b3");
      if ((y + Math.floor(t * 20)) % 9 === 0) g.rect(wx - 2, y, 3, 2, "white");
    }
    // sponge (top view) at the front, sweeping up and down
    const sy = CY + Math.sin(t * 9) * 46;
    const sx = front - 4;
    g.line(270, 480, sx + 24, sy + 30, "r1", 26);
    g.line(270, 480, sx + 24, sy + 30, "r2", 22);
    g.rect(sx - 20, sy - 30, 40, 60, "b0");
    g.rect(sx - 18, sy - 28, 36, 56, "b2");
    g.rect(sx - 18, sy - 28, 36, 8, "b3");
    g.rect(sx + 10, sy - 28, 8, 56, "b1");
    // wire face (visible edge) with glitter
    g.rect(sx - 18, sy - 28, 6, 56, "m3");
    for (let i = 0; i < 10; i++) g.px(sx - 17 + (i % 2) * 3, sy - 26 + i * 5, (Math.floor(t * 10) + i) % 3 ? "y1" : "y2");
    g.line(sx - 6, sy + 10, sx + 6, sy + 14, "white", 2);
    g.circle(sx + 20, sy + 24, 10, "s3");
    // glitter trail
    for (let i = 0; i < 12; i++) {
      const gx = front - 10 - rnd(i + Math.floor(t * 12)) * 60;
      const gy = CY - 80 + rnd(i + 40 + Math.floor(t * 12)) * 160;
      g.px(gx, gy, i % 3 ? "y1" : "y2");
    }
  }

  // ---------- shine after it's clean
  if (shine > 0) {
    const k = Math.floor(t * 6) % 4;
    const tw = (x: number, y: number, s: number, c: string) => {
      g.rect(x - s, y, s * 2 + 1, 1, c);
      g.rect(x, y - s, 1, s * 2 + 1, c);
    };
    g.glow(CX - 20, CY - 30, 70 * shine, "#e8f0f4", 0.35 * shine);
    tw(CX - 46, CY - 44, 5 + (k === 0 ? 2 : 0), "white");
    tw(CX + 38, CY + 30, 3 + (k === 2 ? 1 : 0), "white");
    tw(CX + 4, CY - 70, 3 + (k === 1 ? 1 : 0), "y2");
    tw(CX - 70, CY + 40, 2, "white");
    // lamp reflection in the bottom
    g.circle(CX + 24, CY - 22, 6, "l3");
    g.circle(CX + 24, CY - 22, 3, "white");
  }
  // vignette
  g.vgrad(0, 0, 270, 90, [
    [0, "rgba(10,6,4,0.65)"],
    [1, "rgba(10,6,4,0)"],
  ]);
  g.vgrad(0, 400, 270, 80, [
    [0, "rgba(10,6,4,0)"],
    [1, "rgba(10,6,4,0.6)"],
  ]);
};
