"""Puti's yard drawings (keyframes/yard.aseprite) -> sprites for the home.
python3 build.py <yard.aseprite> <_layout.json> <outdir>
Writes yd-<name>.png per item and yard.json: size, anchor (her feet point), and for the coop the nest box,
for the feeders the seed pixels (so the game can show how full they are), the tray line and perches.
"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import ase
from PIL import Image

src, layout, out = sys.argv[1:4]
os.makedirs(out, exist_ok=True)
a = ase.read(src)
lay = [f for f in json.load(open(layout)) if f['file'] == 'yard'][0]
WANT = {'coop': 'coop', 'rock-rock-1': 'rock', 'rock-rock-3': 'bigrock', 'feeder-post-full': 'feeder', 'feeder-hanging-full': 'feederhang'}
meta = {}
for it in lay['items']:
    if it['name'] not in WANT:
        continue
    li = [i for i, L in enumerate(a['layers']) if L['name'] == it['title']]
    im = ase.flatten(a, 0, set(li))
    bb = im.getbbox()
    # her drawing may have grown past the old box: keep anything within 12 px of it
    x0, y0 = max(min(bb[0], it['x']), it['x'] - 12), max(min(bb[1], it['y']), it['y'] - 12)
    x1, y1 = min(max(bb[2], it['x'] + it['w']), it['x'] + it['w'] + 12), min(max(bb[3], it['y'] + it['h']), it['y'] + it['h'] + 12)
    im = im.crop((x0, y0, x1, y1))
    name = WANT[it['name']]
    fx, fy = it['feet'][0] - x0, it['feet'][1] - y0
    m = {'w': im.width, 'h': im.height, 'ax': fx, 'ay': fy}
    px = im.load()
    if name == 'coop':
        # the straw in the nest: yellow pixels
        ys = [(x, y) for y in range(im.height) for x in range(im.width) if px[x, y][3] and px[x, y][0] > 200 and px[x, y][1] > 160 and px[x, y][2] < 140]
        if ys:
            nx0, ny0 = min(p[0] for p in ys), min(p[1] for p in ys)
            nx1 = max(p[0] for p in ys)
            m['nest'] = {'x': nx0 - fx, 'y': ny0 - fy, 'w': nx1 - nx0}
    if name.startswith('feeder'):
        # glass column: the seed pixels are the orange-brown ones inside the pale glass box
        seeds = [(x, y) for y in range(im.height) for x in range(im.width) if px[x, y][3] and 150 < px[x, y][0] and 90 < px[x, y][1] < 200 and px[x, y][2] < 140 and abs(px[x, y][0] - px[x, y][1]) > 25]
        # the tray: the widest run of the wooden brown below the seeds
        if seeds:
            sy0, sy1 = min(p[1] for p in seeds), max(p[1] for p in seeds)
            sx0, sx1 = min(p[0] for p in seeds), max(p[0] for p in seeds)
            m['seed'] = {'x0': sx0, 'y0': sy0, 'x1': sx1, 'y1': sy1}
            tray = sy1 + 2
            row = [x for x in range(im.width) if px[x, tray][3]]
            m['tray'] = tray - fy
            m['perch'] = [[min(row) - fx + 1, tray - fy], [max(row) - fx - 1, tray - fy], [0, sy0 - 10 - fy]] if row else []
    im.save(f'{out}/yd-{name}.png')
    meta[name] = m
json.dump(meta, open(f'{out}/yard.json', 'w'), indent=1)
print(json.dumps(meta))
