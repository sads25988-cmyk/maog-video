import { Gfx, PColor } from "../engine";

export type PxExpr = "shock" | "worried" | "happy" | "calm" | "proud" | "sad" | "tender";
export type PxPose = "panic" | "stand" | "scrub" | "present" | "sit" | "hold" | "reach";
export type Look = "red" | "abaya" | "bride";

type Pt = [number, number];

const LOOKS: Record<Look, { R: PColor; RD: PColor; RL: PColor; plk: PColor; trim: PColor; S: PColor; S2: PColor }> = {
  red: { R: "r2", RD: "r1", RL: "r3", plk: "r0", trim: "l0", S: "cloth1", S2: "cloth2" },
  abaya: { R: "k2", RD: "k1", RL: "k3", plk: "k1", trim: "k4", S: "k1", S2: "k3" },
  bride: { R: "m4", RD: "m3", RL: "white", plk: "m3", trim: "y2", S: "white", S2: "m3" },
};

export type WomanOpts = {
  expr: PxExpr;
  pose: PxPose;
  look?: Look;
  blink?: boolean;
  glasses?: boolean;
  old?: boolean;
  item?: (hx: number, hy: number) => void; // drawn at the near hand
  bob?: number; // vertical body offset (breathing / sobbing)
};

/**
 * A woman sprite (~66×195 px on the 270×480 canvas). (x, y) = centre of her head.
 * Faces 3/4 to the viewer's left — wrap in g.flipX() to face right.
 */
