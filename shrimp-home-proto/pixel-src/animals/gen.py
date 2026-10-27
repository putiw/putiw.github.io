"""Animation frames for hens, birds and fish, built from Puti's own drawings.
Hens: her white hen (hens.aseprite, Layer 1) recoloured into the other breeds.
Birds: her bulbul and myna (fishandbird.aseprite). Fish: her seven fish (same file).
Only her pixels are used; poses move whole parts (legs, head, tail) and add a neck, legs or wings in her palette.

python3 gen.py <hens.aseprite> <fishandbird.aseprite> <outdir>
Writes <outdir>/<name>.png (one row of frames) and <outdir>/manifest.json.
"""
import sys, os, json, math
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ase import read
from PIL import Image

A = (9, 6, 9, 255)
T = (0, 0, 0, 0)


def layer(a, name):
    i = next(i for i, L in enumerate(a['layers']) if L['name'] == name)
    c = next(c for c in a['frames'][0]['cels'] if c['layer'] == i)
    im = c['img'].convert('RGBA')
    return im.crop(im.getbbox())


def grid(im):
    return [[im.getpixel((x, y)) for x in range(im.width)] for y in range(im.height)]


def toimg(g):
    h, w = len(g), len(g[0])
    im = Image.new('RGBA', (w, h))
    im.putdata([p for r in g for p in r])
    return im


def blank(w, h):
    return [[T] * w for _ in range(h)]


def put(g, x, y, p):
    if 0 <= y < len(g) and 0 <= x < len(g[0]):
        g[y][x] = p


def paste(dst, src, ox, oy, mask=None):
    for y, r in enumerate(src):
        for x, p in enumerate(r):
            if p[3] and (mask is None or mask(x, y)):
                put(dst, x + ox, y + oy, p)


def outline(g, fillset, col):
    """Ink outline around pixels in fillset (list of (x,y)) where the canvas is empty."""
    s = set(fillset)
    for (x, y) in fillset:
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                xx, yy = x + dx, y + dy
                if (xx, yy) in s:
                    continue
                if 0 <= yy < len(g) and 0 <= xx < len(g[0]) and g[yy][xx][3] == 0:
                    g[yy][xx] = col


def disc_pts(cx, cy, r):
    return [(x, y) for x in range(int(cx - r) - 1, int(cx + r) + 2) for y in range(int(cy - r) - 1, int(cy + r) + 2)
            if (x - cx) ** 2 + (y - cy) ** 2 <= r * r]


def line_pts(x0, y0, x1, y1):
    n = max(abs(x1 - x0), abs(y1 - y0), 1)
    return [(round(x0 + (x1 - x0) * i / n), round(y0 + (y1 - y0) * i / n)) for i in range(n + 1)]


# ---------------------------------------------------------------- hens

def hen_parts(src):
    g = grid(src)
    H, W = len(g), len(g[0])
    LEG = 31  # first row of legs (row 31 is the belly outline)
    body = [[g[y][x] if y < LEG else T for x in range(W)] for y in range(H)]
    head = [[T] * W for _ in range(H)]
    for y in range(H):
        for x in range(W):
            p = g[y][x]
            if not p[3]:
                continue
            if (y <= 11 and x >= 32) or (12 <= y <= 15 and x >= 39):
                head[y][x] = p
                body[y][x] = T
    return g, body, head, LEG


def draw_leg(g, hx, hy, fx, fy, leg, ink, toe_fwd=True):
    """3 px wide leg like hers: ink | leg colour | ink, foot 3 wide."""
    pts = line_pts(hx, hy, fx, fy)
    for (x, y) in pts:
        put(g, x - 1, y, ink); put(g, x + 1, y, ink)
    for (x, y) in pts:
        put(g, x, y, leg)
    # foot: like hers, AEEEA with ink under
    for dx in range(-2, 3):
        put(g, fx + dx, fy, ink if abs(dx) == 2 else leg)
        put(g, fx + dx, fy + 1, ink if abs(dx) < 2 else T)
    put(g, fx + (2 if toe_fwd else -2), fy, leg)
    put(g, fx + (3 if toe_fwd else -3), fy, ink)


