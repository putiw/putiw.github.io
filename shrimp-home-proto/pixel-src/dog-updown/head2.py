# Her dog's head walking toward you, tipped down a little: the same size as her head, with more of the top
# showing and the eyes, nose and muzzle lower. Upper case is the face; lower case is the ear (d dark, t tan
# stripe, m mid), which swings out a little with each step.
import sys,os;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from common import *
HALF=[  # x 61..73, mirrored to x 74..86
 ".........DDDD",   # 0  the crown
 "......DDDMMMM",   # 1
 ".....DMMTTTTT",   # 2
 "....DMTTTTTTT",   # 3
 "...DMTTTTTTTT",   # 4
 "..dddTTTTTTTT",   # 5  the ear root
 ".dtmddTTTTTTT",   # 6
 ".dtmddTTTTTTT",   # 7
 "dttmddTTTTTTT",   # 8
 "dtmdddTTTTTTT",   # 9
 "dtmdddTTTTTTT",   # 10
 "dtmdddTTTTTTT",   # 11
 "dtmdddTTMDDTT",   # 12 eyes, 2 x 3, the brow beside each
 "dttdddTTTDDTM",   # 13 the bridge of the nose
 "dtmdddTTTDDTM",   # 14
 "dtmdddMTTTTTM",   # 15
 "dtmdddTTTTTTT",   # 16
 ".dtdddTTTTTDD",   # 17 the nose
 ".dtdddMTTTDDD",   # 18
 ".dmddDTTTTTDD",   # 19
 "..dddDMTTTTTM",   # 20 the muzzle
 "...dd.DMTTTTT",   # 21
 ".......DDMMTT",   # 22
 ".........DDDD",   # 23 the chin, tucked
]
X0=61
def head(y0,flap=(0,0)):
    g={}
    for j,row in enumerate(HALF):
        for side in (0,1):
            op=flap[side]
            sw=0 if j<11 else op if j<16 else (op+1 if op else 0)
            for i,ch in enumerate(row):
                if ch=='.':continue
                x=X0+i
                if ch.islower():
                    x-=sw
                    c=ch.upper()
                else:c=ch
                if side:x=147-x
                if ch.islower() or (x,y0+j) not in g:g[(x,y0+j)]=c
            # where the ear swung away, the cheek shows in shadow
            if sw:
                inner=[X0+i for i,ch in enumerate(row) if ch.islower()]
                if inner:
                    for k in range(sw):
                        x=max(inner)-k
                        xx=x if not side else 147-x
                        if g.get((xx,y0+j)) in (None,'D') :g[(xx,y0+j)]='M'
    return g
if __name__=='__main__':
    import front_sym as F
    old={(x,y+5):c for (x,y),c in F.HEAD.items()}
    preview([load_frame(13),render(old),render(head(77)),render(head(77,(1,1)))],os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','head2.png'),z=9,crop=(54,70,94,104))
