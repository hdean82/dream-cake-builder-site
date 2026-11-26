// ===================================================================================================
// Signature Cakes: decorations made to recreate Sprinkle Me Silly's real cakes in the Studio.
// Every piece is built in code (no downloads), so it always loads. Units are inches; size 100 = life size.
// "face" pieces are authored lying flat (thickness along +Y) and are turned to face out on the cake side.
// ===================================================================================================
const sgMat={
 gloss:c=>dmat(c,{r:.28,cc:.7,ccr:.1,sh:.2}),
 matte:c=>dmat(c,{r:.6,sh:.35}),
 metal:c=>dmat(c,{r:.22,metal:1,cc:.5}),
 sugar:c=>dmat(c,{r:.45,cc:.35,ccr:.2,sh:.35})};
// Bend a flat "face" piece around a tier of radius R (local units) so wide pieces hug the cake.
function sgBend(g,R){if(!R||R<=0)return g;const p=g.attributes.position,n=g.attributes.normal;if(!n)g.computeVertexNormals();const nn=g.attributes.normal;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),th=x/R,c=Math.cos(th),s=Math.sin(th);p.setX(i,(R+y)*s);p.setY(i,(R+y)*c-R);const nx=nn.getX(i),ny=nn.getY(i);nn.setXYZ(i,nx*c+ny*s,-nx*s+ny*c,nn.getZ(i))}p.needsUpdate=true;nn.needsUpdate=true;return g}
const sgR=(dc)=>dc&&dc.R?dc.R/((dc.size??100)/100):0;
const sgOval=(x,y,rx,ry,depth,lift=0)=>{const pts=[];for(let i=0;i<72;i++){const a=i/72*2*PI;pts.push(new T.Vector2(x+rx*Math.cos(a),y+ry*Math.sin(a)))}return flatShape(new T.Shape(pts),depth,lift)};
// ---------- sports balls ----------
function soccerParts(q){const R=.42,g=new T.SphereGeometry(R,48,32),ico=new T.IcosahedronGeometry(1,0),ip=ico.attributes.position,dirs=[];for(let i=0;i<ip.count;i++){const v=new V3(ip.getX(i),ip.getY(i),ip.getZ(i)).normalize();if(!dirs.some(d=>d.distanceTo(v)<.01))dirs.push(v)}
 tintTo(g,(x,y,z)=>{const v=new V3(x,y,z).normalize();let m=0;for(const d of dirs)m=Math.max(m,v.dot(d));return m>.925?[.08,.08,.09]:[.97,.97,.96]});g.translate(0,R,0);return[[dmat('#ffffff',{r:.32,cc:.6,ccr:.12}),norm(g)]]}
function footballParts(q){const g=new T.SphereGeometry(.34,40,24);g.scale(1.75,1,1);tintTo(g,(x)=>{const e=Math.abs(x)/.595;return e>.68&&e<.76?[.97,.95,.92]:[.47,.25,.13]});g.translate(0,.32,0);
 const lace=[];const sp=new T.BoxGeometry(.38,.025,.025);sp.translate(0,.655,0);lace.push(sp);for(let k=-3;k<=3;k++){const b=new T.BoxGeometry(.022,.024,.11);b.translate(k*.055,.655,0);lace.push(b)}
 return[[dmat('#7a4022',{r:.62,sh:.3}),norm(g)],[dmat('#fbf7f1',{r:.4}),mg(lace)]]}
function hoopBallParts(q){const R=.45,g=new T.SphereGeometry(R,48,32);tintTo(g,(x,y,z)=>{const a=Math.abs(x)<.012||Math.abs(y)<.012,cy=Math.abs(Math.hypot(y,z-R*1.05)-R*.78)<.014||Math.abs(Math.hypot(y,z+R*1.05)-R*.78)<.014;return a||cy?[.08,.06,.05]:[1,1,1]});g.translate(0,R,0);return[[dmat('#e8762c',{r:.7,sh:.3}),norm(g)]]}
function baseball2Parts(q){const R=.4,g=new T.SphereGeometry(R,40,28);g.translate(0,R,0);const pts=[];for(let i=0;i<=96;i++){const t=i/96*2*PI,a=.44;const v=new V3(Math.cos(t)+a*Math.cos(3*t),Math.sin(t)-a*Math.sin(3*t),2*Math.sqrt(a*(1-a))*Math.sin(2*t)).normalize().multiplyScalar(R*1.005);v.y+=R;pts.push(v)}
 const seam=new T.TubeGeometry(new T.CatmullRomCurve3(pts,true),160,.012,6,true),st=[];for(let i=0;i<96;i+=2){const p=pts[i],n=pts[(i+1)%96].clone().sub(p).normalize(),out=p.clone().sub(new V3(0,R,0)).normalize(),side=new V3().crossVectors(n,out).normalize();for(const s of[-1,1]){const b=new T.BoxGeometry(.012,.012,.05);b.lookAt(side.clone().multiplyScalar(s));b.translate(p.x+side.x*s*.025,p.y+side.y*s*.025,p.z+side.z*s*.025);st.push(b)}}
 return[[dmat('#fbf9f4',{r:.5,sh:.4}),norm(g)],[dmat('#d62839',{r:.5}),mg([seam,...st])]]}
// ---------- movie night ----------
function popcornParts(q,c){const list=[];const n=4+Math.floor(q()*3);for(let k=0;k<n;k++){const r=.07+q()*.05,g=new T.SphereGeometry(r,10,8),p=g.attributes.position,ph=q()*9;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),kk=1+.28*Math.sin(x*40+ph)*Math.sin(y*37)*Math.sin(z*33+ph);p.setXYZ(i,x*kk,y*kk,z*kk)}g.computeVertexNormals();g.translate(rj(q,.18),.07+q()*.1,rj(q,.18));list.push(g)}
 const m=mg(list);tintTo(m,(x,y,z)=>{const k=.9+.1*Math.sin(x*60+z*50);return Math.sin(x*23+y*31+z*17)>.75?[1,.86,.55]:[k,k,k*.95]});return[[dmat(c,{r:.75,sh:.4}),m]]}
function ticketParts(q,c){const W=1.15,H=.58,s=new T.Shape();s.moveTo(-W/2,-H/2);s.lineTo(W/2,-H/2);s.lineTo(W/2,-.09);s.absarc(W/2,0,.09,-PI/2,PI/2,true);s.lineTo(W/2,H/2);s.lineTo(-W/2,H/2);s.lineTo(-W/2,.09);s.absarc(-W/2,0,.09,PI/2,-PI/2,true);s.closePath();
 const g=new T.ExtrudeGeometry(s,{depth:.03,bevelEnabled:false});g.translate(0,0,-.015);
 const line=[];for(const[y0]of[[H/2-.07],[-H/2+.07]]){const b=new T.BoxGeometry(W-.24,.025,.04);b.translate(0,y0,0);line.push(b)}for(let k=0;k<6;k++){const b=new T.BoxGeometry(.018,.07+((k*7)%3)*.03,.04);b.translate(W/2-.22-k*.03,-.12,0);line.push(b)}{const dg=(w,h,x,y)=>{const b=new T.BoxGeometry(w,h,.04);b.translate(x,y,0);line.push(b)};dg(.06,.3,-.12,.02);for(const y of[.17,.02,-.13])dg(.15,.05,.12,y);dg(.05,.3,.19,.02)}
 const st=flatShape(starShape(.07,.03),.03,0);st.rotateX(PI/2);st.translate(-W/2+.2,.12,.03);const st2=st.clone();st2.translate(W-.4,0,0);
 const stick=new T.CylinderGeometry(.018,.018,1.3,8);stick.translate(0,-H/2-.55,0);const all=[g];all.forEach(x=>x.translate(0,1.4,0));[...line,st,st2].forEach(x=>x.translate(0,1.4,0));stick.translate(0,1.4,0);
 return[[dmat(c,{r:.5,sh:.3}),norm(g)],[dmat('#d62839',{r:.5}),mg([...line,st,st2])],[dmat('#fbf7f1',{r:.6}),norm(stick)]]}
