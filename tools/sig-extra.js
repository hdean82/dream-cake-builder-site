// extra signature pieces (added in round 2)
METALS['#b0825f']=1;METALS['#8c6a52']=1;METALS['#b9725f']=1;
DECOR.glitterspheres={...DECOR.spheres,label:'Glitter Spheres',mat:c=>dmat(c,{r:.62,metal:.55,cc:.1}),colors:['#b0825f','#d9a08a','#d4ae5a','#c9ccd2','#f3ead8','#5fb3a3']};
DECOR_ICONS.glitterspheres=di('<circle cx="14" cy="18" r="8" fill="#b0825f"/><circle cx="26" cy="12" r="6" fill="#5fb3a3"/><circle cx="27" cy="23" r="4.5" fill="#f3ead8"/><circle cx="11" cy="15" r="1" fill="#fff"/>');
// ---- bumble bee face (lies on the side of a fuzzy black cake) ----
function beeFaceParts(q,c,mode,dc){const yel=[],lid=[],white=[],blk=[],hl=[];
 yel.push(sgOval(0,0,1.0,.86,.03));
 for(const sd of[-1,1]){const cx=sd*.42,cy=.16;white.push(sgOval(cx,cy,.34,.38,.045));blk.push(sgOval(cx+sd*.06,cy-.05,.15,.17,.052));lid.push(sgOval(cx,cy+.2,.37,.22,.06));hl.push(sgOval(cx+sd*.1,cy-.0,.045,.05,.075))}
 const sm=new T.Shape();sm.moveTo(-.3,-.36);sm.quadraticCurveTo(0,-.72,.3,-.36);sm.quadraticCurveTo(0,-.56,-.3,-.36);blk.push(flatShape(sm,.05,0));
 const R=sgR(dc),B=l=>sgBend(mg(l),R);
 return[[dmat(c,{r:.4,cc:.4}),B(yel)],[dmat('#ffffff',{r:.3,cc:.6}),B(white)],[dmat('#f2b40f',{r:.4,cc:.4}),B(lid)],[dmat('#1d1b1f',{r:.25,cc:.7}),B(blk)],[dmat('#ffffff',{r:.1,cc:1}),B(hl)]]}
// ---- bee wings and looped antennae (stand on top) ----
function beeTopParts(q,c,mode,dc){const dark=[],wing=[],swirl=[];
 for(const sd of[-1,1]){const pts=[new V3(sd*.45,0,.55),new V3(sd*.58,.5,.6),new V3(sd*.8,.85,.6)];dark.push(new T.TubeGeometry(new T.CatmullRomCurve3(pts),14,.045,6,false));const ring=new T.TorusGeometry(.22,.05,8,24);ring.translate(sd*.82,1.08,.6);dark.push(ring);
  const w=new T.SphereGeometry(1,28,16);w.scale(.2,.95,.07);w.rotateZ(-sd*.38);w.translate(sd*.78,.7,-.35);wing.push(w);const sw=new T.TorusGeometry(.16,.035,6,22,PI*1.6);sw.translate(0,0,0);sw.rotateZ(-sd*.38);sw.translate(sd*.78,.75,-.28);swirl.push(sw);const sw2=new T.TorusGeometry(.07,.035,6,16,PI*1.6);sw2.rotateZ(-sd*.38+.5);sw2.translate(sd*.78,.75,-.28);swirl.push(sw2)}
 return[[dmat('#1d1b1f',{r:.35,cc:.5}),mg([...dark,...swirl])],[dmat('#ffffff',{r:.4,cc:.5}),mg(wing)]]}
