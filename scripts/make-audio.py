"""Synthesises the soundtrack for MoajStory (45 s) -> public/audio/moaj-story.wav

No samples: everything is generated (Karplus-Strong plucks, sine tines, filtered noise).
Scene timings mirror src/pixel/Story.tsx (seconds = frame / 30).
"""
import wave
import numpy as np

SR = 44100
DUR = 45.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)


def put(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    L[i : i + len(sig)] += sig * (1 - max(0, pan))
    R[i : i + len(sig)] += sig * (1 + min(0, pan))


def env(n, a=0.005, r=0.2):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def lowpass(x, k):
    # one-pole low-pass, k in (0,1]
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += k * (x[i] - acc)
        y[i] = acc
    return y


def noise(d):
    return rng.standard_normal(int(d * SR))


def hz(note):  # midi -> hz
    return 440.0 * 2 ** ((note - 69) / 12)


def pluck(f, d, bright=0.5):
    """Karplus-Strong plucked string (oud-ish)."""
    n = int(d * SR)
    p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p)
    buf = lowpass(buf, bright)
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return out * env(n, 0.002, 0.05)


def tine(f, d):
    """music-box tine"""
    t = np.arange(int(d * SR)) / SR
    s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 9)
    return s * np.exp(-t * 3.2) * env(len(t), 0.002, 0.05)


def sine(f, d, a=0.4, r=0.4):
    t = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * f * t) * env(len(t), a, r)


def ding(f, d=1.6):
    t = np.arange(int(d * SR)) / SR
    s = sum(np.sin(2 * np.pi * f * m * t) * w for m, w in [(1, 1), (2.76, 0.4), (5.4, 0.2)])
    return s * np.exp(-t * 3.5) * env(len(t), 0.001, 0.05)


def thump(d=0.35, f0=90, f1=45):
    t = np.arange(int(d * SR)) / SR
    f = np.linspace(f0, f1, len(t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14)


def scrub(d=0.22):
    x = noise(d)
    x = x - lowpass(x, 0.08)  # high-pass-ish
    x = lowpass(x, 0.35)
    return x * np.hanning(len(x))


def reverb(x, mix=0.25):
    y = x.copy()
    for dl, g in [(0.031, 0.5), (0.047, 0.42), (0.071, 0.35), (0.113, 0.28), (0.173, 0.2), (0.257, 0.14)]:
        k = int(dl * SR)
        y[k:] += x[:-k] * g * mix * 2
    return y


# ------------------------------------------------------------------ 0–4.5  HOOK
d = sine(hz(38), 4.6, 0.3, 0.6) + 0.7 * sine(hz(39), 4.6, 0.3, 0.6)  # D2 + Eb2 rub
d *= 1 + 0.3 * np.sin(np.arange(len(d)) / SR * 2 * np.pi * 3)
put(d, 0, 0.16)
crk = noise(4.5) * (rng.random(int(4.5 * SR)) > 0.9985) * 6 + lowpass(noise(4.5), 0.05) * 0.6
put(crk * env(len(crk), 0.05, 0.6), 0, 0.12)  # burning crackle / sizzle
for t0 in (0.0, 1.1, 2.2, 3.3):
    put(thump(), t0, 0.5)

# ------------------------------------------------------------------ 4.5–10.5  FLASHBACK (music box + vinyl)
vin = lowpass(noise(6.0), 0.3) * 0.15 + noise(6.0) * (rng.random(int(6 * SR)) > 0.9992) * 3
put(vin * env(len(vin), 0.3, 0.5), 4.5, 0.09)
mel = [(74, 0), (78, 0.4), (81, 0.8), (79, 1.2), (78, 1.6), (76, 2.0), (74, 2.8), (76, 3.2), (78, 3.6), (73, 4.0), (74, 4.6)]
mb = np.zeros(int(6.2 * SR))
for n, t0 in mel:
    s = tine(hz(n), 1.8)
    i = int(t0 * SR)
    mb[i : i + len(s)] += s[: len(mb) - i]
put(reverb(mb, 0.35) * env(len(mb), 0.2, 0.8), 4.6, 0.22)

# ------------------------------------------------------------------ 10.5–14.5  NIGHT (crickets)
for k in range(10):
    t0 = 10.6 + k * 0.38 + rng.random() * 0.1
    t = np.arange(int(0.12 * SR)) / SR
    c = np.sin(2 * np.pi * 4300 * t) * (np.sin(2 * np.pi * 45 * t) > 0) * np.hanning(len(t))
    put(c, t0, 0.05, pan=-0.4 if k % 2 else 0.4)
put(sine(hz(50), 4.0, 1.0, 1.2) + 0.5 * sine(hz(57), 4.0, 1.0, 1.2), 10.5, 0.07)

# ------------------------------------------------------------------ 14.5–19.5  SCRUB (old sponge)
for k in range(20):
    put(scrub(0.24), 14.6 + k * 0.25, 0.45 if k % 2 == 0 else 0.3, pan=0.2)
put(sine(hz(38), 5.0, 0.5, 0.6) + 0.6 * sine(hz(39), 5.0, 0.5, 0.6), 14.5, 0.12)

# ------------------------------------------------------------------ 19.5–23.5  FLOOR (clock + heartbeat)
for k in range(8):
    t = np.arange(int(0.03 * SR)) / SR
    tick = np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 200)
    put(tick, 19.6 + k * 0.5, 0.35 if k % 2 == 0 else 0.22, pan=-0.3)
