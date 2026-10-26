import sys,os,math;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from common import *
sit=to_grid(load_frame(13))
HEAD_DY=4
def hsh(x,y,s=0):
    v=math.sin(x*12.9898+y*78.233+s*37.719)*43758.5453
    return v-math.floor(v)
def back_head():
    """the back of her head: same outline and ears as her front view, tan fur where the face was,
    and the dark of the saddle coming up the neck underneath"""
    g={}
    for (x,y),c in sit.items():
        if y>95:continue
        g[(x,y)]=c
    # paint out the face: eyes, brows, muzzle and nose become tan fur between the ear lines
    for y in range(80,96):
        for x in range(65,82):
            if (x,y) in g:g[(x,y)]='T'
    # the ears' inner edges, as she draws them from the front
    for y in range(81,89):g[(64,y)]='D';g[(82,y)]='D'
    g[(65,88)]='D';g[(81,88)]='D'
    # fur strokes like the ones on top of her head
    for (x,y) in [(68,80),(69,80),(74,81),(75,81),(71,83),(72,83),(77,83),(67,85),(68,85),(74,85),(75,86),(70,87),(71,87),(78,86),(73,86)]:
        g[(x,y)]='M'
    # the neck, dark, coming up under the skull with a ragged edge
    top={65:89,66:88,67:88,68:87,69:88,70:87,71:87,72:86,73:87,74:87,75:86,76:87,77:88,78:87,79:88,80:88,81:89}
    for x,y0 in top.items():
        for y in range(y0,96):
            if (x,y) in g:g[(x,y)]='D'
        if (x,y0-1) in g and hsh(x,y0)<0.6:g[(x,y0-1)]='M'
    return g
HEAD=back_head()
TORSO=[
# x 52 + i
# 0         1         2         3
# 0123456789012345678901234567890123456789
 "........DDDDDDDDDDDDDDDDDDDDDDDDD.......",  # 96 shoulders behind the neck
 ".......DDDDDDDDDDDDDDDDDDDDDDDDDDD......",  # 97
 "......DDDDDDDDDDDDDDDDDDDDDDDDDDDDD.....",  # 98 the saddle over the back
 "......DDDDDDDDDDDDDDDDDDDDDDDDDDDDD.....",  # 99
 "......DDDDDDDDDDDDDDDDDDDDDDDDDDDDD.....",  # 100
 "......DDDDDDDDDDDDDDDDDDDDDDDDDDDDD.....",  # 101
 "......DDDDDDDDDDDDDDDDDDDDDDDDDDDDD.....",  # 102
 "......DMDDDDDDDDDDDDDDDDDDDDDDDDDMD.....",  # 103 the rump
 "......DTMDMDDDDDDDDDDDDDDDDDDDMDMTD.....",  # 104 tan comes in at the sides
 "......DTTMTMDDDDDDDDDDDDDDDDDMTMTTD.....",  # 105 the thighs
 "......DTTTTMMDMDDDDDDDDDDDMDMMTTTTD.....",  # 106
 "......DTTTTTTMMDDDDDDDDDDDMMTTTTTTD.....",  # 107
 "......DTTTTTTTMMDDDDDDDDDMMTTTTTTTD.....",  # 108
 "......DMTTTTTTTMD.......DMTTTTTTTMD.....",  # 109
 ".......DTTTTTTTMD.......DMTTTTTTTD......",  # 110
 ".......DMTTTTTTMD.......DMTTTTTTMD......",  # 111
 "........DTTTTTMD.........DMTTTTTD.......",  # 112
]
TORSO_Y=96
LEG_MID_L=["DTTTTMD","DTTTTMD","DTTTMMD","DMTTTMD"]
LEG_PAW_L=["DTTTTMD","DTTTMMD","DMMKKMD","DDDDDDD"]
LEG_MID_R=["DMTTTTD","DMTTTTD","DMMTTTD","DMTTTMD"]
LEG_PAW_R=["DMTTTTD","DMMTTTD","DMKKMMD","DDDDDDD"]
# the tail, up from the rump: tan feathering with dark strands, thick at the base, a curl at the tip
TAIL=[
 "...DD...",
 "..DTTD..",
 "..DTTMD.",
 ".DTTTMD.",
 ".DTTMMD.",
 "DTTTDMMD",
 "DTTTDMMD",
 "DTTDMMD.",
 "DTTDMMD.",
 ".DTDMMD.",
 ".DTDMD..",
 ".DTDMD..",
 "..DDD...",
 "..DDD...",
]
def paste(g,rows,x0,y0):
    for j,r in enumerate(rows):
        for i,c in enumerate(r):
            if c!='.':g[(x0+i,y0+j)]=c
def back_frame(liftL,liftR,fL,fR,bob,wag):
    g={}
    top=112+bob
    for (x,lift) in [(67,fL),(74,fR)]:
        bot=122-lift
        for y in range(top-2,bot-1):
            g[(x,y)]='D';g[(x+1,y)]='M';g[(x+2,y)]='D'
        for i,c in enumerate('DMD'):g[(x+i,bot-1)]=c
        for i,c in enumerate('DDD'):g[(x+i,bot)]=c
    for (x,lift,mid,paw) in [(60,liftL,LEG_MID_L,LEG_PAW_L),(76,liftR,LEG_MID_R,LEG_PAW_R)]:
        bot=126-lift
        n=max(0,bot-top+1-len(paw))
        paste(g,[mid[i%len(mid)] for i in range(n)]+paw,x,top)
    for (x,y),c in HEAD.items():g[(x,y+HEAD_DY+bob)]=c
    paste(g,TORSO,52,TORSO_Y+bob)
    n=len(TAIL)
    for j,r in enumerate(TAIL):
        k=(n-1-j)/(n-1)
        dx=round(wag*k*k)
        for i,c in enumerate(r):
            if c!='.':g[(68+i+dx,91+j+bob)]=c
    return g
cyc=dict(liftL=[0,0,0,0,2,5,4,1],liftR=[2,5,4,1,0,0,0,0],bob=[0,-1,-1,0,0,-1,-1,0],wag=[-4,-3,0,3,4,3,0,-3])
def frames():return [render(back_frame(cyc['liftL'][k],cyc['liftR'][k],round(cyc['liftR'][k]*0.6),round(cyc['liftL'][k]*0.6),cyc['bob'][k],cyc['wag'][k])) for k in range(8)]
if __name__=='__main__':
    fr=frames()
    preview([load_frame(13),fr[0],fr[2],fr[4]],os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','back_v8_zoom.png'),z=8,crop=(50,68,96,128))
    preview([load_frame(13),load_frame(0),load_frame(3)]+fr,os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','back_v8_x2.png'),z=2,crop=(30,60,110,128),bg=(106,190,48,255))
