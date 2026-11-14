"""Bacteria ad soundtrack — 30 s -> public/audio/bacteria-ad.wav"""
import wave, numpy as np

SR = 44100
DUR = 30.0
N = int(SR * DUR)
rng = np.random.default_rng(42)
L = np.zeros(N); R = np.zeros(N)

def put(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    sig = sig[:N - i] * gain
    L[i:i+len(sig)] += sig * (1 - max(0, pan))
    R[i:i+len(sig)] += sig * (1 + min(0, pan))

def env(n, a=0.005, r=0.2):
    e = np.ones(n); na,nr = int(a*SR),int(r*SR)
    na = min(na, n); nr = min(nr, n - na)
    if na: e[:na]  = np.linspace(0,1,na)
    if nr: e[-nr:] *= np.linspace(1,0,nr)
    return e

def lowpass(x, k):
    y=np.empty_like(x); acc=0.0
    for i in range(len(x)):
        acc += k*(x[i]-acc); y[i]=acc
    return y

def noise(d): return rng.standard_normal(int(d*SR))
def hz(n): return 440.0*2**((n-69)/12)

def sine(f,d,a=0.4,r=0.4):
    t=np.arange(int(d*SR))/SR
    return np.sin(2*np.pi*f*t)*env(len(t),a,r)

def ding(f,d=1.4):
    t=np.arange(int(d*SR))/SR
    s=sum(np.sin(2*np.pi*f*m*t)*w for m,w in [(1,1),(2.76,.4),(5.4,.2)])
    return s*np.exp(-t*3.5)*env(len(t),0.001,0.05)

def pluck(f,d,bright=0.5):
    n=int(d*SR); p=max(2,int(SR/f))
    buf=rng.uniform(-1,1,p); buf=lowpass(buf,bright)
    out=np.empty(n)
    for i in range(n):
        out[i]=buf[i%p]; buf[i%p]=0.5*(buf[i%p]+buf[(i+1)%p])*0.996
    return out*env(n,0.002,0.05)

def reverb(x,mix=0.25):
    y=x.copy()
    for dl,g in [(.031,.5),(.047,.42),(.071,.35),(.113,.28)]:
        k=int(dl*SR); y[k:]+=x[:-k]*g*mix*2
    return y

# ── 0–4s  Kitchen ambience (normal) ──────────────────────────────────────────
# Running water
water = lowpass(noise(5.0), 0.08) * 0.4
put(water * env(len(water), 0.5, 0.8), 0, 0.18)
# Dish clinks
for t0 in (0.6, 1.4, 2.1, 2.9, 3.5):
    clink = noise(0.04)
    clink = clink - lowpass(clink, 0.1)
    clink = lowpass(clink, 0.7)
    put(clink * env(len(clink), 0.001, 0.08) * 0.9, t0, 0.3, pan=0.2)

# ── 3–6s  Smell / discovery — suspense ───────────────────────────────────────
drone = sine(hz(38), 3.0, 0.3, 0.6) + 0.5*sine(hz(39), 3.0, 0.3, 0.6)
put(drone * env(len(drone), 0.3, 0.6), 3.2, 0.14)

# ── 6–8s  Horror sting ───────────────────────────────────────────────────────
sting = np.zeros(int(0.8*SR))
for f0,amp in [(hz(80),0.6),(hz(76),.4),(hz(71),.3),(hz(66),.2)]:
    t=np.arange(len(sting))/SR
    sting += np.sin(2*np.pi*f0*t)*np.exp(-t*8)*amp
put(sting*env(len(sting),0.001,0.1), 6.1, 0.55)

# ── 7–19s  Bacteria world (quirky, whimsical) ─────────────────────────────────
# Light bouncy melody
BPM=116; beat=60/BPM
melody=[
    (hz(69),.5),(hz(71),.5),(hz(74),1),(hz(72),.5),(hz(71),.5),
    (hz(69),1),(hz(67),.5),(hz(69),.5),(hz(71),1),(hz(74),2),
    (hz(72),.5),(hz(71),.5),(hz(69),1),(hz(67),.5),(hz(66),.5),(hz(67),2),
    (hz(69),.5),(hz(71),.5),(hz(74),1),(hz(76),.5),(hz(74),.5),(hz(72),2),
    (hz(71),.5),(hz(69),.5),(hz(67),1),(hz(69),2),
]
t0=7.3
for f,b in melody:
    if t0>18: break
    put(pluck(f, min(1.4,b*beat+0.5), 0.6), t0, 0.25, 0.1)
    t0 += b*beat

# Quirky pizzicato counterpoint
t0=7.5
for f,b in [(hz(62),.5),(hz(64),.5),(hz(66),.5),(hz(67),.5)]*8:
    if t0>18: break
    put(pluck(f, 0.3, 0.7), t0, 0.1, -0.15)
    t0 += b*beat

# Soft pad chords (creepy-cute)
for c0,notes in [(7.3,[50,57,62]),(10.5,[52,59,64]),(13.7,[55,62,67]),(16.9,[50,57,62])]:
    pad=sum(sine(hz(n), 3.4, 0.6, 0.9) for n in notes)/3
    put(reverb(pad,0.3)*env(len(pad),0.2,0.9), c0, 0.09)

# Bubble pops (bacteria world SFX)
for t0 in (8.2,9.1,10.0,11.4,12.5,13.2,14.8,16.0,17.1):
    pop = sine(hz(80 + rng.integers(20)), 0.12, 0.001, 0.2)
    put(pop, t0, 0.2, (-0.5+rng.random()))

# ── 18–20s  Moaj arrival — dramatic swell ────────────────────────────────────
riser = noise(2.2)
riser = lowpass(riser, 0.08) * np.linspace(0,1,len(riser))**2
put(riser*env(len(riser),0.1,0.2), 18.0, 0.28)

# Bacteria panic SFX (scrambling)
for k in range(12):
    t=np.arange(int(0.08*SR))/SR
    scr = np.sin(2*np.pi*(300+k*40)*t)*np.exp(-t*40)
    put(scr*env(len(scr),0.001,0.1), 18.5+k*0.08, 0.2, (-0.6+k*0.1))

# ── 20–24s  Clean resolution ──────────────────────────────────────────────────
# Bright warm melody
clean_mel=[(hz(74),1),(hz(78),1),(hz(81),.5),(hz(79),.5),(hz(78),2)]
t0=20.1
for f,b in clean_mel:
    put(pluck(f, min(1.6,b*beat+0.5), 0.5), t0, 0.3, 0.1)
    t0 += b*beat
# Sparkle dings
for k,f in enumerate([hz(93),hz(96),hz(100),hz(105)]):
    put(ding(f,1.2), 20.4+k*0.14, 0.18, -0.4+k*0.3)
put(sine(hz(55),4.0,0.5,0.8)+0.5*sine(hz(62),4.0,0.5,0.8), 20.0, 0.1)

# ── 22–30s  End card music ────────────────────────────────────────────────────
end_mel=[(hz(74),1),(hz(76),1),(hz(78),2),(hz(76),1),(hz(74),1),(hz(72),2),
         (hz(74),1),(hz(78),1),(hz(81),1.5),(hz(79),.5),(hz(78),2)]
t0=22.4
for f,b in end_mel:
    if t0>29: break
    put(pluck(f, min(1.6,b*beat+0.5), 0.5), t0, 0.3, 0.12)
    t0 += b*beat
# Warm pad
pad=sum(sine(hz(n), 8.0, 0.6, 1.2) for n in [50,57,62,66])/4
put(reverb(pad,0.3)*env(len(pad),0.4,1.2), 22.0, 0.11)
# Final glitter ding
put(ding(hz(98),2.5), 28.5, 0.22)
put(ding(hz(102),2.0), 28.8, 0.16)

# ── master ────────────────────────────────────────────────────────────────────
mix = np.stack([L,R])
fade = int(1.0*SR)
mix[:,-fade:] *= np.linspace(1,0,fade)
mix = np.tanh(mix*1.1)
mx = np.max(np.abs(mix))
if mx > 0: mix /= mx / 0.88
pcm = (mix.T*32767).astype(np.int16)
with wave.open("public/audio/bacteria-ad.wav","wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok", pcm.shape)
