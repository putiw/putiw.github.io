"""python3 add_birds.py <fishandbird.aseprite> <src/animart.js>
Adds the birds in NEW (Puti's Firecrest, Great Tit, Magpie, 28 Oct) to animart.js without rebuilding the rest,
and checks that no frame of any bird touches its frame edge (head, tail and feet all inside)."""
import sys, os, json, base64, io
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, os.path.dirname(__file__))
from ase import read
from PIL import Image
import gen
# name: (layer, flip, legtop, legx, hip, shoulder, wingL, fly layer)
NEW = {
    'firecrest': ('Firecrest', True, 21, (18, 42), (29, 20), (34, 9), 18, None),
    'tit': ('Great Tit', True, 31, (45, 67), (58, 30), (60, 12), 24, None),
    'magpie': ('Magpie', True, 38, (66, 88), (75, 36), (78, 18), 34, None),
}
# the tit's back is yellow-green round the shoulder, so its open wing takes her blue-grey wing feathers instead
WINGC = {'tit': ((106, 136, 190, 255), (64, 94, 142, 255), (151, 167, 194, 255))}
fb = read(sys.argv[1]); js = sys.argv[2]
s = open(js).read()
i = s.index('var ANIMSRC=') + 12; j = s.index(';\nvar ANIMMETA=')
SRC = json.loads(s[i:j]); META = json.loads(s[j + 15:s.rindex(';')])
def edge_ok(f):
    H, W = len(f), len(f[0])
    return not any(f[y][x][3] for y in range(H) for x in (0, W - 1)) and not any(f[y][x][3] for x in range(W) for y in (0, H - 1))
for name, v in NEW.items():
    spec = gen.auto_spec(fb, *v)
    if name in WINGC: spec['wingc'] = WINGC[name]
    src, at = gen.layer_at(fb, spec['layer'])
    if spec['flip']: src = src.transpose(Image.FLIP_LEFT_RIGHT)
    frames, rows = [], {}
    for pose, n in gen.BIRD_POSES.items():
        rows[pose] = [len(frames), n]
        for t in range(n): frames.append(gen.bird_frame(src, spec, pose, t, None))
    bad = [k for k, f in enumerate(frames) if not edge_ok(f)]
    assert not bad, (name, 'frames touch the edge', bad)
    im, w, h = gen.sheet(frames)
    im.save('/tmp/claude-0/nb/bird-%s.png' % name)
    b = io.BytesIO(); im.save(b, 'PNG')
    SRC['an-bird-' + name] = 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()
    feet = max(y for y in range(src.height) for x in range(spec['legx'][0], min(src.width, spec['legx'][1] + 1)) if y >= spec['legtop'] and src.getpixel((x, y))[3])
    META['birds'][name] = {'w': w, 'h': h, 'poses': rows, 'title': spec['layer'], 'ax': spec['pad'] + spec['hip'][0], 'ay': spec['pad'] + feet + 1}
    print(name, w, h, 'ok')
# check every bird already in the file too
for k, v in SRC.items():
    if not k.startswith('an-bird-'): continue
    im = Image.open(io.BytesIO(base64.b64decode(v.split(',')[1]))).convert('RGBA'); m = META['birds'][k[8:]]
    n = im.width // m['w']; bad = []
    for f in range(n):
        c = im.crop((f * m['w'], 0, (f + 1) * m['w'], m['h']))
        bb = c.getbbox()
        if bb and (bb[0] == 0 or bb[1] == 0 or bb[2] == m['w'] or bb[3] == m['h']): bad.append(f)
    print('check', k, n, 'frames', 'cut off: %s' % bad if bad else 'none cut off')
open(js, 'w').write(s[:i] + json.dumps(SRC) + ';\nvar ANIMMETA=' + json.dumps(META) + ';\n')
