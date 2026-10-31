#!/usr/bin/env python3
"""Real planets for the ship's sky (Pass 172).

Source: the Open Exoplanet Catalogue's import of the NASA Exoplanet Archive
(github.com/OpenExoplanetCatalogue/oec_gzip, systems-exoplanetarchive.xml.gz; star ages from systems.xml.gz).
Picks every planet in Bohl, Lawrence, Lowry and Kaltenegger 2026 (MNRAS, doi:10.1093/mnras/stag028, the 45
rocky habitable-zone worlds), K2-18 b, then the nearest planets with a known year until there are TARGET.

Usage: python3 tests/build-space-planets.py <oec_gzip dir>   (writes the block in shrimp/space.html)
Only Earth's measurements are copied. What a ship finds on the ground is decided in space.html, not here.
"""
import gzip, json, math, os, re, sys
import xml.etree.ElementTree as ET

TARGET = 960
PAPER = ["GJ 1002 b","GJ 1002 c","GJ 1061 c","GJ 1061 d","GJ 251 c","GJ 273 b","GJ 3323 b","GJ 667 C c","GJ 667 C e",
 "GJ 667 C f","GJ 682 b","K2-239 d","K2-288 B b","K2-3 d","K2-72 e","Kepler-1229 b","Kepler-1410 b","Kepler-1544 b",
 "Kepler-1606 b","Kepler-1649 c","Kepler-1652 b","Kepler-186 f","Kepler-296 e","Kepler-296 f","Kepler-441 b",
 "Kepler-442 b","Kepler-452 b","Kepler-62 e","Kepler-62 f","L 98-59 f","LHS 1140 b","LP 890-9 c","Proxima Centauri b",
 "Ross 508 b","TOI-1266 d","TOI-700 d","TOI-700 e","TOI-715 b","TRAPPIST-1 d","TRAPPIST-1 e","TRAPPIST-1 f",
 "TRAPPIST-1 g","Teegarden's Star c","Wolf 1061 c","Wolf 1069 b"]
EXTRA = ["K2-18 b"]
RJ, MJ, LY = 11.209, 317.83, 3.26156  # Earth radii per Jupiter radius, Earth masses per Jupiter mass, ly per parsec

def num(e, tag):
    x = e.find(tag)
    if x is None or x.text is None: return None, {}
    try: return float(x.text), x.attrib
    except ValueError: return None, x.attrib

def spec(st, teff):
    s = (st or '').strip()
    if s and s[0] in 'OBAFGKM': return s[0]
    if teff:
        return 'M' if teff < 3900 else 'K' if teff < 5300 else 'G' if teff < 6000 else 'F' if teff < 7500 else 'A'
    return None

def load(path):
    out = {}
    root = ET.fromstring(gzip.open(path).read())
    for sysd in root.iter('system'):
        dpc, _ = num(sysd, 'distance')
        for star in sysd.iter('star'):
            teff, _ = num(star, 'temperature'); srad, _ = num(star, 'radius'); smass, _ = num(star, 'mass')
            age, _ = num(star, 'age'); sp = star.find('spectraltype'); sname = star.find('name')
            for p in star.findall('planet'):
                names = [n.text for n in p.findall('name') if n.text]
                if not names: continue
                out[names[0]] = dict(p=p, names=names, dpc=dpc, teff=teff, srad=srad, smass=smass, age=age,
                                     sp=sp.text if sp is not None else None, star=sname.text if sname is not None else names[0][:-2])
    return out

