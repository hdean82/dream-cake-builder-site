# Assembles tools/signature-decor.js from sig-pieces.js + sig-extra.js + sig-themes.js and injects it into studio.html
import re,sys
d='/home/claude/dream-cake-builder-site/'
old=open(d+'tools/signature-decor.js').read()
new=open(d+'tools/sig-pieces.js').read()+open(d+'tools/sig-extra.js').read()+'\n'+open(d+'tools/sig-themes.js').read()
s=open(d+'studio.html').read()
assert s.count(old)==1,'old block not found'
s=s.replace(old,new)
open(d+'studio.html','w').write(s)
open(d+'tools/signature-decor.js','w').write(new)
print('ok',len(new))
