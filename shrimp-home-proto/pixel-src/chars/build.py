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