function clapperParts(q){const W=1.5,H=.85,base=new T.BoxGeometry(W,.06,H);base.translate(0,.03,0);const lines=[];for(const z of[-.12,.12]){const b=new T.BoxGeometry(W-.12,.012,.02);b.translate(0,.066,z);lines.push(b)}const v=new T.BoxGeometry(.02,.012,.26);v.translate(-.2,.066,-.24);lines.push(v);
 const stripe=g=>tintTo(g,(x)=>{const k=Math.floor((x+2)/.17+(x*.0))%2;return k?[.06,.06,.07]:[.97,.97,.96]});
 const bar1=new T.BoxGeometry(W,.07,.2,30,1,1);const p1=bar1.attributes.position;for(let i=0;i<p1.count;i++){const x=p1.getX(i),z=p1.getZ(i);p1.setX(i,x+z*.9)}stripe(bar1);bar1.translate(0,.035,-H/2-.11);
 const bar2=bar1.clone();bar2.rotateX(-.28);bar2.translate(0,.09,-.16);
 return[[dmat('#1d1b1f',{r:.45,cc:.3}),mg([base])],[dmat('#fbf7f1',{r:.5}),mg(lines)],[dmat('#ffffff',{r:.45,cc:.3}),mg([bar1,bar2])]]}
// ---------- crawfish boil ----------
function crawfishParts(q,c){const body=[],dark=[];const seg=(z,rx,ry,rz)=>{const g=new T.SphereGeometry(1,16,12);g.scale(rx,ry,rz);g.translate(0,ry*.9,z);body.push(g)};
 seg(.0,.16,.13,.26);for(let k=1;k<=5;k++)seg(-.2-k*.11,.13-k*.012,.1-k*.008,.08);const fan=new T.SphereGeometry(1,12,8);fan.scale(.17,.03,.11);fan.translate(0,.06,-.92);body.push(fan);
 const claw=sd=>{const arm=new T.CylinderGeometry(.03,.035,.38,8);arm.rotateX(PI/2);arm.rotateY(sd*.45);arm.translate(sd*.14,.12,.3);const pin=new T.SphereGeometry(1,14,10);pin.scale(.09,.06,.2);pin.rotateY(sd*.25);pin.translate(sd*.24,.12,.6);const tip=new T.ConeGeometry(.035,.18,8);tip.rotateX(PI/2);tip.translate(sd*.3,.12,.82);return[arm,pin,tip]};
 body.push(...claw(-1),...claw(1));for(const sd of[-1,1])for(let k=0;k<4;k++){const l=new T.CylinderGeometry(.012,.012,.3,5);l.rotateZ(sd*(PI/2-.5));l.translate(sd*.2,.06,.08-k*.08);body.push(l)}
 for(const sd of[-1,1]){const pts=[new V3(sd*.04,.2,.25),new V3(sd*.18,.35,.6),new V3(sd*.28,.32,.78),new V3(sd*.36,.2,.95)];dark.push(new T.TubeGeometry(new T.CatmullRomCurve3(pts),24,.013,5,false));const e=new T.SphereGeometry(.028,8,6);e.translate(sd*.07,.22,.24);dark.push(e)}
 const m=mg(body);tintTo(m,(x,y)=>{const k=.8+.4*Math.min(1,y/.25);return[k,k*.95,k*.9]});return[[dmat(c,{r:.25,cc:.85,ccr:.08,sh:.2}),m],[dmat('#2a1210',{r:.4,cc:.6}),mg(dark)]]}
function cornParts(q,c){const L=.9,R=.2,g=new T.CylinderGeometry(R,R*.85,L,28,26),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x),k=1+.08*Math.abs(Math.sin(a*14))*Math.abs(Math.sin(y*44)),e=1-Math.pow(Math.abs(y)/(L/2),6)*.25;p.setX(i,x*k*e);p.setZ(i,z*k*e)}g.computeVertexNormals();g.rotateZ(PI/2);g.translate(0,R*.9,0);
 tintTo(g,(x,y,z)=>{const k=.85+.15*Math.abs(Math.sin(x*44));return[k,k*.95,k*.8]});return[[dmat(c,{r:.35,cc:.55,ccr:.12,sh:.3}),norm(g)]]}
function potatoParts(q,c){const g=new T.SphereGeometry(.22,18,12),p=g.attributes.position,ph=q()*9;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),k=1+.08*Math.sin(x*9+ph)*Math.sin(z*7);p.setXYZ(i,x*k*1.25,y*k*.8,z*k)}g.computeVertexNormals();g.translate(0,.16,0);
 tintTo(g,(x,y,z)=>{const s=Math.sin(x*40+ph)*Math.sin(z*37)*Math.sin(y*41);return s>.6?[.55,.4,.25]:[1,1,1]});return[[dmat(c,{r:.7,sh:.25}),norm(g)]]}
function potLidParts(q,c){const R=1/Math.sin(.42),lid=new T.SphereGeometry(R,64,12,0,2*PI,0,.42);lid.scale(1,1.8,1);lid.translate(0,-Math.cos(.42)*R*1.8+.02,0);const rim=new T.TorusGeometry(1,.035,8,64);rim.rotateX(PI/2);rim.translate(0,.03,0);
 const h=new T.TorusGeometry(.3,.06,12,28,PI);h.translate(0,.42,0);const k1=new T.CylinderGeometry(.07,.09,.1,12);k1.translate(-.3,.4,0);const k2=k1.clone();k2.translate(.6,0,0);
 return[[sgMat.metal(c),mg([lid,rim,h,k1,k2])]]}
// ---------- money ----------
function cashParts(q,c){const parts=[];const n=1+(q()<.5?1:0);for(let k=0;k<n;k++){const W=1.05,H=.45,g=new T.PlaneGeometry(W,H,18,6),p=g.attributes.position,cv=rj(q,.25);for(let i=0;i<p.count;i++){const x=p.getX(i);p.setZ(i,cv*x*x)}
 tintTo(g,(x,y)=>{const ex=Math.abs(x)/(W/2),ey=Math.abs(y)/(H/2),oval=Math.hypot(x/.19,y/.17);return ex>.9||ey>.84?[.96,.97,.93]:oval<1?[.82,.84,.76]:oval<1.12?[.4,.5,.38]:(ex>.62&&ex<.68)||(ey>.6&&ey<.66)?[.5,.58,.46]:[.78,.83,.74]});
 g.translate(0,H/2,0);g.rotateY(rj(q,.6)+k*.4);g.rotateZ(rj(q,.5));g.translate(rj(q,.1),.05,rj(q,.1));parts.push(g)}return[[dmat('#e9efe2',{r:.75,sh:.3}),mg(parts)]]}
function dollarGeo(){const R=.17,pts=[];for(let i=0;i<=28;i++){const a=-.25+i/28*(1.5*PI+.25);pts.push(new V3(Math.cos(a)*R,R+Math.sin(a)*R,0))}for(let i=1;i<=28;i++){const a=PI/2-i/28*(1.5*PI+.25);pts.push(new V3(Math.cos(a)*R,-R+Math.sin(a)*R,0))}
 const s=new T.TubeGeometry(new T.CatmullRomCurve3(pts),120,.045,10,false),bar=new T.CylinderGeometry(.028,.028,.9,10);return mg([s,bar])}
function dollarStandParts(q,c){const g=dollarGeo();g.scale(1.6,1.6,1.6);g.translate(0,.85,0);const stick=new T.CylinderGeometry(.02,.02,.6,8);stick.translate(0,.1,0);return[[sgMat.metal(c),g],[dmat('#fbf7f1',{r:.6}),norm(stick)]]}
function dollarFaceParts(q,c,mode,dc){const g=dollarGeo();g.scale(1.6,1.6,.35);g.rotateX(-PI/2);g.translate(0,.03,0);return[[sgMat.metal(c),sgBend(g,sgR(dc))]]}
// ---------- bows, cow ----------
function sugarBowParts(q,c){const g=bowGeo(q,.9);g.rotateX(-PI/2);return[[bowMat(c),g]]}
function cowTopParts(q,c,mode,dc){const horns=[],ears=[],inner=[];const sp=(dc&&dc.spread)||1.15;
 for(const sd of[-1,1]){const pts=[];for(let i=0;i<=12;i++){const t=i/12;pts.push(new V3(sd*(sp-.1*t+.18*t*t),t*.95,-.05*t))}const tube=new T.TubeGeometry(new T.CatmullRomCurve3(pts),20,.24,14,false),pp=tube.attributes.position;for(let i=0;i<pp.count;i++){const y=pp.getY(i),k=Math.max(.15,1-y/1.05),cx=sd*(sp-.1*(y/.95)+.18*(y/.95)**2);pp.setX(i,cx+(pp.getX(i)-cx)*k);pp.setZ(i,pp.getZ(i)*k)}tube.computeVertexNormals();horns.push(tube);
  }
 const bows=[];for(const sd of[-1,1]){const b=bowGeo(q,.8);b.translate(sd*sp,.25,.25);bows.push(b)}
 return[[dmat('#1d1b1f',{r:.35,cc:.5}),mg(horns)],[bowMat(c),mergeGeometries(bows)]]}
