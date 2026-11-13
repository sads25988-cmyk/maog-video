// Builds storyboard/storyboard-sheet.jpg from storyboard/frame-XX.png + storyboard/notes.json
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright"); // uses globally installed Playwright (NODE_PATH)
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("storyboard");
const notes = JSON.parse(fs.readFileSync(path.join(dir, "notes.json"), "utf8"));
const font = path.resolve("public/fonts/cairo-arabic-900-normal.woff2");
const font7 = path.resolve("public/fonts/cairo-arabic-700-normal.woff2");
const cards = notes
  .map(
    (n, i) => `
  <div class="card">
    <img src="file://${dir}/frame-${String(i + 1).padStart(2, "0")}.png" />
    <div class="txt">
      <div class="head"><span class="num">${i + 1}</span><span class="time">${n.t}</span></div>
      <p class="shot">${n.shot}</p>
      <div class="row"><b>التعليق</b><span class="vo">${n.vo}</span></div>
      <div class="row"><b>الصوت</b><span>${n.snd}</span></div>
      <div class="row"><b>الحركة</b><span>${n.anim}</span></div>
    </div>
  </div>`,
  )
  .join("");
const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>
@font-face{font-family:C;src:url(file://${font}) format("woff2");font-weight:900}
@font-face{font-family:C;src:url(file://${font7}) format("woff2");font-weight:700}
*{box-sizing:border-box;margin:0}
body{font-family:C,sans-serif;background:#F3E6D0;color:#2A1B12;padding:56px;width:1800px}
h1{font-weight:900;font-size:58px;display:flex;align-items:center;gap:20px}
h1 .tag{font-size:26px;background:#1E6FDE;color:#fff;border-radius:999px;padding:4px 22px 10px}
.sub{font-weight:700;font-size:24px;margin:10px 0 36px;color:#5A4232}
.sub i{font-style:normal;background:#FFC83D;padding:0 8px;border-radius:6px;color:#2A1B12}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:32px}
.card{display:flex;gap:26px;background:#FBF3E4;border:5px solid #2A1B12;border-radius:26px;padding:22px;box-shadow:0 8px 0 #2A1B12}
.card img{width:300px;height:533px;border-radius:14px;border:4px solid #2A1B12;flex:none}
.txt{display:flex;flex-direction:column;gap:14px;font-weight:700;font-size:22px;line-height:1.6}
.head{display:flex;align-items:center;gap:14px}
.num{font-weight:900;font-size:34px;width:60px;height:60px;border-radius:50%;background:#2A1B12;color:#FFC83D;display:grid;place-items:center;padding-bottom:6px}
.time{font-weight:900;font-size:30px;direction:ltr}
.shot{font-size:23px}
.row{display:flex;gap:12px}
.row b{font-weight:900;flex:none;width:84px;color:#B5583B}
.vo{font-weight:900}
</style></head><body>
<h1>موج — ستوري بورد الإعلان <span class="tag">45 ثانية · 9:16 · 1080×1920</span></h1>
<p class="sub">فلات فيكتور، خطوط سميكة، حركة cut-out. المطبخ بألوان دافية محايدة، والمنتج والنص بألوان موج. الكلمة <i>الصفراء</i> هي كلمة الذروة في كل جملة.</p>
<div class="grid">${cards}</div>
</body></html>`;
const tmp = path.join(dir, ".sheet.html");
fs.writeFileSync(tmp, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 2 });
await page.goto("file://" + tmp);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(dir, "storyboard-sheet.jpg"), fullPage: true, type: "jpeg", quality: 88 });
await browser.close();
fs.unlinkSync(tmp);
console.log("ok");
