from PIL import Image
import os
SRC=os.path.join(os.path.dirname(os.path.abspath(__file__)),'dog-14.png')
PAL={'D':(36,27,11),'T':(195,137,50),'M':(119,84,32),'K':(79,57,22),'B':(22,16,0),'N':(0,0,0),'k':(59,43,17)}
INV={v:k for k,v in PAL.items()}
def load_frame(i):
    im=Image.open(SRC).convert('RGBA')
    return im.crop((i*128,0,i*128+128,128))
def to_grid(fr):
    """frame -> dict {(x,y):letter} for opaque pixels (alpha>0), letters by nearest palette"""
    px=fr.load();g={}
    for y in range(fr.size[1]):
        for x in range(fr.size[0]):
            p=px[x,y]
            if p[3]<128:continue
            c=p[:3]
            if c in INV:g[(x,y)]=INV[c]
            else:
                # nearest palette colour
                best=min(PAL.items(),key=lambda kv:sum((a-b)**2 for a,b in zip(kv[1],c)))
                g[(x,y)]=best[0]
    return g
def put(g,ascii_rows,x0,y0,transparent='.',erase=' '):
    """paste ascii rows onto grid g; '.' leaves what's there, ' ' is never used; '_' erases"""
    for j,row in enumerate(ascii_rows):
        for i,ch in enumerate(row):
            if ch=='.':continue
            if ch=='_':g.pop((x0+i,y0+j),None);continue
            g[(x0+i,y0+j)]=ch
def render(g,size=(128,128)):
    im=Image.new('RGBA',size,(0,0,0,0));px=im.load()
    for (x,y),ch in g.items():
        if 0<=x<size[0] and 0<=y<size[1]:px[x,y]=PAL[ch]+(255,)
    return im
def dump(g,x0,x1,y0,y1):
    out=[]
    for y in range(y0,y1):
        out.append('%3d '%y+''.join(g.get((x,y),'.') for x in range(x0,x1)))
    return '\n'.join(out)
def preview(frames,path,z=6,bg=(200,220,190,255),crop=(40,64,104,128),cols=None):
    cw,ch=crop[2]-crop[0],crop[3]-crop[1]
    cols=cols or len(frames)
    rows=(len(frames)+cols-1)//cols
    sheet=Image.new('RGBA',(cols*cw*z+(cols+1)*4,rows*ch*z+(rows+1)*4),(160,170,150,255))
    for k,f in enumerate(frames):
        c=Image.new('RGBA',(cw,ch),bg);c.alpha_composite(f.crop(crop))
        sheet.paste(c.resize((cw*z,ch*z),Image.NEAREST),(4+(k%cols)*(cw*z+4),4+(k//cols)*(ch*z+4)))
    sheet.save(path)