export const drawWoman = (g: Gfx, x: number, y: number, o: WomanOpts) => {
  const { expr, pose, look = "red", blink = false, glasses, old, item, bob = 0 } = o;
  const L = LOOKS[look];
  const X = (dx: number) => x + dx;
  const Y = (dy: number) => y + dy + bob;

  // ---------- body
  if (pose === "sit") {
    // sitting on the floor, dress spread around folded legs
    g.poly([X(-22), Y(40), X(24), Y(40), X(34), Y(64), X(54), Y(94), X(48), Y(104), X(-54), Y(104), X(-60), Y(94), X(-34), Y(64)], L.R);
    g.poly([X(18), Y(46), X(26), Y(46), X(54), Y(94), X(48), Y(104), X(34), Y(104)], L.RD);
    g.line(X(-40), Y(80), X(-50), Y(100), L.RL, 2);
    for (let i = -52; i < 48; i += 4) g.px(X(i), Y(100), L.trim);
    g.rect(X(-62), Y(100), 12, 4, "k3"); // slipper peeking out
  } else {
    g.poly(
      [X(-22), Y(40), X(24), Y(40), X(34), Y(70), X(38), Y(120), X(42), Y(172), X(-40), Y(172), X(-36), Y(120), X(-32), Y(70)],
      L.R,
    );
    g.poly([X(18), Y(46), X(26), Y(46), X(42), Y(172), X(28), Y(172)], L.RD);
    g.poly([X(-30), Y(72), X(-24), Y(72), X(-32), Y(172), X(-38), Y(172)], L.RL);
    g.line(X(-8), Y(100), X(-12), Y(170), L.RD, 2);
    g.line(X(8), Y(110), X(10), Y(170), L.RD, 1);
    g.rect(X(-2), Y(46), 4, 80, L.plk);
    for (let i = 0; i < 13; i++) g.px(X(-1 + (i % 2)), Y(50 + i * 6), L.trim);
    for (let i = -38; i < 40; i += 4) g.px(X(i), Y(167), L.trim);
    g.rect(X(-26), Y(172), 14, 3, "k3");
    g.rect(X(8), Y(172), 14, 3, "k3");
  }

  // ---------- head-scarf
  g.poly([X(-22), Y(4), X(22), Y(4), X(30), Y(44), X(18), Y(52), X(-18), Y(52), X(-30), Y(44)], L.S);
  g.circle(X(0), Y(0), 24, L.S);
  g.line(X(-16), Y(-10), X(-10), Y(-18), L.S2, 1);
  g.line(X(19), Y(16), X(26), Y(42), L.S2, 1);
  g.line(X(-22), Y(24), X(-26), Y(42), L.S2, 1);
  if (look === "bride") {
    // pearl circlet
    for (let i = -14; i <= 10; i += 3) g.px(X(i), Y(-17), "y2");
  }

  // ---------- face
  const sad = expr === "sad";
  const hy = sad ? 3 : 0; // head bows when sad
  g.ellipse(X(-4), Y(3 + hy), 14, 16, "s3");
  g.rect(X(7), Y(-8 + hy), 3, 22, "s2");
  g.ellipse(X(-4), Y(-12 + hy), 15, 3, L.S);
  g.rect(X(-8), Y(3 + hy), 1, 4, "s2");
  g.px(X(-9), Y(6 + hy), "s2");
  if (old) {
    g.px(X(-15), Y(1 + hy), "s1");
    g.px(X(-14), Y(2 + hy), "s1");
    g.px(X(2), Y(1 + hy), "s1");
    g.px(X(1), Y(2 + hy), "s1");
    g.line(X(-10), Y(9 + hy), X(-12), Y(12 + hy), "s2");
    g.line(X(-2), Y(9 + hy), X(0), Y(12 + hy), "s2");
  }

  const eye = (ex: number) => {
    const ey = hy;
    if (blink || expr === "happy" || expr === "proud" || expr === "tender") {
      g.rect(X(ex - 1), Y(-1 + ey), 3, 1, "k0");
      g.px(X(ex - 2), Y(0 + ey), "k0");
      g.px(X(ex + 2), Y(0 + ey), "k0");
      return;
    }
    if (sad) {
      g.rect(X(ex - 1), Y(1 + ey), 3, 1, "k0");
      g.px(X(ex - 2), Y(0 + ey), "k0");
      g.px(X(ex + 2), Y(0 + ey), "k0");
      return;
    }
    if (expr === "shock") {
      g.rect(X(ex - 1), Y(-3), 3, 5, "white");
      g.rect(X(ex), Y(-1), 1, 2, "k0");
    } else if (expr === "worried") {
      g.rect(X(ex - 1), Y(-2), 3, 4, "white");
      g.rect(X(ex - 1), Y(0), 2, 2, "k0");
    } else {
      g.rect(X(ex - 1), Y(-2), 3, 3, "white");
      g.rect(X(ex - 1), Y(-1), 2, 2, "k0");
    }
  };
  eye(-11);
  eye(-2);
  if (glasses) {
    g.rect(X(-14), Y(-4 + hy), 7, 1, "y0");
    g.rect(X(-5), Y(-4 + hy), 7, 1, "y0");
    g.rect(X(-14), Y(2 + hy), 7, 1, "y0");
    g.rect(X(-5), Y(2 + hy), 7, 1, "y0");
    g.rect(X(-14), Y(-4 + hy), 1, 7, "y0");
    g.rect(X(-8), Y(-4 + hy), 1, 7, "y0");
    g.rect(X(-5), Y(-4 + hy), 1, 7, "y0");
    g.rect(X(1), Y(-4 + hy), 1, 7, "y0");
    g.rect(X(-7), Y(-2 + hy), 2, 1, "y0");
  }
  // brows
  const by = hy;
  if (expr === "shock") {
    g.rect(X(-13), Y(-7), 4, 1, "k0");
    g.rect(X(-4), Y(-7), 4, 1, "k0");
    g.px(X(-13), Y(-6), "k0");
    g.px(X(-1), Y(-6), "k0");
  } else if (expr === "worried" || sad) {
    g.line(X(-13), Y(-4 + by), X(-10), Y(-6 + by), "k0");
    g.line(X(-4), Y(-6 + by), X(-1), Y(-4 + by), "k0");
  } else if (!glasses) {
    g.rect(X(-13), Y(-6 + by), 4, 1, "k0");
    g.rect(X(-4), Y(-6 + by), 4, 1, "k0");
  } else {
    g.rect(X(-13), Y(-7 + by), 4, 1, old ? "m2" : "k0");
    g.rect(X(-4), Y(-7 + by), 4, 1, old ? "m2" : "k0");
  }
  // cheeks + mouth
  const blushC: PColor = expr === "happy" || expr === "tender" || look === "bride" ? "r4" : "r4";
  g.rect(X(-15), Y(5 + hy), 2, 1, blushC);
  g.rect(X(0), Y(5 + hy), 2, 1, blushC);
  if (expr === "shock") g.rect(X(-7), Y(9), 3, 4, "r0");
  else if (expr === "worried" || sad) {
    g.rect(X(-8), Y(11 + hy), 4, 1, "r0");
    g.px(X(-9), Y(12 + hy), "r0");
    g.px(X(-4), Y(12 + hy), "r0");
  } else if (expr === "happy" || expr === "proud" || expr === "tender") {
    g.rect(X(-9), Y(10), 5, 1, "r0");
    g.px(X(-10), Y(9), "r0");
    g.px(X(-4), Y(9), "r0");
  } else g.rect(X(-8), Y(11), 3, 1, "r0");

  // ---------- arms
  const arm = (sh: Pt, el: Pt, hd: Pt) => {
    const [sx, sy] = [X(sh[0]), Y(sh[1])];
    const [ex, ey] = [X(el[0]), Y(el[1])];
    const [hx, hyy] = [X(hd[0]), Y(hd[1])];
    g.line(sx, sy, ex, ey, L.RD, 10);
    g.line(ex, ey, hx, hyy, L.RD, 10);
    g.line(sx, sy, ex, ey, L.R, 8);
    g.line(ex, ey, hx, hyy, L.R, 8);
    const cx = hx + (ex - hx) * 0.16;
    const cy = hyy + (ey - hyy) * 0.16;
    g.line(cx, cy, cx + (ex - hx) * 0.06, cy + (ey - hyy) * 0.06, L.plk, 8);
    g.px(cx, cy, L.trim);
    g.circle(hx, hyy, 5, "s3");
    g.rect(hx + 2, hyy + 1, 2, 3, "s2");
    return [hx, hyy] as Pt;
  };

  let near: Pt;
  switch (pose) {
    case "panic":
      arm([18, 46], [24, 70], [9, 12]);
      near = arm([-20, 46], [-30, 70], [-19, 11]);
      break;
    case "sit":
      arm([18, 46], [22, 72], [2, 86]);
      near = arm([-20, 46], [-26, 72], [-12, 88]);
      break;
    case "hold":
      arm([18, 46], [28, 78], [-20, 84]);
      near = arm([-20, 46], [-34, 76], [-52, 84]);
      break;
    case "present":
      arm([18, 46], [26, 80], [10, 92]);
      near = arm([-22, 46], [-40, 64], [-48, 36]);
      break;
    case "reach":
      arm([18, 46], [26, 82], [20, 110]);
      near = arm([-22, 46], [-44, 62], [-74, 58]);
      break;
    case "scrub":
      arm([20, 46], [24, 84], [6, 96]);
      near = arm([-22, 46], [-38, 76], [-58, 92]);
      break;
    default:
      arm([20, 46], [28, 84], [22, 112]);
      near = arm([-22, 46], [-30, 84], [-26, 112]);
  }
  item?.(near[0], near[1]);
};

