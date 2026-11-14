import { Gfx, layer, rnd } from "../engine";
import { drawWoman, PxExpr } from "./ummFahad";

/** Old-photo grade: sepia + flicker; quantize afterwards maps it into the warm palette. */
export const sepia = (g: Gfx, amount: number, flicker = 0) => {
  const img = g.ctx.getImageData(0, 0, g.w, g.h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const gg = d[i + 1];
    const b = d[i + 2];
    const sr = Math.min(255, (r * 0.393 + gg * 0.769 + b * 0.189) * (1 + flicker));
    const sg = Math.min(255, (r * 0.349 + gg * 0.686 + b * 0.168) * (1 + flicker));
    const sb = Math.min(255, (r * 0.272 + gg * 0.534 + b * 0.131) * (1 + flicker));
    d[i] = r + (sr - r) * amount;
    d[i + 1] = gg + (sg - gg) * amount;
    d[i + 2] = b + (sb - b) * amount;
  }
  g.ctx.putImageData(img, 0, 0);
};

const sadu = (g: Gfx, y: number, h: number) => {
  g.rect(0, y, 270, h, "r1");
  g.rect(0, y, 270, 2, "k1");
  g.rect(0, y + h - 2, 270, 2, "k1");
  for (let x = 0; x < 270; x += 12) {
    g.poly([x, y + h - 3, x + 6, y + 3, x + 12, y + h - 3], "white");
    g.poly([x + 3, y + h - 3, x + 6, y + 8, x + 9, y + h - 3], "k1");
  }
};

export const drawWedding = (g: Gfx, frame: number, o: { grandmaExpr?: PxExpr; brideExpr?: PxExpr } = {}) => {
  const t = frame / 30;
  layer(
    g,
    (lg) => {
      // majlis walls
      lg.rect(0, 0, 270, 480, "w4");
      lg.rect(0, 0, 270, 40, "w2");
      // rounded arch niche with a small window
      lg.rect(96, 140, 78, 62, "w3");
      lg.ellipse(135, 140, 39, 40, "w3");
      lg.rect(100, 144, 70, 58, "w2");
      lg.ellipse(135, 144, 35, 36, "w2");
      lg.rect(124, 150, 22, 40, "d1");
      lg.rect(126, 152, 18, 36, "sky3");
      lg.rect(134, 152, 2, 36, "d1");
      sadu(lg, 206, 18);
      // wall cushions (masanid) along the back
      lg.rect(0, 332, 270, 50, "r2");
      lg.rect(0, 332, 270, 4, "r3");
      for (let x = 0; x < 270; x += 30) {
        lg.rect(x + 2, 340, 26, 36, "r1");
        lg.rect(x + 4, 342, 22, 32, "r2");
        lg.poly([x + 15, 346, x + 22, 358, x + 15, 370, x + 8, 358], "y0");
      }
      lg.rect(0, 380, 270, 22, "d2");
      // carpet
      lg.rect(0, 402, 270, 78, "r1");
      for (let x = 6; x < 270; x += 20) {
        lg.poly([x, 440, x + 8, 430, x + 16, 440, x + 8, 450], "r3");
        lg.px(x + 8, 440, "y0");
      }
      lg.rect(0, 410, 270, 2, "y0");
      lg.rect(0, 470, 270, 2, "y0");
      // incense burner (mabkhara) with a wisp
      lg.poly([226, 400, 246, 400, 242, 388, 230, 388], "d3");
      lg.rect(228, 382, 16, 6, "d4");
      for (let i = 0; i < 6; i++) {
        const yy = 378 - i * 7;
        lg.px(236 + Math.round(Math.sin(t * 2 + i) * 2), yy, "w8");
      }
      // lantern
      lg.rect(134, 0, 2, 56, "k3");
      lg.poly([126, 60, 144, 60, 140, 56, 130, 56], "d3");
      lg.rect(127, 60, 16, 22, "d3");
      lg.rect(129, 62, 12, 18, "l2");
      lg.poly([126, 82, 144, 82, 135, 90], "d3");
    },
    (lg) => {
      lg.glow(135, 72, 220, "#ffc183", 0.42, "source-atop");
      lg.glow(0, 480, 160, "#000000", 0.4, "source-atop");
      lg.glow(270, 480, 160, "#000000", 0.4, "source-atop");
    },
  );
  g.glow(135, 72, 26, "#ffb46a", 0.5);

  // ---------- the two women (mother-in-law faces right, bride faces left)
  g.flipX(80, () =>
    drawWoman(g, 80, 274, { expr: o.grandmaExpr ?? "tender", pose: "hold", look: "abaya", glasses: true, old: true }),
  );
  drawWoman(g, 196, 274, { expr: o.brideExpr ?? "happy", pose: "hold", look: "bride", blink: false });

  // ---------- the gift: a brand-new pot with a red ribbon, held between them
  const px = 138;
  const py = 344;
  g.rect(px - 28, py, 56, 34, "m3");
  g.rect(px - 26, py + 2, 8, 30, "m4");
  g.rect(px + 16, py + 2, 10, 30, "m2");
  g.rect(px - 38, py + 6, 8, 4, "m2"); // handles
  g.rect(px + 30, py + 6, 8, 4, "m2");
  g.ellipse(px, py - 1, 32, 3, "m4");
  g.ellipse(px, py - 1, 27, 2, "m1");
  g.rect(px - 2, py - 3, 4, 37, "r3"); // ribbon
  g.rect(px - 28, py + 14, 56, 4, "r3");
  g.poly([px, py - 4, px - 9, py - 11, px - 7, py - 2], "r3");
  g.poly([px, py - 4, px + 9, py - 11, px + 7, py - 2], "r3");
  // hands on the handles
  g.circle(px - 32, py + 8, 5, "s3");
  g.circle(px + 32, py + 8, 5, "s3");
  // a twinkle on the new pot
  if (Math.floor(t * 4) % 3 === 0) {
    g.rect(px - 18, py + 8, 5, 1, "white");
    g.rect(px - 16, py + 6, 1, 5, "white");
  }

  // ---------- old-film grade
  const flick = (rnd(Math.floor(frame / 2)) - 0.5) * 0.08;
  sepia(g, 0.85, flick);
  // film vignette + dust specks
  for (let i = 0; i < 6; i++) {
    const sx = rnd(frame * 7 + i) * 270;
    const sy = rnd(frame * 13 + i) * 480;
    g.px(sx, sy, rnd(i + frame) > 0.5 ? "w9" : "k1");
  }
  if (rnd(frame) > 0.6) g.rect(Math.floor(rnd(frame + 3) * 270), 0, 1, 480, "w6");
  g.vgrad(0, 0, 270, 80, [
    [0, "rgba(20,12,8,0.7)"],
    [1, "rgba(20,12,8,0)"],
  ]);
  g.vgrad(0, 400, 270, 80, [
    [0, "rgba(20,12,8,0)"],
    [1, "rgba(20,12,8,0.7)"],
  ]);
};
