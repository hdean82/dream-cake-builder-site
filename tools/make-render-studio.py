# Builds render-studio.html (a local copy of the Studio with a render hook) for making screenshots and theme renders.
s=open('studio.html').read()
a='sceneReady=true;applyScene();renderPanels();renderSummary();updateUndo();build();'
assert s.count(a)==1
s=s.replace(a,a+'\nwindow.__H={THEMES,applyTheme,DECOR,R,cam,ctl,cake,S,render,loadSample,get design(){return design},commit,makeBackground,build,applyScene,PRESETS,T};\n')
open('render-studio.html','w').write(s)
