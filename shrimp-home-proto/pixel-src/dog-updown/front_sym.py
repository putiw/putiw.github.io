# Walking toward you, seen a little from above: her face made symmetric (her right half mirrored), the chest
# and front legs the same way, the dark back showing behind the head and the tail up behind it.
import sys,os,math;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from common import *
sit=to_grid(load_frame(13))
CX=147  # mirror: x -> CX - x (the face's middle is between x 73 and 74)
def sym_rows(y0,y1,xmin=74):
    g={}
    for (x,y),c in sit.items():
        if y0<=y<=y1 and x>=xmin:
            g[(x,y)]=c;g[(CX-x,y)]=c
    return g
HEAD=sym_rows(71,95)
HEAD.pop((CX-74,71),None);HEAD.pop((74,71),None)   # one tuft, not two
CHEST=sym_rows(96,103)
# front leg: her right front leg (x 78-86), mirrored for the left
def leg_cols():
    rows={}
    for y in range(104,127):
        rows[y]=[sit.get((x,y)) for x in range(78,87)]
    return rows
LEG=leg_cols()
def leg_rows(n_body):
    body=[LEG[y] for y in range(104,122)]
    paw=[["D","M","T","T","T","T","T","D",None],["D","M","T","T","T","T","T","D",None],["D","D","T","T","D","T","T","D",None],[None,"D","D","D","D","D","D",None,None]]
    rows=[body[min(len(body)-1,int(i*len(body)/max(1,n_body)))] for i in range(n_body)]
    return rows+paw
def paste(g,rows,x0,y0,mirror=False):
    for j,r in enumerate(rows):
        for i,c in enumerate(r):
            if c and c!='.':
                x=x0+i
                if mirror:x=CX-x
                g[(x,y0+j)]=c
TAIL=[
 "...DD...",
 "..DTD...",
 "..DDTD..",
 ".TDDDT..",
 ".DDDDTD.",
 "TDDDDDT.",
 "TDDDDDMT",
 "MDDDDDDT",
 "TDDDDDDM",
 ".TDDDDT.",
 ".MDDDDT.",
 "..DDDD..",
 "..DDDD..",
]
# the back behind the head: a dark rounded hump, a little lighter along the spine
HUMP=[
 ".......DDDDDDDD.......",
 ".....DDKKKKKKKKDD.....",
 "....DKKDDDDDDDDKKD....",
 "...DKDDDDDDDDDDDDKD...",
 "..DKDDDDDDDDDDDDDDKD..",
 "..DDDDDDDDDDDDDDDDDD..",
 ".DDDDDDDDDDDDDDDDDDDD.",
 ".DDDDDDDDDDDDDDDDDDDD.",
 ".DDDDDDDDDDDDDDDDDDDD.",
 "DDDDDDDDDDDDDDDDDDDDDD",
 "DDDDDDDDDDDDDDDDDDDDDD",
 "DDDDDDDDDDDDDDDDDDDDDD",
 "DDDDDDDDDDDDDDDDDDDDDD",
]
def front_frame(liftL,liftR,hL,hR,bob,wag,head_dy=5,hump_y=67,tail_y=55):
    g={}
    # the tail, furthest back, wagging from its base
    n=len(TAIL)
    for j,r in enumerate(TAIL):
        k=(n-1-j)/(n-1);dx=round(wag*k*k)
        for i,c in enumerate(r):
            if c!='.':g[(70+i+dx,tail_y+j+bob)]=c
    # the back
    for j,r in enumerate(HUMP):
        for i,c in enumerate(r):
            if c!='.':g[(63+i,hump_y+j+bob)]=c
    top=109+bob
    # far hind legs between the front legs
    for (xs,lift,shape) in [(70,hL,['MD','MD','KD','MD']),(76,hR,['DM','DM','DK','DM'])]:
        bot=122-lift
        for y in range(top+2,bot-1):
            r=shape[(y-top)%len(shape)]
            for i,c in enumerate(r):g[(xs+i,y)]=c
        px=xs-1 if xs<73 else xs-1
        for i,c in enumerate('DMTD'):g[(px+i,bot-1)]=c
        for i,c in enumerate('DDDD'):g[(px+i,bot)]=c
    # front legs, the same leg mirrored
    for (lift,mir) in [(liftR,False),(liftL,True)]:
        bot=126-lift
        rows=leg_rows(max(1,bot-top+1-4))
        paste(g,rows,78,top,mirror=mir)
    # chest and head
    for (x,y),c in CHEST.items():g[(x,y+head_dy+bob)]=c
    for (x,y),c in HEAD.items():g[(x,y+head_dy+bob)]=c
    return g
LIFT_A=[0,0,0,0,2,5,4,1];LIFT_B=[2,5,4,1,0,0,0,0];BOB=[0,-1,-1,0,0,-1,-1,0]
WAG=[-3,-2,0,2,3,2,0,-2]
def frames():
    out=[render(front_frame(LIFT_A[k],LIFT_B[k],round(LIFT_B[k]*0.6),round(LIFT_A[k]*0.6),BOB[k],WAG[k])) for k in range(8)]
    return out,render(front_frame(0,0,0,0,0,0))
if __name__=='__main__':
    ff,fs=frames()
    preview([load_frame(13),fs,ff[1],ff[5]],os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','fsym_zoom.png'),z=7,crop=(48,52,96,128))
    print(dump(front_frame(0,0,0,0,0,0),56,92,54,128))
