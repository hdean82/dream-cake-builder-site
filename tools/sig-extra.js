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
// ---- sports board top: four colored fields with white markings ----
function sportsTopParts(q,c,mode,dc){const RAD=(dc&&dc.rad)||1;const F=(r0,r1,a0,da,y)=>{const g=new T.RingGeometry(r0,r1,64,1,a0,da);g.rotateX(-PI/2);g.translate(0,y,0);return g};
 const P=PI/2,col=[['#3f8f45',0],['#d9893a',P],['#2f6fd0',2*P],['#5cb04e',3*P]],out=[];
 col.forEach(([cl,a])=>out.push([dmat(cl,{r:.55,cc:.2}),F(0,1,a+.01,P-.02,.05)]));
 const w=[];for(const r of[.3,.42,.54,.66,.78,.9])w.push(F(r-.012,r+.012,0+.02,P-.04,.065));
 w.push(F(.52,.55,P+.02,P-.04,.065),F(.2,.23,P+.02,P-.04,.065));
 w.push(F(.45,.48,3*P+.02,P-.04,.065),F(.08,.11,0,2*PI,.065));
 {const d=new T.PlaneGeometry(.34,.34);d.rotateX(-PI/2);d.rotateY(PI/4);d.translate(Math.cos(2.5*P)*.55,.06,-Math.sin(2.5*P)*.55);out.push([dmat('#c99a62',{r:.7}),d]);const d2=new T.PlaneGeometry(.26,.26);d2.rotateX(-PI/2);d2.rotateY(PI/4);d2.translate(Math.cos(2.5*P)*.55,.064,-Math.sin(2.5*P)*.55);out.push([dmat('#4f9a4a',{r:.6}),d2])}
 for(const a of[0,P,2*P,3*P]){const b=new T.BoxGeometry(2,.012,.03);b.rotateY(a);b.translate(0,.065,0);w.push(b)}
 out.push([dmat('#fbf7f1',{r:.5}),mg(w)]);out.forEach(([,g])=>g.scale(RAD,1,RAD));return out}
DECOR.sportstop={label:'Sports Field Top',layouts:['cluster'],layout:'cluster',count:1,max:1,color:'#3f8f45',colors:['#3f8f45'],sp:.3,side:'up',sink:0,tilt:[0,0],spin:0,make:sportsTopParts};
DECOR_ICONS.sportstop=di('<circle cx="20" cy="20" r="14" fill="#5cb04e"/><path d="M20 20V6A14 14 0 0 1 34 20z" fill="#d9893a"/><path d="M20 20H6A14 14 0 0 0 20 34z" fill="#2f6fd0"/>');
{const c=DECOR_CATS.find(x=>x.key==='signature');c.items.push('sportstop')}
// ---- script word topper (e.g. "forever|eva"), traced from the script fonts ----
const SCRIPT_WAIT=new Set();
function scriptTopParts(q,c,mode,dc){const MF=MSG_FONTS[(dc&&dc.font)||'dancing']||MSG_FONTS.dancing,ff={css:MF.css,w:MF.w||''},fs=(ff.w?ff.w+' ':'')+'80px '+MF.css;
 if(document.fonts&&!document.fonts.check(fs)&&!SCRIPT_WAIT.has(fs)){SCRIPT_WAIT.add(fs);document.fonts.load(fs).then(()=>{GLY.clear();scheduleBuild()}).catch(()=>{})}
 const lines=String((dc&&dc.text)||'forever|eva').split('|').slice(0,3),gs=[];let y=0;
 lines.forEach((ln,i)=>{const sh=NUM_FONT.generateShapes(ln,.55,ff);if(!sh.length)return;const g=new T.ExtrudeGeometry(sh,{depth:.07,bevelEnabled:true,bevelThickness:.012,bevelSize:.008,bevelSegments:1,curveSegments:6});g.computeBoundingBox();const b=g.boundingBox;g.translate(-(b.min.x+b.max.x)/2+(i%2?.25:-.1),-b.max.y+y,-.035);y-=(b.max.y-b.min.y)*.86;gs.push(g)});
 if(!gs.length)return[];const m=mg(gs);m.computeBoundingBox();const bb=m.boundingBox,pk=[];for(const sx of[-.28,.28]){const p=new T.CylinderGeometry(.022,.022,1.3,8);p.translate(sx,bb.min.y-.55,0);pk.push(p)}
 return[[dmat(c,{r:.28,metal:.4,cc:.7,ccr:.1}),mg([m,...pk])]]}
