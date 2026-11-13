import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./theme";
import { FONT } from "./fonts";

/**
 * Sentence syntax: words separated by spaces; wrap the peak word(s) in *…*
 * e.g. "الكبسة؟ *تحفة.*"   or   "سلك إيطالي يحكّ بس *ما يخرّش؟*"
 */
export type Token = { text: string; peak: boolean };

export const tokenize = (sentence: string): Token[] => {
  const out: Token[] = [];
  let inPeak = false;
  for (const raw of sentence.split(/\s+/).filter(Boolean)) {
    let w = raw;
    let starts = false;
    let ends = false;
    if (w.startsWith("*")) {
      starts = true;
      w = w.slice(1);
    }
    if (w.endsWith("*")) {
      ends = true;
      w = w.slice(0, -1);
    }
    if (starts) inPeak = true;
    out.push({ text: w, peak: inPeak });
    if (ends) inPeak = false;
  }
  return out;
};

const groupTokens = (tokens: Token[]) => {
  const groups: { t: Token; i: number }[][] = [];
  tokens.forEach((t, i) => {
    const last = groups[groups.length - 1];
    if (t.peak && last && last[last.length - 1].t.peak) last.push({ t, i });
    else groups.push([{ t, i }]);
  });
  return groups;
};

export type KineticLine = {
  sentence: string;
  /** frame (relative to the parent Sequence) at which each word pops in. */
  wordFrames?: number[];
};

type Props = {
  lines: KineticLine[];
  /** If true, everything is shown fully (storyboard stills). */
  still?: boolean;
  top?: number; // px from top of frame (block top)
  center?: boolean; // vertically centered in frame
  size?: number;
  gap?: number; // vertical gap between lines
  maxWidth?: number;
};

/** Smooth round outline + drop shadow built from a ring of text-shadows (no miter spikes). */
const outline = (fs: number) => {
  const r = fs * 0.075;
  const parts: string[] = [];
  for (const rr of [r, r * 0.55]) {
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      parts.push(`${(Math.cos(a) * rr).toFixed(1)}px ${(Math.sin(a) * rr).toFixed(1)}px 0 ${C.ink}`);
    }
  }
  const d = fs * 0.07;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    parts.push(`${(Math.cos(a) * r).toFixed(1)}px ${(d + Math.sin(a) * r).toFixed(1)}px 0 ${C.ink}`);
  }
  return parts.join(", ");
};

const Word: React.FC<{
  token: Token;
  appearAt: number | null;
  size: number;
}> = ({ token, appearAt, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let scale = 1;
  let opacity = 1;
  let y = 0;
  let rot = 0;
  if (appearAt !== null) {
    const s = spring({
      frame: frame - appearAt,
      fps,
      config: { damping: 11, stiffness: 180, mass: 0.6 },
    });
    scale = interpolate(s, [0, 1], [0.35, 1]);
    opacity = interpolate(frame - appearAt, [0, 3], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    y = interpolate(s, [0, 1], [40, 0]);
    rot = token.peak ? interpolate(s, [0, 1], [-8, 0]) : 0;
  }
  const fs = token.peak ? size * 1.12 : size;
  return (
    <span
      style={{
        display: "inline-block",
        transform: `translateY(${y}px) scale(${scale}) rotate(${rot}deg)`,
        opacity,
        color: token.peak ? C.yellow : C.white,
        textShadow: outline(fs),
        margin: `0 ${Math.round(size * 0.12)}px`,
        fontSize: fs,
        whiteSpace: "nowrap",
      }}
    >
      {token.text}
    </span>
  );
};

export const KineticText: React.FC<Props> = ({
  lines,
  still,
  top = 250,
  center,
  size = 104,
  gap = 18,
  maxWidth = 960,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: center ? 0 : top,
        bottom: center ? 0 : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-start",
        gap,
        pointerEvents: "none",
      }}
    >
      {lines.map((line, li) => {
        const tokens = tokenize(line.sentence);
        return (
          <div
            key={li}
            dir="rtl"
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              lineHeight: 1.45,
              maxWidth,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "baseline",
              textAlign: "center",
            }}
          >
            {groupTokens(tokens).map((g, gi) =>
              g.length === 1 ? (
                <Word
                  key={gi}
                  token={g[0].t}
                  size={size}
                  appearAt={still ? null : (line.wordFrames?.[g[0].i] ?? 0)}
                />
              ) : (
                <span key={gi} style={{ display: "inline-flex", whiteSpace: "nowrap", alignItems: "baseline" }}>
                  {g.map(({ t, i }) => (
                    <Word key={i} token={t} size={size} appearAt={still ? null : (line.wordFrames?.[i] ?? 0)} />
                  ))}
                </span>
              ),
            )}
          </div>
        );
      })}
    </div>
  );
};
