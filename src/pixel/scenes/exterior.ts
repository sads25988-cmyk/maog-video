import { Gfx, layer, rnd } from "../engine";

const WARM = "#ffb46a";

const cloud = (g: Gfx, x: number, y: number, parts: [number, number, number][], lit: boolean) => {
  // highlight rim first (offset up), then body
  for (const [dx, dy, r] of parts) g.circle(x + dx, y + dy - 2, r, lit ? "sky7" : "sky5");
  for (const [dx, dy, r] of parts) g.circle(x + dx, y + dy, r, lit ? "sky4" : "sky3");
  for (const [dx, dy, r] of parts) g.rect(x + dx - r, y + dy + 1, r * 2, r - 1, "sky3");
};

const najdiCrenels = (g: Gfx, x0: number, x1: number, y: number, c: string) => {
  for (let x = x0; x + 6 <= x1; x += 9) g.poly([x, y, x + 6, y, x + 3, y - 5], c);
};

export const drawExterior = (g: Gfx, frame: number, o: { arrival?: number } = {}) => {
  const t = frame / 30;

  // ---------------- sky
  g.vgrad(0, 0, 270, 340, [
    [0, "sky0"],
    [0.35, "sky2"],
    [0.75, "sky4"],
    [1, "sky5"],
  ]);
  for (let i = 0; i < 70; i++) {
    const x = Math.floor(rnd(i) * 270);
    const y = Math.floor(rnd(i + 99) * 230);
    if (rnd(i + 7) > 0.75) g.px(x, y, "star");
    else g.px(x, y, "sky6");
  }
  // moon: crescent first, then halo over everything so the cut-out matches the sky
  g.circle(196, 96, 8, "moon");
  g.circle(200, 93, 7, "sky2");
  g.glow(196, 96, 70, "sky6", 0.5);
  g.glow(196, 96, 30, "sky8", 0.45);

  // clouds (slow drift)
  const drift = Math.round(t * 1.5);
  cloud(g, 150 + drift, 132, [[0, 0, 9], [12, -5, 12], [27, -2, 10], [40, 2, 8], [-12, 3, 7]], true);
  cloud(g, 222 + drift, 118, [[0, 0, 7], [11, -4, 9], [24, 0, 7]], true);
  cloud(g, -10 + drift, 176, [[0, 0, 10], [16, -6, 13], [34, -2, 10], [50, 2, 8], [64, 4, 6]], false);
  cloud(g, 40 + drift, 214, [[0, 0, 6], [10, -3, 8], [22, 0, 6]], false);

  // ---------------- distant skyline
  g.rect(0, 268, 34, 72, "c0");
  g.rect(8, 256, 18, 14, "c0");
  g.rect(232, 262, 38, 80, "c0");
  g.px(14, 276, "l0");
  g.px(15, 276, "l0");
  g.px(244, 280, "l1");
  g.px(252, 290, "l0");

  // ---------------- lighting pass
  layer(
    g,
    (lg) => {
      // ---------------- house (upper floor + roof)
      // roof stair tower
      lg.rect(142, 186, 34, 22, "w1");
      najdiCrenels(g, 143, 176, 186, "w2");
      lg.rect(150, 192, 8, 12, "k2");
      // parapet + crenellations
      lg.rect(28, 206, 156, 9, "w3");
      lg.rect(28, 214, 156, 2, "w1");
      najdiCrenels(g, 29, 184, 206, "w3");
      // facade
      lg.rect(32, 216, 148, 90, "w2");
      lg.rect(180, 210, 10, 96, "w1"); // side return (shadow)
      lg.rect(32, 216, 148, 3, "w1"); // soffit shadow
      // decorative band
      lg.rect(32, 226, 148, 2, "w3");
      for (let x = 36; x < 178; x += 8) lg.rect(x, 229, 4, 2, "w1");

      // window 1 (dark) + AC unit
      lg.rect(60, 238, 26, 36, "w0");
      lg.rect(62, 240, 22, 32, "c1");
      lg.rect(72, 240, 2, 32, "w0");
      lg.rect(63, 241, 3, 12, "c3");
      lg.rect(40, 246, 16, 13, "k6");
      lg.rect(41, 247, 14, 11, "k5");
      for (let y = 249; y < 257; y += 2) lg.rect(42, y, 12, 1, "k3");
      lg.rect(39, 259, 18, 2, "w1");

      // window 2 (dark)
      lg.rect(94, 238, 22, 36, "w0");
      lg.rect(96, 240, 18, 32, "c1");
      lg.rect(104, 240, 2, 32, "w0");
      lg.rect(97, 241, 3, 10, "c3");

      // kitchen window (lit, warm)
      lg.rect(124, 238, 26, 36, "w0");
      lg.rect(126, 240, 22, 32, "l1");
      lg.rect(126, 240, 22, 6, "l0");
      lg.rect(136, 240, 2, 32, "w0");
      // curtain folds
      lg.rect(126, 240, 4, 32, "l0");
      lg.rect(144, 240, 4, 32, "l0");
      // exhaust vent
      lg.rect(156, 246, 8, 8, "k3");
      for (let y = 247; y < 253; y += 2) lg.rect(157, y, 6, 1, "k1");

      // ---------------- palm (behind wall)
      for (let y = 222; y < 302; y += 3) {
        const sway = Math.round(Math.sin(y / 20) * 1);
        lg.rect(212 + sway, y, 6, 2, "d1");
        lg.rect(212 + sway, y + 2, 6, 1, "d0");
      }
      const fr = Math.sin(t * 1.2) * 1.5;
      const fronds: [number, number, number, number][] = [
        [214, 222, 176, 236 + fr],
        [214, 222, 186, 206 + fr],
        [214, 222, 202, 192],
        [214, 222, 230, 190],
        [214, 222, 250, 206 - fr],
        [214, 222, 256, 236 - fr],
        [214, 222, 240, 246],
        [214, 222, 188, 248],
      ];
      for (const [x0, y0, x1, y1] of fronds) {
        const cx = (x0 + x1) / 2;
        const cy = Math.min(y0, y1) - 12;
        const dir = x1 > x0 ? 1 : -1;
        // leaflets hanging from the rib (both sides)
        for (let s = 0.15; s < 1; s += 0.07) {
          const x = (1 - s) * (1 - s) * x0 + 2 * (1 - s) * s * cx + s * s * x1;
          const y = (1 - s) * (1 - s) * y0 + 2 * (1 - s) * s * cy + s * s * y1;
          const len = 4 + Math.sin(s * Math.PI) * 6;
          lg.line(x, y, x + dir * 2, y + len, "g1", 2);
          lg.line(x, y, x - dir * 1, y + len * 0.7, "g2", 1);
        }
        lg.curve(x0, y0, cx, cy, x1, y1, "g2", 2);
        lg.curve(x0, y0 - 1, cx, cy - 1, x1, y1 - 1, dir > 0 ? "g4" : "g3", 1);
      }
      lg.circle(214, 222, 4, "d2");

      // ---------------- smoke from the kitchen vent
      // thin wisp of smoke from the kitchen vent (the first hint)
      const puffs: [number, number, number][] = [
        [165, 245, 2],
        [168, 239, 2],
        [170, 232, 3],
        [173, 224, 3],
        [175, 216, 4],
      ];
      puffs.forEach(([x, y, r], i) => {
        const dx = Math.round(Math.sin(t * 2.4 + i * 1.3) * 1.2);
        lg.circle(x + dx, y, r, i > 2 ? "k4" : "k5");
        lg.circle(x + dx + 1, y + 1, Math.max(1, r - 1), i > 2 ? "k3" : "k4");
      });

      // ---------------- boundary wall
      lg.rect(0, 300, 270, 94, "w2");
      lg.rect(0, 296, 270, 5, "w4");
      lg.rect(0, 301, 270, 2, "w1");
      for (const x of [0, 100, 186, 262]) {
        lg.rect(x, 290, 10, 104, "w3");
        lg.rect(x - 1, 288, 12, 4, "w5");
      }
      // gate
      lg.rect(42, 318, 46, 76, "k1");
      lg.rect(45, 321, 19, 73, "k3");
      lg.rect(66, 321, 19, 73, "k3");
      for (let x = 47; x < 63; x += 3) lg.rect(x, 330, 1, 34, "k1");
      for (let x = 68; x < 84; x += 3) lg.rect(x, 330, 1, 34, "k1");
      lg.rect(45, 328, 40, 2, "k4");
      lg.rect(45, 366, 40, 2, "k4");
      lg.rect(61, 350, 2, 6, "m1");
      lg.rect(67, 350, 2, 6, "m1");
      // gate lamp
      lg.rect(62, 310, 6, 5, "k4");
      lg.rect(63, 313, 4, 3, "l3");
      // house number
      lg.rect(92, 330, 8, 6, "w6");
      // cat on the wall
      lg.rect(118, 288, 7, 8, "k0");
      lg.rect(117, 285, 3, 4, "k0");
      lg.rect(123, 285, 3, 4, "k0");
      lg.rect(116, 293, 2, 3, "k0");
      lg.px(119, 289, "y1");
      lg.px(123, 289, "y1");
      lg.line(125, 295, 129, 298, "k0", 1);

      // ---------------- street lamp
      lg.rect(252, 238, 3, 156, "k3");
      lg.rect(250, 386, 7, 8, "k2");
      lg.curve(253, 240, 252, 230, 240, 232, "k3", 2);
      lg.rect(232, 232, 12, 4, "k4");
      lg.rect(234, 236, 8, 2, "l3");

      // ---------------- sidewalk + street
      lg.rect(0, 394, 270, 6, "k5");
      lg.rect(0, 394, 270, 1, "k6");
      lg.rect(0, 400, 270, 80, "k2");
      for (let i = 0; i < 90; i++) lg.px(rnd(i + 300) * 270, 402 + rnd(i + 400) * 78, rnd(i) > 0.5 ? "k3" : "k1");
      lg.ellipse(70, 462, 16, 3, "k1");

      // ---------------- parked car (white sedan, facing left)
      const cy = 404;
      lg.ellipse(170, cy + 44, 58, 4, "k0"); // shadow
      // body
      lg.poly([112, cy + 26, 118, cy + 18, 140, cy + 16, 152, cy + 2, 198, cy + 2, 210, cy + 16, 224, cy + 18, 228, cy + 26, 228, cy + 38, 112, cy + 38], "m2");
      lg.rect(112, cy + 26, 116, 3, "m3");
      lg.rect(112, cy + 34, 116, 4, "m1");
      // windows
      lg.poly([155, cy + 5, 174, cy + 5, 174, cy + 16, 145, cy + 16], "c1");
      lg.poly([178, cy + 5, 196, cy + 5, 206, cy + 16, 178, cy + 16], "c1");
      lg.line(158, cy + 7, 152, cy + 14, "c3", 1);
      // door lines + handle
      lg.rect(176, cy + 17, 1, 18, "m1");
      lg.rect(166, cy + 21, 4, 1, "m0");
      lg.rect(190, cy + 21, 4, 1, "m0");
      // lights
      lg.rect(112, cy + 24, 4, 4, "y2");
      lg.rect(225, cy + 24, 3, 4, "r3");
      // wheels
      for (const wx of [134, 206]) {
        lg.circle(wx, cy + 38, 9, "k1");
        lg.circle(wx, cy + 38, 4, "m1");
        lg.px(wx, cy + 38, "k2");
      }


      // ---------------- arriving SUV (the mother-in-law), facing right
      if (o.arrival !== undefined) {
        const ease = 1 - Math.pow(1 - Math.min(1, o.arrival), 3);
        const x0 = -130 + ease * 130;
        const by = 412;
        lg.ellipse(x0 + 52, by + 46, 58, 4, "k0");
        lg.poly([x0, by + 14, x0 + 14, by, x0 + 74, by, x0 + 86, by + 14, x0 + 104, by + 18, x0 + 106, by + 40, x0, by + 40], "k3");
        lg.rect(x0, by + 26, 106, 2, "m2"); // chrome line
        lg.rect(x0 + 18, by + 4, 26, 11, "c1");
        lg.rect(x0 + 48, by + 4, 24, 11, "c1");
        lg.rect(x0 + 22, by + 5, 3, 9, "c3");
        lg.rect(x0 + 101, by + 22, 5, 4, "l3"); // headlight
        lg.rect(x0, by + 22, 3, 4, "r3"); // tail light
        for (const wx of [x0 + 22, x0 + 84]) {
          lg.circle(wx, by + 40, 10, "k1");
          lg.circle(wx, by + 40, 5, "m1");
        }
      }

    },
    (lg) => {
      // light only touches surfaces (walls, palm, street, car) — not the sky
      lg.glow(238, 262, 140, "#ffc183", 0.42, "source-atop");
      lg.glow(238, 420, 100, "#ffc183", 0.3, "source-atop", 30);
      lg.glow(65, 322, 46, "#ffc183", 0.45, "source-atop");
      lg.glow(137, 258, 26, "#ffc183", 0.25, "source-atop");
    },
  );
  // halos in the air (small)
  g.glow(238, 236, 34, WARM, 0.45);
  g.glow(238, 236, 10, "#fff0c0", 0.8);
  g.glow(65, 313, 16, WARM, 0.5);
  g.glow(65, 313, 5, "#fff0c0", 0.7);
  if (o.arrival !== undefined) {
    const ease = 1 - Math.pow(1 - Math.min(1, o.arrival), 3);
    const hx = -130 + ease * 130 + 106;
    g.with(
      () => {
        g.ctx.globalCompositeOperation = "lighter";
        const grd = g.ctx.createLinearGradient(hx, 0, hx + 170, 0);
        grd.addColorStop(0, "rgba(255,236,190,0.55)");
        grd.addColorStop(1, "rgba(255,236,190,0)");
        g.ctx.fillStyle = grd;
        g.ctx.beginPath();
        g.ctx.moveTo(hx, 434);
        g.ctx.lineTo(hx + 180, 404);
        g.ctx.lineTo(hx + 180, 476);
        g.ctx.closePath();
        g.ctx.fill();
      },
      {},
    );
    g.glow(hx, 436, 14, "#fff2cf", 0.8);
    // light sweeping across the wall
    g.glow(hx + 40, 360, 50, "#fff2cf", 0.18 * ease);
  }
  // top/bottom cinematic vignette
  g.vgrad(0, 0, 270, 70, [
    [0, "rgba(4,8,14,0.55)"],
    [1, "rgba(4,8,14,0)"],
  ]);
  g.vgrad(0, 440, 270, 40, [
    [0, "rgba(4,4,8,0)"],
    [1, "rgba(4,4,8,0.6)"],
  ]);
};