// ---- stock pot: tilted lid and loop handles ----
function potLid2Parts(q,c){const parts=potLidParts(q,c);for(const p of parts){p[1].rotateX(-.18);p[1].translate(0,.3,-.95)}return parts}
function potHandleParts(q,c){const a=new T.TorusGeometry(.42,.07,8,22,PI),b=new T.TorusGeometry(.42,.07,8,22,PI);b.translate(0,0,0);return[[sgMat.metal(c),mg([a])]]}
// ---- baseball glove and bat ----
function gloveParts(q,c){const palm=new T.SphereGeometry(1,24,16);palm.scale(.55,.14,.6);palm.translate(0,.16,0);const fing=[];for(let k=0;k<4;k++){const f=new T.CapsuleGeometry(.08,.46,4,10);f.rotateX(PI/2);f.rotateY((k-1.5)*.16);f.translate((k-1.5)*.2,.18,.66);fing.push(f)}const th=new T.CapsuleGeometry(.09,.36,4,10);th.rotateX(PI/2);th.rotateY(.95);th.translate(.5,.18,.1);fing.push(th);
 const pocket=new T.SphereGeometry(1,20,12);pocket.scale(.3,.05,.3);pocket.translate(0,.3,.05);return[[dmat(c,{r:.55,sh:.4}),mg([palm,...fing])],[dmat('#8a5326',{r:.6}),norm(pocket)]]}
function batParts(q,c){const b=new T.CylinderGeometry(.11,.04,1.9,18);b.rotateZ(PI/2);b.translate(.1,.12,0);const k=new T.SphereGeometry(.07,12,8);k.translate(-.88,.12,0);return[[dmat(c,{r:.5,cc:.3}),mg([b,k])]]}
// ---- monogram hoop: floral hoop with a gold M inside ----
function monoHoopParts(q,c,mode,dc){const parts=hoopParts(q,c),R=.95,cy=R+1.05,M=[],bar=(w,h,x,y,rz)=>{const g=new T.BoxGeometry(w,h,.05);g.rotateZ(rz||0);g.translate(x,y,0);M.push(g)};
 bar(.08,.78,-.3,cy);bar(.08,.78,.3,cy);bar(.08,.56,-.15,cy+.1,.55);bar(.08,.56,.15,cy+.1,-.55);parts[0][1]=mg([parts[0][1],...M]);return parts}
