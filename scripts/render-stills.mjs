// node scripts/render-stills.mjs <compositionId> <outDir> <frame> [frame...] [--browser=path]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const browserArg = process.argv.find((a) => a.startsWith("--browser="));
const browserExecutable = browserArg ? browserArg.split("=")[1] : null;
const [id, outDir, ...frames] = args;
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const fr of frames) {
  const output = path.join(outDir, `${id}-${String(fr).padStart(4, "0")}.png`);
  await renderStill({ serveUrl, composition, frame: Number(fr), output, browserExecutable, imageFormat: "png" });
  console.log(output);
}