for t0 in (19.8, 20.1, 21.0, 21.3, 22.2, 22.5):
    put(thump(0.3, 70, 40), t0, 0.45)
put(sine(hz(38), 4.0, 0.5, 1.0), 19.5, 0.1)

# ------------------------------------------------------------------ 23.5–26.5  ARRIVAL (engine + doorbell)
eng_t = np.arange(int(2.2 * SR)) / SR
eng = (np.sin(2 * np.pi * 42 * eng_t) + 0.4 * lowpass(noise(2.2), 0.02) * 4) * np.linspace(0.2, 1, len(eng_t))
eng *= env(len(eng), 0.3, 0.4)
put(eng, 23.5, 0.28, pan=-0.5)
put(ding(hz(76), 1.2), 25.7, 0.35)  # ding…
put(ding(hz(72), 1.4), 26.05, 0.35)  # …dong

# ------------------------------------------------------------------ 26.5–29.5  FAHAD runs in
for k in range(7):
    t = np.arange(int(0.07 * SR)) / SR
    step = lowpass(noise(0.07), 0.2) * np.exp(-t * 60)
    put(step, 26.55 + k * 0.2, 0.5, pan=-0.6 + k * 0.15)
riser = noise(1.6)
riser = lowpass(riser, 0.12) * np.linspace(0, 1, len(riser)) ** 2
put(riser, 27.9, 0.25)

# ------------------------------------------------------------------ 29.5–34.5  CLIMAX (one scrub + wave + glitter)
sw = noise(2.5)
sw = lowpass(sw - lowpass(sw, 0.05), 0.5) * np.sin(np.linspace(0, np.pi, len(sw)))
put(sw, 30.0, 0.35, pan=0.1)  # the long scrub / wave whoosh
for k, f in enumerate([88, 93, 96, 100, 105]):
    put(ding(hz(f), 1.4), 32.55 + k * 0.08, 0.16, pan=-0.5 + k * 0.25)
put(ding(hz(93), 2.5), 32.6, 0.25)

# ------------------------------------------------------------------ 29.5–45  MUSIC (warm oud-like plucks + pad + daf)
BPM = 100
beat = 60 / BPM
start = 29.6
# melody in D (bright, homely) — (midi, beats)
melody = [
    (62, 1), (69, 1), (74, 1), (69, 1),
    (74, 0.5), (76, 0.5), (78, 1), (76, 0.5), (74, 0.5), (76, 1),
    (78, 1), (81, 1), (79, 0.5), (78, 0.5), (76, 1),
    (74, 0.5), (76, 0.5), (78, 0.5), (76, 0.5), (74, 1), (73, 1),
    (74, 1), (78, 1), (81, 1.5), (79, 0.5),
    (78, 1), (76, 1), (74, 2),
    (69, 1), (74, 1), (78, 1), (74, 3),
]
t0 = start
for n, b in melody:
    if t0 > 44.4:
        break
    put(pluck(hz(n), min(1.6, b * beat + 0.6), 0.55), t0, 0.32, pan=0.15)
    put(pluck(hz(n - 12), min(1.2, b * beat + 0.3), 0.35), t0, 0.08, pan=-0.2)
    t0 += b * beat
# pad chords (D – G – A – D)
chords = [(start, [50, 57, 62]), (start + 8 * beat, [55, 59, 62]), (start + 16 * beat, [57, 61, 64]), (start + 20 * beat, [50, 57, 62, 66])]
for i, (c0, notes) in enumerate(chords):
    c1 = chords[i + 1][0] if i + 1 < len(chords) else 45.0
    pad = sum(sine(hz(n), c1 - c0 + 0.4, 0.6, 0.8) for n in notes) / len(notes)
    put(pad, c0, 0.12)
# soft daf pattern (dum . tak tak)
tb = start + 2 * beat
while tb < 43.5:
    put(thump(0.3, 110, 55), tb, 0.35)
    t = np.arange(int(0.06 * SR)) / SR
    tak = lowpass(noise(0.06), 0.6) * np.exp(-t * 70)
    put(tak, tb + beat, 0.18)
    put(tak, tb + beat * 1.5, 0.12)
    tb += 2 * beat
# end-card glitter sparkle
put(ding(hz(98), 2.0), 40.9, 0.2)

# ------------------------------------------------------------------ master
mix = np.stack([L, R])
fade = int(1.2 * SR)
mix[:, -fade:] *= np.linspace(1, 0, fade)
mix = np.tanh(mix * 1.2)
mix /= np.max(np.abs(mix)) / 0.89
pcm = (mix.T * 32767).astype(np.int16)
with wave.open("public/audio/moaj-story.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok", pcm.shape)