DECOR.scripttop={label:'Script Word Topper',layouts:['cluster'],layout:'cluster',count:1,max:1,color:'#d9a08a',colors:['#d9a08a','#d4ae5a','#c9ccd2','#1d1b1f','#fbf7f1'],sp:.4,side:'up',sink:.6,tilt:[0,0],spin:0,make:scriptTopParts};
DECOR_ICONS.scripttop=di('<text x="20" y="24" font-size="13" text-anchor="middle" fill="#d9a08a" font-style="italic" font-family="cursive">love</text>');
{const c=DECOR_CATS.find(x=>x.key==='signature');c.items.push('scripttop')}
// ---- crawfish hanging over a rim (side piece) ----
function crawHangParts(q,c,mode,dc){const p=crawfishParts(q,c,mode,dc);for(const[,g]of p){g.rotateX(PI/2);g.rotateZ((q()-.5)*.7)}return p}
DECOR.crawhang={label:'Crawfish Over The Rim',layouts:['band'],layout:'band',count:5,max:16,color:'#d2381e',colors:['#d2381e','#b52a14'],sp:.9,roll:.3,sink:0,embed:.02,make:crawHangParts};
DECOR_ICONS.crawhang=DECOR_ICONS.crawfish;
{const c=DECOR_CATS.find(x=>x.key==='signature');c.items.push('crawhang')}
function cornUpParts(q,c,mode,dc){const p=cornParts(q,c,mode,dc);for(const[,g]of p){g.computeBoundingBox();const b=g.boundingBox;g.rotateZ(PI/2+(q()-.5)*.35)}return p}
DECOR.cornup={label:'Standing Corn',layouts:['cluster','crown','scatter'],layout:'cluster',count:3,max:12,color:'#f2c230',colors:['#f2c230','#f6d76a'],sp:.7,side:'up',sink:.02,tilt:[0,0],make:cornUpParts};
DECOR_ICONS.cornup=DECOR_ICONS.corncob;
{const c=DECOR_CATS.find(x=>x.key==='signature');c.items.push('cornup')}
// ---- rope knot with hanging ends (money bag neck) ----
function ropeKnotParts(q,c){const g=[];const rope=(pts,r)=>{const cv=new T.CatmullRomCurve3(pts.map(p=>new V3(...p))),tb=new T.TubeGeometry(cv,48,r,10,false),pp=tb.attributes.position;return tb};
 for(let k=0;k<3;k++){const a=k/3*2*PI,t=new T.TorusGeometry(.24,.12,10,24);t.rotateY(.4);t.translate(Math.cos(a)*.13,Math.sin(a)*.13,.12);g.push(t)}const b=new T.SphereGeometry(.17,14,10);b.translate(0,0,.2);g.push(b);
 g.push(rope([[-.05,-.1,.15],[-.2,-.6,.5],[-.36,-1.2,.85],[-.45,-1.75,1.15],[-.55,-2.4,1.35]],.13));g.push(rope([[.08,-.1,.15],[.22,-.55,.45],[.34,-1.05,.8],[.45,-1.6,1.1],[.5,-2.1,1.3]],.13));
 for(const[x,y,z]of[[-.55,-2.42,1.35],[.5,-2.12,1.3]]){const s=new T.SphereGeometry(.1,10,8);s.translate(x,y,z);g.push(s)}
 return[[dmat(c,{r:.6,cc:.1}),mg(g)]]}
DECOR.ropeknot={label:'Rope Knot And Ties',layouts:['band'],layout:'band',count:1,max:2,color:'#1d1b1f',colors:['#1d1b1f','#d4ae5a','#8a5a3a','#fbf7f1'],sp:2,roll:0,sink:0,embed:.08,make:ropeKnotParts};
DECOR_ICONS.ropeknot=di('<circle cx="20" cy="12" r="5" fill="#1d1b1f"/><path d="M18 15q-4 10-6 18M22 15q3 8 4 14" stroke="#1d1b1f" stroke-width="3" fill="none"/>');
{const c=DECOR_CATS.find(x=>x.key==='signature');c.items.push('ropeknot')}
// ---- sports details: hoop rim with piped net, yard numbers, grass tuft ----
function hoopNetParts(q,c){const rim=new T.TorusGeometry(.62,.06,10,40);rim.rotateX(PI/2);rim.translate(0,.08,0);const net=[];for(let k=0;k<16;k++){const a=-1.2+k/15*2.4+(q()-.5)*.15,pts=[];for(let s=0;s<=10;s++){const u=s/10,rr=.6+u*1.5,w=Math.sin(u*9+k)*.12;pts.push(new V3(-Math.cos(a)*rr+Math.sin(a)*w,.07-Math.pow(Math.max(0,u-.55),2)*1.6+Math.sin(u*14+k)*.02,Math.sin(a)*rr*.75+Math.cos(a)*w))}net.push(new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,.035,6,false))}
 return[[dmat(c,{r:.35,cc:.5}),rim],[dmat('#fbf7f1',{r:.45,cc:.3}),mg(net)]]}
