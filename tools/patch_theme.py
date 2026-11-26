import sys,re
key=sys.argv[1]
new=sys.stdin.read().strip('\n')
p='/home/claude/dream-cake-builder-site/tools/sig-themes.js'
s=open(p).read()
a=s.index(" {key:'%s',"%key)
m=re.compile(r"\n \{key:'|\n\);?\s*$|\}\}\);\s*$").search(s,a+5)
# find end of this theme: next "\n {key:'" or the final ");"
nxt=s.find("\n {key:'",a+5)
if nxt==-1:
    end=s.rindex('}});')+2
    tail=s[end:]
    s=s[:a]+new.rstrip(',').rstrip()+tail
else:
    s=s[:a]+new+s[nxt:]
open(p,'w').write(s)
print('patched',key)
