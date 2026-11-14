import { Gfx, layer } from "../engine";
import { drawKitchen } from "./kitchen";

/** Product hero: the rescued pot shining under the lamp, Moaj sponge standing on its rim. */
export const drawHero = (g: Gfx, frame: number) => {
  const t = frame / 30;
  // background: the same kitchen, empty and calm, pushed back into shadow
  drawKitchen(g, frame, { burning: false, smoke: 0, hideCharacter: true, hidePot: true });
  g.with(() => g.rect(0, 0, 270, 480, "#140f12"), { alpha: 0.55 });

  layer(
    g,
    (lg) => {
      // counter front (foreground)
      lg.rect(0, 372, 270, 12, "w7");
      lg.rect(0, 372, 270, 2, "w9");
      lg.rect(0, 384, 270, 96, "d1");
      // pot — big, clean, polished aluminium
      const px = 135;
      lg.ellipse(px, 372, 84, 6, "k1"); // contact shadow
      lg.poly([px - 74, 270, px + 74, 270, px + 70, 366, px - 70, 366], "m2");
      lg.rect(px - 66, 274, 14, 90, "m4"); // specular band
      lg.rect(px - 46, 276, 4, 86, "m3");
      lg.rect(px + 44, 274, 22, 90, "m1");
      lg.rect(px + 60, 274, 8, 90, "m0");
      lg.rect(px - 70, 356, 140, 10, "m1");
      // reflection of the lamp
      lg.rect(px - 22, 286, 4, 60, "m4");
      lg.rect(px - 22, 292, 4, 14, "white");
      // rim
      lg.ellipse(px, 270, 80, 9, "m4");
      lg.ellipse(px, 270, 72, 6, "m1");
      lg.ellipse(px, 271, 70, 5, "m0");
      // handles
      lg.rect(px - 92, 282, 18, 8, "m1");
      lg.rect(px + 74, 282, 18, 8, "m1");
      lg.rect(px - 92, 282, 18, 2, "m3");
      lg.rect(px + 74, 282, 18, 2, "m3");

    },
    (lg) => {
      lg.glow(150, 140, 230, "#ffc183", 0.4, "source-atop");
    },
  );

  // ---------- Moaj sponge standing on the rim (drawn after lighting so its colours stay true)
  const sx = 160;
  const sy = 196;
  const L = (x: number, y: number) => [sx + x, sy + y + Math.round(x * -0.08)];
  const quad = (pts: number[][], c: string) => g.poly(pts.flatMap(([x, y]) => L(x, y)), c);
  quad([[0, 0], [46, 0], [46, 74], [0, 74]], "b0"); // outline/back
  quad([[2, 2], [44, 2], [44, 72], [2, 72]], "b2"); // foam
  quad([[2, 52], [44, 52], [44, 72], [2, 72]], "b1"); // lower shade
  quad([[34, 2], [44, 2], [44, 72], [34, 72]], "b1"); // side shade
  // foam pores
  for (const [x, y] of [[10, 34], [22, 44], [30, 30], [14, 58], [28, 62], [38, 46]]) {
    const [qx, qy] = L(x, y);
    g.rect(qx, qy, 2, 2, "b0");
  }
  // white wave mark
  for (let x = 6; x < 40; x++) {
    const [qx, qy] = L(x, 50 + Math.round(Math.sin(x / 5) * 2));
    g.rect(qx, qy, 1, 2, "white");
  }
  // Italian wire layer on top (wavy seam)
  for (let x = 2; x < 44; x++) {
    const seam = 22 + Math.round(Math.sin(x / 6) * 3);
    const [qx, qy] = L(x, 2);
    g.rect(qx, qy, 1, seam, x % 3 === 0 ? "m2" : x % 3 === 1 ? "m3" : "m4");
    const [ex, ey] = L(x, 2 + seam);
    g.rect(ex, ey, 1, 1, "b0");
  }
  // gold glitter
  for (let i = 0; i < 22; i++) {
    const x = 4 + ((i * 37) % 38);
    const y = 4 + ((i * 23) % 16);
    const [qx, qy] = L(x, y);
    g.px(qx, qy, (Math.floor(t * 8) + i) % 4 === 0 ? "y2" : i % 2 ? "y1" : "y0");
  }
  g.glow(183, 205, 26, "#ffd27a", 0.3);

  // the lamp
  g.rect(149, 0, 2, 120, "k3");
  g.poly([136, 132, 164, 132, 158, 120, 142, 120], "d3");
  g.rect(146, 133, 8, 3, "l3");
  g.glow(150, 136, 46, "#ffb46a", 0.45);
  g.glow(150, 136, 10, "#fff0c0", 0.8);

  // twinkles on the pot and the glitter
  const tw = (x: number, y: number, s: number, c: string) => {
    g.rect(x - s, y, s * 2 + 1, 1, c);
    g.rect(x, y - s, 1, s * 2 + 1, c);
  };
  const k = Math.floor(t * 6) % 4;
  tw(116, 296, 3 + (k === 0 ? 1 : 0), "white");
  tw(196, 200, 3 + (k === 2 ? 1 : 0), "y2");
  tw(168, 208, 2 + (k === 1 ? 1 : 0), "white");
  tw(70, 266, 2, "white");
};
