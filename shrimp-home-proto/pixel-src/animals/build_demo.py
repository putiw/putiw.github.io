"""python3 build_demo.py <anim dir> <out.html>: embeds the sheets from gen.py into demo.tpl.html."""
import sys, json, base64, os, glob
d, out = sys.argv[1], sys.argv[2]
man = json.load(open(os.path.join(d, 'manifest.json')))
sheets = {os.path.basename(p)[:-4]: 'data:image/png;base64,' + base64.b64encode(open(p, 'rb').read()).decode() for p in glob.glob(os.path.join(d, '*.png'))}
tpl = open(os.path.join(os.path.dirname(__file__), 'demo.tpl.html')).read()
open(out, 'w').write(tpl.replace('__MANIFEST__', json.dumps(man)).replace('__SHEETS__', json.dumps(sheets)))
print(out, os.path.getsize(out))
