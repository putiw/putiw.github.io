"""Seamless room tiles, same colours and rules as the code in land.js (floorPx, stoneWall, paleWall),
so Puti can paint over them in Aseprite and the home can tile her version.
python3 tiles.py <outdir>  ->  floor-wood.aseprite (256x64), wall-stone.aseprite (128x112), wall-pale.aseprite (64x112) + PNGs
"""
import sys, os, random
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import ase
from PIL import Image


def hx(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (255,)


def mix(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3)) + (255,)


def lt(c, t): return mix(c, hx('#fff4dc'), t)
def dk(c, t): return mix(c, hx('#1c1830'), t)


def floor(W=256, H=64, seed=5):
    r = random.Random(seed)
    P = [hx(c) for c in ('#b6733f', '#ad6b3b', '#bb7a45', '#a66536')]
    SEAM, GRAIN, HI = hx('#74401f'), hx('#9a5a31'), hx('#c4844e')
    im = Image.new('RGBA', (W, H))
    pl = 128  # plank length; W is a multiple so the tile wraps
    for row in range(H // 16):
        off = r.randrange(0, pl // 16) * 16
        cols = [r.choice(P) for _ in range(W // pl)]
        for ry in range(16):
            y = row * 16 + ry
            for x in range(W):
                sx = (x + off) % pl
                seg = ((x + off) // pl) % len(cols)
                if ry == 0 or sx == 0:
                    c = SEAM
                elif ry == 1 and r.random() < 0.35:
                    c = HI
                elif 3 < ry < 14 and r.random() < 0.045:
                    c = GRAIN
                else:
                    c = cols[seg]
                im.putpixel((x, y), c)
    return im


def stone(W=128, H=112, seed=11):
    r = random.Random(seed)
    SC = [hx(c) for c in ('#7d828a', '#8f949b', '#a3a7ad', '#b6babf', '#c9ccd0', '#6d7279', '#dfe1e3', '#9a9ea4')]
    EDGE = hx('#3c3f45')
    im = Image.new('RGBA', (W, H), hx('#e6e2da'))
    # row heights 11..16 that add up to H exactly
    rows, y = [], 0
    while H - y > 16:
        h = r.randint(11, 16)
        if H - y - h < 11 and H - y - h != 0:
            h = H - y if H - y <= 16 else H - y - 11
        rows.append(h); y += h
    if y < H:
        rows.append(H - y)
    y = 0
    for rh in rows:
        widths, tot = [], 0
        while tot < W:
            w = r.randint(14, 33)
            if W - tot - w < 14:
                w = W - tot
            widths.append(w); tot += w
        x = r.randrange(0, W)
        for sw in widths:
            c = r.choice(SC)
            cl, cd = lt(c, 0.22), dk(c, 0.12)
            sx0, sx1, sy0, sy1 = x + 1, x + sw - 1, y + 1, y + rh - 1
            for j in range(sy0, sy1):
                for i in range(sx0, sx1):
                    ex, ey = i in (sx0, sx1 - 1), j in (sy0, sy1 - 1)
                    if ex and ey:
                        continue
                    col = EDGE if (ex or ey) else cl if j == sy0 + 1 else cd if j == sy1 - 2 else c
                    im.putpixel((i % W, j), col)
            x += sw
        y += rh
    return im


def pale(W=64, H=112, seed=3):
    r = random.Random(seed)
    im = Image.new('RGBA', (W, H), hx('#d4e6f3'))
    for i in range(W):
        if r.random() < 0.06:
            l = 6 + r.randrange(16)
            s = r.randrange(H - l)
            for j in range(s, s + l):
                im.putpixel((i, j), hx('#c6dbec'))
    return im


if __name__ == '__main__':
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    for name, im in (('floor-wood', floor()), ('wall-stone', stone()), ('wall-pale', pale())):
        im.save(f'{out}/{name}.png')
        ase.write(f'{out}/{name}.aseprite', [im], layer_name=name)
        print(name, im.size)