function cowEarParts(q,c){const e=new T.SphereGeometry(1,28,18);e.scale(.5,.78,.09);e.translate(0,-.62,0);e.rotateX(-.55);const o=new T.SphereGeometry(1,28,18);o.scale(.53,.81,.06);o.translate(0,-.62,-.02);o.rotateX(-.55);const i=new T.SphereGeometry(1,24,14);i.scale(.36,.6,.06);i.translate(0,-.6,.05);i.rotateX(-.55);return[[dmat('#ffffff',{r:.45,cc:.3}),e],[dmat('#1d1b1f',{r:.4,cc:.4}),o],[dmat(c,{r:.45,cc:.3}),i]]}
function cowFaceParts(q,c,mode,dc){const black=[],white=[],pink=[],dark=[],red=[],tongue=[];
 const rov=(x,y,rx,ry,rot,d)=>{const pts=[],cr=Math.cos(rot),sr=Math.sin(rot);for(let i=0;i<72;i++){const a=i/72*2*PI,u=rx*Math.cos(a),v=ry*Math.sin(a);pts.push(new T.Vector2(x+u*cr-v*sr,y+u*sr+v*cr))}return flatShape(new T.Shape(pts),d,0)};
 // eyes: left smaller and lower, right bigger and higher, pupils looking up and right
 const E=[[-.52,.3,.27,.4,-.12,.24],[.22,.6,.33,.47,.18,.3]];
 for(const[x,y,rx,ry,r,pr]of E){black.push(rov(x,y,rx+.045,ry+.045,r,.03));white.push(rov(x,y,rx,ry,r,.04));black.push(rov(x+rx*.28,y+ry*.12,rx*.66,ry*.74,r,.055));white.push(rov(x+rx*.1,y+ry*.45,.05,.05,0,.065));
  const l=new T.Shape();l.moveTo(x-rx*.9,y-ry*1.05);l.quadraticCurveTo(x+rx*.3,y-ry*1.45,x+rx*1.5,y-ry*.95);l.quadraticCurveTo(x+rx*.3,y-ry*1.3,x-rx*.9,y-ry*1.05);black.push(flatShape(l,.035,0))}
 // muzzle
 black.push(rov(.12,-.52,.9,.64,.22,.03));pink.push(rov(.12,-.52,.84,.58,.22,.05));
 for(const[x,y]of[[-.28,-.24],[.43,-.06]]){black.push(rov(x,y,.085,.065,.2,.06));dark.push(rov(x,y,.055,.038,.2,.07))}
 // big open smile: straight top lip, round bottom
 const M=k=>{const cx=.12,cy=-.62,P=(x,y)=>[cx+(x-cx)*k,cy+(y-cy)*k];const s=new T.Shape();s.moveTo(...P(-.42,-.52));s.quadraticCurveTo(...P(.1,-.42),...P(.66,-.26));s.bezierCurveTo(...P(.72,-.75),...P(.25,-1.05),...P(-.12,-.92));s.quadraticCurveTo(...P(-.38,-.8),...P(-.42,-.52));return s};
 black.push(flatShape(M(.92),.06,0));red.push(flatShape(M(.82),.07,0));
 const tg=new T.Shape();tg.absellipse(.2,-.8,.18,.08,0,2*PI,false,.15);tongue.push(flatShape(tg,.075,0));
 const th=new T.Shape();th.moveTo(-.16,-.52);th.lineTo(.02,-.49);th.lineTo(.0,-.66);th.lineTo(-.15,-.68);th.closePath();white.push(flatShape(th,.08,0));
 const R=sgR(dc),B=l=>sgBend(mg(l),R);return[[dmat('#1d1b1f',{r:.35,cc:.5}),B(black)],[dmat('#ffffff',{r:.35,cc:.4}),B(white)],[dmat(c,{r:.4,cc:.4}),B(pink)],[dmat('#a0475c',{r:.4,cc:.4}),B(dark)],[dmat('#8a2338',{r:.45,cc:.4}),B(red)],[dmat('#e77f96',{r:.45,cc:.4}),B(tongue)]]}
// ---------- baby shower ----------
function teddyParts(q,c){const S=(sx,sy,sz,x,y,z)=>{const g=new T.SphereGeometry(1,20,14);g.scale(sx,sy,sz);g.translate(x,y,z);return g};
 const fur=[S(.34,.36,.3,0,.36,0),S(.28,.26,.26,0,.92,0),S(.1,.1,.06,-.2,1.14,0),S(.1,.1,.06,.2,1.14,0),S(.12,.1,.1,-.3,.42,.16),S(.12,.1,.1,.3,.42,.16),S(.13,.12,.18,-.18,.1,.26),S(.13,.12,.18,.18,.1,.26)];
 const lite=[S(.12,.09,.09,0,.86,.22),S(.06,.06,.03,-.2,1.14,.03),S(.06,.06,.03,.2,1.14,.03),S(.2,.22,.08,0,.38,.24)];const dark=[S(.045,.035,.03,0,.9,.31),S(.03,.035,.02,-.1,.98,.23),S(.03,.035,.02,.1,.98,.23)];
 return[[dmat(c,{r:.75,sh:.6}),mg(fur)],[dmat('#fbf3ec',{r:.7,sh:.5}),mg(lite)],[dmat('#1d1b1f',{r:.25,cc:.8}),mg(dark)]]}
function abcBlockParts(q,c,mode,dc){const cols=mixOf(dc,c),bc=cols[Math.floor(q()*cols.length)%cols.length],s=.42,b=new T.BoxGeometry(s,s,s);b.translate(0,s/2,0);const fr=[];for(const[x,z,ry]of[[0,s/2,0],[0,-s/2,0],[s/2,0,PI/2],[-s/2,0,PI/2]]){const f=new T.BoxGeometry(s*.82,s*.82,.012);f.rotateY(ry);f.translate(x*1.02,s/2,z*1.02);fr.push(f)}
 const L=[];const bar=(w,h,x,y)=>{const g=new T.BoxGeometry(w,h,.02);g.translate(x,y+s/2,s/2+.012);L.push(g)};const k=Math.floor(q()*3);if(k===0){bar(.05,.22,-.06,0);bar(.05,.22,.06,0);bar(.12,.04,0,.02)}else if(k===1){bar(.05,.22,-.06,0);bar(.12,.04,0,.09);bar(.12,.04,0,-.0);bar(.12,.04,0,-.09)}else{bar(.05,.22,-.07,0);bar(.12,.04,0,.09);bar(.12,.04,0,-.09)}
 const ry=rj(q,.6);[b,...fr,...L].forEach(g=>g.rotateY(ry));return[[dmat('#fbf7f1',{r:.45,cc:.3}),norm(b)],[dmat(bc,{r:.4,cc:.4}),mg([...fr,...L])]]}
function balloonParts(q,c){const N=12,cc=new T.Color(c),env=new T.SphereGeometry(.75,48,32);const p=env.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);if(y<-.2){const k=1-(-.2-y)*.75;p.setX(i,p.getX(i)*k);p.setZ(i,p.getZ(i)*k)}}env.computeVertexNormals();env.translate(0,2.0,0);
 tintTo(env,(x,y,z)=>{const a=Math.atan2(z,x),on=Math.floor((a+PI)/(2*PI)*N)%2===0;return on?[cc.r,cc.g,cc.b]:[.98,.98,.98]});
 const sw=[];for(let k=0;k<N;k++){const a=k/N*2*PI,g=new T.SphereGeometry(.16,12,8);g.scale(.5,.55,1);g.lookAt(new V3(Math.cos(a),0,Math.sin(a)));g.translate(Math.cos(a)*.7,1.78,Math.sin(a)*.7);sw.push(g)}
 const ropes=[];for(let k=0;k<4;k++){const a=k/4*2*PI+PI/4,top=new V3(Math.cos(a)*.38,1.35,Math.sin(a)*.38),bot=new V3(Math.cos(a)*.24,.62,Math.sin(a)*.24);const len=top.distanceTo(bot),g=new T.CylinderGeometry(.012,.012,len,5);g.lookAt(top.clone().sub(bot));g.rotateX(PI/2);const m=top.clone().add(bot).multiplyScalar(.5);g.translate(m.x,m.y,m.z);ropes.push(g)}
 const basket=new T.CylinderGeometry(.3,.24,.38,20,4,true);basket.translate(0,.43,0);const bb=new T.CylinderGeometry(.24,.24,.03,20);bb.translate(0,.24,0);const rim=new T.TorusGeometry(.3,.03,6,24);rim.rotateX(PI/2);rim.translate(0,.62,0);
 return[[dmat('#ffffff',{r:.45,sh:.4,cc:.3}),norm(env)],[dmat('#fbf7f1',{r:.5,sh:.4}),mg(sw)],[dmat('#d4ae5a',{r:.3,metal:.7}),mg(ropes)],[dmat('#8a5a3a',{r:.8}),mg([basket,bb,rim])]]}
