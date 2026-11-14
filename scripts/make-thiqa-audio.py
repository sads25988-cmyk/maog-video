"""«ثقة عمياء» soundtrack -> public/audio/thiqa.wav

Orchestral score is written as MIDI and rendered through FluidSynth with the
FluidR3 GM soundfont; sound effects are synthesized with numpy/scipy.
All timings come from src/thiqa/beats.json so picture and sound stay locked.

needs: apt fluidsynth fluid-soundfont-gm ; pip pretty_midi scipy
"""
import json
import os
import subprocess
import tempfile
import wave

import numpy as np
import pretty_midi
from scipy.signal import butter, sosfilt

SR = 44100
B = json.load(open("src/thiqa/beats.json"))
TOTAL = B["total"]
N = int(SR * TOTAL)
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
rng = np.random.default_rng(1448)
n2m = pretty_midi.note_name_to_number

c, ti, a1, a2, a3, br = B["cold"], B["title"], B["act1"], B["act2"], B["act3"], B["brand"]

# ═══════════════════════════════════ SCORE ═══════════════════════════════════
pm = pretty_midi.PrettyMIDI(initial_tempo=120)
_inst = {}


def I(program, name):
    if name not in _inst:
        ins = pretty_midi.Instrument(program=program, name=name)
        pm.instruments.append(ins)
        _inst[name] = ins
    return _inst[name]


DR = pretty_midi.Instrument(program=0, is_drum=True, name="drums")
pm.instruments.append(DR)

STR, TREM, PIZZ, HARP = I(48, "strings"), I(44, "trem"), I(45, "pizz"), I(46, "harp")
TIMP, CHOIR, HIT, CELLO = I(47, "timp"), I(52, "choir"), I(55, "hit"), I(42, "cello")
BASS, VLN, HORN, BRASS = I(43, "bass"), I(40, "violin"), I(60, "horn"), I(61, "brass")
CEL, GLOCK = I(8, "celesta"), I(9, "glock")


def nt(ins, pitch, t, d, v):
    p = n2m(pitch) if isinstance(pitch, str) else pitch
    ins.notes.append(pretty_midi.Note(velocity=int(np.clip(v, 1, 127)), pitch=int(p), start=float(t), end=float(t + d)))


def chord(ins, pitches, t, d, v, spread=0.0):
    for k, p in enumerate(pitches):
        nt(ins, p, t + k * spread, d - k * spread, v)


def cc(ins, num, t, val):
    ins.control_changes.append(pretty_midi.ControlChange(number=num, value=int(np.clip(val, 0, 127)), time=float(max(0, t))))


def ramp(ins, t0, t1, v0, v1, steps=24, num=11):
    for k in range(steps + 1):
        cc(ins, num, t0 + (t1 - t0) * k / steps, v0 + (v1 - v0) * k / steps)


def drum(key, t, v):
    DR.notes.append(pretty_midi.Note(velocity=int(v), pitch=key, start=float(t), end=float(t + 0.5)))


def timp_roll(t0, t1, pitch, v0, v1, step=0.045):
    n = int((t1 - t0) / step)
    for k in range(n):
        nt(TIMP, pitch, t0 + k * step, step * 1.6, v0 + (v1 - v0) * k / max(1, n - 1))


def gliss(ins, notes, t0, t1, v):
    for k, p in enumerate(notes):
        nt(ins, p, t0 + (t1 - t0) * k / len(notes), 0.6, v)


for ins in pm.instruments:
    if not ins.is_drum:
        cc(ins, 11, 0, 110)
        cc(ins, 91, 0, 70)
cc(HIT, 91, 0, 90)
cc(TIMP, 91, 0, 80)

