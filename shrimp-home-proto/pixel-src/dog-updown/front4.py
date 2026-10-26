# Walking toward you, seen a little from above: her head tipped down (head2) with ears that swing out and
# back with each step, the dark neck joining it to the chest, and behind the head the rump and the tail.
import sys,os;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from common import *
import front_sym as F, head2 as H
NECK=[  # x 61..86: the dark of the neck and shoulders under the ears, like her sitting frame
 "DDDDDD..............DDDDDD",
 "DDDDDDD............DDDDDDD",
 ".DDDDDDD..........DDDDDDD.",
 ".DDDDDDDD........DDDDDDDD.",
 "..DDDDDDDDDDDDDDDDDDDDDD..",
]
RUMP=[  # the back and rump showing behind the head, rounded, a soft light along the top
 ".....DDDDDD.....",
 "...DDKKKKKKDD...",
 "..DKKDDDDDDKKD..",
 ".DKDDDDDDDDDDKD.",
 "DDDDDDDDDDDDDDDD",
 "DDDDDDDDDDDDDDDD",
 "DDDDDDDDDDDDDDDD",
 "DDDDDDDDDDDDDDDD",
]
RUMP_X=66;RUMP_Y=72
def front_frame(liftL,liftR,hL,hR,bob,wag,flap=(0,0)):
    g={}
    n=len(F.TAIL)
    for j,r in enumerate(F.TAIL):
        k=(n-1-j)/(n-1);dx=round(wag*k*k)
        for i,c in enumerate(r):
            if c!='.':g[(70+i+dx,RUMP_Y-10+j+bob)]=c
    for j,r in enumerate(RUMP):
        for i,c in enumerate(r):
            if c!='.':g[(RUMP_X+i,RUMP_Y+j+bob)]=c
    # chest, legs and the far legs: as before (front_sym), below the head
    gg=F.front_frame(liftL,liftR,hL,hR,bob,wag)
    for (x,y),c in gg.items():
        if y>=101+bob:g[(x,y)]=c
    for (x,y),c in F.CHEST.items():g[(x,y+5+bob)]=c
    for j,r in enumerate(NECK):
        for i,c in enumerate(r):
            if c!='.':g.setdefault((61+i,96+j+bob),c)
    for (x,y),c in H.head(77+bob,flap).items():g[(x,y)]=c
    return g
LIFT_A=F.LIFT_A;LIFT_B=F.LIFT_B;BOB=F.BOB;WAG=F.WAG
FLAP=[1,0,0,1,1,0,0,1]   # the ears lag the head: out as it comes down, back in as it rises
def frames():
    out=[render(front_frame(LIFT_A[k],LIFT_B[k],round(LIFT_B[k]*0.6),round(LIFT_A[k]*0.6),BOB[k],WAG[k],(FLAP[k],FLAP[k]))) for k in range(8)]
    return out,render(front_frame(0,0,0,0,0,0))
if __name__=='__main__':
    ff,fs=frames()
    preview([load_frame(13),fs,ff[0],ff[1]],os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','front4_big.png'),z=8,crop=(50,58,98,128))
