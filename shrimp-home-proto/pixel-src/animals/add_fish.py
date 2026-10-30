"""python3 add_fish.py <fishandbird.aseprite> <src/animart.js> "Layer name:L|R" ...
Adds or replaces fish in animart.js from her layers without rebuilding the rest. L/R = the way the head faces in her drawing.
Swim frames as in gen.py (all face right in the sheet)."""
import sys, os, json, base64, io
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, os.path.dirname(__file__))
from ase import read
import gen
fb = read(sys.argv[1]); js = sys.argv[2]
s = open(js).read()
i = s.index('var ANIMSRC=') + 12; j = s.index(';\nvar ANIMMETA=')
SRC = json.loads(s[i:j]); META = json.loads(s[j + 15:s.rindex(';')])
for arg in sys.argv[3:]:
    title, face = arg.rsplit(':', 1)
    src = gen.layer(fb, title); frames = gen.fish_frames(src, face); im, w, h = gen.sheet(frames)
    assert not any(f[y][x][3] for f in frames for y in (0, len(f) - 1) for x in range(len(f[0]))), (title, 'cut off')
    slug = title.lower().replace(' ', '-'); b = io.BytesIO(); im.save(b, 'PNG')
    SRC['an-fish-' + slug] = 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()
    META['fish'][slug] = {'w': w, 'h': h, 'poses': {'swim': [0, len(frames)]}, 'title': title}
    print('fish', slug, w, h)
open(js, 'w').write(s[:i] + json.dumps(SRC) + ';\nvar ANIMMETA=' + json.dumps(META) + ';\n')