DMIN_UP = ["D3", "E3", "F3", "G3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "Bb4", "C5", "D5", "E5", "F5", "G5", "A5", "D6"]
DMAJ_UP = ["D3", "E3", "F#3", "G3", "A3", "B3", "C#4", "D4", "E4", "F#4", "G4", "A4", "B4", "C#5", "D5", "E5", "F#5", "A5", "D6"]

# ── cold open: rising dread → «خاين.»
nt(BASS, "D1", 0.25, c["slam"] - 0.27, 70)
ramp(BASS, 0.25, c["slam"], 40, 110)
chord(TREM, ["D2", "A2"], 0.4, c["slam"] - 0.42, 60)
ramp(TREM, 0.4, c["slam"], 20, 105)
s = c["slam"]
chord(HIT, ["D3", "A3", "D4"], s, 0.9, 127)
nt(TIMP, "D2", s, 1.4, 127)
chord(BRASS, ["D2", "D3", "A3"], s, 1.1, 118)
ramp(BRASS, s + 0.2, s + 1.1, 110, 0)
drum(35, s, 127)
drum(57, s, 112)

# ── title: drama theme
t0 = ti["start"]
timp_roll(t0 + 0.02, ti["textIn"] + 0.05, "D2", 40, 112)
gliss(HARP, DMIN_UP, t0 + 0.05, ti["textIn"] + 0.2, 85)
h = ti["textIn"] + 0.05
chord(STR, ["D3", "F3", "A3", "D4", "F4", "A4"], h, 2.05, 104)
ramp(STR, h, h + 0.6, 70, 127)
ramp(STR, ti["textOut"] - 0.3, ti["end"], 127, 30)
chord(CHOIR, ["D4", "F4", "A4"], h, 2.0, 88)
ramp(CHOIR, ti["textOut"] - 0.3, ti["end"], 110, 20)
nt(BASS, "D2", h, 2.0, 95)
for k, (p, d) in enumerate([("A3", 0.38), ("D4", 0.38), ("F4", 0.33), ("E4", 0.9)]):
    nt(HORN, p, h + 0.05 + [0, 0.4, 0.8, 1.15][k], d, 108)
drum(49, h, 88)
for k, p in enumerate(["D6", "F6", "A6", "D7"]):
    nt(GLOCK, p, h + k * 0.06, 0.8, 72)

# ── act 1: the suspicion
s0, z = a1["sponge"], a1["zoom"]
nt(BASS, "D2", s0, z[0] - s0 - 0.02, 58)
chord(TREM, ["D3", "A3"], s0, z[0] - s0 - 0.02, 46)
ramp(TREM, s0, z[0], 55, 95)
for p, t, d in [("A5", 0.3, 0.55), ("F5", 0.9, 0.5), ("E5", 1.4, 0.45), ("D5", 1.85, 0.6), ("C#5", 2.55, 0.8)]:
    nt(CEL, p, s0 + t, d, 74)
nt(CELLO, "D3", a1["subSmell"] - 0.1, z[0] - a1["subSmell"], 62)
ramp(CELLO, a1["subSmell"] - 0.1, z[0], 50, 115)
for k, (pitches, v) in enumerate([(["D3", "A3"], 112), (["D3", "A3"], 120), (["Bb2", "F3", "Bb3"], 127)]):
    chord(HIT, pitches, z[k], 0.32 if k < 2 else 0.8, v)
    nt(TIMP, "D2" if k < 2 else "Bb1", z[k], 0.5 if k < 2 else 1.0, v)
    drum(35, z[k], v)
drum(57, z[2], 115)
chord(BRASS, ["Bb2", "F3", "Bb3"], z[2], 0.62, 112)

fl = a1["flash"]
progs = [["Bb2", "D3", "F3", "Bb3", "D4", "F4"], ["A2", "C3", "F3", "A3", "C4", "F4"], ["G2", "D3", "G3", "Bb3", "D4", "G4"]]
for k, t in enumerate(fl):
    chord(HARP, progs[k], t, 1.1, 78, spread=0.07)
    chord(STR, progs[k][1:4], t, 1.05, 66)
    nt(CEL, ["F6", "C6", "D6"][k], t, 0.9, 82)
    chord(CHOIR, progs[k][3:5], t, 1.05, 52)
w = a1["wide"]
chord(STR, ["A2", "E3", "A3", "C#4"], w, a1["accuse"] - w - 0.02, 86)
ramp(STR, w, a1["accuse"], 60, 118)
nt(CELLO, "A2", w, a1["accuse"] - w - 0.02, 80)
for p, t, d in [("A4", 0.2, 0.4), ("Bb4", 0.6, 0.35), ("A4", 0.95, 0.3), ("G#4", 1.25, 0.3)]:
    nt(VLN, p, w + t, d, 98)
ac = a1["accuse"]
chord(HIT, ["D3", "F3", "A3", "D4"], ac, 0.9, 127)
nt(TIMP, "D2", ac, 1.0, 127)
drum(35, ac, 127)
drum(57, ac, 108)
chord(BRASS, ["D3", "F3", "A3"], ac, 0.85, 118)
chord(TREM, ["D3", "F3", "A3", "D4"], ac + 0.1, a1["end"] - ac - 0.12, 92)
ramp(TREM, ac + 0.1, a1["end"], 115, 25)

# ── act 2: the lab
L0, hush = a2["start"], a2["hush"]
t = L0 + 0.05
k = 0
while t < hush - 0.12:
    nt(PIZZ, ["D3", "D3", "D3", "Eb3"][k % 4], t, 0.2, 58 + 45 * (t - L0) / (hush - L0))
    t += 0.25
    k += 1
chord(TREM, ["D4", "Eb4"], L0, hush - L0 - 0.03, 64)
ramp(TREM, L0, hush, 35, 124)
nt(BASS, "D2", L0, hush - L0 - 0.03, 72)
for tt, v in [(18.4, 60), (19.2, 72), (19.7, 82), (20.0, 90)]:
    nt(TIMP, "D2", tt, 0.3, v)
sl = a2["slam"]
chord(HIT, ["D2", "D3", "A3", "D4", "F4"], sl, 1.0, 127)
nt(TIMP, "D2", sl, 1.2, 127)
chord(BRASS, ["D2", "D3", "F3", "A3"], sl, 0.95, 124)
ramp(BRASS, sl + 0.3, sl + 1.05, 120, 10)
chord(STR, ["D3", "F3", "A3", "D4"], sl, 1.05, 118)
chord(CHOIR, ["D4", "F4", "A4"], sl, 1.05, 108)
drum(35, sl, 127)
drum(57, sl, 120)
drum(52, sl + 0.01, 100)
for k, (t, pitches) in enumerate(zip(a2["react"], [["A3", "E4"], ["G3", "D4"], ["F3", "C4"], ["E3", "B3"]])):
    chord(HIT, pitches, t, 0.28, 112)
    nt(PIZZ, pitches[0], t, 0.2, 110)
    drum(38 if k % 2 else 40, t, 90)
wd = a2["wide"]
chord(BRASS, ["Bb2", "F3", "Bb3", "D4"], wd, 1.15, 104)
chord(STR, ["Bb2", "F3", "Bb3", "D4"], wd, 1.15, 100)
chord(BRASS, ["A2", "E3", "A3", "C#4"], wd + 1.2, 1.15, 112)
chord(STR, ["A2", "E3", "A3", "C#4"], wd + 1.2, 1.15, 108)
chord(CHOIR, ["A3", "C#4", "E4"], wd + 1.2, 1.15, 92)
timp_roll(wd + 0.9, wd + 1.2, "A1", 50, 120)
nt(TIMP, "A1", wd + 1.2, 0.9, 120)
ml = a2["mil"]
nt(PIZZ, "D4", ml + 0.05, 0.16, 112)
nt(PIZZ, "A3", ml + 0.24, 0.16, 112)
nt(PIZZ, "D2", ml + 0.45, 0.4, 124)
nt(BASS, "D2", ml + 0.45, 0.32, 90)

# ── act 3: confrontation, the doorbell, the door
s3 = a3["start"]
chord(TREM, ["D3", "F3", "A3"], s3, a3["throw"] - s3 - 0.02, 100)
ramp(TREM, s3, s3 + 0.5, 80, 120)
for (pb, pc), t, d in [(("D2", "D3"), 0, 1.3), (("Bb1", "Bb2"), 1.3, 0.7), (("A1", "A2"), 2.0, 0.68)]:
    nt(BASS, pb, s3 + t, d, 96)
    nt(CELLO, pc, s3 + t, d, 86)
for p, t, d in [("A4", 0.3, 0.5), ("D5", 0.8, 0.4), ("C5", 1.2, 0.3), ("Bb4", 1.5, 0.5), ("A4", 2.0, 0.65)]:
    nt(VLN, p, s3 + t, d, 112)
for t in a3["thunder"]:
    nt(TIMP, "D2", t, 0.9, 118)
th = a3["throw"]
for k, p in enumerate(["D5", "E5", "F5", "G5", "A5", "Bb5", "C6", "D6"]):
    nt(VLN, p, th + k * 0.04, 0.12, 104)
dr = a3["door"]
gliss(HARP, DMAJ_UP, dr + 0.05, dr + 0.65, 86)
chord(CHOIR, ["D4", "F#4", "A4"], dr + 0.1, a3["end"] - dr - 0.1, 96)
ramp(CHOIR, dr + 0.1, a3["end"], 25, 122)
chord(STR, ["D3", "A3", "D4", "F#4"], dr + 0.1, a3["end"] - dr - 0.1, 100)
ramp(STR, dr + 0.1, a3["end"], 25, 127)
for k in range(10):
    nt(CEL, rng.choice(["D6", "F#6", "A6", "B6", "D7"]), dr + 0.25 + k * 0.15, 0.5, 60 + k * 3)
timp_roll(a3["end"] - 0.6, a3["end"] - 0.02, "D2", 40, 118)

# ── brand: resolution
b0 = br["start"]
chord(BRASS, ["D3", "F#3", "A3", "D4"], b0, 1.6, 116)
ramp(BRASS, b0 + 0.8, b0 + 1.6, 115, 40)
chord(STR, ["D2", "D3", "A3", "D4", "F#4", "A4"], b0, TOTAL - b0 - 0.3, 116)
ramp(STR, b0 + 1.5, TOTAL - 0.4, 120, 30)
chord(CHOIR, ["D4", "F#4", "A4", "D5"], b0, TOTAL - b0 - 0.6, 98)
ramp(CHOIR, b0 + 1.5, TOTAL - 0.6, 115, 20)
nt(TIMP, "D2", b0, 1.2, 127)
drum(49, b0, 104)
drum(57, b0 + 0.01, 90)
for k, p in enumerate(["D6", "F#6", "A6", "D7"]):
    nt(GLOCK, p, b0 + k * 0.07, 1.0, 84)
for p, t, d in [("F#4", br["logo"], 0.4), ("A4", br["logo"] + 0.38, 0.35), ("D5", br["line"] + 0.02, 1.6)]:
    nt(HORN, p, t, d, 106)
chord(HARP, ["D3", "A3", "D4", "F#4", "A4", "D5"], br["claim"], 1.4, 72, spread=0.08)
nt(GLOCK, "D7", br["handle"], 1.2, 86)
for k, p in enumerate(["A6", "B6", "D7", "F#7"]):
    nt(CEL, p, br["shine"] + k * 0.07, 0.7, 70)

# keep the renderer running to the very end
nt(STR, "D2", TOTAL - 0.05, 0.04, 1)

with tempfile.TemporaryDirectory() as tmp:
    mid = os.path.join(tmp, "score.mid")
    wav = os.path.join(tmp, "score.wav")
    pm.write(mid)
    subprocess.run(
        [
            "fluidsynth", "-ni", "-q", "-g", "0.55", "-r", str(SR), "-O", "s16", "-F", wav,
            "-o", "synth.reverb.active=1", "-o", "synth.reverb.room-size=0.82", "-o", "synth.reverb.damp=0.3",
            "-o", "synth.reverb.width=0.95", "-o", "synth.reverb.level=0.75", "-o", "synth.chorus.active=0",
            SF2, mid,
        ],
        check=True,
    )
    with wave.open(wav) as wf:
        raw = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float64) / 32768
        ch = wf.getnchannels()