def hen_frame(parts, pose, t):
    g0, body, head, LEG = parts
    W, H = len(g0[0]) + 8, len(g0) + 2
    g = blank(W, H)
    neckc = body[16][30]  # body colour
    leg = (217, 164, 58, 255)
    bob, hdx, hdy = 0, 0, 0
    feet = [(20, 0), (28, 0)]  # foot x, lift
    if pose == 'walk':
        k = t % 4
        feet = [[(18, 0), (30, 0)], [(20, 2), (28, 0)], [(22, 0), (26, 0)], [(20, 0), (28, 2)]][k]
        bob = -1 if k in (1, 3) else 0
    elif pose == 'peck':
        hdx, hdy = [(0, 0), (3, 9), (6, 20), (6, 21), (3, 9)][t % 5]
    elif pose == 'idle':
        hdy = [0, 0, 1, 0][t % 4]
    elif pose == 'run':
        k = t % 4
        feet = [[(16, 1), (32, 0)], [(22, 3), (26, 1)], [(32, 0), (16, 1)], [(26, 1), (22, 3)]][k]
        bob = [-2, -1, -2, -1][k]
    # legs: hips at the belly, inside the body
    floor = len(g0) - 2
    for i, (fx, lift) in enumerate(feet):
        hx = [20, 28][i]
        draw_leg(g, hx, LEG + bob - 1, fx, floor - lift, leg, A)
    paste(g, body, 0, bob)
    if hdx or hdy:
        # neck: discs from the base of the head to its new spot, then ink round it
        pts = []
        steps = 6
        for i in range(steps + 1):
            f = i / steps
            pts += disc_pts(35 + (hdx + 1) * f, 15 + bob + (hdy - 5) * f, 4.2)
        pts = list(set(pts))
        for (x, y) in pts:
            put(g, x, y, neckc)
        outline(g, pts, A)
    paste(g, head, hdx, hdy + bob)
    return g


def recolour(g, cmap, extra=None):
    out = [[cmap.get(p[:3], p) if p[3] else p for p in r] for r in g]
    if extra:
        extra(out, g)
    return out


def rgb(*c):
    return tuple(c) + (255,)


HEN_C, HEN_F, HEN_G, HEN_H, HEN_D = (247, 243, 234), (227, 220, 204), (189, 181, 166), (177, 171, 165), (60, 50, 40)