function ladderParts(q,c){const L=2.2,parts=[];for(const x of[-.22,.22]){const r=new T.BoxGeometry(.07,.05,L);r.translate(x,.03,0);parts.push(r)}for(let k=0;k<7;k++){const r=new T.BoxGeometry(.44,.05,.06);r.translate(0,.05,-L/2+.18+k*(L-.36)/6);parts.push(r)}return[[dmat(c,{r:.5,cc:.3}),mg(parts)]]}
function buttonParts(q,c){const r=.14+q()*.08,g=new T.CylinderGeometry(r,r,.05,28);g.translate(0,.025,0);const rim=new T.TorusGeometry(r*.85,.018,6,28);rim.rotateX(PI/2);rim.translate(0,.05,0);const holes=[];for(const[x,z]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const h=new T.CylinderGeometry(.018,.018,.02,8);h.translate(x*r*.22,.055,z*r*.22);holes.push(h)}
 const m=METALS[c]?sgMat.metal(c):sgMat.gloss(c);return[[m,mg([g,rim])],[dmat('#3a2a1a',{r:.6}),mg(holes)]]}
// ---------- bling ----------
function broochParts(q,c,mode,dc){const metal=[],gems=[];const big=new T.OctahedronGeometry(.16,1);big.scale(1,.5,1.3);big.translate(0,.08,-.05);gems.push(big);const ring=new T.TorusGeometry(.2,.025,6,24);ring.rotateX(PI/2);ring.translate(0,.05,-.05);metal.push(ring);
 for(let k=0;k<9;k++){const a=-PI/2+(k-4)*.32,len=k===4?1.05:.55+.35*Math.cos((k-4)*.38);for(let j=0;j<4;j++){const t=.32+j/4*len,g=new T.OctahedronGeometry(.045+.025*(1-j/4),0);g.scale(1,.5,1.4);g.translate(Math.cos(a)*t,.05,Math.sin(a)*t);gems.push(g)}const tip=new T.OctahedronGeometry(.07,0);tip.scale(1,.5,1.6);tip.translate(Math.cos(a)*(len+.38),.05,Math.sin(a)*(len+.38));gems.push(tip)}
 const drop=new T.OctahedronGeometry(.1,1);drop.scale(1,.5,1.6);drop.translate(0,.06,.42);gems.push(drop);const R=sgR(dc);
 return[[sgMat.metal(c),sgBend(mg(metal),R)],[dmat('#f6e3dc',{r:.05,metal:.3,cc:1,ccr:.02}),sgBend(mg(gems),R)]]}
function hoopParts(q,c){const R=.95,ring=new T.TorusGeometry(R,.035,10,80);ring.translate(0,R+1.05,0);const stick=[];for(const x of[-.35,.35]){const s=new T.CylinderGeometry(.02,.02,1.2,8);s.translate(x,.6,0);stick.push(s)}
 const roses=[];for(let k=0;k<4;k++){const a=PI*1.05+k*.32,r=roseGeo(q);r.scale(.32,.32,.32);r.rotateX(-PI/2);r.translate(Math.cos(a)*R,R+1.05+Math.sin(a)*R,.06);roses.push(r)}const lv=[];for(let k=0;k<4;k++){const L=leafGeo(.4,.14);L.rotateX(-PI/2);L.rotateZ(PI*1.2+k*.5);const a=PI*1.0+k*.36;L.translate(Math.cos(a)*R*1.05,R+1.05+Math.sin(a)*R*1.05,0);lv.push(norm(L))}
 return[[sgMat.metal(c),mg([ring,...stick])],[dm.rose('#fbf7f1'),mergeGeometries(roses.map(norm))],[dm.leaf(),mergeGeometries(lv)]]}
// ---------- garden ----------
function beeParts(q,c){const body=new T.SphereGeometry(.55,40,28);body.scale(1.15,.95,1);body.translate(0,.55,0);tintTo(body,(x)=>Math.floor((x+.7)/.26)%2?[.1,.09,.08]:[1,.85,.2]);
 const face=new T.SphereGeometry(.42,32,20);face.translate(.5,.62,0);const eyes=[],dark=[];for(const z of[-.15,.15]){const e=new T.SphereGeometry(.09,16,12);e.translate(.84,.75,z);dark.push(e);const h=new T.SphereGeometry(.025,8,6);h.translate(.91,.79,z+.02);eyes.push(h)}
 const smile=new T.TorusGeometry(.12,.02,6,20,PI);smile.rotateZ(PI);smile.rotateY(PI/2);smile.translate(.9,.58,0);dark.push(smile);const st=new T.ConeGeometry(.08,.2,12);st.rotateZ(PI/2);st.translate(-.72,.55,0);dark.push(st);
 for(const z of[-.12,.12]){const pts=[new V3(.62,.95,z),new V3(.7,1.18,z*1.6),new V3(.86,1.25,z*1.9)];dark.push(new T.TubeGeometry(new T.CatmullRomCurve3(pts),12,.018,6,false));const b=new T.SphereGeometry(.05,10,8);b.translate(.88,1.26,z*1.9);dark.push(b)}
 const wings=[];for(const z of[-1,1]){const w=new T.SphereGeometry(1,24,12);w.scale(.32,.04,.2);w.rotateX(z*.5);w.rotateZ(-.3);w.translate(-.05,1.1,z*.32);wings.push(w)}
 return[[dmat('#ffffff',{r:.5,sh:.5}),norm(body)],[dmat('#ffd21f',{r:.45,cc:.3}),norm(face)],[dmat('#1d1b1f',{r:.3,cc:.7}),mg(dark)],[dmat('#ffffff',{r:.2,cc:1}),mg(eyes)],[dmat('#eaf6ff',{r:.15,cc:1,ccr:.05,sh:.5}),mg(wings)]]}

