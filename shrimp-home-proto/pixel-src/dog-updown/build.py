# Builds the dog's walk-toward (front) and walk-away (back) cycles in Puti's style, plus a standing frame
# for each, and appends them to her 14-frame dog sheet.
import sys,os;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from common import *
import front_sym as F, back_sym as Bk
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')
if __name__=='__main__':
    os.makedirs(OUT,exist_ok=True)
    ff,fs=F.frames();bf,bs=Bk.frames()
    src=Image.open(SRC).convert('RGBA')
    n=14+8+8+2
    sheet=Image.new('RGBA',(128*n,128),(0,0,0,0))
    sheet.paste(src,(0,0))
    for k,f in enumerate(ff+bf+[fs,bs]):sheet.alpha_composite(f,(128*(14+k),0))
    sheet.save(os.path.join(OUT,'dog_sheet_ud.png'))
    preview([load_frame(13)]+ff+[fs],os.path.join(OUT,'front_zoom.png'),z=5,crop=(46,50,100,128))
    preview([load_frame(0)]+bf+[bs],os.path.join(OUT,'back_zoom.png'),z=5,crop=(46,50,100,128))
    print('ok',sheet.size)
