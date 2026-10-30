"""python3 add_dog_millie.py <characters dir> <src/animart.js>
Puti's 30 Oct frames into animart.js, nothing else rebuilt.
- dog.aseprite, 46 frames (guide layers left out): 0-31 as before; 32-35 stand, tail wagging; 36 stand, head to you;
  37 stand, looking back; 38 sit, looking back; 39 sit, half turned; 40 sit; 41-42 sit, panting; 43 sit front, tongue out;
  44 sit front; 45 asleep, curled up.
- millie_walk.aseprite, 52 frames: 0 stand, 1 stand with arms relaxed (new), right 2-13, left 14-25, 26 stand,
  down 27-38, 39 back, up 40-51. Two blinks made from her eye pixels go on the end: 52 = 0 blinking, 53 = 1 blinking.
- millie2 (pixart.js: stand right, stand left, sit) is rebuilt from the new frames as build.py does."""
import sys, os, json, base64, io, re
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import ase
import numpy as np
from PIL import Image

d, js = sys.argv[1], sys.argv[2]
s = open(js).read()
i = s.index('var ANIMSRC=') + 12; j = s.index(';\nvar ANIMMETA=')
SRC = json.loads(s[i:j]); META = json.loads(s[j + 15:s.rindex(';')])
uri = lambda im: (lambda b: (im.save(b, 'PNG'), 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode())[1])(io.BytesIO())


def frames(name):
    a = ase.read(os.path.join(d, name + '.aseprite'))
    keep = [k for k, L in enumerate(a['layers']) if 'guide' not in L['name'].lower()]
    return a, [ase.flatten(a, k, only=keep) for k in range(len(a['frames']))]


# dog
a, fr = frames('dog')
fr = [f.crop((8, 8, 136, 136)) for f in fr]
assert len(fr) == 46, len(fr)
im = Image.new('RGBA', (128 * len(fr), 128))
for k, f in enumerate(fr):
    im.alpha_composite(f, (k * 128, 0))
SRC['dog'] = uri(im)
tags = {t['name']: [t['frm'], t['to'] - t['frm'] + 1] for t in a['tags']}
tags.update({'wag': [32, 4], 'look-you': [36, 1], 'look-back': [37, 1], 'sit-look-back': [38, 1], 'sit-turn': [39, 1],
             'sit-side': [40, 1], 'pant': [41, 2], 'sit-front-tongue': [43, 1], 'sit-front': [44, 1], 'sleep': [45, 1]})
META['chars']['dog'] = {'w': 128, 'h': 128, 'n': 46, 'poses': tags}
print('dog', len(fr), 'frames')

# Millie
a, fr = frames('millie_walk')
assert len(fr) == 52, len(fr)
new = [np.asarray(f).copy() for f in fr]
EYE, LASH = (11, 14, 20), (59, 32, 39)


def blink(f):
    """Her eyes are 3x2: white, pupil, white over white, pupil, lash. Shut = skin, with a lash line on the lower row."""
    g = f.copy()
    ys, xs = np.nonzero((g[:48, :, :3] == EYE).all(axis=2) & (g[:48, :, 3] > 0))
    assert len(xs) >= 2, 'no eyes'
    skin = tuple(g[ys.min() - 1, xs.min()][:3])
    for x0 in sorted(set(xs)):
        y0 = ys[xs == x0].min()
        for yy in (y0, y0 + 1):
            for xx in (x0 - 1, x0, x0 + 1):
                g[yy, xx, :3] = skin
        for xx in (x0 - 1, x0, x0 + 1):
            g[y0 + 1, xx, :3] = LASH
    return g


new += [blink(new[0]), blink(new[1])]
W = 128
im = Image.new('RGBA', (W * len(new), W))
for k, f in enumerate(new):
    im.paste(Image.fromarray(f), (k * W, 0))
SRC['millie'] = uri(im)
im.save('/tmp/claude-0/nb/millie-sheet.png')
pj = open(os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'pixart.js')).read()


def pix(k):
    m = re.search('"' + k + r'":\s*"data:image/[a-z]+;base64,([^"]+)"', pj)
    return np.asarray(Image.open(io.BytesIO(base64.b64decode(m.group(1)))).convert('RGBA')).astype(int)


old, m2 = pix('millie'), pix('millie2')
out2 = Image.new('RGBA', (W * 3, W))
for k, (oi, ni, flip) in enumerate([(9, 10, False), (9, 10, True), (0, 0, False)]):
    o = old[:, oi * W:(oi + 1) * W]; n = new[ni].astype(int)
    if flip:
        o, n = o[:, ::-1], n[:, ::-1]
    d2 = m2[:, k * W:(k + 1) * W].copy()
    keep = np.abs(d2 - o).max(axis=2) <= 8
    d2[keep] = n[keep]
    out2.paste(Image.fromarray(d2.astype('uint8')), (k * W, 0))
SRC['millie2'] = uri(out2)
META['chars']['millie'] = {'w': 128, 'h': 128, 'n': len(new), 'stand': 0, 'relax': 1, 'blink': 52, 'blinkRelax': 53,
                           'right': [2, 12], 'left': [14, 12], 'down': [27, 12], 'backIdle': 39, 'up': [40, 12]}
print('millie', len(new), 'frames')
open(js, 'w').write(s[:i] + json.dumps(SRC) + ';\nvar ANIMMETA=' + json.dumps(META) + ';\n')