Object.assign(DECOR,{
 soccerball:{label:'Soccer Ball',layouts:['cluster','crown','scatter','band'],layout:'cluster',count:1,max:8,color:'#ffffff',colors:['#ffffff'],sp:1,side:'up',sink:.05,embed:.05,make:soccerParts},
 football:{label:'Football',layouts:['cluster','crown','scatter'],layout:'cluster',count:1,max:8,color:'#7a4022',colors:['#7a4022'],sp:1.2,side:'up',sink:.05,embed:.05,noTilt:true,make:footballParts},
 hoopball:{label:'Basketball',layouts:['cluster','crown','scatter','band'],layout:'cluster',count:1,max:8,color:'#e8762c',colors:['#e8762c'],sp:1,side:'up',sink:.05,embed:.05,make:hoopBallParts},
 baseball2:{label:'Baseball',layouts:['cluster','crown','scatter','band'],layout:'cluster',count:1,max:8,color:'#fbf9f4',colors:['#fbf9f4'],sp:1,side:'up',sink:.05,embed:.05,make:baseball2Parts},
 popcorn:{label:'Popcorn',layouts:['cluster','crown','scatter','band'],layout:'cluster',count:30,max:90,color:'#f8efd4',colors:['#f8efd4','#f2d98a','#f3c1cf'],sp:.45,side:'up',sink:.02,embed:.04,pile:.5,make:popcornParts},
 ticket:{label:'Admit One Ticket',layouts:['cluster','crown'],layout:'cluster',count:1,max:3,color:'#f6cf5a',colors:['#f6cf5a','#fbf7f1','#f3a6c0'],sp:1.4,sink:.45,noTilt:true,spin:0,make:ticketParts},
 clapper:{label:'Movie Clapperboard',layouts:['scatter','band','cascade'],layout:'scatter',count:1,max:3,color:'#1d1b1f',colors:['#1d1b1f'],sp:1.6,side:'face',roll:.3,sink:0,embed:-.02,make:clapperParts},
 crawfish:{label:'Crawfish',layouts:['crown','cluster','scatter','band'],layout:'crown',count:8,max:24,color:'#d2381e',colors:['#d2381e','#b52a14'],sp:.9,side:'up',sink:.04,embed:.06,make:crawfishParts},
 corncob:{label:'Corn On The Cob',layouts:['cluster','crown','scatter'],layout:'cluster',count:3,max:12,color:'#f2c230',colors:['#f2c230','#f6d76a'],sp:1,side:'up',sink:.04,embed:.06,noTilt:true,make:cornParts},
 potato:{label:'Red Potatoes',layouts:['cluster','crown','scatter'],layout:'cluster',count:4,max:16,color:'#d9a441',colors:['#d9a441','#b5523c','#e2b86a'],sp:.6,side:'up',sink:.03,embed:.05,make:potatoParts},
 potlid:{label:'Stock Pot Lid',layouts:['cluster'],layout:'cluster',count:1,max:1,color:'#c9ccd2',colors:['#c9ccd2','#d4ae5a'],sp:2,side:'up',sink:-.02,noTilt:true,spin:0,make:potLidParts},
 cash:{label:'Cash Bills',layouts:['cluster','crown','cascade'],layout:'cluster',count:7,max:24,color:'#e9efe2',colors:['#e9efe2'],sp:.55,side:'up',sink:.25,tilt:[.05,.35],make:cashParts},
 dollarsign:{label:'Gold Dollar Signs',layouts:['cluster','crown'],layout:'cluster',count:2,max:6,color:'#d4ae5a',colors:['#d4ae5a','#c9ccd2','#1d1b1f'],sp:1,sink:.35,noTilt:true,spin:0,make:dollarStandParts},
 dollarface:{label:'Dollar Sign Plaque',layouts:['scatter','band'],layout:'scatter',count:1,max:6,color:'#d4ae5a',colors:['#d4ae5a','#c9ccd2','#1d1b1f'],sp:1.2,side:'face',roll:0,sink:0,embed:-.02,make:dollarFaceParts},
 sugarbows:{label:'Fondant Bows',layouts:['band','scatter','cascade','crown'],layout:'band',count:4,max:16,color:'#f3a6c0',colors:['#f3a6c0','#fbf7f1','#d4ae5a','#c9dbef','#e8475f','#1d1b1f'],sp:1.4,side:'face',roll:.2,sink:0,embed:-.02,make:sugarBowParts},
 cowtop:{label:'Cow Horns And Bows',layouts:['cluster'],layout:'cluster',count:1,max:1,color:'#f3a6c0',colors:['#f3a6c0','#c9dbef','#fbf7f1','#e8475f'],sp:3,side:'up',sink:.02,noTilt:true,spin:0,make:cowTopParts},
 cowear:{label:'Floppy Cow Ear',layouts:['band'],layout:'band',count:1,max:2,color:'#f3b6c8',colors:['#f3b6c8','#f3a6c0'],sp:3,roll:0,sink:0,embed:.02,make:cowEarParts},
 cowface:{label:'Cartoon Cow Face',layouts:['band','scatter'],layout:'band',count:1,max:1,color:'#f3a6c0',colors:['#f3a6c0','#e9a6ba'],sp:3,side:'face',roll:0,sink:0,embed:-.02,make:cowFaceParts},
 teddy:{label:'Fondant Teddy Bears',layouts:['cluster','crown','scatter'],layout:'cluster',count:1,max:6,color:'#fbf7f1',colors:['#fbf7f1','#c9a26b','#f3c1cf','#c9dbef'],sp:1.4,side:'up',sink:.02,noTilt:true,spin:0,make:teddyParts},
 abcblocks:{label:'Alphabet Blocks',mixes:true,layouts:['cluster','crown','scatter'],layout:'cluster',count:3,max:12,color:'#2f6fd0',colors:['#2f6fd0','#e8475f','#5cc06c','#f2c230','#f3a6c0'],sp:.7,side:'up',sink:0,embed:.02,noTilt:true,make:abcBlockParts},
 balloon:{label:'Hot Air Balloon',layouts:['cluster'],layout:'cluster',count:1,max:2,color:'#7fb0e8',colors:['#7fb0e8','#f3a6c0','#f2c230','#5cc06c'],sp:2,side:'up',sink:0,noTilt:true,spin:0,make:balloonParts},
 ladder:{label:'Fondant Ladder',layouts:['scatter','band'],layout:'scatter',count:1,max:3,color:'#fbf7f1',colors:['#fbf7f1','#c9a26b'],sp:1.4,side:'face',roll:.15,sink:0,embed:-.02,make:ladderParts},
 buttons:{label:'Fondant Buttons',layouts:['cascade','scatter','band','cluster'],layout:'cascade',count:24,max:80,color:'#d4ae5a',colors:['#d4ae5a','#fbf7f1','#c9dbef','#f3a6c0','#c9ccd2'],sp:.4,side:'face',sink:0,embed:-.01,make:buttonParts},
 brooch:{label:'Jeweled Brooch Burst',layouts:['band','scatter'],layout:'band',count:1,max:4,color:'#d9a08a',colors:['#d9a08a','#d4ae5a','#c9ccd2'],sp:2,side:'face',roll:0,sink:0,embed:-.02,make:broochParts},
 hoop:{label:'Floral Hoop Topper',layouts:['cluster'],layout:'cluster',count:1,max:1,color:'#d4ae5a',colors:['#d4ae5a','#c9ccd2','#d9a08a'],sp:2,sink:.4,noTilt:true,spin:0,make:hoopParts},
 bee:{label:'Bumble Bee',layouts:['cluster','crown','scatter'],layout:'cluster',count:1,max:6,color:'#ffd21f',colors:['#ffd21f'],sp:1.4,side:'up',sink:.02,noTilt:true,spin:0,make:beeParts}});
