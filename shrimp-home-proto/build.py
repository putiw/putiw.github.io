#!/usr/bin/env python3
"""Build dist/index.html from src/. Order matters: later files use earlier globals."""
import os, shutil, re, sys
ROOT=os.path.dirname(os.path.abspath(__file__))
SRC=os.path.join(ROOT,'src'); DIST=os.path.join(ROOT,'dist')
ORDER=['sprites.js','pixart.js','core.js','ink.js','sound.js','shrimpart.js','genetics.js','breed.js','tank.js','toys.js','land.js','book.js','try.js','main.js']
shell=open(os.path.join(SRC,'shell.html')).read()
css=open(os.path.join(SRC,'style.css')).read()
for extra in sorted(os.listdir(SRC)):
    if extra.endswith('.css') and extra!='style.css': css+='\n'+open(os.path.join(SRC,extra)).read()
js=[]
for f in ORDER:
    p=os.path.join(SRC,f)
    if os.path.exists(p): js.append('/* ---- %s ---- */\n'%f+open(p).read())
out=shell.replace('/*CSS*/',css).replace('/*JS*/','\n'.join(js))
assert '</script>' not in '\n'.join(js), 'a JS file contains </script>'
os.makedirs(DIST,exist_ok=True)
open(os.path.join(DIST,'artifact.html'),'w').write(out)
skel='<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'
open(os.path.join(DIST,'index.html'),'w').write(skel+out+'</body></html>')
# the water and music loops: assets/ here, or the game's copies when this sits in the repo
AUD=os.path.join(ROOT,'assets') if os.path.isdir(os.path.join(ROOT,'assets')) else os.path.join(ROOT,'..','shrimp')
for a in ['water.mp3','music.mp3']:
    if os.path.exists(os.path.join(AUD,a)):shutil.copy(os.path.join(AUD,a),os.path.join(DIST,a))
print('built dist/index.html',len(out),'bytes')
