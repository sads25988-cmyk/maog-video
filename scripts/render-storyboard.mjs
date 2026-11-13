// Renders the 10 storyboard frames to out/storyboard/frame-01.png … frame-10.png
// Usage: node scripts/render-storyboard.mjs [--browser=/path/to/chrome]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const browserArg = process.argv.find((a) => a.startsWith("--browser="));
const browserExecutable = browserArg ? browserArg.split("=")[1] : null;
const outDir = path.resolve("out/storyboard");
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "MoajStoryboard", browserExecutable });
for (let i = 0; i < composition.durationInFrames; i++) {
  const output = path.join(outDir, `frame-${String(i + 1).padStart(2, "0")}.png`);
  await renderStill({ serveUrl, composition, frame: i, output, browserExecutable, imageFormat: "png" });
  console.log("rendered", output);
}