DECOR_CATS.push({key:'signature',label:'Signature Cake Pieces',items:['soccerball','football','hoopball','baseball2','popcorn','ticket','clapper','crawfish','corncob','potato','potlid','cash','dollarsign','dollarface','sugarbows','cowtop','cowear','cowface','teddy','abcblocks','balloon','ladder','buttons','brooch','hoop','bee']});
{const ic=(k,b)=>DECOR_ICONS[k]=di(b);
 ic('soccerball','<circle cx="20" cy="15" r="10" fill="#fff" stroke="#222"/><path d="M20 10l4 3-1.5 4.5h-5L16 13z" fill="#222"/>');
 ic('football','<ellipse cx="20" cy="15" rx="13" ry="8" fill="#7a4022"/><path d="M15 15h10M17 13v4M20 13v4M23 13v4" stroke="#fff" stroke-width="1.2"/>');
 ic('hoopball','<circle cx="20" cy="15" r="10" fill="#e8762c"/><path d="M10 15h20M20 5v20M13 8q7 7 0 14M27 8q-7 7 0 14" stroke="#222" fill="none"/>');
 ic('baseball2','<circle cx="20" cy="15" r="10" fill="#fbf9f4" stroke="#ccc"/><path d="M14 7q4 8 0 16M26 7q-4 8 0 16" stroke="#d62839" fill="none" stroke-dasharray="2 1.5"/>');
 ic('popcorn','<circle cx="14" cy="18" r="5" fill="#f8efd4"/><circle cx="21" cy="14" r="6" fill="#f2e2b0"/><circle cx="27" cy="19" r="5" fill="#f8efd4"/><circle cx="20" cy="21" r="4" fill="#fff6e0"/>');
 ic('ticket','<rect x="7" y="9" width="26" height="13" rx="2" fill="#f6cf5a"/><text x="20" y="19" font-size="6" text-anchor="middle" fill="#d62839">ADMIT</text>');
 ic('clapper','<rect x="8" y="12" width="24" height="13" fill="#1d1b1f"/><path d="M8 6l24 3v4H8z" fill="#fff" stroke="#1d1b1f"/><path d="M12 6.5l3 6M18 7.3l3 6M24 8l3 5" stroke="#1d1b1f" stroke-width="2"/>');
 ic('crawfish','<ellipse cx="20" cy="17" rx="5" ry="9" fill="#d2381e"/><ellipse cx="13" cy="8" rx="3" ry="5" fill="#d2381e"/><ellipse cx="27" cy="8" rx="3" ry="5" fill="#d2381e"/>');
 ic('corncob','<rect x="8" y="11" width="24" height="9" rx="4.5" fill="#f2c230"/><path d="M12 11v9M16 11v9M20 11v9M24 11v9M28 11v9" stroke="#d9a82a"/>');
 ic('potato','<ellipse cx="15" cy="18" rx="7" ry="5" fill="#d9a441"/><ellipse cx="26" cy="17" rx="6" ry="4.5" fill="#b5523c"/>');
 ic('potlid','<ellipse cx="20" cy="18" rx="15" ry="5" fill="#c9ccd2"/><path d="M15 13q5-6 10 0" stroke="#999" stroke-width="2" fill="none"/>');
 ic('cash','<rect x="7" y="9" width="22" height="11" fill="#cfe0c4" stroke="#5a7a4e" transform="rotate(-10 18 15)"/><rect x="11" y="12" width="22" height="11" fill="#dbe8d2" stroke="#5a7a4e"/><circle cx="22" cy="17.5" r="3" fill="none" stroke="#5a7a4e"/>');
 ic('dollarsign','<text x="20" y="25" font-size="22" text-anchor="middle" fill="#d4ae5a" font-weight="700">$</text>');
 ic('dollarface','<rect x="8" y="4" width="24" height="22" rx="3" fill="#fff4ef"/><text x="20" y="22" font-size="17" text-anchor="middle" fill="#d4ae5a" font-weight="700">$</text>');
 ic('sugarbows','<path d="M20 15l-10-6v12zM20 15l10-6v12z" fill="#f3a6c0"/><circle cx="20" cy="15" r="2.6" fill="#e17ca0"/>');
 ic('cowtop','<path d="M10 22q-2-10 3-14M30 22q2-10-3-14" stroke="#1d1b1f" stroke-width="3" fill="none"/><ellipse cx="5" cy="22" rx="5" ry="2.5" fill="#f3a6c0"/><ellipse cx="35" cy="22" rx="5" ry="2.5" fill="#f3a6c0"/>');
 ic('cowear','<ellipse cx="20" cy="20" rx="9" ry="14" fill="#fff" stroke="#1d1b1f" stroke-width="2"/><ellipse cx="20" cy="21" rx="6" ry="10" fill="#f3b6c8"/>');
 ic('cowface','<ellipse cx="14" cy="10" rx="4" ry="5" fill="#fff" stroke="#1d1b1f"/><ellipse cx="26" cy="10" rx="4" ry="5" fill="#fff" stroke="#1d1b1f"/><ellipse cx="20" cy="21" rx="10" ry="6" fill="#f3a6c0" stroke="#1d1b1f"/>');
 ic('teddy','<circle cx="20" cy="20" r="7" fill="#fbf7f1" stroke="#d9cdbd"/><circle cx="20" cy="10" r="5" fill="#fbf7f1" stroke="#d9cdbd"/><circle cx="16" cy="6.5" r="2" fill="#fbf7f1" stroke="#d9cdbd"/><circle cx="24" cy="6.5" r="2" fill="#fbf7f1" stroke="#d9cdbd"/>');
 ic('abcblocks','<rect x="7" y="13" width="12" height="12" fill="#fff" stroke="#2f6fd0"/><rect x="21" y="13" width="12" height="12" fill="#fff" stroke="#e8475f"/><rect x="14" y="2" width="12" height="11" fill="#fff" stroke="#5cc06c"/>');
 ic('balloon','<circle cx="20" cy="11" r="9" fill="#7fb0e8"/><path d="M14 17l3 6M26 17l-3 6" stroke="#b08a3a"/><rect x="16" y="23" width="8" height="5" fill="#8a5a3a"/>');
 ic('ladder','<path d="M14 3v24M26 3v24M14 7h12M14 12h12M14 17h12M14 22h12" stroke="#c9b9a6" stroke-width="2"/>');
 ic('buttons','<circle cx="14" cy="15" r="6" fill="#d4ae5a"/><circle cx="27" cy="13" r="4.5" fill="#d4ae5a"/><circle cx="13" cy="14" r=".9" fill="#5a4220"/><circle cx="15" cy="16" r=".9" fill="#5a4220"/>');
 ic('brooch','<circle cx="20" cy="17" r="4" fill="#f6e3dc" stroke="#d9a08a"/><path d="M20 13V3M16 14l-5-8M24 14l5-8M15 17H6M25 17h9" stroke="#d9a08a" stroke-width="2" stroke-dasharray="2 1"/>');
 ic('hoop','<circle cx="20" cy="13" r="9" fill="none" stroke="#d4ae5a" stroke-width="2"/><circle cx="13" cy="19" r="3" fill="#fbf7f1" stroke="#ddd"/><circle cx="17" cy="21.5" r="2.5" fill="#fbf7f1" stroke="#ddd"/>');
 ic('bee','<ellipse cx="19" cy="17" rx="9" ry="7" fill="#ffd21f"/><path d="M15 11v12M20 10v14" stroke="#1d1b1f" stroke-width="2.4"/><ellipse cx="17" cy="8" rx="5" ry="3" fill="#dff1ff"/><circle cx="26" cy="15" r="1.2" fill="#1d1b1f"/>')}

// Stencils used by the signature cakes: Art Deco geometric lines, harlequin diamonds and soft fondant pleats.
// (signature stencils are registered right after STENCILS is defined)

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
 return[[sgMat.metal(c),mg([m,...pk])]]}
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
 DECOR_ICONS['mx_'+k]=di('<circle cx="20" cy="20" r="12" fill="#f3d6d9"/><text x="20" y="25" font-size="13" text-anchor="middle">✨</text>')}
{const c=DECOR_CATS.find(x=>x.key==='signature');c.items.push(...MX.map(m=>'mx_'+m[0]))}