Object.assign(DECOR,{
 beeface:{label:'Bumble Bee Face',layouts:['band','scatter'],layout:'band',count:1,max:1,color:'#ffd21f',colors:['#ffd21f'],sp:3,side:'face',roll:0,sink:0,embed:-.02,make:beeFaceParts},
 beetop:{label:'Bee Wings And Antennae',layouts:['cluster'],layout:'cluster',count:1,max:1,color:'#ffd21f',colors:['#ffd21f'],sp:3,side:'up',sink:.02,noTilt:true,spin:0,make:beeTopParts},
 potlid2:{label:'Tilted Stock Pot Lid',layouts:['cluster'],layout:'cluster',count:1,max:1,color:'#c9ccd2',colors:['#c9ccd2','#d4ae5a'],sp:2,side:'up',sink:-.05,noTilt:true,spin:0,make:potLid2Parts},
 pothandle:{label:'Stock Pot Handles',layouts:['band'],layout:'band',count:2,max:2,color:'#c9ccd2',colors:['#c9ccd2','#d4ae5a'],sp:1,side:'face',roll:0,sink:0,embed:.02,make:potHandleParts},
 glove:{label:'Baseball Glove',layouts:['cluster','crown','scatter'],layout:'cluster',count:1,max:3,color:'#c7843f',colors:['#c7843f','#8a5326','#1d1b1f'],sp:1.4,side:'up',sink:.03,embed:.05,noTilt:true,make:gloveParts},
 bat:{label:'Wooden Bat',layouts:['cluster','crown','scatter'],layout:'cluster',count:1,max:3,color:'#c79a5b',colors:['#c79a5b','#2a1a10','#fbf7f1'],sp:1.8,side:'up',sink:.03,embed:.05,noTilt:true,make:batParts},
 monohoop:{label:'Monogram Floral Hoop',layouts:['cluster'],layout:'cluster',count:1,max:1,color:'#d4ae5a',colors:['#d4ae5a','#c9ccd2','#d9a08a'],sp:2,sink:.4,noTilt:true,spin:0,make:monoHoopParts}});
{const c=DECOR_CATS.find(x=>x.key==='signature');c.items.push('glitterspheres','beeface','beetop','potlid2','pothandle','glove','bat','monohoop')}
{const ic=(k,b)=>DECOR_ICONS[k]=di(b);
 ic('beeface','<ellipse cx="20" cy="15" rx="12" ry="10" fill="#ffd21f"/><ellipse cx="14" cy="13" rx="4" ry="5" fill="#fff"/><ellipse cx="26" cy="13" rx="4" ry="5" fill="#fff"/><circle cx="15" cy="14" r="2" fill="#1d1b1f"/><circle cx="27" cy="14" r="2" fill="#1d1b1f"/><path d="M15 21q5 4 10 0" stroke="#1d1b1f" stroke-width="1.6" fill="none"/>');
 ic('beetop','<path d="M12 22q-3-8 0-14M28 22q3-8 0-14" stroke="#1d1b1f" stroke-width="2" fill="none"/><circle cx="12" cy="7" r="3" fill="none" stroke="#1d1b1f" stroke-width="2"/><circle cx="28" cy="7" r="3" fill="none" stroke="#1d1b1f" stroke-width="2"/>');
 ic('potlid2','<ellipse cx="20" cy="18" rx="15" ry="5" fill="#c9ccd2" transform="rotate(-8 20 18)"/><path d="M15 12q5-6 10 0" stroke="#999" stroke-width="2" fill="none"/>');
 ic('pothandle','<path d="M10 20a10 10 0 0 1 20 0" stroke="#c9ccd2" stroke-width="3" fill="none"/>');
 ic('glove','<ellipse cx="19" cy="19" rx="9" ry="6" fill="#c7843f"/><rect x="12" y="6" width="3" height="11" rx="1.5" fill="#c7843f"/><rect x="17" y="4" width="3" height="12" rx="1.5" fill="#c7843f"/><rect x="22" y="6" width="3" height="11" rx="1.5" fill="#c7843f"/>');
 ic('bat','<rect x="6" y="13" width="28" height="4" rx="2" fill="#c79a5b" transform="rotate(-18 20 15)"/>');
 ic('monohoop','<circle cx="20" cy="14" r="10" fill="none" stroke="#d4ae5a" stroke-width="2"/><path d="M15 19V9l5 6 5-6v10" stroke="#d4ae5a" stroke-width="1.8" fill="none"/>')}
// ---- puffy pillow top: a square dome with pinched corners and gold tassels ----
function pillowTopParts(q,c,mode,dc){const N=40,g=new T.PlaneGeometry(2,2,N,N);g.rotateX(-PI/2);const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),ex=1-Math.pow(Math.abs(x),2.4),ez=1-Math.pow(Math.abs(z),2.4),pinch=1-.5*Math.pow(Math.abs(x*z),1.3);p.setY(i,.3*Math.max(0,ex*ez)*pinch)}g.computeVertexNormals();
 const tass=[];for(const sx of[-1,1])for(const sz of[-1,1]){const t=new T.SphereGeometry(.07,12,8);t.translate(sx*.99,.05,sz*.99);tass.push(t);const t2=new T.ConeGeometry(.05,.18,10);t2.rotateX(PI);t2.translate(sx*1.02,-.02,sz*1.02);tass.push(t2)}
 return[[dmat(c,{r:.5,sh:.45}),norm(g)],[sgMat.metal('#d4ae5a'),mg(tass)]]}
