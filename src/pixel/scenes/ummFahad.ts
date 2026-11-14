import { Gfx, PColor } from "../engine";

export type PxExpr = "shock" | "worried" | "happy" | "calm" | "proud";
export type PxPose = "panic" | "stand" | "scrub" | "present";

type Pt = [number, number];

/**
 * Umm Fahad as a pixel sprite (~66×195 px on the 270×480 canvas).
 * (x, y) = centre of her head. She faces 3/4 to the viewer's left.
 * `item` is drawn in the near hand (scene coords of that hand are passed in).
 */
export const drawUmmFahad = (
  g: Gfx,
  x: number,
  y: number,
  expr: PxExpr,
  pose: PxPose,
  blink = false,
  item?: (hx: number, hy: number) => void,
) => {
  const X = (dx: number) => x + dx;
  const Y = (dy: number) => y + dy;
  const S: PColor = "cloth1";
  const S2: PColor = "cloth2";
  const R: PColor = "r2";
  const RD: PColor = "r1";
  const RL: PColor = "r3";

  // ---------- darraa body (soft A-line)
  g.poly(
    [X(-22), Y(40), X(24), Y(40), X(34), Y(70), X(38), Y(120), X(42), Y(172), X(-40), Y(172), X(-36), Y(120), X(-32), Y(70)],
    R,
  );
  g.poly([X(18), Y(46), X(26), Y(46), X(42), Y(172), X(28), Y(172)], RD);
  g.poly([X(-30), Y(72), X(-24), Y(72), X(-32), Y(172), X(-38), Y(172)], RL);
  g.line(X(-8), Y(100), X(-12), Y(170), RD, 2);
  g.line(X(8), Y(110), X(10), Y(170), RD, 1);
  // embroidered placket + hem
  g.rect(X(-2), Y(46), 4, 80, "r0");
  for (let i = 0; i < 13; i++) g.px(X(-1 + (i % 2)), Y(50 + i * 6), "l0");
  for (let i = -38; i < 40; i += 4) g.px(X(i), Y(167), "l0");
  // slippers
  g.rect(X(-26), Y(172), 14, 3, "k3");
  g.rect(X(8), Y(172), 14, 3, "k3");

  // ---------- head-scarf: hood + drape
  g.poly([X(-22), Y(4), X(22), Y(4), X(30), Y(44), X(18), Y(52), X(-18), Y(52), X(-30), Y(44)], S);
  g.circle(X(0), Y(0), 24, S);
  g.line(X(-16), Y(-10), X(-10), Y(-18), S2, 1);
  g.line(X(19), Y(16), X(26), Y(42), S2, 1);
  g.line(X(-22), Y(24), X(-26), Y(42), S2, 1);

  // ---------- face (3/4 left)
  g.ellipse(X(-4), Y(3), 14, 16, "s3");
  g.rect(X(7), Y(-8), 3, 22, "s2");
  g.ellipse(X(-4), Y(-12), 15, 3, S); // hood rim over forehead
  g.rect(X(-8), Y(3), 1, 4, "s2"); // nose
  g.px(X(-9), Y(6), "s2");

  const eye = (ex: number) => {
    if (blink || expr === "happy" || expr === "proud") {
      g.rect(X(ex - 1), Y(-1), 3, 1, "k0");
      g.px(X(ex - 2), Y(0), "k0");
      g.px(X(ex + 2), Y(0), "k0");
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
  // brows
  if (expr === "shock") {
    g.rect(X(-13), Y(-7), 4, 1, "k0");
    g.rect(X(-4), Y(-7), 4, 1, "k0");
    g.px(X(-13), Y(-6), "k0");
    g.px(X(-1), Y(-6), "k0");
  } else if (expr === "worried") {
    g.line(X(-13), Y(-4), X(-10), Y(-6), "k0");
    g.line(X(-4), Y(-6), X(-1), Y(-4), "k0");
  } else if (expr === "happy" || expr === "proud") {
    g.rect(X(-13), Y(-6), 4, 1, "k0");
    g.rect(X(-4), Y(-6), 4, 1, "k0");
  } else {
    g.rect(X(-13), Y(-5), 4, 1, "k0");
    g.rect(X(-4), Y(-5), 4, 1, "k0");
  }
  // cheeks
  g.rect(X(-15), Y(5), 2, 1, "r4");
  g.rect(X(0), Y(5), 2, 1, "r4");
  // mouth
  if (expr === "shock") g.rect(X(-7), Y(9), 3, 4, "r0");
  else if (expr === "worried") {
    g.rect(X(-8), Y(11), 4, 1, "r0");
    g.px(X(-9), Y(12), "r0");
  } else if (expr === "happy" || expr === "proud") {
    g.rect(X(-9), Y(10), 5, 1, "r0");
    g.px(X(-10), Y(9), "r0");
    g.px(X(-4), Y(9), "r0");
  } else g.rect(X(-8), Y(11), 3, 1, "r0");

  // ---------- arms (thick sleeve strokes)
  const arm = (sh: Pt, el: Pt, hd: Pt) => {
    const [sx, sy] = [X(sh[0]), Y(sh[1])];
    const [ex, ey] = [X(el[0]), Y(el[1])];
    const [hx, hy] = [X(hd[0]), Y(hd[1])];
    g.line(sx, sy, ex, ey, RD, 10);
    g.line(ex, ey, hx, hy, RD, 10);
    g.line(sx, sy, ex, ey, R, 8);
    g.line(ex, ey, hx, hy, R, 8);
    // cuff band
    const cx = hx + (ex - hx) * 0.16;
    const cy = hy + (ey - hy) * 0.16;
    g.line(cx, cy, cx + (ex - hx) * 0.06, cy + (ey - hy) * 0.06, "r0", 8);
    g.px(cx, cy, "l0");
    // hand
    g.circle(hx, hy, 5, "s3");
    g.rect(hx + 2, hy + 1, 2, 3, "s2");
    return [hx, hy] as Pt;
  };

  if (pose === "panic") {
    arm([18, 46], [24, 70], [9, 12]); // far hand → far cheek
    arm([-20, 46], [-30, 70], [-19, 11]); // near hand → near cheek
  } else if (pose === "scrub") {
    arm([20, 46], [24, 84], [6, 96]);
    const h = arm([-22, 46], [-38, 76], [-58, 92]);
    item?.(h[0], h[1]);
  } else if (pose === "present") {
    arm([20, 46], [26, 80], [10, 92]);
    const h = arm([-22, 46], [-40, 64], [-48, 36]);
    item?.(h[0], h[1]);
  } else {
    arm([20, 46], [28, 84], [22, 112]);
    const h = arm([-22, 46], [-30, 84], [-26, 112]);
    item?.(h[0], h[1]);
  }
};