music = raw.reshape(-1, ch).T if ch == 2 else np.vstack([raw, raw])
MUS = np.zeros((2, N))
m = min(N, music.shape[1])
MUS[:, :m] = music[:, :m]

# ═══════════════════════════════════ SFX ═══════════════════════════════════
FX = np.zeros((2, N))


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def norm(x):
    return x / (np.max(np.abs(x)) + 1e-9)


def put(sig, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i] * g
    FX[0, i : i + len(sig)] += sig * min(1.0, 1 - pan)
    FX[1, i : i + len(sig)] += sig * min(1.0, 1 + pan)


def put2(sig2, t, g=1.0):
    i = int(t * SR)
    n = min(sig2.shape[1], N - i)
    FX[:, i : i + n] += sig2[:, :n] * g


def env(n, a, r):
    e = np.ones(n)
    na, nr = min(n, int(a * SR)), int(r * SR)
    nr = min(nr, n - na)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def tt(d):
    return np.arange(int(d * SR)) / SR


def heartbeat(t, g=1.0):
    for off, f, amp in [(0, 58, 1.0), (0.19, 50, 0.75)]:
        x = tt(0.22)
        s = np.sin(2 * np.pi * f * x * (1 - 0.25 * x / 0.22)) * np.exp(-x * 22) * amp
        s += lp(rng.standard_normal(len(x)), 180) * np.exp(-x * 60) * 0.25 * amp
        put(s, t + off, g)


