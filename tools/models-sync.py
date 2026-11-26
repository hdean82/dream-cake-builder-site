# recompress recovered models into assets/m and refresh the MODEL_OK list in studio.html
import os,re,subprocess,sys
R='/home/claude/dream-cake-builder-site'
sys.path.insert(0,'/home/claude/meshy/tools');from retex import retex
src='/home/claude/meshy/old'
for f in os.listdir(src):
  d=f'{R}/assets/m/{f}'
  if f.endswith('.glb') and not os.path.exists(d):retex(f'{src}/{f}',d)
ok=sorted(f[:8] for f in os.listdir(f'{R}/assets/m') if f.endswith('.glb'))
s=open(f'{R}/studio.html').read()
line="const MODEL_OK=new Set('"+' '.join(ok)+"'.split(' '));"
if 'const MODEL_OK=' in s:s=re.sub(r"const MODEL_OK=new Set\('[^']*'\.split\(' '\)\);",line,s)
else:s=s.replace('const MODEL_BLOB={',line+'\nconst MODEL_BLOB={',1)
open(f'{R}/studio.html','w').write(s);print(len(ok),'models live')
