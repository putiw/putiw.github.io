import json,re
r=json.load(open('audit.json'))
def big(v):
  a=abs(v)
  for d,s in ((1e9,'B'),(1e6,'M'),(1e3,'k')):
    if a>=d: return ('-' if v<0 else '')+('%.3g'%(a/d))+s
  return '%.3g'%v
NOISE=re.compile(r'^(today\.|emp\.inf:|emp\.heart:|emp\.kind:|emp\.kindNew|me\.(hist|days|dlog|cnt)|emp\.later)')
def imm(o):
  out=[]
  for x in o['imm']:
    if NOISE.match(x): continue
    out.append(x.replace('|','/'))
  return out
def heart(o):
  for x in o['imm']:
    m=re.match(r'emp\.heart: (\S+) > (\S+)',x)
    if m: d=float(m.group(2))-float(m.group(1)); return ('heart %+g'%d)
  return ''
rows=[];nflag={'same':0,'near':0,'none':0}
for x in r:
  base=x['opts'][0]['yr']
  vis=[]
  for o in x['opts']:
    im=imm(o)
    vis.append((tuple(im),o['later'],round(o['yr']['money']/1e3),round(o['yr']['humans']),round(o['yr']['q'],3),round(o['yr']['inf'])))
  flags=[]
  if len(set(vis))==1: flags.append('SAME')
  else:
    def close(a,b):
      ok=True
      for k in ('money','humans','inf'):
        A,B=a['yr'][k],b['yr'][k]
        if abs(A-B)>0.01*max(abs(A),abs(B),1): ok=False
      return ok and abs(a['yr']['q']-b['yr']['q'])<0.01
    if all(close(x['opts'][0],o) for o in x['opts'][1:]): flags.append('NEARLY SAME after a year')
  for o in x['opts']:
    if not imm(o) and not o['later'] and o['ok'] is True: flags.append('NO EFFECT: '+o['label'][:40])
  rows.append((x,flags))
L=['# Choices audit (Pass 268, item 11)','','List only, nothing changed. One row per choice card: every story card with two or more options (`MILESTONES`, `CARDS3`) and every one-of-several project (`PROJ` with `c:\'fork\'`, the "A choice · pick one" box).','','How the numbers were made: each option was applied to the same save (the average bot\'s year-8 snapshot, day ~2,900, about 19M owners), with the same random seed, then the sim ran 365 days. "Right away" is every field the option changed in the save, other than the hidden ending scores (traits, heart, which only move the ending). "Later" is how many delayed events it queued. "After a year" is cash, owners and kit quality (`emp.q`) 365 days on. Forks were bought with cash topped up so cost never blocked them; a fork\'s money spent shows in cash.','','Flags: **SAME** = every option changed the same fields to the same values and ended the year equal. **NEARLY SAME** = cash, owners and ✦ within 1% after a year and kit quality within 0.01. **NO EFFECT** = that option changed nothing in the save and queued nothing (only the ending scores move).','','Caveats: one save, one seed. A choice whose effect needs a later stage (Space, the hard part, Grandma\'s land) or a random roll that didn\'t come up shows less than it can do. Story cards whose option depends on the state (`opts`, `chf`) were read on this save.','']
summ=[]
for x,f in rows:
  if f: summ.append('- `%s` %s: %s'%(x['id'],x['title'].split(':')[0],'; '.join(f)))
L+=['## Flagged (%d of %d)'%(len(summ),len(rows)),'']+summ+['','## Every choice','']
for x,f in rows:
  L.append('### `%s` %s'%(x['id'],x['title'].replace('\n',' ')[:110]))
  if f: L.append('Flag: '+'; '.join(f))
  L.append('')
  L.append('| Option | Right away | Later | After a year: cash · owners · kit q | Ending lean |')
  L.append('|---|---|---|---|---|')
  for o in x['opts']:
    im=imm(o); y=o['yr']
    push=json.loads(o['push']) if o['push'] else {}
    lean=', '.join('%s %+.2g'%(k,v) for k,v in push.items() if abs(v)>1e-6)
    h=heart(o)
    ok='' if o['ok'] is True else ' (option refused: %s)'%o['ok']
    b=x['opts'][0]['yr']
    yr='%s · %s · %.3f'%(big(y['money']),big(y['humans']),y['q']) if o is x['opts'][0] else 'vs first: cash %s · owners %s · q %+.3f'%(big(y['money']-b['money']),big(y['humans']-b['humans']),y['q']-b['q'])
    L.append('| %s%s | %s | %s | %s | %s |'%(o['label'].replace('|','/')[:70],ok,'<br>'.join(i[:90] for i in im[:6]) or 'nothing',o['later'] or '',yr,'; '.join(t for t in (h,lean) if t)))
  L.append('')
open('shrimp-choices-audit.md','w').write('\n'.join(L))
print(len(rows),len(summ))