def breeds():
    def brown(g, src):
        pass

    def speckle(g, src):
        for y in range(len(g)):
            for x in range(len(g[0])):
                if src[y][x][:3] in (HEN_C, HEN_F) and ((x * 73856093) ^ (y * 19349663)) % 9 == 0 and 14 < y < 30:
                    g[y][x] = rgb(242, 236, 222)
                    if y + 1 < len(g) and src[y + 1][x][:3] in (HEN_C, HEN_F):
                        g[y + 1][x] = rgb(36, 28, 24)

    def jungle(g, src):
        # hackles: neck and head feathers orange-gold, streaked
        for y in range(len(g)):
            for x in range(len(g[0])):
                p = src[y][x]
                if p[:3] in (HEN_C, HEN_F) and x >= 30 and y <= 18:
                    g[y][x] = rgb(196, 98, 34) if (x % 3 == 0 and (y + x // 3) % 4 != 0) else rgb(232, 150, 52)

    return {
        'white': ({}, None),
        'brown': ({HEN_C: rgb(178, 110, 58), HEN_F: rgb(152, 90, 46), HEN_G: rgb(122, 70, 38), HEN_H: rgb(112, 64, 36),
                   HEN_D: rgb(72, 44, 30)}, brown),
        'speckled': ({HEN_C: rgb(128, 66, 40), HEN_F: rgb(108, 54, 34), HEN_G: rgb(88, 44, 30), HEN_H: rgb(80, 40, 28),
                      HEN_D: rgb(32, 26, 24)}, speckle),
        'blue': ({HEN_C: rgb(178, 182, 192), HEN_F: rgb(158, 162, 174), HEN_G: rgb(128, 132, 148), HEN_H: rgb(120, 124, 140),
                  HEN_D: rgb(68, 72, 90)}, None),
        'jungle': ({HEN_C: rgb(150, 82, 42), HEN_F: rgb(168, 54, 30), HEN_G: rgb(118, 38, 26), HEN_H: rgb(108, 34, 24),
                    HEN_D: rgb(24, 52, 42)}, jungle),
    }


def jungle_tail(g):
    """Wild junglefowl: two long dark green sickle feathers over the tail."""
    ink, f1, f2 = A, rgb(24, 52, 42), rgb(40, 84, 64)
    for arc, col in (([(9, 12), (6, 8), (3, 5), (1, 3), (0, 6)], f1), ([(8, 14), (4, 11), (1, 10), (0, 13)], f2)):
        pts = []
        for (x0, y0), (x1, y1) in zip(arc, arc[1:]):
            pts += line_pts(x0 + 4, y0, x1 + 4, y1)
        pts = list(set(pts))
        thick = list(set(pts + [(x + 1, y) for x, y in pts]))
        for (x, y) in thick:
            if not g[y][x][3] or g[y][x] == A:
                put(g, x, y, col)
        outline(g, thick, ink)


# ---------------------------------------------------------------- birds

def bird_frame(src, spec, pose, t):
    g0 = grid(src)
    H0, W0 = len(g0), len(g0[0])
    pad = 12
    W, H = W0 + 2 * pad, H0 + 2 * pad
    g = blank(W, H)
    legtop = spec['legtop']
    hx0 = spec['headx']
    body = [[g0[y][x] if y < legtop else T for x in range(W0)] for y in range(H0)]
    legs = [[g0[y][x] if y >= legtop else T for x in range(W0)] for y in range(H0)]
    head = blank(W0, H0)
    hcx, hcy, hrx, hry = spec['headell']
    for y in range(H0):
        for x in range(W0):
            if body[y][x][3] and ((x - hcx) / hrx) ** 2 + ((y - hcy) / hry) ** 2 <= 1:
                head[y][x] = body[y][x]
                body[y][x] = T
    by, hdx, hdy, tdy, showlegs, wing = 0, 0, 0, 0, True, None
    if pose == 'idle':
        tdy = [0, 1, 1, 1, 0, 0][t % 6]
        hdy = [0, 0, 0, 0, 0, 0][t % 6]
    elif pose == 'peck':
        hdx, hdy = [(0, 0), (1, 4), (2, 8), (2, 8), (1, 4)][t % 5]
        tdy = [0, -1, -2, -2, -1][t % 5]
    elif pose == 'hop':
        by = [0, 1, -3, -5, -3, 0][t % 6]
        showlegs = t % 6 in (0, 1, 5)
        tdy = [0, 0, 2, 3, 2, 0][t % 6]
    elif pose == 'fly':
        by = [-4, -6, -4, -2][t % 4]
        showlegs = False
        wing = ['up', 'mid', 'down', 'mid'][t % 4]
    ox, oy = pad, pad
    if showlegs:
        sink = 1 if (pose == 'hop' and t % 6 == 1) else 0
        paste(g, legs, ox, oy + max(by, 0))
        by += sink
    else:
        # tucked feet under the belly
        for (fx, fy) in spec['tuck']:
            put(g, ox + fx, oy + fy + by, spec['foot'])
            put(g, ox + fx + 1, oy + fy + by, spec['foot'])
            put(g, ox + fx, oy + fy + by + 1, A)
            put(g, ox + fx + 1, oy + fy + by + 1, A)
    tx = spec['tailx']
    for x in range(W0):
        off = round(tdy * (tx - x) / tx) if (tdy and x < tx) else 0
        for y in range(H0):
            p = body[y][x]
            if p[3]:
                put(g, ox + x, oy + by + y + off, p)
    if hdx or hdy:
        pts = []
        cx, cy = spec['neck']
        for i in range(5):
            f = i / 4
            pts += disc_pts(cx + hdx * f, cy + hdy * f, spec['neckr'])
        pts = [p for p in set(pts)]
        for (x, y) in pts:
            put(g, ox + x, oy + by + y, spec['neckc'])
        outline(g, [(ox + x, oy + by + y) for x, y in pts], A)
    paste(g, head, ox + hdx, oy + by + hdy)
    if wing in ('up', 'mid', 'down'):
        draw_wing(g, spec, ox, oy + by, wing, front=True)
    return g


def draw_wing(g, spec, ox, oy, state, front=True):
    """Open wing seen from the side: five feathers fanned from the shoulder, coverts in her wing colour
    near the body, darker flight feathers, ink round the whole wing and between feathers."""
    sx, sy = spec['shoulder']
    L = spec['wingL']
    centre = {'up': -112, 'mid': 175, 'down': 128}[state]   # degrees, 0 = forward, -90 = up
    spread = {'up': 46, 'mid': 30, 'down': 40}[state]
    base, dark, lite = spec['wingc']
    feathers = []
    for i in range(5):
        f = i / 4
        ang = math.radians(centre - spread / 2 + spread * f)
        ln = L * (1.0 - 0.35 * f)            # front feather longest
        tip = (sx + ln * math.cos(ang), sy + ln * math.sin(ang))
        feathers.append(line_pts(round(sx + 5 - 10 * f), sy, round(tip[0]), round(tip[1])))
    tips = [fl[-1] for fl in feathers]
    poly = hull([(sx + 6, sy + 1), (sx - 7, sy + 2), (sx - 4, sy - 1), (sx + 3, sy - 1)] + [(x + 0.5, y + 0.5) for x, y in tips])
    pts = set(fill_poly(poly))
    for (x, y) in pts:
        d = math.hypot(x - sx, y - sy) / L
        c = lite if d < 0.18 else base if d < 0.48 else dark
        put(g, ox + x, oy + y, c)
    for (x, y) in pts:
        if any((x + dx, y + dy) not in pts for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
            put(g, ox + x, oy + y, A)
    for fl in feathers[1:-1]:
        for k, (x, y) in enumerate(fl):
            if k / max(len(fl) - 1, 1) > 0.6:
                put(g, ox + x, oy + y, A)
    # covert edge: a short ink arc where the coverts end
    for fl in feathers:
        k = int(len(fl) * 0.48)
        x, y = fl[k]
        put(g, ox + x, oy + y, A)


def hull(ps):
    ps = sorted(set(ps))
    def cr(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, up = [], []
    for p in ps:
        while len(lo) >= 2 and cr(lo[-2], lo[-1], p) <= 0:
            lo.pop()
        lo.append(p)
    for p in reversed(ps):
        while len(up) >= 2 and cr(up[-2], up[-1], p) <= 0:
            up.pop()
        up.append(p)
    return lo[:-1] + up[:-1]


def fill_poly(poly):
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
    out = []
    for y in range(int(min(ys)), int(max(ys)) + 1):
        for x in range(int(min(xs)), int(max(xs)) + 1):
            px, py = x + 0.5, y + 0.5
            inside = False
            j = len(poly) - 1
            for i in range(len(poly)):
                xi, yi = poly[i]; xj, yj = poly[j]
                if (yi > py) != (yj > py) and px < (xj - xi) * (py - yi) / (yj - yi + 1e-9) + xi:
                    inside = not inside
                j = i
            if inside:
                out.append((x, y))
    return out


BIRDS = {
    'bulbul': dict(layer='White eared bulbul', legtop=25, headx=33, heady=14, tailx=18, taily=17, headell=(41, 7, 12, 8.5),
                   neck=(36, 11), neckr=3.5, neckc=(34, 28, 26, 255), shoulder=(30, 10), wingL=20,
                   wingc=((121, 103, 85, 255), (90, 78, 68, 255), (150, 132, 112, 255)),
                   tuck=[(27, 24), (35, 24)], foot=(34, 28, 26, 255)),
    'myna': dict(layer='common myna', legtop=31, headx=35, heady=13, tailx=22, taily=24, headell=(46.5, 6, 11.5, 8),
                 neck=(39, 11), neckr=4, neckc=(20, 16, 19, 255), shoulder=(30, 17), wingL=22,
                 wingc=((90, 78, 68, 255), (34, 28, 26, 255), (66, 57, 52, 255)),
                 tuck=[(30, 31), (37, 31)], foot=(249, 163, 27, 255)),
}
BIRD_POSES = {'idle': 6, 'peck': 5, 'hop': 6, 'fly': 4}

# ---------------------------------------------------------------- fish

FISH = [('Green Tiger Barb', 'R'), ('Black Neon Tetra', 'R'), ('Ember Tetra', 'R'), ('Serpae Tetra', 'L'),
        ('Black Phantom Tetra', 'L'), ('Rosy Tetra', 'R'), ('Tricolor Swordtail', 'R')]


def fish_frames(src, face, n=6):
    g0 = grid(src)
    if face == 'L':
        g0 = [r[::-1] for r in g0]
    H0, W0 = len(g0), len(g0[0])
    pad = 3
    frames = []
    for t in range(n):
        g = blank(W0, H0 + 2 * pad)
        ph = 2 * math.pi * t / n
        for x in range(W0):
            f = max(0.0, 1 - x / (W0 * 0.62))  # tail end bends, head stays put (faces right after flip)
            off = round(2.2 * f * f * math.sin(ph - x * 0.18))
            for y in range(H0):
                p = g0[y][x]
                if p[3]:
                    put(g, x, y + pad + off, p)
        frames.append(g)
    return frames


def sheet(frames):
    w, h = len(frames[0][0]), len(frames[0])
    im = Image.new('RGBA', (w * len(frames), h))
    for i, f in enumerate(frames):
        im.alpha_composite(toimg(f), (i * w, 0))
    return im, w, h


def main(hens_path, fb_path, out):
    os.makedirs(out, exist_ok=True)
    man = {'hens': {}, 'birds': {}, 'fish': {}}
    hens = read(hens_path)
    fb = read(fb_path)
    her_hen = layer(hens, 'Layer 1')
    parts = hen_parts(her_hen)
    poses = {'idle': 4, 'walk': 4, 'peck': 5, 'run': 4}
    for name, (cmap, extra) in breeds().items():
        frames, rows = [], {}
        for pose, n in poses.items():
            rows[pose] = [len(frames), n]
            for t in range(n):
                f = hen_frame(parts, pose, t)
                src = [r[:] for r in f]
                f = recolour(f, cmap)
                if extra:
                    extra(f, src)
                if name == 'jungle':
                    jungle_tail(f)
                frames.append(f)
        im, w, h = sheet(frames)
        im.save(f'{out}/hen-{name}.png')
        man['hens'][name] = {'w': w, 'h': h, 'poses': rows}
    for name, spec in BIRDS.items():
        src = layer(fb, spec['layer'])
        frames, rows = [], {}
        for pose, n in BIRD_POSES.items():
            rows[pose] = [len(frames), n]
            for t in range(n):
                frames.append(bird_frame(src, spec, pose, t))
        im, w, h = sheet(frames)
        im.save(f'{out}/bird-{name}.png')
        man['birds'][name] = {'w': w, 'h': h, 'poses': rows, 'title': spec['layer']}
    for title, face in FISH:
        src = layer(fb, title)
        frames = fish_frames(src, face)
        im, w, h = sheet(frames)
        slug = title.lower().replace(' ', '-')
        im.save(f'{out}/fish-{slug}.png')
        man['fish'][slug] = {'w': w, 'h': h, 'poses': {'swim': [0, len(frames)]}, 'title': title}
    json.dump(man, open(f'{out}/manifest.json', 'w'), indent=1)
    print(json.dumps({k: list(v) for k, v in man.items()}))


if __name__ == '__main__':
    main(*sys.argv[1:4])
