"""Minimal Aseprite reader: frames x layers -> RGBA PIL images.
Usage: python3 ase.py file.aseprite outdir   (writes one PNG per frame and per layer, prints layers/tags)
"""
import struct, zlib, sys, os
from PIL import Image


def read(path):
    b = open(path, 'rb').read()
    fsize, magic, nframes, W, H, depth = struct.unpack_from('<IHHHHH', b, 0)
    assert magic == 0xA5E0, 'not aseprite'
    trans_idx = b[28]
    pos = 128
    layers, tags, pal = [], [], {}
    frames = []
    for fi in range(nframes):
        flen, fmagic, old, dur, _, new = struct.unpack_from('<IHHH2sI', b, pos)
        n = new or old
        p = pos + 16
        cels = []
        for _ in range(n):
            clen, ctype = struct.unpack_from('<IH', b, p)
            d = b[p + 6:p + clen]
            if ctype == 0x2004:
                flags, ltype, child, _, _, blend, op = struct.unpack_from('<HHHHHHB', d, 0)
                nl = struct.unpack_from('<H', d, 16)[0]
                name = d[18:18 + nl].decode('utf8', 'replace')
                layers.append(dict(name=name, visible=bool(flags & 1), type=ltype, child=child, op=op))
            elif ctype == 0x2005:
                li, x, y, op, ct, z = struct.unpack_from('<HhhBHh', d, 0)
                r = d[16:]
                if ct in (0, 2):
                    w, h = struct.unpack_from('<HH', r, 0)
                    px = r[4:] if ct == 0 else zlib.decompress(r[4:])
                    cels.append(dict(layer=li, x=x, y=y, op=op, w=w, h=h, px=px))
                elif ct == 1:
                    cels.append(dict(layer=li, link=struct.unpack_from('<H', r, 0)[0], x=x, y=y, op=op))
            elif ctype == 0x2019:
                psize, first, last = struct.unpack_from('<III', d, 0)
                q = 20
                for i in range(first, last + 1):
                    fl, rr, gg, bb, aa = struct.unpack_from('<HBBBB', d, q)
                    q += 6
                    if fl & 1:
                        q += 2 + struct.unpack_from('<H', d, q)[0]
                    pal[i] = (rr, gg, bb, aa)
            elif ctype == 0x2018:
                nt = struct.unpack_from('<H', d, 0)[0]
                q = 10
                for _ in range(nt):
                    a, z_, dirn = struct.unpack_from('<HHB', d, q)
                    q += 17
                    sl = struct.unpack_from('<H', d, q)[0]
                    tags.append(dict(name=d[q + 2:q + 2 + sl].decode(), frm=a, to=z_))
                    q += 2 + sl
            p += clen
        frames.append(dict(dur=dur, cels=cels))
        pos += flen

    def celimg(c):
        img = Image.new('RGBA', (c['w'], c['h']))
        px = c['px']
        if depth == 32:
            img = Image.frombytes('RGBA', (c['w'], c['h']), px)
        elif depth == 16:
            out = bytearray()
            for i in range(0, len(px), 2):
                v, a = px[i], px[i + 1]
                out += bytes((v, v, v, a))
            img = Image.frombytes('RGBA', (c['w'], c['h']), bytes(out))
        else:
            out = bytearray()
            for v in px:
                out += bytes((0, 0, 0, 0)) if v == trans_idx else bytes(pal.get(v, (0, 0, 0, 255)))
            img = Image.frombytes('RGBA', (c['w'], c['h']), bytes(out))
        return img

    # resolve linked cels
    for fi, f in enumerate(frames):
        for c in f['cels']:
            if 'link' in c:
                src = next(cc for cc in frames[c['link']]['cels'] if cc['layer'] == c['layer'])
                c.update({k: src[k] for k in ('w', 'h', 'px')})
                c['x'], c['y'] = src['x'], src['y']
            c['img'] = celimg(c)
    return dict(W=W, H=H, layers=layers, tags=tags, frames=frames)


def flatten(a, fi, only=None):
    img = Image.new('RGBA', (a['W'], a['H']))
    for c in sorted(a['frames'][fi]['cels'], key=lambda c: c['layer']):
        L = a['layers'][c['layer']]
        if only is not None and c['layer'] not in only:
            continue
        if only is None and not L['visible']:
            continue
        img.alpha_composite(c['img'], (max(c['x'], 0), max(c['y'], 0)) if c['x'] >= 0 and c['y'] >= 0 else (0, 0)) if c['x'] >= 0 and c['y'] >= 0 else img.paste(c['img'], (c['x'], c['y']), c['img'])
    return img


if __name__ == '__main__':
    a = read(sys.argv[1])
    out = sys.argv[2]
    os.makedirs(out, exist_ok=True)
    print('size', a['W'], a['H'], 'frames', len(a['frames']))
    for i, L in enumerate(a['layers']):
        print('layer', i, L)
    print('tags', a['tags'])
    for fi in range(len(a['frames'])):
        flatten(a, fi).save(f'{out}/f{fi}.png')
        for c in a['frames'][fi]['cels']:
            print('  frame', fi, 'layer', c['layer'], a['layers'][c['layer']]['name'], 'at', c['x'], c['y'], c['w'], c['h'])
            flatten(a, fi, {c['layer']}).save(f'{out}/f{fi}_L{c["layer"]}.png')
