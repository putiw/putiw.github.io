"""Puti's character files -> sheets for the home (added to src/animart.js by export).
python3 build.py <characters dir> <outdir>
- dog.aseprite: 32 frames of 144 -> 128 (crop 8 px each side, same as pixart.js's dog layout)
- cat-pierre.aseprite: 13 frames, tags walk-right, walk-left, nap, look-up, sit
- grandma.aseprite: 2 frames, sit-knit
Hidden guide layers are left out.
"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import ase
from PIL import Image

d, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
meta = {}


def sheet(name, crop=None):
    a = ase.read(os.path.join(d, name + '.aseprite'))
    fr = [ase.flatten(a, i) for i in range(len(a['frames']))]
    if crop:
        fr = [f.crop(crop) for f in fr]
    w, h = fr[0].size
    im = Image.new('RGBA', (w * len(fr), h))
    for i, f in enumerate(fr):
        im.alpha_composite(f, (i * w, 0))
    return im, w, h, {t['name']: [t['frm'], t['to'] - t['frm'] + 1] for t in a['tags']}


im, w, h, tags = sheet('dog', (8, 8, 136, 136))
im.save(f'{out}/dog.png'); meta['dog'] = {'w': w, 'h': h, 'poses': tags}
im, w, h, tags = sheet('cat-pierre')
im.save(f'{out}/pierre.png'); meta['pierre'] = {'w': w, 'h': h, 'poses': tags, 'ax': 36, 'ay': 47}
im, w, h, tags = sheet('grandma')
im.save(f'{out}/grandma.png'); meta['grandma'] = {'w': w, 'h': h, 'poses': tags, 'ax': 43, 'ay': 89}
json.dump(meta, open(f'{out}/chars.json', 'w'), indent=1)
print(json.dumps(meta))

# Millie: her walk sheet as is, and the three derived poses in pixart.js's 'millie2' (stand right = frame 9,
# stand left = frame 9 mirrored, sit = frame 0) get her new pixels wherever they still match the old frame they came from
import re, base64, io
import numpy as np
a = ase.read(os.path.join(d, 'millie_walk.aseprite'))
new = [np.asarray(ase.flatten(a, i)).copy() for i in range(len(a['frames']))]
W = 128
im = Image.new('RGBA', (W * len(new), W))
for i, f in enumerate(new):
    im.paste(Image.fromarray(f), (i * W, 0))
im.save(f'{out}/millie.png')
js = open(os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'pixart.js')).read()
def pix(k):
    m = re.search('"' + k + r'":\s*"data:image/[a-z]+;base64,([^"]+)"', js)
    return np.asarray(Image.open(io.BytesIO(base64.b64decode(m.group(1)))).convert('RGBA')).astype(int)
old, m2 = pix('millie'), pix('millie2')
src = [(9, False), (9, True), (0, False)]
out2 = Image.new('RGBA', (W * 3, W))
for k, (fi, flip) in enumerate(src):
    o = old[:, fi * W:(fi + 1) * W]
    n = new[fi].astype(int)
    if flip:
        o, n = o[:, ::-1], n[:, ::-1]
    d2 = m2[:, k * W:(k + 1) * W].copy()
    keep = np.abs(d2 - o).max(axis=2) <= 8          # this pixel was copied from the old frame
    d2[keep] = n[keep]
    out2.paste(Image.fromarray(d2.astype('uint8')), (k * W, 0))
out2.save(f'{out}/millie2.png')
print('millie', len(new), 'frames, millie2 3 poses')