/** Back-compat wrapper used by the style frames. */
export const drawUmmFahad = (
  g: Gfx,
  x: number,
  y: number,
  expr: PxExpr,
  pose: PxPose,
  blink = false,
  item?: (hx: number, hy: number) => void,
) => drawWoman(g, x, y, { expr, pose, blink, item, look: "red" });

/** Fahad (~10 y/o) in a white thobe. (x, y) = centre of head. Faces 3/4 left. */
export const drawFahad = (
  g: Gfx,
  x: number,
  y: number,
  o: { expr: "excited" | "smile" | "worried"; pose: "run" | "offer" | "stand"; step?: number; item?: (hx: number, hy: number) => void },
) => {
  const X = (dx: number) => x + dx;
  const Y = (dy: number) => y + dy;
  const step = o.step ?? 0;
  // legs / feet (under thobe)
  if (o.pose === "run") {
    const a = step % 2 === 0 ? 1 : -1;
    g.rect(X(-10 + a * 8), Y(98), 5, 8, "s2");
    g.rect(X(4 - a * 8), Y(98), 5, 8, "s2");
    g.rect(X(-12 + a * 8), Y(104), 9, 3, "k3");
    g.rect(X(2 - a * 8), Y(104), 9, 3, "k3");
  } else {
    g.rect(X(-10), Y(98), 5, 8, "s2");
    g.rect(X(5), Y(98), 5, 8, "s2");
    g.rect(X(-12), Y(104), 9, 3, "k3");
    g.rect(X(4), Y(104), 9, 3, "k3");
  }
  // thobe
  g.poly([X(-15), Y(20), X(15), Y(20), X(20), Y(60), X(22), Y(100), X(-22), Y(100), X(-20), Y(60)], "m4");
  g.poly([X(10), Y(22), X(15), Y(20), X(22), Y(100), X(14), Y(100)], "m3");
  g.rect(X(-1), Y(22), 2, 22, "m3");
  g.px(X(0), Y(26), "m2");
  g.px(X(0), Y(32), "m2");
  // head
  g.circle(X(0), Y(0), 16, "s3");
  g.rect(X(6), Y(-8), 4, 18, "s2");
  // hair
  g.ellipse(X(0), Y(-9), 16, 9, "k1");
  g.rect(X(-16), Y(-10), 6, 6, "k1");
  g.rect(X(8), Y(-10), 9, 10, "k1");
  // ear
  g.rect(X(8), Y(0), 3, 5, "s2");
  // eyes
  if (o.expr === "smile") {
    g.rect(X(-11), Y(0), 3, 1, "k0");
    g.rect(X(-3), Y(0), 3, 1, "k0");
  } else {
    g.rect(X(-11), Y(-2), 3, 4, "white");
    g.rect(X(-3), Y(-2), 3, 4, "white");
    g.rect(X(-11), Y(-1), 2, 2, "k0");
    g.rect(X(-3), Y(-1), 2, 2, "k0");
  }
  g.rect(X(-12), Y(-5), 4, 1, "k0");
  g.rect(X(-4), Y(-5), 4, 1, "k0");
  g.rect(X(-14), Y(4), 2, 1, "r4");
  // mouth
  if (o.expr === "excited") g.rect(X(-8), Y(7), 4, 3, "r0");
  else if (o.expr === "smile") {
    g.rect(X(-9), Y(7), 5, 1, "r0");
    g.px(X(-10), Y(6), "r0");
  } else g.rect(X(-8), Y(8), 3, 1, "r0");
  // arms
  const arm = (sh: Pt, hd: Pt) => {
    g.line(X(sh[0]), Y(sh[1]), X(hd[0]), Y(hd[1]), "m2", 8);
    g.line(X(sh[0]), Y(sh[1]), X(hd[0]), Y(hd[1]), "m4", 6);
    g.circle(X(hd[0]), Y(hd[1]), 4, "s3");
    return [X(hd[0]), Y(hd[1])] as Pt;
  };
  let near: Pt;
  if (o.pose === "run") {
    arm([12, 26], [22 - (step % 2) * 8, 52]);
    near = arm([-12, 26], [-30, -4]); // holding the sponge up high
  } else if (o.pose === "offer") {
    arm([12, 26], [16, 56]);
    near = arm([-12, 26], [-40, 34]);
  } else {
    arm([12, 26], [16, 56]);
    near = arm([-12, 26], [-16, 56]);
  }
  o.item?.(near[0], near[1]);
};