def boom(t, g=1.0, d=1.6):
    x = tt(d)
    f = 95 * np.exp(-x * 2.2) + 32
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 2.4)
    s += lp(rng.standard_normal(len(x)), 900) * np.exp(-x * 18) * 0.5
    put(norm(s), t, g)


def whoosh(t, d=0.45, g=1.0, f0=300, f1=3500, rev=False):
    n = int(d * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    low = band = 0.0
    q = 0.9
    for k in range(n):
        p = k / n
        fc = f0 * (f1 / f0) ** (p if not rev else 1 - p)
        f = 2 * np.sin(np.pi * min(fc, 7000) / SR)
        low += f * band
        high = x[k] - low - q * band
        band += f * high
        out[k] = band
    out = norm(out)
    shape = np.sin(np.pi * np.linspace(0, 1, n)) ** (1.5 if not rev else 0.7)
    if rev:
        shape = np.linspace(0, 1, n) ** 2.2
    sig = out * shape
    pan = np.linspace(-0.6, 0.6, n)
    put2(np.vstack([sig * (1 - np.clip(pan, 0, 1)), sig * (1 + np.clip(pan, -1, 0))]), t, g)


def riser(t0, t1, g=1.0):
    n = int((t1 - t0) * SR)
    x = norm(hp(rng.standard_normal(n), 2500)) * np.linspace(0, 1, n) ** 3
    put(x, t0, g)


def tick(t, hi, g=1.0):
    x = tt(0.03)
    s = norm(bp(rng.standard_normal(len(x)), 2600 if hi else 1800, 5200 if hi else 3600) * np.exp(-x * 260))
    put(s, t, g, pan=0.25)


def paper(t, d=0.5, g=1.0):
    n = int(d * SR)
    x = bp(rng.standard_normal(n), 1800, 7000)
    am = (rng.random(n // 300 + 1) ** 3).repeat(300)[:n]
    put(norm(x * lp(am, 60)) * env(n, 0.02, 0.15), t, g, pan=0.1)


def rain(t0, t1, g=1.0, fade_from=None):
    n = int((t1 - t0) * SR)
    L = hp(lp(rng.standard_normal(n), 5200), 350)
    R = hp(lp(rng.standard_normal(n), 5200), 350)
    drops = np.zeros(n)
    for i in rng.integers(0, n - 400, int((t1 - t0) * 260)):
        drops[i : i + 400] += np.exp(-np.arange(400) / 40) * rng.uniform(0.2, 1)
    drops = hp(drops, 1500)
    e = env(n, 0.4, 0.3)
    if fade_from is not None:
        k = int((fade_from - t0) * SR)
        e[k:] *= np.linspace(1, 0.05, n - k)
    L, R = norm(L) * 0.5, norm(R) * 0.5
    drops = norm(drops) * 0.6
    put2(np.vstack([L + drops, R + np.roll(drops, 777)]) * e, t0, g)


def thunder(t, g=1.0):
    crack = hp(rng.standard_normal(int(0.35 * SR)), 900) * np.exp(-tt(0.35) * 16)
    put(norm(crack), t, g * 0.55)
    n = int(3.2 * SR)
    rum = lp(rng.standard_normal(n), 140, 3) * 6
    rum *= np.minimum(1, tt(3.2) / 0.15) * np.exp(-tt(3.2) * 1.2) * (1 + 0.5 * np.sin(2 * np.pi * 3.1 * tt(3.2)))
    put(norm(rum), t + 0.04, g)


def splash(t, g=1.0):
    n = int(0.7 * SR)
    s = bp(rng.standard_normal(n), 700, 6000) * np.exp(-tt(0.7) * 9)
    for _ in range(14):
        i = rng.integers(0, n - 2000)
        f = rng.uniform(600, 1400)
        s[i : i + 2000] += np.sin(2 * np.pi * f * tt(2000 / SR) * (1 + tt(2000 / SR) * 9)) * np.exp(-tt(2000 / SR) * 60) * 0.3
    put(norm(s), t, g, pan=0.35)


def bell(t, f, g=1.0, d=2.2):
    x = tt(d)
    s = sum(np.sin(2 * np.pi * f * m * x) * a * np.exp(-x * dk) for m, a, dk in [(1, 1, 1.4), (2.0, 0.5, 2.2), (2.76, 0.32, 3.0), (5.4, 0.12, 5.0)])
    put(norm(s) * env(len(x), 0.002, 0.2), t, g, pan=-0.2)


def shimmer(t0, d, g=1.0):
    n = int(d * SR)
    s = np.zeros(n)
    for _ in range(int(d * 22)):
        i = rng.integers(0, max(1, n - 9000))
        f = rng.uniform(2400, 6200)
        s[i : i + 9000] += np.sin(2 * np.pi * f * tt(9000 / SR)) * np.exp(-tt(9000 / SR) * 9) * rng.uniform(0.2, 1)
    put(norm(s) * np.linspace(0.2, 1, n), t0, g)


def flicker(t0, t1, g=1.0):
    t = t0
    while t < t1:
        x = tt(0.012)
        put(norm(hp(rng.standard_normal(len(x)), 3000) * np.exp(-x * 400)), t, g)
        t += rng.uniform(0.03, 0.09)


def roomtone(t0, t1, g=1.0):
    n = int((t1 - t0) * SR)
    put2(np.vstack([norm(lp(rng.standard_normal(n), 400)), norm(lp(rng.standard_normal(n), 400))]) * env(n, 0.3, 0.3), t0, g)


# cold open
for t, g in [(0.05, 0.55), (0.85, 0.65), (1.62, 0.8)]:
    heartbeat(t, g)
flicker(c["disclaimerIn"], c["disclaimerIn"] + 0.35, 0.06)
riser(c["slam"] - 0.5, c["slam"], 0.14)
boom(c["slam"], 0.8)
whoosh(c["slam"] - 0.18, 0.2, 0.25, 600, 4000, rev=True)

# title
whoosh(ti["textIn"] - 0.15, 0.6, 0.12, 200, 2200)
shimmer(ti["textIn"] + 0.5, 1.2, 0.05)

# act 1
roomtone(a1["sponge"], a1["end"], 0.02)
hum = sum(np.sin(2 * np.pi * f * tt(z[0] - a1["sponge"])) * a for f, a in [(60, 1), (120, 0.5), (180, 0.2)])
put(hum * env(len(hum), 0.3, 0.2), a1["sponge"], 0.012)
t, k = a1["sponge"] + 0.1, 0
while t < z[0] - 0.05:
    tick(t, k % 2 == 0, 0.1)
    t += 0.5
    k += 1
for k, t in enumerate(z):
    whoosh(t - 0.06, 0.16, 0.25 + 0.1 * k, 800, 5000, rev=True)
    boom(t, 0.25 + 0.2 * k, 1.0)
for t in fl:
    whoosh(t - 0.22, 0.3, 0.14, 1500, 6000, rev=True)
    shimmer(t, 0.5, 0.04)
whoosh(a1["accuse"] - 0.1, 0.14, 0.4, 700, 5000, rev=True)
boom(a1["accuse"], 0.55, 1.2)

# act 2
roomtone(a2["start"], a2["end"], 0.02)
for t, d in [(17.5, 0.45), (18.25, 0.35), (18.9, 0.5)]:
    paper(t, d, 0.13)
for t, g in [(17.7, 0.4), (18.45, 0.45), (19.1, 0.5), (19.6, 0.55), (20.0, 0.6), (20.85, 0.75)]:
    heartbeat(t, g)
boom(a2["slam"], 0.85, 1.8)
whoosh(a2["slam"] - 0.12, 0.13, 0.45, 600, 5000, rev=True)
for t in a2["react"]:
    whoosh(t - 0.05, 0.18, 0.3, 900, 6000)
    boom(t, 0.18, 0.5)
whoosh(a2["mil"] - 0.08, 0.12, 0.22, 900, 5000, rev=True)

# act 3
rain(a3["start"], a3["door"] + 0.2, 0.2, fade_from=a3["bell"][0] - 0.4)
for t in a3["thunder"]:
    thunder(t, 0.5)
whoosh(a3["throw"] - 0.02, 0.55, 0.32, 300, 4000)
splash(a3["splash"], 0.3)
bell(a3["bell"][0], 659.25, 0.32)
bell(a3["bell"][1], 523.25, 0.32, 2.6)
shimmer(a3["door"] + 0.2, a3["end"] - a3["door"], 0.07)
riser(a3["end"] - 0.9, a3["end"], 0.12)

# brand
boom(br["start"], 0.45, 2.0)
shimmer(br["start"], 1.4, 0.06)
shimmer(br["shine"], 0.9, 0.05)

# ═══════════════════════════════════ MIX ═══════════════════════════════════
def duck(t0, t1, floor, att, rel):
    g = np.ones(N)
    i0, i1, a, r = int(t0 * SR), int(t1 * SR), int(att * SR), int(rel * SR)
    g[i0 : i0 + a] = np.linspace(1, floor, a)
    g[i0 + a : i1] = floor
    g[i1 : i1 + r] = np.linspace(floor, 1, r)
    return g


MUS /= np.max(np.abs(MUS)) + 1e-9
MUS *= duck(a2["hush"] - 0.02, a2["slam"] - 0.006, 0.015, 0.05, 0.006)
MUS *= duck(a3["splash"] + 0.05, a3["door"], 0.08, 0.3, 0.05)
mix = MUS * 0.78 + FX
fade = int(0.6 * SR)
mix[:, -fade:] *= np.linspace(1, 0, fade)
def smooth(x, k):
    cs = np.cumsum(np.concatenate([[0.0], x]))
    m = (cs[k:] - cs[:-k]) / k
    pad = len(x) - len(m)
    return np.concatenate([np.full(pad // 2, m[0]), m, np.full(pad - pad // 2, m[-1])])


# gentle lookahead compression so dialogue-free drama still reads loud on phone speakers
rms = np.sqrt(np.maximum(smooth((mix**2).mean(0), int(0.03 * SR)), 1e-12))
over = np.maximum(0, 20 * np.log10(rms) + 24)
gain = 10 ** (smooth(-over * (1 - 1 / 3.0), int(0.08 * SR)) / 20)
mix *= gain
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(mix * 1.6) / np.tanh(1.6)
mix /= np.max(np.abs(mix)) / 0.93
pcm = (mix.T * 32767).astype(np.int16)
os.makedirs("public/audio", exist_ok=True)
with wave.open("public/audio/thiqa.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok", pcm.shape, f"{pcm.shape[0] / SR:.2f}s")