DECOR.hoopnet={label:'Hoop Rim And Piped Net',layouts:['cluster'],layout:'cluster',count:1,max:2,color:'#d62839',colors:['#d62839','#e8762c'],sp:.6,side:'up',sink:.05,tilt:[0,0],make:hoopNetParts};
function yardNumParts(q,c,mode,dc){const txt=(dc&&dc.text)||'10 20 30 40 50';return[[dmat(c,{r:.4,cc:.3}),sgText(txt,.5,0,0,.04)]]}
DECOR.yardnums={label:'Yard Line Numbers',layouts:['cluster'],layout:'cluster',count:1,max:1,color:'#fbf7f1',colors:['#fbf7f1','#f2c230'],sp:.3,side:'up',sink:.0,tilt:[0,0],spin:0,make:yardNumParts};
function grassTuftParts(q,c){const g=[];for(let k=0;k<90;k++){const a=q()*2*PI,r0=.45+q()*.35,L=.18+q()*.2,cn=new T.ConeGeometry(.035,L,5);cn.translate(0,L/2,0);cn.rotateZ((q()*.6+.3));cn.rotateY(-a);cn.translate(Math.cos(a)*r0,0,Math.sin(a)*r0);g.push(cn)}return[[dmat(c,{r:.6}),mg(g)]]}
DECOR.grasstuft={label:'Piped Grass Tuft',layouts:['cluster','scatter'],layout:'cluster',count:1,max:8,color:'#3f9a45',colors:['#3f9a45','#5cb04e'],sp:.6,side:'up',sink:.02,tilt:[0,0],make:grassTuftParts};
DECOR_ICONS.hoopnet=di('<ellipse cx="20" cy="14" rx="10" ry="4" fill="none" stroke="#d62839" stroke-width="3"/><path d="M11 15l4 14M20 18v12M29 15l-4 14" stroke="#ccc" stroke-width="2"/>');
DECOR_ICONS.yardnums=di('<rect x="3" y="12" width="34" height="16" fill="#3f9a45"/><text x="20" y="24" font-size="9" text-anchor="middle" fill="#fff" font-weight="900">10 20</text>');
DECOR_ICONS.grasstuft=di('<path d="M8 30l4-12M14 30l2-14M20 30v-15M26 30l-2-14M32 30l-4-12" stroke="#3f9a45" stroke-width="3"/>');
{const c=DECOR_CATS.find(x=>x.key==='signature');c.items.push('hoopnet','yardnums','grasstuft')}
// ---- Meshy sculpted pieces (hosted GLBs, optimized) ----
const MX=[
 ['peony_coral','Coral Sugar Peony','up',{ds:true,cut:.74}],['peony_blush','Blush Sugar Peony','up',{ds:true,cut:.3}],['peony_bud','Coral Peony Bud','up',{ds:true,cut:.55}],
 ['queenanne','Queen Anne\'s Lace Sprig','front',{ds:true}],['waxflower','White Waxflower Sprig','front',{ds:true}],['eucalyptus','Eucalyptus Sprig','front',{ds:true}],
 ['cascade_wedding','Peony Cascade Spray','front',{ds:true}],['cascade_rose','Rose Cascade Spray','front',{ds:true}],
 ['teddy_balloon','Teddy Hot Air Balloon','front',{}],['teddy_seated','Sitting Teddy Bear','front',{}],['teddy_reclining','Playful Teddy Bear','front',{}],['block_c','Baby Letter Block','front',{}],
 ['brooch','Rose Gold Brooch','front',{metal:.85,rough:.25}],['tassel','Gold Tassel','front',{metal:.85,rough:.35}],
 ['crawfish','Boiled Crawfish','up',{}],['corn_cob','Corn On The Cob','front',{}],['corn_round','Corn Round','front',{}],['potato','Red Potato','front',{}],
 ['cash_fan','Fanned Cash','front',{ds:true}],['cash_bundle','Cash Bundle','front',{}],['clapperboard','Clapperboard','front',{}],['ticket','Admit One Ticket','front',{ds:true}],['glove','Baseball Glove','front',{}]];
for(const[k,label,face,o]of MX){MODELS['mx_'+k]=[label,'✨','/assets/models/'+k+'.glb',1,null,null,null,o];
 DECOR['mx_'+k]={label:label+' (Sculpted)',layouts:['cluster','crown','band','cascade','scatter'],layout:'cluster',count:1,max:24,color:'',colors:[],sp:1.4,side:'up',roll:face==='front'?.1:.5,spin:.6,sink:0,embed:-.004,noTilt:true,model:true,
  make:(q,c,mode,dc)=>{const id='mx_'+k,e=MODEL_CACHE[id];if(!e){loadModel(id);return[]}if(!e.parts)return[];const out=e.parts.map(([m,g])=>[m,g.clone()]);if(mode==='side'&&face==='up')out.forEach(([,g])=>{g.rotateX(PI/2)});if(dc&&dc.flip)out.forEach(([,g])=>g.rotateZ(PI));return out}};
 DECOR_ICONS['mx_'+k]='<svg viewBox="0 0 40 30" aria-hidden="true"><image href="/assets/models/thumbs/'+k+'.webp" x="5" y="0" width="30" height="30" preserveAspectRatio="xMidYMid slice"/></svg>'}
{const c=DECOR_CATS.find(x=>x.key==='signature');c.items.push(...MX.map(m=>'mx_'+m[0]))}
// ---- hide 3D toppers whose files were lost with the old Studio host (they no longer load) ----
queueMicrotask(()=>{for(const k in MODELS){if(!modelLive(MODELS[k])&&DECOR['m_'+k])DECOR['m_'+k].hidden=true}})
