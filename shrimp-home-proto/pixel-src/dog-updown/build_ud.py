# Builds the dog's walk-toward (front) and walk-away (back) cycles in Puti's style, plus a standing frame
# for each, and appends them to her 14-frame dog sheet.
import sys,os,math;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from common import *
import back8
sit=to_grid(load_frame(13))
# ---------------- front: her own head and front legs, standing ----------------
HEAD_DY=4
CHEST=[
# x 52 + i
# 0         1         2         3
# 0123456789012345678901234567890123456789
 "........DDDDDDDDDDDDDDDDDDDDDMMDDDDD.....",  # 100 under the chin
 "........DDDDDDDDDDDMMMMMMMMMMMTDDDDD.....",  # 101
 ".......DDDDDDDDDDTTMMMMMMMTTTTTTTDDDDD...",  # 102
 ".......DDDDDDDDDTTTTTTTTTTTTTTTTTTDDDD...",  # 103
 ".......DDDDDDDDTTTTTTTTTTTTTTTTTTTTDDD...",  # 104
 ".......DDDDDDDTTTTTTTTTTTTTTTTTTTTTDDD...",  # 105
 "........DDDDDDTTTTTTTTTTTTTTTTTTTTTDD....",  # 106
 "........DDDDDTTTTTTTTMTMMTTTTTTTTTTDD....",  # 107
 ".........DDDDTTTTTTTMMMMMMTTTTTTTTDD.....",  # 108
 "..........DDDTTTTTTMMDDDDMMTTTTTTDD......",  # 109
]
CHEST_Y=100
def leg_body(x0,x1,n):
    body=[[sit.get((x,y)) for x in range(x0,x1+1)] for y in range(104,122)]
    return [body[min(len(body)-1,int(i*len(body)/max(1,n)))] for i in range(n)]
# her front paws (from the sitting frame), cleaned of the haunch beside the left one
PAW_L=["DMMTTTTD","DMTTTTTD","DDTTDTTDD",".DDDDDDD."]
PAW_R=["DMTTTTTD","DMMTTTTD","DDTTDTTDD",".DDDDDDD."]
def paste_rows(g,rows,x0,y0):
    for j,r in enumerate(rows):
        for i,c in enumerate(r):
            if c and c!='.':g[(x0+i,y0+j)]=c
# the tip of her tail, wagging behind the head: it shows past the head's top corners at the ends of the wag
TIP=[".DT.","DTTD","DTMD","DMD.",".D.."]
def front_frame(liftL,liftR,hL,hR,bob,wag):
    g={}
    # tail tip first, so the head covers it in the middle of the wag
    tx=71+wag*3.6-2;ty=74+bob+(0 if abs(wag)>0.5 else 3)
    top=109+bob
    for (xs,lift,shape) in [(71,hL,['MD','MD','KD','MD']),(77,hR,['DM','DM','DK','DM'])]:
        bot=122-lift
        for y in range(top+2,bot-1):
            r=shape[(y-top)%len(shape)]
            for i,c in enumerate(r):g[(xs+i,y)]=c
        px=xs-1
        for i,c in enumerate('DMTD'):g[(px+i,bot-1)]=c
        for i,c in enumerate('DDDD'):g[(px+i,bot)]=c
    for (x0,x1,lift,paw,pdx) in [(63,70,liftL,PAW_L,0),(79,86,liftR,PAW_R,0)]:
        bot=126-lift
        n=max(1,bot-top+1-len(paw))
        paste_rows(g,leg_body(x0,x1,n),x0,top)
        paste_rows(g,paw,x0+pdx,bot-len(paw)+1)
    paste_rows(g,CHEST,52,CHEST_Y+bob)
    for (x,y),c in sit.items():
        if y<=95:g[(x,y+HEAD_DY+bob)]=c
    return g
# ---------------- the cycles ----------------
LIFT_A=[0,0,0,0,2,5,4,1];LIFT_B=[2,5,4,1,0,0,0,0];BOB=[0,-1,-1,0,0,-1,-1,0]
WAG_F=[-1,-0.6,0,0.6,1,0.6,0,-0.6]
def front_frames():
    out=[render(front_frame(LIFT_A[k],LIFT_B[k],round(LIFT_B[k]*0.6),round(LIFT_A[k]*0.6),BOB[k],WAG_F[k])) for k in range(8)]
    stand=render(front_frame(0,0,0,0,0,0))
    return out,stand
def back_frames():
    W=[-4,-3,0,3,4,3,0,-3]
    out=[render(back8.back_frame(LIFT_A[k],LIFT_B[k],round(LIFT_B[k]*0.6),round(LIFT_A[k]*0.6),BOB[k],W[k])) for k in range(8)]
    stand=render(back8.back_frame(0,0,0,0,0,-1))
    return out,stand
if __name__=='__main__':
    ff,fs=front_frames();bf,bs=back_frames()
    preview([load_frame(13)]+ff+[fs],os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','final_front_zoom.png'),z=5,crop=(48,62,96,128))
    preview([load_frame(0)]+bf+[bs],os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','final_back_zoom.png'),z=5,crop=(48,62,96,128))
    # the new sheet: her 14 frames, then 8 toward, 8 away, stand toward, stand away
    src=Image.open(SRC).convert('RGBA')
    n=14+8+8+2
    sheet=Image.new('RGBA',(128*n,128),(0,0,0,0))
    sheet.paste(src,(0,0))
    for k,f in enumerate(ff+bf+[fs,bs]):sheet.alpha_composite(f,(128*(14+k),0))
    sheet.save(os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','dog_sheet_ud.png'))
    # animated previews on grass, 3x
    def anim(frames,path,fps=12,z=3,crop=(36,60,106,128)):
        ims=[]
        for f in frames:
            c=Image.new('RGBA',(crop[2]-crop[0],crop[3]-crop[1]),(106,190,48,255));c.alpha_composite(f.crop(crop))
            ims.append(c.resize((c.size[0]*z,c.size[1]*z),Image.NEAREST).convert('P',palette=Image.ADAPTIVE))
        ims[0].save(path,save_all=True,append_images=ims[1:],duration=int(1000/fps),loop=0)
    anim(ff,os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','walk_down.gif'))
    anim(bf,os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','walk_up.gif'))
    anim([load_frame(i) for i in range(1,13)],os.path.join(os.path.dirname(os.path.abspath(__file__)),'out','walk_side.gif'),fps=16,crop=(10,60,110,128))
    print('ok',sheet.size)
