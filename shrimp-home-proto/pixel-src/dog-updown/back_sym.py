# Walking away, a little from above. Puti: the back of the head, the back and the top of the tail are dark;
# the face, belly and under the tail are yellow.
import sys,os,math;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from common import *
import front_sym as F
def hsh(x,y,s=0):
    v=math.sin(x*12.9898+y*78.233+s*37.719)*43758.5453
    return v-math.floor(v)
def back_head():
    g={}
    for (x,y),c in F.HEAD.items():g[(x,y)]='D'
    # the ears catch a little light along their length, like the strands she draws in them
    for (x,y) in [(62,85),(62,86),(63,88),(63,89),(62,91),(85,85),(85,86),(84,88),(84,89),(85,91)]:
        if (x,y) in g:g[(x,y)]='K'
    # rounded top of the skull: a soft lighter rim
    for (x,y) in [(70,73),(71,72),(72,72),(75,72),(76,72),(77,73),(68,74),(79,74)]:
        if (x,y) in g:g[(x,y)]='K'
    return g
HEAD=back_head()
BODY=[
# x 54 + i (centred on the head, x 73.5)
# 0         1         2         3
# 0123456789012345678901234567890123456789
 "...........DDDDDDDDDDDDDDDDDD...........",  # 0  the neck, narrower than the ears
 "..........DDDDDDDDDDDDDDDDDDDD..........",  # 1
 ".........DDDDDDDDDDDDDDDDDDDDDD.........",  # 2  shoulders
 "........DDDDDDDDDDDDDDDDDDDDDDDD........",  # 3
 "........DDDDDDDDDDDDDDDDDDDDDDDD........",  # 4  the back
 ".......DDDDDDDDDDDDDDDDDDDDDDDDDD.......",  # 5
 ".......DDDDDDDDDDDDDDDDDDDDDDDDDD.......",  # 6
 "......DDDDDDDDDDDDDDDDDDDDDDDDDDDD......",  # 7
 "......DDDDDDDDDDDDDDDDDDDDDDDDDDDD......",  # 8
 "......DMDDDDDDDDDDDDDDDDDDDDDDDDMD......",  # 9  the rump
 "......DTMDMDDDDDDDDDDDDDDDDDDMDMTD......",  # 10 yellow at the sides
 "......DTTMTMDDDDDDMTTMDDDDDDMTMTTD......",  # 11 and under the tail
 "......DTTTTMMDMDMTTTTTTMDMDMMTTTTD......",  # 12
 "......DTTTTTTMMTTTTTTTTTTMMTTTTTTD......",  # 13 the butt and thighs
 "......DTTTTTTTMTTTTTTTTTTMTTTTTTTD......",  # 14
 "......DTTTTTTTTMTTTTTTTTMTTTTTTTTD......",  # 15
 "......DMTTTTTTTMTTTTTTTTMTTTTTTTMD......",  # 16
 ".......DTTTTTTTMDTTTTTTDMTTTTTTTD.......",  # 17
 ".......DMTTTTTTMD.DDDD.DMTTTTTTMD.......",  # 18
 "........DTTTTTMD........DMTTTTTD........",  # 19
]
BODY_Y=88
LEG_MID_L=["DTTTTMD","DTTTTMD","DTTTMMD","DMTTTMD"]
LEG_PAW_L=["DTTTTMD","DTTTMMD","DMMKKMD","DDDDDDD"]
LEG_MID_R=["DMTTTTD","DMTTTTD","DMMTTTD","DMTTTMD"]
LEG_PAW_R=["DMTTTTD","DMMTTTD","DMKKMMD","DDDDDDD"]
# the tail from behind: the yellow feathering underneath faces you, the dark top shows along its edges and
# where the tip curls over
TAIL=[
 "..DDD...",
 ".DDDDD..",
 ".DDKDDD.",
 "..DTTMD.",
 ".DTTTMD.",
 ".DTTMMD.",
 "DTTTTMMD",
 "DTTMTTMD",
 "DTTTTMMD",
 "DMTTTTMD",
 ".DTTMTMD",
 ".DTTTTD.",
 ".DMTTMD.",
 "..TTTM..",
 "..TTTT..",
]
def paste(g,rows,x0,y0):
    for j,r in enumerate(rows):
        for i,c in enumerate(r):
            if c!='.':g[(x0+i,y0+j)]=c
def back_frame(liftL,liftR,fL,fR,bob,wag,head_dy=-4):
    g={}
    top=BODY_Y+19+bob
    for (x,lift) in [(68,fL),(77,fR)]:
        bot=121-lift
        for y in range(top-2,bot-1):
            g[(x,y)]='D';g[(x+1,y)]='M';g[(x+2,y)]='D'
        for i,c in enumerate('DMD'):g[(x+i,bot-1)]=c
        for i,c in enumerate('DDD'):g[(x+i,bot)]=c
    for (x,lift,mid,paw) in [(61,liftL,LEG_MID_L,LEG_PAW_L),(79,liftR,LEG_MID_R,LEG_PAW_R)]:
        bot=126-lift
        n=max(0,bot-top+1-len(paw))
        paste(g,[mid[i%len(mid)] for i in range(n)]+paw,x,top)
    for (x,y),c in HEAD.items():g[(x,y+head_dy+bob)]=c
    paste(g,BODY,54,BODY_Y+bob)
    n=len(TAIL)
    for j,r in enumerate(TAIL):
        k=(n-1-j)/(n-1);dx=round(wag*k*k)
        for i,c in enumerate(r):
            if c!='.':g[(70+i+dx,85+j+bob)]=c
    return g
LIFT_A=F.LIFT_A;LIFT_B=F.LIFT_B;BOB=F.BOB
WAG=[-4,-3,0,3,4,3,0,-3]
def frames():
    out=[render(back_frame(LIFT_A[k],LIFT_B[k],round(LIFT_B[k]*0.6),round(LIFT_A[k]*0.6),BOB[k],WAG[k])) for k in range(8)]
    return out,render(back_frame(0,0,0,0,0,-1))
if __name__=='__main__':
    bf,bs=frames()
    preview([load_frame(0),bs,bf[1],bf[5]],os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','bsym_zoom.png'),z=7,crop=(48,58,96,128))
    preview([load_frame(0),load_frame(13)]+bf[:4],os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','bsym_x3.png'),z=3,crop=(30,52,110,128),bg=(106,190,48,255))