DECOR.pillowtop={label:'Puffy Pillow Top',layouts:['cluster'],layout:'cluster',count:1,max:1,color:'#fbf7f1',colors:['#fbf7f1','#f3d6d9','#c9dbef'],sp:3,side:'up',sink:0,tilt:[0,0],spin:0,make:pillowTopParts};
DECOR_ICONS.pillowtop=di('<path d="M6 22q14-14 28 0q-14 4-28 0z" fill="#fbf7f1" stroke="#d9cdbd"/><circle cx="6" cy="22" r="1.6" fill="#d4ae5a"/><circle cx="34" cy="22" r="1.6" fill="#d4ae5a"/>');
{const c=DECOR_CATS.find(x=>x.key==='signature');void 0}
// ---- gold tassels for pillow corners ----
function tasselParts(q,c){const b=new T.SphereGeometry(.16,16,12);b.translate(0,0,.12);const cap=new T.CylinderGeometry(.09,.13,.14,14);cap.translate(0,-.17,.12);const fr=[];for(let i=0;i<14;i++){const a=i/14*2*PI,g=new T.CylinderGeometry(.022,.016,.55,5);g.translate(Math.cos(a)*.08,-.5,.12+Math.sin(a)*.08);fr.push(g)}return[[sgMat.metal(c),mg([b,cap])],[dmat(c,{r:.5,metal:.5}),mg(fr)]]}
DECOR.tassel={label:'Gold Tassels',layouts:['band'],layout:'band',count:4,max:8,color:'#d4ae5a',colors:['#d4ae5a','#c9ccd2','#fbf7f1'],sp:1,roll:0,sink:0,embed:-.05,make:tasselParts};
DECOR_ICONS.tassel=di('<circle cx="20" cy="10" r="4" fill="#d4ae5a"/><path d="M16 14h8l3 18H13z" fill="#d4ae5a"/>');
{const c=DECOR_CATS.find(x=>x.key==='signature');c.items.push('tassel')}
// ---- lettered face pieces: popcorn label and birthday plaque ----
function sgText(str,h,cx,cy,depth){const g=mg(NUM_FONT.generateShapes(str,h).map(s=>flatShape(s,depth,0)));g.computeBoundingBox();const b=g.boundingBox;g.translate(cx-(b.min.x+b.max.x)/2,0,-cy-(b.min.z+b.max.z)/2);return g}
function rrectShape(w,h,r){const s=new T.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s}
function popLabelParts(q,c,mode,dc){const R=sgR(dc),B=g=>sgBend(g,R);return[[dmat(c,{r:.4,cc:.4}),B(mg([sgOval(0,0,.62,.62,.03),sgText('POP',.26,0,.16,.07),sgText('CORN',.26,0,-.2,.07)]))],[dmat('#fbf7f1',{r:.4,cc:.3}),B(sgOval(0,0,.55,.55,.05))]]}
function plaqueParts(q,c,mode,dc){const R=sgR(dc),B=g=>sgBend(g,R),t1=(dc&&dc.l1)||'HAPPY',t2=(dc&&dc.l2)||'BIRTHDAY';return[[dmat('#fbf7f1',{r:.4,cc:.3}),B(mg([flatShape(rrectShape(1.9,.86,.12),.03,0),sgText(t1,.2,0,.16,.08),sgText(t2,.2,0,-.16,.08)]))],[dmat(c,{r:.35,cc:.5}),B(flatShape(rrectShape(1.8,.76,.1),.05,0))]]}
DECOR.poplabel={label:'Popcorn Label',layouts:['band'],layout:'band',count:1,max:1,color:'#d62839',colors:['#d62839','#2f6fd0','#1d1b1f'],sp:3,side:'face',roll:0,sink:0,embed:-.02,make:popLabelParts};
DECOR.plaque={label:'Happy Birthday Plaque',layouts:['band'],layout:'band',count:1,max:1,color:'#1d1b1f',colors:['#1d1b1f','#d62839','#2f6fd0','#d4ae5a'],sp:3,side:'face',roll:0,sink:0,embed:-.02,make:plaqueParts};
DECOR_ICONS.poplabel=di('<circle cx="20" cy="20" r="13" fill="#fff" stroke="#d62839" stroke-width="3"/><text x="20" y="24" font-size="9" text-anchor="middle" fill="#d62839" font-weight="900">POP</text>');
DECOR_ICONS.plaque=di('<rect x="4" y="12" width="32" height="16" rx="3" fill="#1d1b1f" stroke="#fff"/><text x="20" y="23" font-size="7" text-anchor="middle" fill="#fff" font-weight="900">HAPPY</text>');
{const c=DECOR_CATS.find(x=>x.key==='signature');c.items.push('poplabel','plaque')}
