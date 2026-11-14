import { Gfx, layer, rnd } from "../engine";
import { drawUmmFahad, PxExpr, PxPose } from "./ummFahad";

export type KitchenOpts = {
  burning?: boolean;
  expr?: PxExpr;
  pose?: PxPose;
  smoke?: number; // 0..1
  hideCharacter?: boolean;
  hidePot?: boolean;
};

const WARM = "#ffc183";

export const drawKitchen = (g: Gfx, frame: number, o: KitchenOpts = {}) => {
  const t = frame / 30;
  const { burning = true, expr = "shock", pose = "panic", smoke = 1, hideCharacter, hidePot } = o;

  layer(
    g,
    (lg) => {
      // ---------- walls / ceiling
      lg.rect(0, 0, 270, 480, "w2");
      lg.rect(0, 0, 270, 34, "k2");
      lg.rect(0, 34, 270, 3, "w1");
      // backsplash tiles
      lg.rect(0, 226, 270, 74, "w4");
      for (let y = 226; y < 300; y += 8) {
        lg.rect(0, y, 270, 1, "w3");
        for (let x = (y / 8) % 2 === 0 ? 0 : 4; x < 270; x += 8) lg.rect(x, y, 1, 8, "w3");
      }
      // a band of patterned tiles
      for (let x = 2; x < 270; x += 16) {
        lg.rect(x + 3, 260, 4, 4, "d3");
        lg.px(x + 4, 261, "w6");
      }

      // ---------- window (night outside)
      lg.rect(14, 104, 86, 110, "d1");
      lg.vgrad(20, 110, 74, 98, [
        [0, "sky1"],
        [1, "sky4"],
      ]);
      lg.circle(76, 130, 4, "moon");
      lg.circle(78, 128, 4, "sky2");
      for (let i = 0; i < 10; i++) lg.px(22 + rnd(i + 5) * 70, 112 + rnd(i + 50) * 40, "star");
      // neighbour wall + palm silhouette through the window
      lg.rect(20, 180, 74, 28, "c0");
      lg.rect(58, 150, 3, 40, "g0");
      for (const [dx, dy] of [
        [-14, 8],
        [-10, -6],
        [4, -10],
        [14, -4],
        [16, 8],
      ])
        lg.curve(59, 150, 59 + dx / 2, 146, 59 + dx, 150 + dy, "g0", 2);
      lg.rect(55, 110, 3, 98, "d1");
      lg.rect(20, 158, 74, 2, "d1");
      lg.rect(10, 212, 94, 6, "d2");

      // ---------- upper cabinets
      lg.rect(176, 52, 94, 120, "d3");
      lg.rect(176, 52, 94, 4, "d4");
      for (const cx of [180, 226]) {
        lg.rect(cx, 60, 42, 106, "d2");
        lg.rect(cx + 3, 63, 36, 100, "d3");
      }
      lg.rect(216, 104, 2, 12, "m3");
      lg.rect(230, 104, 2, 12, "m3");
      lg.rect(176, 172, 94, 3, "d1");

      // ---------- counter + lower cabinets
      lg.rect(0, 300, 270, 10, "w7");
      lg.rect(0, 300, 270, 2, "w8");
      lg.rect(0, 310, 270, 112, "d2");
      for (const cx of [4, 70, 136, 202]) {
        lg.rect(cx, 318, 62, 98, "d1");
        lg.rect(cx + 3, 321, 56, 92, "d2");
        lg.rect(cx + 28, 330, 6, 2, "m2");
      }
      // floor
      lg.rect(0, 422, 270, 58, "k4");
      for (let x = 0; x < 270; x += 18) lg.rect(x, 422, 1, 58, "k3");
      for (let y = 422; y < 480; y += 12) lg.rect(0, y, 270, 1, "k3");

      // ---------- counter props: tray waiting for the kabsa, dallah, spices
      lg.ellipse(46, 297, 30, 4, "d4");
      lg.ellipse(46, 296, 26, 3, "w8");
      lg.rect(190, 284, 6, 16, "r2");
      lg.rect(198, 288, 6, 12, "y0");
      lg.rect(206, 286, 6, 14, "g3");
      // dallah
      lg.poly([232, 300, 250, 300, 248, 282, 244, 274, 238, 274, 234, 282], "d4");
      lg.line(234, 280, 224, 270, "d4", 2);
      lg.rect(239, 268, 4, 6, "d4");

      // ---------- stove + the pot
      lg.rect(92, 296, 78, 6, "k2");
      // flame
      for (let i = 0; i < 9; i++) {
        const fh = 2 + Math.round((Math.sin(t * 18 + i * 1.7) + 1) * 1.5);
        lg.rect(104 + i * 6, 296 - fh, 2, fh, i % 2 ? "f1" : "f0");
      }
      if (!hidePot) {
      // pot body
      lg.rect(102, 246, 56, 48, "m2");
      lg.rect(104, 248, 8, 44, "m4");
      lg.rect(146, 248, 10, 44, "m1");
      lg.rect(98, 244, 64, 5, "m3");
      lg.rect(94, 254, 8, 4, "m1");
      lg.rect(158, 254, 8, 4, "m1");
      if (burning) {
        // scorched bottom ring
        lg.rect(102, 284, 56, 10, "k1");
        lg.rect(104, 282, 6, 2, "k2");
        lg.rect(140, 281, 10, 3, "k2");
      }
      }
    },
    (lg) => {
      // pendant lamp light on everything in the room
      lg.glow(150, 150, 210, WARM, 0.38, "source-atop");
      // moonlight through the window
      lg.glow(57, 240, 80, "#7aa6c8", 0.18, "source-atop", 50);
      // darker corners
      lg.glow(0, 480, 200, "#000000", 0.35, "source-atop");
      lg.glow(270, 480, 120, "#000000", 0.45, "source-atop");
    },
  );

  // ---------- Umm Fahad
  if (!hideCharacter) drawUmmFahad(g, 214, 278, expr, pose, Math.floor(t * 30) % 90 < 4);

  // ---------- smoke from the pot: soft clustered puffs (alpha → dithered texture)
  if (smoke > 0) {
    const puffs = 22;
    for (let i = 0; i < puffs; i++) {
      const p = ((t * 0.3 + i / puffs) % 1) * smoke;
      const py = 244 - p * 190;
      const px = 130 + Math.sin(i * 2.3 + t * 1.2) * (4 + p * 34) + p * 10;
      const r = 3 + Math.round(p * 12);
      const a = 0.85 - p * 0.45;
      g.with(
        () => {
          g.circle(px, py, r, "#47444c");
          g.circle(px + r * 0.6, py + 2, Math.round(r * 0.7), "#47444c");
        },
        { alpha: a * 0.42 },
      );
    }
    // haze collecting under the ceiling
    g.with(() => g.vgrad(40, 34, 200, 60, [[0, "#2e2c33"], [1, "rgba(46,44,51,0)"]]), { alpha: 0.7 * smoke });
  }
  // ---------- pendant lamp (in front of the wall)
  g.rect(149, 0, 2, 120, "k3");
  g.poly([136, 132, 164, 132, 158, 120, 142, 120], "d3");
  g.rect(136, 131, 28, 2, "d4");
  g.rect(146, 133, 8, 3, "l3");
  g.glow(150, 136, 40, "#ffb46a", 0.4);
  g.glow(150, 136, 10, "#fff0c0", 0.8);

  // vignette
  g.vgrad(0, 0, 270, 60, [
    [0, "rgba(4,4,8,0.6)"],
    [1, "rgba(4,4,8,0)"],
  ]);
};
