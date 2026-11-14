import React from "react";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const NASKH = "MoajNaskh";
loadFont({ family: NASKH, url: staticFile("fonts/noto-naskh-arabic-arabic-700-normal.woff2"), weight: "700" });

/**
 * Cinematic caption: clean white Naskh, soft shadow, key word underlined with a
 * hand-drawn Moaj-yellow stroke. Mark the key word with *…* in the text.
 */
export const Caption: React.FC<{
  lines: string[];
  top?: number;
  size?: number;
  opacity?: number;
  underlineProgress?: number; // 0..1 draw-on of the underline
}> = ({ lines, top = 520, size = 64, opacity = 1, underlineProgress = 1 }) => (
  <div
    dir="rtl"
    style={{
      position: "absolute",
      top,
      left: 60,
      right: 60,
      textAlign: "center",
      fontFamily: NASKH,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.75,
      color: "#FBF7EE",
      textShadow: "0 4px 18px rgba(0,0,0,0.65), 0 2px 3px rgba(0,0,0,0.6)",
      opacity,
    }}
  >
    {lines.map((line, li) => (
      <div key={li}>
        {line.split(/(\*[^*]+\*)/).map((part, i) =>
          part.startsWith("*") ? (
            <span key={i} style={{ position: "relative", display: "inline-block" }}>
              {part.slice(1, -1)}
              <svg
                viewBox="0 0 100 14"
                preserveAspectRatio="none"
                style={{ position: "absolute", left: "-4%", width: "108%", bottom: -size * 0.12, height: size * 0.28, overflow: "visible" }}
              >
                <path
                  d="M98 5 C70 2 35 3 2 7 M94 10 C66 7 34 8 8 11"
                  fill="none"
                  stroke="#FFC83D"
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - underlineProgress}
                />
              </svg>
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </div>
    ))}
  </div>
);
