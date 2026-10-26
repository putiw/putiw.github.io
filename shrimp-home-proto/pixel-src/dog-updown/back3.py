# Walking away: the back of her head is dark like the rest of the back, so the ears carry it — each one dark
# with the tan stripe down its outer edge, a lighter line where it meets the head, and the same swing out and
# back as walking toward you. Body, rump, tail and legs as in back_sym.
import sys,os;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from common import *
import back_sym as B, head2 as H
def back_head(y0,flap=(0,0)):
    g={}
    full=H.head(y0,flap)
    # which pixels are ear: the head with the ears swung far out tells us
    face=set();ear=set()
    for j,row in enumerate(H.HALF):
        for side in (0,1):
            op=flap[side];sw=0 if j<11 else op if j<16 else (op+1 if op else 0)
            for i,ch in enumerate(row):
                if ch=='.':continue
                x=H.X0+i
                if ch.islower():x-=sw
                if side:x=147-x
                (ear if ch.islower() else face).add((x,y0+j))
    for p,c in full.items():g[p]='D'   # the back of the head is dark
    # the ears: seen from behind you look at their outer side, so her tan stripe shows wider — 2 px under
    # the dark outline, a mid-brown fleck now and then, and a tan tip
    rows={}
    for (x,y) in ear:rows.setdefault((y,x<73.5),[]).append(x)
    for (y,left),xs in rows.items():
        xs=sorted(xs,key=lambda x:abs(x-73.5),reverse=True)
        for k,x in enumerate(xs):
            if k==0:c='D'
            elif k<=2:c='M' if (y+k)%5==0 else 'T'
            else:c='D'
            g[(x,y)]=c
    # a lighter line along the inside of each ear, where it hangs against the head
    for (x,y) in ear:
        for dx in (1,-1):
            q=(x+dx,y)
            if q in g and q not in ear and g[q]=='D' and (x<73.5)==(dx>0) and y>y0+6:g[q]='K'
    # the round of the skull catching a little light
    for (x,y) in [(70,y0+1),(71,y0+1),(76,y0+1),(77,y0+1),(68,y0+2),(79,y0+2),(67,y0+3),(80,y0+3)]:
        if (x,y) in g:g[(x,y)]='K'
    return g
def back_frame(liftL,liftR,fL,fR,bob,wag,flap=(0,0)):
    g=B.back_frame(liftL,liftR,fL,fR,bob,wag)
    for (x,y) in [(x,y-4+bob) for (x,y) in B.HEAD]:
        if g.get((x,y))=='D' or g.get((x,y))=='K':pass
    # replace the old head
    for (x,y),c in B.HEAD.items():g.pop((x,y-4+bob),None)
    # the body under the old head comes back, then the new head on top
    gb={}
    B.paste(gb,B.BODY,54,B.BODY_Y+bob)
    for p,c in gb.items():g.setdefault(p,c)
    for p,c in back_head(73+bob,flap).items():g[p]=c
    # the tail stays in front of everything
    n=len(B.TAIL)
    for j,r in enumerate(B.TAIL):
        k=(n-1-j)/(n-1);dx=round(wag*k*k)
        for i,c in enumerate(r):
            if c!='.':g[(70+i+dx,85+j+bob)]=c
    return g
LIFT_A=B.LIFT_A;LIFT_B=B.LIFT_B;BOB=B.BOB;WAG=B.WAG
FLAP=[1,0,0,1,1,0,0,1]
def frames():
    out=[render(back_frame(LIFT_A[k],LIFT_B[k],round(LIFT_B[k]*0.6),round(LIFT_A[k]*0.6),BOB[k],WAG[k],(FLAP[k],FLAP[k]))) for k in range(8)]
    return out,render(back_frame(0,0,0,0,0,-1))
if __name__=='__main__':
    bf,bs=frames()
    preview([load_frame(0),bs,bf[0],bf[1]],os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','back3_big.png'),z=8,crop=(50,62,98,128))