def rec(name, d, ages):
    p = d['p']
    r, ra = num(p, 'radius'); m, ma = num(p, 'mass'); per, _ = num(p, 'period'); a, _ = num(p, 'semimajoraxis')
    e, _ = num(p, 'eccentricity'); teq, _ = num(p, 'temperature'); tr, _ = num(p, 'istransiting')
    yr = p.find('discoveryyear'); how = p.find('discoverymethod')
    transit = tr == 1
    # The archive fills a radius for planets that never crossed their star (from a mass-radius rule). Earth never saw those.
    # The archive also fills masses and radii from a mass-radius rule. Those come with no error bars: keep only measured ones.
    meas = lambda at: 'errorminus' in at or 'errorplus' in at or 'upperlimit' in at
    rE = round(r * RJ, 2) if (r and transit and meas(ra)) else None
    mE = round(m * MJ, 2) if (m and meas(ma)) else None
    # with no measured width there's no tilt either, so a radial-velocity mass is only a minimum
    mlim = 'up' if (m and 'upperlimit' in ma) else ('min' if (mE and not rE) else '')

    # a mass far too big for its width is an upper limit the archive kept as a value
    if rE and mE and mE / rE ** 3 > 3.5: mlim = 'up'
    if teq is None and d['teff'] and d['srad'] and a:
        teq = d['teff'] * math.sqrt(d['srad'] * 0.00465047 / (2 * a)) * 0.7 ** 0.25
    age = d['age'] or ages.get(name)
    o = d.get('oec') or {}
    return dict(n=name, st=d['star'], sp=spec(d['sp'] or o.get('sp'), d['teff'] or o.get('teff')), ly=round(d['dpc'] * LY, 1) if d['dpc'] else None,
                r=rE, m=mE, ml=mlim, P=round(per, 2) if per else None, a=round(a, 4) if a else None,
                e=round(e, 3) if e is not None else None, teq=round(teq) if teq else None,
                ts=round(d['teff']) if d['teff'] else None, ms=round(d['smass'], 2) if d['smass'] else None,
                age=round(age, 1) if age else None, y=int(yr.text) if yr is not None and yr.text else None,
                how=how.text if how is not None else None, hz=0)

def main(src):
    nasa = load(os.path.join(src, 'systems-exoplanetarchive.xml.gz'))
    oec = load(os.path.join(src, 'systems.xml.gz'))
    ages = {k: v['age'] for k, v in oec.items() if v['age']}
    alias = {}
    for k, v in nasa.items():
        for n in v['names']: alias[n.replace(' ', '').lower()] = k
    ALIAS = {'Proxima Centauri b': 'Proxima Cen b'}
    def find(n): return alias.get(ALIAS.get(n, n).replace(' ', '').lower())
    oalias = {}
    for k, v in oec.items():
        for n in v['names']: oalias[n.replace(' ', '').lower()] = v
    for k, v in nasa.items():
        v['oec'] = next((oalias[n.replace(' ', '').lower()] for n in v['names'] if n.replace(' ', '').lower() in oalias), None)
        if not v['dpc'] and v['oec']: v['dpc'] = v['oec']['dpc']
    picked, missing = [], []
    for n in PAPER + EXTRA:
        k = find(n)
        (picked.append(k) if k else missing.append(n))
    near = sorted((v['dpc'], k) for k, v in nasa.items() if v['dpc'] and num(v['p'], 'period')[0] and k not in picked)
    for _, k in near:
        if len(picked) >= TARGET: break
        picked.append(k)
    rows = [rec(k, nasa[k], ages) for k in picked]
    for r in rows:
        for n in PAPER:
            if find(n) == r['n']: r['n'] = n; r['hz'] = 1  # the paper's spelling
    rows = [r for r in rows if r['ly'] and r['sp'] in ('A', 'F', 'G', 'K', 'M')]
    rows.sort(key=lambda r: r['ly'])
    js = json.dumps(rows, separators=(',', ':'), ensure_ascii=False)
    page = os.path.join(os.path.dirname(__file__), '..', 'shrimp', 'space.html')
    s = open(page).read()
    a, b = '// ==PLANETS-START==\n', '// ==PLANETS-END=='
    block = a + '// Built by tests/build-space-planets.py from the NASA Exoplanet Archive via the Open Exoplanet Catalogue. Do not edit by hand.\n' + 'var REAL=' + js + ';\n' + b
    s = s[:s.index(a)] + block + s[s.index(b) + len(b):] if a in s else s.replace('// ==SPACE-SIM-START==\n', '// ==SPACE-SIM-START==\n' + block + '\n', 1)
    open(page, 'w').write(s)
    print(len(rows), 'planets,', sum(r['hz'] for r in rows), 'from the paper, missing:', missing)

if __name__ == '__main__':
    main(sys.argv[1])
