"""4x anime upscale via Real-ESRGAN (ncnn, CPU, tiled).

usage: python3 scripts/upscale-anime.py MODEL_DIR IN.png OUT.png [OUT_W OUT_H]
"""
import sys
import numpy as np
import ncnn
from PIL import Image

model_dir, src, dst = sys.argv[1:4]
out_size = tuple(int(v) for v in sys.argv[4:6]) if len(sys.argv) >= 6 else None

SCALE, TILE, PAD = 4, 160, 12

net = ncnn.Net()
net.opt.use_vulkan_compute = False
net.opt.num_threads = 4
net.load_param(f"{model_dir}/realesrgan-x4plus-anime.param")
net.load_model(f"{model_dir}/realesrgan-x4plus-anime.bin")

img = np.asarray(Image.open(src).convert("RGB"), dtype=np.float32) / 255.0
h, w, _ = img.shape
out = np.zeros((h * SCALE, w * SCALE, 3), dtype=np.float32)

tiles_y = range(0, h, TILE)
tiles_x = range(0, w, TILE)
total = len(tiles_y) * len(tiles_x)
done = 0
for y0 in tiles_y:
    for x0 in tiles_x:
        y1, x1 = min(y0 + TILE, h), min(x0 + TILE, w)
        py0, px0 = max(y0 - PAD, 0), max(x0 - PAD, 0)
        py1, px1 = min(y1 + PAD, h), min(x1 + PAD, w)
        tile = np.ascontiguousarray(img[py0:py1, px0:px1].transpose(2, 0, 1))
        ex = net.create_extractor()
        ex.input("data", ncnn.Mat(tile))
        _, res = ex.extract("output")
        res = np.array(res).transpose(1, 2, 0)
        oy, ox = (y0 - py0) * SCALE, (x0 - px0) * SCALE
        out[y0 * SCALE:y1 * SCALE, x0 * SCALE:x1 * SCALE] = res[oy:oy + (y1 - y0) * SCALE, ox:ox + (x1 - x0) * SCALE]
        done += 1
    print(f"{done}/{total}", flush=True)

im = Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))
if out_size:
    im = im.resize(out_size, Image.LANCZOS)
im.save(dst, optimize=True)
print("saved", dst, im.size)