// ---------- Signature cakes: Sprinkle Me Silly's real cakes, rebuilt in the Studio ----------
const SIG='Signature Cakes';
THEMES.unshift(
 {key:'sig_peony',name:'Coral Peony Cascade',tag:SIG,blurb:'Five tall ivory tiers alternating combed buttercream and Swiss dots, with a sculpted column of coral and magenta peonies, ranunculus, white wildflowers and eucalyptus trailing down one side.',d:{board:'silver',topper:'none',tiers:[
  newTier(9.6,5.4,{texture:'lines',top:'none',bottom:'none',decor:[DC('mx_cascade_wedding','band',1,{size:880,rot:18,y:.2}),DC('mx_peony_coral','band',1,{size:330,rot:40,y:-1.4}),DC('mx_eucalyptus','band',1,{size:420,rot:-5,y:-.6})]}),
  newTier(8.4,5.2,{top:'none',bottom:'none',decor:[DC('dragees','scatter',110,{color:'#f1e8de',size:85}),DC('mx_cascade_wedding','band',1,{size:860,rot:20,y:0}),DC('mx_peony_blush','band',1,{size:300,rot:44,y:.8}),DC('mx_queenanne','band',1,{size:360,rot:-4,y:-.4})]}),
  newTier(7.4,5,{texture:'lines',top:'none',bottom:'none',decor:[DC('mx_cascade_rose','band',1,{size:840,rot:20,y:0}),DC('mx_peony_coral','band',1,{size:310,rot:42,y:.6}),DC('mx_waxflower','band',1,{size:330,rot:-2,y:-.8})]}),
  newTier(6.4,5,{top:'none',bottom:'none',decor:[DC('dragees','scatter',80,{color:'#f1e8de',size:85}),DC('mx_cascade_wedding','band',1,{size:800,rot:22,y:0}),DC('mx_peony_bud','band',1,{size:260,rot:44,y:1})]}),
  newTier(5,4.8,{texture:'lines',top:'none',bottom:'none',decor:[DC('mx_cascade_rose','band',1,{size:620,rot:22,y:1.2}),DC('mx_peony_coral','cluster',1,{size:300,face:30}),DC('mx_peony_bud','cluster',1,{size:220,face:30}),DC('mx_waxflower','cluster',1,{size:260})]})]}},
 {key:'sig_monogram',name:'Gilded Monogram Hexagon',tag:SIG,blurb:'Champagne hexagons with bold geometric gold lines and a gold quilt, a pleated ivory tier, a gold leaf top and a floral monogram hoop.',d:{board:'silver',topper:'none',tiers:[
  newTier(12,5.4,{shape:'hexagon',color:'#d9bf94',finish:'metallic',top:'none',bottom:'none',stencil:{pattern:'geo',color:'#8f6d33',size:4.4,height:4.4,y:.3},bottom:'pearls',bottomColor:'#d4ae5a'}),
  newTier(11,5.2,{shape:'hexagon',color:'#cfae74',finish:'metallic',texture:'golf',top:'none',bottom:'none'}),
  newTier(9.4,5.6,{color:'#fbf7f1',finish:'fondant',top:'none',bottom:'none',stencil:{pattern:'pleats',color:'#ddd2c4',size:2.2,height:5.6}}),
  newTier(9,5.4,{color:'#d2b47c',finish:'metallic',top:'pearls',pipe:'#d4ae5a',bottom:'pearls',bottomColor:'#d4ae5a',decor:[DC('monohoop','cluster',1,{color:'#d4ae5a',size:360,center:true,face:95})]})]}},
 {key:'sig_rosettower',name:'Blush Rosette Tower',tag:SIG,blurb:'Ivory rosette tiers around a blush tier with diagonal fondant pleats, and a tall smooth blush top tier on a gold board.',d:{board:'gold',topper:'none',tiers:[
  newTier(10,5.6,{texture:'rosettes',roseSize:170,roseTip:'2D',color:'#fbf3ea',top:'none',bottom:'none'}),
  newTier(8.8,5.4,{color:'#f1cfcf',finish:'fondant',top:'none',bottom:'none',stencil:{pattern:'pleats',color:'#d9a7aa',size:1.4,height:5.4}}),
  newTier(7.8,5.2,{texture:'rosettes',roseSize:170,roseTip:'2D',color:'#fbf3ea',top:'none',bottom:'none'}),
  newTier(6.6,4.4,{color:'#f4d6d4',finish:'fondant',top:'none',bottom:'none'})]}},
 {key:'sig_teal',name:'Teal Bauble Cascade',tag:SIG,blurb:'Three tall teal fondant tiers, a harlequin bottom tier and a column of glittery bronze, ivory and teal spheres cascading down one side, with sprinkles.',d:{board:'white',boardColor:'#e9eaec',topper:'none',tiers:[
  newTier(8.6,6,{color:'#7cc8b8',finish:'fondant',top:'none',bottom:'none',stencil:{pattern:'harlequin',color:'#c4e8df',size:1.6,height:3,y:-1.4},decor:[DC('glitterspheres','cascade',6,{color:'#b0825f',rot:-88,size:391}),DC('glitterspheres','cascade',5,{color:'#f3ead8',rot:-82,size:405}),DC('spheres','cascade',3,{color:'#5fb3a3',rot:-94,size:378}),DC('glitterspheres','cascade',4,{color:'#8c6a52',rot:-88,size:297})]}),
  newTier(7.6,5.8,{color:'#7cc8b8',finish:'fondant',top:'none',bottom:'none',decor:[DC('glitterspheres','cascade',5,{color:'#b0825f',rot:-88,size:378}),DC('glitterspheres','cascade',4,{color:'#f3ead8',rot:-82,size:391}),DC('spheres','cascade',3,{color:'#5fb3a3',rot:-94,size:364}),DC('glitterspheres','cascade',3,{color:'#8c6a52',rot:-88,size:283})]}),
  newTier(6.6,5.6,{color:'#7cc8b8',finish:'fondant',top:'none',bottom:'none',decor:[DC('glitterspheres','cascade',5,{color:'#b0825f',rot:-88,size:364}),DC('glitterspheres','cascade',4,{color:'#f3ead8',rot:-82,size:378}),DC('spheres','cascade',3,{color:'#5fb3a3',rot:-94,size:351}),DC('sprinkles','cascade',220,{mix:['#5fb3a3','#d4ae5a','#c9ccd2','#fbf7f1'],rot:30})]})]}},
 {key:'sig_cow',name:'Pink Bow Cow',tag:SIG,blurb:'A white cow cake with black spots, big cartoon eyes, a pink muzzle with a wide open grin, floppy pink-lined ears, black horns and pink bows.',d:{board:'white',boardColor:'#fbf7f1',topper:'none',tiers:[
  newTier(8,6.2,{color:'#ffffff',finish:'fondant',print:'cow',printColor:'#1d1b1f',top:'none',bottom:'none',decor:[DC('cowface','band',1,{color:'#f3b6c8',size:300,R:4,rot:55,y:.3}),DC('cowear','band',1,{color:'#f3b6c8',size:200,rot:-25,y:2.6}),DC('cowear','band',1,{color:'#f3b6c8',size:200,rot:135,y:2.6}),DC('cowtop','cluster',1,{color:'#f3a6c0',size:190,center:true,face:95})]})]}},
 {key:'sig_pillows',name:'Gold Damask Pillows',tag:SIG,blurb:'A pillow cake: a base tier in gold damask with a ring of ivory roses, a puffy pleated pillow with pinched corners and gold tassels, and a silver rose dome topped with ivory roses.',d:{board:'silver',boardShape:'square',topper:'none',tiers:[
  newTier(10,3.6,{shape:'square',color:'#fbf7f1',finish:'fondant',texture:'dimple',prof:'pillow',top:'rope',pipe:'#d4ae5a',bottom:'rope',bottomColor:'#d4ae5a',stencil:{pattern:'damask',color:'#d4ae5a',size:1.8,height:1.8,y:-.8},decor:[DC('roses','band',16,{color:'#fbf7f1',size:130,y:-1.4})]}),
  newTier(7.5,3.2,{shape:'square',color:'#fbf7f1',finish:'fondant',texture:'ruffle',prof:'pillow',top:'rope',pipe:'#fbf7f1',bottom:'scrolls',bottomColor:'#d4ae5a',decor:[DC('mx_tassel','band',4,{size:260,rot:45,y:.2})]}),
  newTier(5.5,3.4,{color:'#c9ccd2',texture:'rosettes',prof:'dome',top:'none',bottom:'none',decor:[DC('roses','cluster',10,{color:'#fbf7f1',size:130})]})]}},
 {key:'sig_ruffles',name:'Forever Ruffles',tag:SIG,blurb:'Four ivory fondant tiers with a diagonal sweep of vertical fondant ruffles edged in gold luster, a lace band, a clean top tier and a rose gold "forever" script topper.',d:{board:'silver',topper:'none',tiers:[
  newTier(10,5.4,{color:'#fbf8f2',finish:'fondant',texture:'vruffles',edgeColor:'#c8a46a',vr:{c:110,w0:180,w1:180},top:'none',bottom:'none'}),
  newTier(8.6,5.2,{color:'#fbf8f2',finish:'fondant',texture:'vruffles',edgeColor:'#c8a46a',vr:{c:135,w0:105,w1:40},top:'none',bottom:'none'}),
  newTier(7.4,5,{color:'#fbf8f2',finish:'fondant',top:'none',bottom:'none',stencil:{pattern:'lace',color:'#e6dccd',size:2.2,height:2.6,y:1.1}}),
  newTier(6.2,5.4,{color:'#fbf8f2',finish:'fondant',top:'none',bottom:'none',decor:[DC('scripttop','cluster',1,{color:'#e2ae96',size:380,center:true,face:95,text:'forever|eva'})]})]}},
 {key:'sig_rosegold',name:'Rose Gold Jewels',tag:SIG,blurb:'Six tiers of quilted ivory, jeweled chain swags, a rose gold glitter tier and rhinestone brooch bursts with rose gold roses.',d:{board:'rosegold',topper:'none',tiers:[
  newTier(12,4,{color:'#fbf8f2',finish:'fondant',side:'quilted',sideColor:'#fbf8f2',pearlColor:'#d9a08a',top:'pearls',pipe:'#d9a08a',bottom:'pearls',bottomColor:'#d9a08a',decor:[DC('mx_brooch','band',1,{size:330,rot:55}),DC('dragees','scatter',40,{color:'#d9a08a',size:45})]}),
  newTier(10,3.6,{color:'#fbf8f2',finish:'fondant',side:'swags',sideColor:'#d9a08a',pearlColor:'#d9a08a',top:'pearls',pipe:'#d9a08a',bottom:'pearls',bottomColor:'#d9a08a',decor:[DC('roses','cascade',5,{color:'#d9a08a',size:130,rot:-30})]}),
  newTier(8,3.6,{color:'#98483d',finish:'fondant',texture:'stucco',top:'dpearls',topColor:'#d9a08a',bottom:'pearls',bottomColor:'#d9a08a',decor:[DC('dragees','scatter',110,{color:'#e8b9a3',size:45})]}),
  newTier(7,3.6,{color:'#fbf8f2',finish:'fondant',side:'quilted',sideColor:'#fbf8f2',pearlColor:'#d9a08a',top:'none',bottom:'pearls',bottomColor:'#d9a08a'}),
  newTier(6,3.4,{color:'#fbf8f2',finish:'fondant',side:'strings',pipe:'#d9a08a',top:'pearls',pipe2:'#d9a08a',bottom:'pearls',bottomColor:'#d9a08a',decor:[DC('mx_brooch','band',1,{size:200,rot:55})]}),
  newTier(5,3.4,{color:'#fbf8f2',finish:'fondant',top:'dpearls',topColor:'#d9a08a',bottom:'none',decor:[DC('roses','cluster',3,{color:'#d9a08a',size:130})]})]}},
 {key:'sig_babysky',name:'Up, Up And Away Bears',tag:SIG,blurb:'Three tall tiers airbrushed from pale sky to bright blue, covered in fondant clouds, with a ladder, a pile of gold buttons, teddy bears and ABC blocks, and a bear in a hot air balloon on top.',d:{board:'white',boardColor:'#e9eaec',topper:'none',tiers:[
  newTier(8.6,6.6,{color:'#e6f1f7',finish:'fondant',ombre:true,ombreColor:'#5aaee8',top:'none',bottom:'none',decor:[DC('clouds','scatter',22,{color:'#fbf7f1',size:190}),DC('dragees','scatter',30,{color:'#fbf7f1',size:60}),DC('mx_teddy_seated','cluster',1,{size:560,where:'board',face:55,seed:4}),DC('mx_teddy_reclining','cluster',1,{size:520,where:'board',face:55,seed:12}),DC('mx_block_c','cluster',3,{size:230,where:'board',seed:21})]}),
  newTier(7.6,6.4,{color:'#e6f1f7',finish:'fondant',ombre:true,ombreColor:'#4aa6e6',top:'none',bottom:'none',decor:[DC('clouds','scatter',18,{color:'#fbf7f1',size:190}),DC('buttons','cascade',70,{color:'#b8913f',rot:-75,size:180,wide:1.4}),DC('ladder','band',1,{color:'#fbf7f1',rot:110,size:240})]}),
  newTier(6.4,5.8,{color:'#e6f1f7',finish:'fondant',ombre:true,ombreColor:'#3c9be0',top:'none',bottom:'none',decor:[DC('clouds','scatter',14,{color:'#fbf7f1',size:180}),DC('mx_teddy_balloon','cluster',1,{size:1100,center:true,face:55})]})]}},
 {key:'sig_sports',name:'All-Star Sports Number',tag:SIG,blurb:'A number 2 cut into sports zones: a blue baseball corner with a baseball and bat, a green soccer field with piped grass, a wood basketball court with a hoop and piped net, and a football field with yard lines and numbers, on an orange board.',d:{cakeType:'number',number:{text:'2',height:13,layers:2,cake:'vanilla',cream:'#3f8f45',style:'frosted',zones:[[0,.42,0,.45,'#2f6fd0'],[0,.42,.45,1,'#4fa84a'],[.42,.74,0,1,'#d6a15a'],[.74,1,0,1,'#3f8f45',11]]},board:'white',boardTint:'#d4621a',numBoard:'round',topper:'none',tiers:[
  newTier(8,4,{decor:[DC('grasstuft','cluster',1,{color:'#3f9a45',size:260,at:[.45,-.55]}),DC('soccerball','cluster',1,{size:280,at:[.45,-.55]}),DC('baseball2','cluster',1,{size:270,at:[-.5,-.72]}),DC('bat','cluster',1,{size:260,at:[-.05,-.86],yaw:-25}),DC('hoopnet','cluster',1,{color:'#d62839',size:230,at:[-.15,.12],yaw:20}),DC('hoopball','cluster',1,{size:270,at:[-.15,.12]}),DC('football','cluster',1,{size:270,at:[.5,.7],yaw:10}),DC('mx_glove','cluster',1,{size:300,at:[-.7,-.4],yaw:30}),DC('yardnums','cluster',1,{color:'#fbf7f1',size:120,at:[-.05,.93],yaw:0})]})]}},
 {key:'sig_blocks',name:'Building Block Number',tag:SIG,blurb:'A sunny yellow number 6 with a blue window, a mosaic wall of toy bricks around the side, rainbow sprinkles and bricks on top.',d:{cakeType:'number',number:{text:'6',height:13,layers:2,cake:'vanilla',cream:'#f6c919',style:'frosted',wall:['#e8475f','#2f6fd0','#f2c230','#5cc06c','#2f6fd0','#e8475f','#2a7a3a'],wallH:.95,holeFill:'#2f6fd0'},board:'white',boardTint:'#34405e',numBoard:'round',topper:'none',tiers:[
  newTier(8,4,{decor:[DC('bricks','cluster',18,{size:250,mix:['#e8475f','#2f6fd0','#5cc06c']}),DC('sprinkles','cluster',260,{mix:['#e8475f','#2f6fd0','#5cc06c','#f28a3a','#fbf7f1']})]})]}},
 {key:'sig_movie',name:'Movie Night Popcorn',tag:SIG,blurb:'A red and white striped popcorn tier overflowing with popcorn and a "13" Admit One ticket, over a black and white chevron clapperboard tier with stars.',d:{board:'gold',topper:'none',tiers:[
  newTier(11,4.8,{color:'#fbf7f1',finish:'fondant',top:'none',bottom:'none',stencil:{pattern:'chevron',color:'#1d1b1f',size:1.4,height:4.6},decor:[DC('plaque','band',1,{color:'#1d1b1f',size:270,R:5.5,rot:55,y:.3}),DC('mx_clapperboard','band',1,{size:320,rot:5}),DC('stars','scatter',14,{mix:['#f38ab0','#5fc8d8','#f2c230'],size:210}),DC('dragees','scatter',20,{color:'#f2c230',size:140})]}),
  newTier(7.8,8.4,{color:'#fbf7f1',finish:'fondant',prof:'bucket',stencil:{pattern:'stripes',color:'#d62839',size:1.3,height:8.2},top:'rope',pipe:'#fbf7f1',bottom:'none',decor:[DC('poplabel','band',1,{color:'#d62839',size:200,R:3.7,rot:55,y:.6}),DC('popcorn','cluster',120,{color:'#f8efd4',size:260}),DC('mx_ticket','cluster',1,{size:480,center:true,face:55}),DC('stars','cluster',5,{mix:['#f38ab0','#5fc8d8','#f2c230'],size:240})]})]}},
 {key:'sig_crawfish',name:'Crawfish Boil Pot',tag:SIG,blurb:'A brushed silver stock pot cake with a tilted lid and loop handles, spilling over with crawfish and corn, with potatoes and corn on the board.',d:{board:'white',boardColor:'#ece5d3',topper:'none',tiers:[
  newTier(8,7,{color:'#c4c8ce',finish:'fondant',texture:'brushed',top:'rope',pipe:'#aeb2b8',bottom:'rope',bottomColor:'#aeb2b8',decor:[DC('pothandle','band',2,{color:'#c9ccd2',size:160,y:2,rot:95}),DC('potlid2','cluster',1,{color:'#c9ccd2',size:300,center:true}),DC('mx_crawfish','crown',9,{size:340}),DC('mx_corn_cob','crown',3,{size:190,rot:60}),DC('crawhang','band',6,{color:'#d2381e',size:240,y:2.2}),DC('mx_corn_round','cluster',3,{size:170,where:'board',seed:3}),DC('mx_corn_cob','cluster',3,{size:230,where:'board',seed:9}),DC('mx_potato','cluster',5,{size:180,where:'board'})]})]}},
 {key:'sig_bee',name:'Bumble Bee Garden',tag:SIG,blurb:'A fuzzy black piped bee dome with a big round yellow face, googly eyes and a smile, swirl wings and curly antennae, in a garden of piped grass and sugar flowers.',d:{board:'white',boardColor:'#c9d96a',topper:'none',tiers:[
  newTier(13,1.4,{color:'#5cae4a',texture:'grass',top:'none',bottom:'none',decor:[DC('daisies','scatter',12,{color:'#fbf7f1',size:130}),DC('blossoms','scatter',18,{mix:['#f3a6c0','#f2c230','#7fb0e8','#e8475f'],size:130})]}),
  newTier(10,6,{color:'#1d1b1f',texture:'grass',furLen:150,prof:'half',top:'none',bottom:'none',decor:[DC('beeface','band',1,{color:'#ffd21f',size:370,R:4.3,rot:55,y:-.3}),DC('beetop','cluster',1,{color:'#ffd21f',size:260,center:true,face:95})]})]}},
 {key:'sig_moneybag',name:'Money Bag Birthday',tag:SIG,blurb:'A red money bag cake gathered up like a real sack, tied at the neck with a thick black rope knot and hanging ties, a big gold dollar sign, and cash and gold dollar signs spilling out of the ruffled opening.',d:{board:'white',boardColor:'#e9eaec',topper:'none',tiers:[
  newTier(9.4,7.4,{color:'#b5321f',finish:'royal',prof:'sack',texture:'gathers',top:'none',bottom:'none',decor:[DC('dollarface','band',1,{color:'#d4ae5a',size:320,R:4.7,rot:55,y:-.5}),DC('mx_cash_bundle','cluster',2,{size:320,where:'board',seed:6})]}),
  newTier(4.2,1,{color:'#a82e1c',finish:'royal',texture:'gathers',gFull:true,top:'rope',pipe:'#1d1b1f',bottom:'rope',bottomColor:'#1d1b1f',decor:[DC('ropeknot','band',1,{color:'#1d1b1f',size:200,rot:92,y:.1})]}),
  newTier(5.8,2.2,{color:'#b5321f',finish:'royal',texture:'gathers',gFull:true,prof:'flare',top:'none',bottom:'none',decor:[DC('cash','cluster',26,{size:360,center:true}),DC('dollarsign','cluster',2,{color:'#d4ae5a',size:300,center:true}),DC('mx_cash_fan','cluster',3,{size:420})]})]}});
