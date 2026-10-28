"""python3 add_pierre.py <cat-pierre.aseprite> <src/animart.js>
Puti's new Pierre (28 Oct): walk-left is frames 5-20; 20 repeats 19 and she left out 5, so the walk is 6-19.
Writes the whole sheet and the poses into animart.js without rebuilding the rest. The game mirrors walk-left to walk right."""
import sys, os, json, io, base64
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import ase
from PIL import Image
a = ase.read(sys.argv[1]); js = sys.argv[2]
fr = [ase.flatten(a, i) for i in range(len(a['frames']))]
w, h = fr[0].size
im = Image.new('RGBA', (w * len(fr), h))
for i, f in enumerate(fr): im.alpha_composite(f, (i * w, 0))
poses = {t['name']: [t['frm'], t['to'] - t['frm'] + 1] for t in a['tags']}
wl = poses['walk-left']
# drop repeated frames at the end of the walk (19 and 20 are the same drawing)
while wl[1] > 1 and list(fr[wl[0] + wl[1] - 1].getdata()) == list(fr[wl[0] + wl[1] - 2].getdata()): wl[1] -= 1
# Puti, 28 Oct: frame 5 is left out too, the walk is 6-19
wl[0] += 1; wl[1] -= 1
# her head numbers from the walk editor (28 Oct): the front (head and shoulders, x 0-34, y 0-35) moves up or down as one piece,
# a raised front fills the row it leaves from the row under it. These become the 'walk' pose, after her own frames.
# frames 6-19 without 15 (Puti, 28 Oct, try it without), 1-based as in Aseprite
WALK = [6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19]
HEAD = [0, 0, -1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1]
FX, FY = 34, 35
def bob(f, dy):
    if not dy: return f.copy()
    o = f.copy(); front = f.crop((0, 0, FX + 1, FY + 1))
    o.paste((0, 0, 0, 0), (0, 0, FX + 1, FY + 1))
    if dy < 0: o.paste(f.crop((0, FY, FX + 1, FY + 1)), (0, FY))
    o.alpha_composite(front, (0, dy)) if dy < 0 else None
    if dy > 0:
        o.alpha_composite(front.crop((0, 0, FX + 1, FY + 1 - dy)), (0, dy))
    return o
walk = [bob(fr[n - 1], HEAD[k]) for k, n in enumerate(WALK)]
assert len(walk) == len(HEAD), (len(walk), len(HEAD))
poses['walk'] = [len(fr), len(walk)]
fr = fr + walk
im = Image.new('RGBA', (w * len(fr), h))
for i, f in enumerate(fr): im.alpha_composite(f, (i * w, 0))
for i, f in enumerate(fr):
    bb = f.getbbox()
    assert not bb or (bb[0] > 0 and bb[1] > 0 and bb[2] < w and bb[3] < h), ('frame', i + 1, 'touches the edge')
s = open(js).read()
i = s.index('var ANIMSRC=') + 12; j = s.index(';\nvar ANIMMETA=')
SRC = json.loads(s[i:j]); META = json.loads(s[j + 15:s.rindex(';')])
b = io.BytesIO(); im.save(b, 'PNG')
SRC['an-pierre'] = 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()
META['chars']['pierre'] = {'w': w, 'h': h, 'poses': poses, 'ax': 36, 'ay': 47}
open(js, 'w').write(s[:i] + json.dumps(SRC) + ';\nvar ANIMMETA=' + json.dumps(META) + ';\n')
print(w, h, poses)
