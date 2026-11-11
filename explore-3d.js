/*
 * Apeos C7072 Explore 3D
 *
 * Extracted from the known-good inline implementation.
 *
 * Protected behaviour:
 * - printer rotation
 * - hotspot coordinates and cameras
 * - in-view and physical occlusion
 * - hotspot z-index support
 * - Fully Open
 * - printer component animations
 * - touchscreen texture
 * - render scheduling
 * - mobile Explore behaviour
 */

/* =========================================================
   Main Three.js / Explore subsystem
   ========================================================= */

(function(){
var heroVideoSources=['final-assets/01-Approved-Assets/video/ai/7792036-hd_1920_1080_25fps.mp4','final-assets/01-Approved-Assets/video/ai/7710602-uhd_4096_2160_25fps.mp4','8439611-hd_1920_1080_25fps.mp4'],heroVideos=Array.prototype.slice.call(document.querySelectorAll('.hero-video video')),activeHeroVideo=0,activeHeroClip=0,heroTransitioning=false,heroPoster=document.querySelector('#office .ph img');
if(heroPoster)heroVideos.forEach(function(video){video.poster=heroPoster.currentSrc||heroPoster.src;});
function prepareHeroVideo(video,clipIndex){video.pause();video.classList.remove('is-active');if(Number(video.dataset.clip)===clipIndex){video.currentTime=0;return;}video.dataset.clip=clipIndex;video.src=heroVideoSources[clipIndex];video.load();}
function advanceHeroVideo(){if(heroTransitioning||heroVideos.length!==2)return;heroTransitioning=true;var nextClip=(activeHeroClip+1)%heroVideoSources.length,nextVideo=heroVideos[1-activeHeroVideo];function startNext(){nextVideo.removeEventListener('canplay',startNext);nextVideo.currentTime=0;function revealNext(){nextVideo.classList.add('is-active');window.setTimeout(function(){var previousVideo=heroVideos[activeHeroVideo];previousVideo.pause();previousVideo.classList.remove('is-active');activeHeroVideo=1-activeHeroVideo;activeHeroClip=nextClip;heroTransitioning=false;prepareHeroVideo(previousVideo,(activeHeroClip+1)%heroVideoSources.length);},1400);}try{var playback=nextVideo.play();if(playback&&playback.then)playback.then(revealNext).catch(function(){heroTransitioning=false;});else revealNext();}catch(e){heroTransitioning=false;}}if(nextVideo.readyState>=2)startNext();else nextVideo.addEventListener('canplay',startNext,{once:true});}
heroVideos.forEach(function(video){video.addEventListener('timeupdate',function(){if(video!==heroVideos[activeHeroVideo]||!Number.isFinite(video.duration))return;if(video.duration-video.currentTime<=1.4)advanceHeroVideo();});video.addEventListener('ended',function(){if(video===heroVideos[activeHeroVideo])advanceHeroVideo();});});
if(!window.THREE){document.getElementById('fallback').style.display='block';return;}
var V=THREE.Vector3, el=document.getElementById('c');
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var deviceMemory=navigator.deviceMemory||8,cpuCount=navigator.hardwareConcurrency||8,isMobile=innerWidth<=900,lowPower=isMobile||deviceMemory<=4||cpuCount<=4;
var R;try{R=new THREE.WebGLRenderer({canvas:el,antialias:!lowPower,alpha:true,powerPreference:'high-performance'});}catch(e){document.getElementById('fallback').style.display='block';return;}
R.setPixelRatio(Math.min(devicePixelRatio||1,isMobile?1:lowPower?1.25:1.5));R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=.95;R.shadowMap.enabled=true;R.shadowMap.type=lowPower?THREE.PCFShadowMap:THREE.PCFSoftShadowMap;
var S=new THREE.Scene(),C=new THREE.PerspectiveCamera(35,1,.1,60),G=new THREE.Group();S.add(G);
var room=new THREE.Group();S.add(room);
var wallMat=new THREE.MeshStandardMaterial({color:0xf1f2f0,roughness:1}),roomFloorMat=new THREE.MeshBasicMaterial({color:0xa6aaa7,toneMapped:false}),windowMat=new THREE.MeshBasicMaterial({color:0xcbdde2}),frameMat=new THREE.MeshStandardMaterial({color:0xb8c1c0,roughness:.8});
var wall=new THREE.Mesh(new THREE.PlaneGeometry(22,9),wallMat);wall.position.set(0,4.4,-3.4);wall.receiveShadow=true;room.add(wall);
var roomFloor=new THREE.Mesh(new THREE.PlaneGeometry(30,26),roomFloorMat);roomFloor.rotation.x=-Math.PI/2;roomFloor.position.set(0,-.03,-1);roomFloor.receiveShadow=true;room.add(roomFloor);
var windowPane=new THREE.Mesh(new THREE.PlaneGeometry(12,5.2),windowMat);windowPane.position.set(0,4,-3.36);room.add(windowPane);
var woodCanvas=document.createElement('canvas');woodCanvas.width=512;woodCanvas.height=512;var woodContext=woodCanvas.getContext('2d'),woodGradient=woodContext.createLinearGradient(0,0,512,0);woodGradient.addColorStop(0,'#b9915d');woodGradient.addColorStop(.24,'#d0b181');woodGradient.addColorStop(.52,'#c5a474');woodGradient.addColorStop(.78,'#d4b989');woodGradient.addColorStop(1,'#b89160');woodContext.fillStyle=woodGradient;woodContext.fillRect(0,0,512,512);for(var grainIndex=0;grainIndex<96;grainIndex++){var grainX=(grainIndex*83)%512;woodContext.beginPath();woodContext.moveTo(grainX,0);for(var grainY=24;grainY<=512;grainY+=24){woodContext.lineTo(grainX+Math.sin(grainY*.021+grainIndex)*2.4+Math.sin(grainY*.008+grainIndex*2)*3.2,grainY);}woodContext.strokeStyle=grainIndex%4===0?'rgba(92,59,28,.2)':'rgba(255,237,197,.16)';woodContext.lineWidth=grainIndex%7===0?2:1;woodContext.stroke();}
var woodTexture=new THREE.CanvasTexture(woodCanvas);woodTexture.encoding=THREE.sRGBEncoding;woodTexture.wrapS=THREE.RepeatWrapping;woodTexture.wrapT=THREE.RepeatWrapping;woodTexture.anisotropy=R.capabilities.getMaxAnisotropy();var woodMat=new THREE.MeshStandardMaterial({map:woodTexture,roughness:.82});
var wallAccent=new THREE.Mesh(new THREE.PlaneGeometry(22,5.6),woodMat);wallAccent.position.set(0,3.05,-3.2);wallAccent.receiveShadow=true;room.add(wallAccent);
var fluteCount=100,flutes=new THREE.InstancedMesh(new THREE.BoxGeometry(.05,5.5,.055),woodMat,fluteCount),fluteTransform=new THREE.Object3D();for(var fluteIndex=0;fluteIndex<fluteCount;fluteIndex++){fluteTransform.position.set(-10.89+fluteIndex*.22,3.05,-3.15);fluteTransform.updateMatrix();flutes.setMatrixAt(fluteIndex,fluteTransform.matrix);}flutes.instanceMatrix.needsUpdate=true;flutes.castShadow=true;flutes.receiveShadow=true;room.add(flutes);
function roomBar(w,h,d,x,y,z){var bar=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),frameMat);bar.position.set(x,y,z);room.add(bar);}
roomBar(.08,5.35,.08,-6,4,-3.3);roomBar(.08,5.35,.08,6,4,-3.3);roomBar(12.08,.08,.08,0,1.36,-3.3);roomBar(12.08,.08,.08,0,6.64,-3.3);roomBar(.06,5.2,.08,0,4,-3.3);roomBar(12,.06,.08,0,4,-3.3);
roomBar(22,.12,.08,0,.06,-3.28);
var wallBaseTexture=woodTexture.clone();wallBaseTexture.rotation=Math.PI/2;wallBaseTexture.center.set(.5,.5);wallBaseTexture.needsUpdate=true;var wallBaseMat=new THREE.MeshStandardMaterial({map:wallBaseTexture,color:0x654a2e,roughness:.9}),wallBase=new THREE.Mesh(new THREE.BoxGeometry(22,.24,.1),wallBaseMat);wallBase.position.set(0,.16,-3.08);wallBase.castShadow=true;room.add(wallBase);
S.add(new THREE.AmbientLight(0xffffff,.25));
var pm0=new THREE.PMREMGenerator(R),es=new THREE.Scene();es.background=new THREE.Color(0x202838);
[[0,6,0,8,.2,8],[6,2,3,.2,4,6],[-6,2,2,.2,4,6],[0,3,7,8,4,.2]].forEach(function(q){var m=new THREE.Mesh(new THREE.BoxGeometry(q[3],q[4],q[5]),new THREE.MeshBasicMaterial({color:new THREE.Color(2.2,2.2,2.4)}));m.position.set(q[0],q[1],q[2]);es.add(m);});
var environmentTarget=pm0.fromScene(es,.03);S.environment=environmentTarget.texture;pm0.dispose();es.traverse(function(o){if(o.isMesh){o.geometry.dispose();o.material.dispose();}});
var d1=new THREE.DirectionalLight(0xffffff,.8);d1.position.set(1.5,8,4);d1.castShadow=true;d1.shadow.mapSize.set(isMobile?512:lowPower?768:1024,isMobile?512:lowPower?768:1024);var sc2=d1.shadow.camera;sc2.left=-3;sc2.right=3;sc2.top=5;sc2.bottom=-3;sc2.near=1;sc2.far=14;d1.shadow.bias=-.0004;S.add(d1);
var graphicsConfig='';function configureGraphics(){var mobile=innerWidth<=900,constrained=mobile||deviceMemory<=4||cpuCount<=4,ratio=Math.min(devicePixelRatio||1,mobile?1:constrained?1.25:1.5),size=mobile?512:constrained?768:1024,key=[mobile,constrained,ratio].join(':');if(key===graphicsConfig)return;graphicsConfig=key;R.setPixelRatio(ratio);R.shadowMap.type=constrained?THREE.PCFShadowMap:THREE.PCFSoftShadowMap;d1.shadow.mapSize.set(size,size);if(d1.shadow.map){d1.shadow.map.dispose();d1.shadow.map=null;}d1.shadow.needsUpdate=true;}
configureGraphics();
var d2=new THREE.DirectionalLight(0x6aa8ff,.5);d2.position.set(-4,2,-2);S.add(d2);
var floor=new THREE.Mesh(new THREE.CircleGeometry(3.4,64),new THREE.ShadowMaterial({opacity:.22}));
floor.rotation.x=-Math.PI/2;floor.position.y=.01;floor.receiveShadow=true;S.add(floor);

/* ---------- content ---------- */
var INFO={
feeder:{tag:'Scan',title:'High-Performance, Quiet Scanning',body:'Capture high-volume documents quickly, accurately and with less disruption.',bl:['Originals from A6 up to A3 (11 × 17")','38 to 220 gsm (50 to 220 gsm when duplex)','Up to 150 ppm, or 300 ppm two-sided in one pass'],cam:[1.5,3.6,2.8],tgt:[0,2.5,0],hs:[-.5,2.75,.4]},
touch:{tag:'Experience',title:'New Control Panel',body:'Clearer, simpler and easier to use with a highly visible 10.1-inch IPS display.',bl:['10.1-inch control panel','Self Help information on the panel','Scan the QR code to continue on your phone','Remote Assistance on the shared panel'],cam:[.18,2.8,2],tgt:[-.2,2.45,.62],hs:[-.2,2.5,.62]},
out:{tag:'Smart sensing',title:'Smart WelcomEyes',body:'Smart sensing helps balance quick access with energy-efficient operation.',bl:['Detects approaching users and resumes from power-saving mode','Helps reduce perceived wait time when the device wakes','Supports remaining-document detection and automatic logout'],cam:[-.45,2.65,2.15],tgt:[-.48,2.05,.48],hs:[-.52,2.08,.5]},
body:{tag:'Intelligence',title:'Apeos × AI',body:'AI works behind the scenes to improve efficiency and help reduce disruption.',bl:['AI-assisted monitoring helps identify potential issues earlier','Usage-aware power management supports smarter energy use','Remote diagnostics can support more proactive maintenance'],cam:[.8,1.9,3.0],tgt:[0,1.65,.5],hs:[.4,1.65,.52]},
t1:{tag:'Paper',title:'Tray 1',body:'Everyday paper, all the way up to A3.',bl:['520 sheets','A5 SEF up to A3 (11 × 17"), plus envelopes and postcards','52 to 300 gsm'],cam:[1.4,1.8,2.6],tgt:[0,1.1,.4],hs:[.5,.78,.52]},
t2:{tag:'Media',title:'Versatile Media Support',body:'Handle a wider range of workplace and promotional media.',bl:['520-sheet tray capacity','Up to SRA3 (320 × 450 mm) and 12 × 18"','Custom sizes from 100 × 148 to 320 × 457 mm'],cam:[1.4,1.3,2.6],tgt:[0,.75,.4],hs:[.5,.55,.52]},
t34:{tag:'Design',title:'Designed to be Compact',body:'A compact footprint designed to fit naturally into modern shared workplaces.',bl:['598 × 685 mm footprint','High paper capacity within a compact body','Designed to integrate more easily into shared office environments'],cam:[1.3,.9,2.6],tgt:[0,.35,.4],hs:[.4,.25,.52]}
};


var IMG="final-assets/01-Approved-Assets/images/embedded/embedded-image-04.jpg";
var MODEL_URL='final-assets/01-Approved-Assets/models/apeos-c7072.glb';
/* ---------- real printer model (GLB) ---------- */
var IW=745,IH=750,P={},pickMeshes=[],mixer=null,ready=false,U={uT:{value:0},uAsm:{value:reduce?1:0},uFocus:{value:0},uM:{value:new V(0,0,99)}};
var touchscreenTexture=null;

/*
 * Use the original control-panel texture embedded in the GLB.
 * Do not replace mtl_UI.002 with an external CanvasTexture.
 */
function applyTouchscreenTexture(){}
function drawScreen(){}
var PART={feeder:['DADF','DADF_stopper','IIT'],touch:['UI3'],out:['a_fin_1','a_fin_2','a_fin_3'],body:['cover','TM_Cover'],t1:['tray_1'],t2:['tray_2'],t34:['tray_3','tray_4'],side:['sidetray','sidetray_1','sidetray_2','sidetray_3'],msi:['msi','msi_stopper']},
CLIPS={feeder:['DADF','DADF_stopper'],out:['a_fin_2','a_fin_3'],t1:['tray_1'],t2:['tray_2'],t34:['tray_3','tray_4'],side:['sidetray_1','sidetray_2','sidetray_3'],msi:['msi','msi_stopper']},
HIDE=['under_tile','depth_gage_model','high_gage_model','width_gage_model'];
INFO.side={tag:'Paper',title:'Side tray',body:'A fold-out tray for extra output.',bl:['100 sheets (70 gsm paper)','Folds out from the left side','Folds away when not needed'],cam:[-3.15,2.9,3.15],tgt:[.03,2.3,1.17],hs:[-.84,2.38,.06]};
INFO.msi={tag:'Paper',title:'Bypass tray',body:'Feed specialty and non-standard media without changing the main trays.',bl:['100 sheets','SRA3 and up to 12 × 19"','Custom sizes from 89 × 98 to 320 × 483 mm','Long paper up to 320 × 1,200 mm','52 to 300 gsm'],cam:[-1,2,2.4],tgt:[-.2,1.2,.3],hs:[-.55,1.2,.62]};
Object.keys(INFO).forEach(function(id){INFO[id].w=new V().fromArray(INFO[id].hs);});
function removeWhiteBaseSupports(mesh,id){if(id!=='body'||!mesh.material||mesh.material.name!=='mtl_white.003')return;var geometry=mesh.geometry,position=geometry.attributes.position,source=geometry.index&&geometry.index.array,vertexCount=source?source.length:position.count,kept=[],aPoint=new V(),bPoint=new V(),cPoint=new V();for(var i=0;i<vertexCount;i+=3){var a=source?source[i]:i,b=source?source[i+1]:i+1,c=source?source[i+2]:i+2;aPoint.set(position.getX(a),position.getY(a),position.getZ(a)).applyMatrix4(mesh.matrixWorld);bPoint.set(position.getX(b),position.getY(b),position.getZ(b)).applyMatrix4(mesh.matrixWorld);cPoint.set(position.getX(c),position.getY(c),position.getZ(c)).applyMatrix4(mesh.matrixWorld);var y=(aPoint.y+bPoint.y+cPoint.y)/3;if(y<-.48)continue;kept.push(a,b,c);}if(kept.length!==vertexCount){geometry.setIndex(kept);geometry.clearGroups();geometry.addGroup(0,kept.length,0);geometry.computeBoundingBox();geometry.computeBoundingSphere();}}
function setupPrinter(g){
  var root=g.scene,owner={},bx=new THREE.Box3(),own=[];
  Object.keys(PART).forEach(function(id){PART[id].forEach(function(n){owner[n]=id;});});
  root.updateMatrixWorld(true);
  root.traverse(function(o){
    if(!o.isMesh)return;var a=o,id=null,hid=false;
    while(a&&!id){if(HIDE.indexOf(a.name)>=0){hid=true;break;}id=owner[a.name];a=a.parent;}
    if(hid){o.visible=false;return;}if(!id)return;console.log('[C7072-MESH]',{mesh:o.name,material:o.material?o.material.name:'',part:id,color:o.material&&o.material.color?'#'+o.material.color.getHexString():'',roughness:o.material&&o.material.roughness!=null?o.material.roughness:'',metalness:o.material&&o.material.metalness!=null?o.material.metalness:''});removeWhiteBaseSupports(o,id);
    var p=P[id]||(P[id]={id:id,m:[],mats:[],acts:[],k:0,tg:0,h:1});
    o.material=o.material.clone();o.material.userData.o=o.material.opacity;o.material.userData.t=o.material.transparent;
    o.castShadow=o.receiveShadow=true;p.m.push(o);p.mats.push(o.material);pickMeshes.push(o);own.push(o);
  });
  own.forEach(function(o){bx.expandByObject(o);});
  var sz=bx.getSize(new V()),sc=2.9/sz.y,ct=bx.getCenter(new V());
  root.scale.multiplyScalar(sc);root.position.set(-ct.x*sc,.02-bx.min.y*sc,-ct.z*sc);
  G.add(root);G.position.set(0,0,0);G.rotation.set(0,0,0);if(touchscreenTexture){applyTouchscreenTexture();}
  mixer=new THREE.AnimationMixer(root);
  Object.keys(CLIPS).forEach(function(id){if(!P[id])return;CLIPS[id].forEach(function(cn){
    var c=g.animations.filter(function(a){return a.name.split('|')[0]===cn;})[0];if(!c)return;
    var a=mixer.clipAction(c);a.play();a.paused=true;a.time=0;P[id].acts.push(a);});});
  mixer.update(0);G.updateMatrixWorld(true);applyTouchscreenTexture();
  Object.keys(INFO).forEach(function(id){var i=INFO[id];if(i.w)i.w.fromArray(i.hs);});
  G.scale.setScalar(1);U.uAsm.value=1;ready=true;t0=performance.now();scheduleFrame();
  var h=document.getElementById('hint');if(h)h.textContent='Select a highlighted part for details';
}
/* END_PRINTER */
function glbFail(e){console.error(e);document.getElementById('fallback').style.display='block';}
(function(){
  var loader=new THREE.GLTFLoader();

  loader.load(
    MODEL_URL,
    function(g){
      setupPrinter(g);
    },
    undefined,
    glbFail
  );
})();

var full=false;(function(){var b=document.getElementById("fo");b.onclick=function(){full=!full;b.textContent=full?"Close all":"Fully open";if(!focus){if(full){var m=innerWidth<=900;tp.set(m?2.6:3.4,3.0,m?9:7.4);tt.set(0,1.35,.5);}else{tp.copy(home.p);tt.copy(home.t);}}scheduleFrame();};})();
/* ---------- hotspots + card ---------- */
var hsWrap=document.getElementById('hs');
Object.keys(INFO).forEach(function(id){var bt=document.createElement('button');bt.className='hs';bt.setAttribute('aria-label',INFO[id].title);bt.onclick=function(e){e.stopPropagation();open(id);};hsWrap.appendChild(bt);INFO[id].el=bt;INFO[id].w=INFO[id].w||new V().fromArray(INFO[id].hs);});
var card=document.getElementById('card'),hint=document.getElementById('hint'),cardT=0,returnFocus=null;
function fill(id){var i=INFO[id];document.getElementById('ct').textContent=i.tag;document.getElementById('ch').textContent=i.title;document.getElementById('cp').textContent=i.body;
  document.getElementById('cl').innerHTML=i.bl.map(function(x){return '<li>'+x+'</li>';}).join('');}

/* ---------- state ---------- */
var home={p:new V(3.6,2.8,8),t:new V(0,1.6,0)},camP=home.p.clone(),camT=home.t.clone(),tp=home.p.clone(),tt=home.t.clone();
var focus=null,hover=null,lock=0,rotY=0,rotT=0;
function open(id){if(performance.now()<lock||focus===id)return;lock=performance.now()+600;returnFocus=document.activeElement;focus=id;document.body.classList.add('f');var i=INFO[id];tp.fromArray(i.cam);tt.fromArray(i.tgt);
  card.classList.remove('show');clearTimeout(cardT);cardT=setTimeout(function(){if(focus===id){fill(id);card.classList.add('show');document.getElementById('x').focus();if(window.anime&&!reduce)window.anime.animate('#cl li',{opacity:[0,1],x:[-14,0],duration:520,delay:window.anime.stagger(80),ease:'outQuart'});}},reduce?0:450);hint.classList.add('off');scheduleFrame();}
function close(){if(!focus||performance.now()<lock)return;lock=performance.now()+600;focus=null;document.body.classList.remove('f');tp.copy(home.p);tt.copy(home.t);card.classList.remove('show');clearTimeout(cardT);drawScreen(-1);var target=returnFocus;returnFocus=null;if(target&&target.isConnected)target.focus({preventScroll:true});scheduleFrame();}
document.getElementById('x').onclick=close;
addEventListener('keydown',function(e){if(e.key==='Escape')close();});

/* ---------- input ---------- */
var RC=new THREE.Raycaster(),nd=new THREE.Vector2(),down=null,drag=false,pendingPointer=null,plane=new THREE.Plane(new V(0,0,1),-.55),tmp=new V();
function setNd(e){var r=el.getBoundingClientRect();nd.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);RC.setFromCamera(nd,C);}
function pick(){var h=RC.intersectObjects(pickMeshes,false);return h.length?h[0].object.userData.pid:null;}
el.addEventListener('pointerdown',function(e){rotT=G.rotation.y;down={x:e.clientX,y:e.clientY,r:rotT};drag=false;scheduleFrame();});
el.addEventListener('pointermove',function(e){
  if(down){var dx=e.clientX-down.x;if(Math.abs(dx)>5||Math.abs(e.clientY-down.y)>5)drag=true;if(drag&&!focus)rotT=down.r+dx*.006;}
  pendingPointer={clientX:e.clientX,clientY:e.clientY};scheduleFrame();});
el.addEventListener('pointerleave',function(){pendingPointer=null;U.uM.value.set(0,0,99);hover=null;scheduleFrame();});
el.addEventListener('pointerup',function(e){if(!down)return;if(!drag){setNd(e);var id=pick();if(id)open(id);else close();}down=null;pendingPointer=null;scheduleFrame();});

/* ---------- loop ---------- */
var xs=document.getElementById('explore'),XW=1,XH=1,vis=true,seen=false,frameRequest=0;
function scheduleFrame(){var bounds=xs.getBoundingClientRect();vis=document.visibilityState==='visible'&&bounds.bottom>0&&bounds.top<innerHeight;if(vis&&!frameRequest)frameRequest=requestAnimationFrame(frame);}
function setHome(){var d=innerWidth>900;home.p.set(d?3.9:2.15,d?2.8:2.55,d?5.3:5.8);home.t.set(d?.5:0,d?1.32:1.34,0);if(!focus){camP.copy(home.p);camT.copy(home.t);tp.copy(home.p);tt.copy(home.t);}}
function resize(){setHome();configureGraphics();XW=xs.clientWidth||innerWidth;XH=xs.clientHeight||innerHeight;R.setSize(XW,XH,false);C.aspect=XW/XH;C.fov=XW<700?48:35;C.updateProjectionMatrix();scheduleFrame();}
addEventListener('resize',resize);if(window.ResizeObserver)new ResizeObserver(resize).observe(xs);resize();
new IntersectionObserver(function(es){var e=es[0],bounds=xs.getBoundingClientRect();vis=document.visibilityState==='visible'&&bounds.bottom>0&&bounds.top<innerHeight;if(vis&&!seen){seen=true;t0=performance.now();}if(e.intersectionRatio<.3&&focus)close();if(vis)scheduleFrame();},{threshold:[0,.3,.5]}).observe(xs);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')scheduleFrame();else vis=false;});
var last=performance.now(),t0=last,scr=0,s=new V(),hotspotPoint=new V(),hotspotRayDirection=new V(),hotspotRaycaster=new THREE.Raycaster(),hotspotCheckAt=0;
function needsFrame(){if(Math.abs(rotT-G.rotation.y)>.001||camP.distanceToSquared(tp)>.0001||camT.distanceToSquared(tt)>.0001||Math.abs(U.uFocus.value-(focus?1:0))>.01)return true;var animating=false;Object.keys(P).forEach(function(id){var p=P[id],targetH=focus?(focus===id?1:.78):1;if(Math.abs(p.h-targetH)>.01||Math.abs(p.k-p.tg)>.01)animating=true;});return animating;}

function frame(now){frameRequest=0;if(!vis)return;var dt=Math.min(.05,(now-last)/1000);last=now;var T=(now-t0)/1000;
  U.uT.value=T;U.uAsm.value=ready?1:0;
  U.uFocus.value+=((focus?1:0)-U.uFocus.value)*(1-Math.exp(-dt*4));
  var kc=reduce?1:1-Math.exp(-dt*3.6);camP.lerp(tp,kc);camT.lerp(tt,kc);C.position.copy(camP);C.lookAt(camT);C.updateMatrixWorld(true);
  G.rotation.y+=(rotT-G.rotation.y)*(1-Math.exp(-dt*4));
  G.updateMatrixWorld(true);if(pendingPointer){setNd(pendingPointer);if(RC.ray.intersectPlane(plane,tmp)){U.uM.value.copy(G.worldToLocal(tmp.clone()));}hover=drag?null:pick();el.classList.toggle('ptr',!!hover);pendingPointer=null;}
  Object.keys(P).forEach(function(id){var p=P[id],tg=((focus===id&&id!=='out')||full)?1:0;if(p.tg!==tg){p.tg=tg;if(window.anime&&!reduce){if(p.tw)p.tw.pause();p.tw=window.anime.animate(p,{k:tg,duration:tg?1100:800,ease:tg?'outQuart':'inOutQuad'});}else p.k=tg;}var ot=focus?(focus===id?1:.78):1;p.h+=(ot-p.h)*(1-Math.exp(-dt*6));var gl=(hover===id&&!focus)?.06:0;
  p.mats.forEach(function(m){m.opacity=(m.userData.o==null?1:m.userData.o)*p.h;m.transparent=!!m.userData.t||p.h<.995;if(m.emissive)m.emissive.setRGB(gl*.3,gl*.8,gl);});
  p.acts.forEach(function(a){a.time=a.getClip().duration*p.k;});});
if(mixer)mixer.update(0);
  if(focus==='touch'&&now-scr>650){scr=now;drawScreen(Math.floor(now/650)%6);}
  G.updateMatrixWorld(true);
  var checkHotspots=now-hotspotCheckAt>80;if(checkHotspots)hotspotCheckAt=now;
  Object.keys(INFO).forEach(function(id){var i=INFO[id];hotspotPoint.copy(i.w);G.localToWorld(hotspotPoint);s.copy(hotspotPoint).project(C);
    i.el.style.transform='translate('+((s.x*.5+.5)*XW)+'px,'+((-s.y*.5+.5)*XH)+'px)';
    var inView=s.x>=-1&&s.x<=1&&s.y>=-1&&s.y<=1&&s.z>=-1&&s.z<=1,frontFacing=(id!=='out'||Math.cos(G.rotation.y)>.65);visible=!focus&&inView&&ready&&!full&&frontFacing;
    if(checkHotspots&&visible){var distance=hotspotPoint.distanceTo(C.position);hotspotRayDirection.subVectors(hotspotPoint,C.position).normalize();hotspotRaycaster.set(C.position,hotspotRayDirection);hotspotRaycaster.far=Math.max(0,distance-.4);i.occluded=hotspotRaycaster.intersectObjects(pickMeshes,false).length>0;}
    i.el.classList.toggle('off',!visible||!!i.occluded);});
  R.render(S,C);if(needsFrame())scheduleFrame();}
scheduleFrame();

/* ---------- microsite behaviour ---------- */
var $=function(s){return [].slice.call(document.querySelectorAll(s));},st=document.getElementById('stage'),nav=document.querySelector('nav'),tk=0,lastScrollY=scrollY,scrollDirection=0,scrollDistance=0;
$('.crop').forEach(function(n){var c=n.dataset.c.split(',').map(Number),w=c[2]-c[0],h=c[3]-c[1],img=n.dataset.img||IMG;n.style.aspectRatio=w+'/'+h;n.style.backgroundImage='url('+img+')';n.style.backgroundSize=(IW/w*100)+'% auto';n.style.backgroundPosition=(c[0]/(IW-w)*100)+'% '+(c[1]/(IH-h)*100)+'%';});
var DS=$('[data-s]'),DP=$('[data-p]'),heroSection=document.querySelector('.hero2'),heroMedia=document.querySelector('.hero2 .hero-video');addEventListener('resize',function(){onScroll();});
function onScroll(){var y=scrollY,M=innerWidth<=900,delta=y-lastScrollY,direction=delta>0?1:delta<0?-1:0;if(direction&&direction!==scrollDirection)scrollDistance=0;if(direction)scrollDistance+=Math.abs(delta);if(y<80||nav.contains(document.activeElement)||direction<0&&scrollDistance>8)nav.classList.remove('h');else if(direction>0&&y>120&&scrollDistance>8)nav.classList.add('h');if(direction)scrollDirection=direction;lastScrollY=y;nav.classList.toggle('s',y>30);if(heroMedia&&!reduce)heroMedia.style.setProperty('--hero-parallax-y',Math.min(y*.4,heroSection.offsetHeight*.15)+'px');
  if(!M)DS.forEach(function(n){n.style.transform='translate3d(0,'+(-y*n.dataset.s)+'px,0)';});
  if(!reduce&&!M){var rs=DP.map(function(n){return n.parentNode.getBoundingClientRect();});DP.forEach(function(n,i){var r=rs[i];n.style.transform='translate3d(0,'+((r.top+r.height/2-innerHeight/2)*n.dataset.p)+'px,0)';});}}
addEventListener('scroll',function(){if(!tk){tk=1;requestAnimationFrame(function(){tk=0;onScroll();});}},{passive:true});onScroll();
function count(n){var t=+n.dataset.n,o={v:0};if(window.anime&&!reduce){window.anime.animate(o,{v:t,duration:1500,ease:'outExpo',onUpdate:function(){n.textContent=Math.round(o.v).toLocaleString();}});}else n.textContent=t.toLocaleString();}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);if(e.target.dataset.n)count(e.target);}});},{threshold:.15});
$('.rv,[data-n]').forEach(function(n){io.observe(n);});
var fm=document.getElementById('fm'),campaignSteps=Array.prototype.slice.call(fm.querySelectorAll('.campaign-step')),campaignIndex=0,campaignNext=document.getElementById('campaign-next'),campaignBack=document.getElementById('campaign-back'),campaignError=document.getElementById('campaign-error'),campaignProgress=document.querySelector('.campaign-progress'),campaignReview=document.getElementById('campaign-review');
function campaignValue(name){var selected=fm.querySelector('input[name="'+name+'"]:checked');return selected?selected.value:'';}
function campaignMove(){campaignSteps.forEach(function(step,index){step.hidden=index!==campaignIndex;});document.getElementById('campaign-count').textContent='Step '+(campaignIndex+1)+' of '+campaignSteps.length;campaignProgress.setAttribute('aria-valuenow',campaignIndex+1);document.getElementById('campaign-progress').style.width=((campaignIndex+1)/campaignSteps.length*100)+'%';campaignBack.disabled=campaignIndex===0;campaignNext.type=campaignIndex===campaignSteps.length-1?'submit':'button';campaignNext.innerHTML=campaignIndex===campaignSteps.length-1?'Confirm demo brief':'Continue <span aria-hidden="true">→</span>';campaignError.textContent='';var activeTitle=campaignSteps[campaignIndex].querySelector('h3');
if(activeTitle){
  activeTitle.focus({preventScroll:true});
  requestAnimationFrame(function(){
    activeTitle.scrollIntoView({
      behavior:'smooth',
      block:'start',
      inline:'nearest'
    });
  });
}}
function campaignValidate(){var selector='',message='';if(campaignIndex===0&&!fm.querySelector('input[name="focus"]:checked')){selector='input[name="focus"]';message='Choose at least one thing for your demo playlist.';}if(campaignIndex===1){if(!campaignValue('team')){selector='input[name="team"]';message='Choose the closest office size.';}else if(!campaignValue('volume')){selector='input[name="volume"]';message='Choose the closest monthly print volume.';}}if(campaignIndex===2&&!campaignValue('timing')){selector='input[name="timing"]';message='Choose a timing option to continue.';}if(campaignIndex===3){var name=fm.elements.n.value.trim(),email=fm.elements.e.value.trim();if(name.length<2){selector='#campaign-name';message='Add your name so we know who the demo is for.';}else if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){selector='#campaign-email';message='Enter a valid work email address.';}}if(message){campaignError.textContent=message;fm.querySelector(selector).focus();return false;}return true;}
function campaignBuildReview(){var focus=Array.prototype.map.call(fm.querySelectorAll('input[name="focus"]:checked'),function(input){return input.value;}).join(', '),rows=[['Demo focus',focus],['Office size',campaignValue('team')],['Monthly print volume',campaignValue('volume')],['Timing',campaignValue('timing')],['Name',fm.elements.n.value.trim()],['Company',fm.elements.company.value.trim()||'Not provided'],['Work email',fm.elements.e.value.trim()],['Demo note',fm.elements.m.value.trim()||'None added']];campaignReview.textContent='';rows.forEach(function(row){var item=document.createElement('div'),label=document.createElement('dt'),value=document.createElement('dd');label.textContent=row[0];value.textContent=row[1];item.appendChild(label);item.appendChild(value);campaignReview.appendChild(item);});}
function campaignAdvance(){if(!campaignValidate())return;if(campaignIndex<campaignSteps.length-1){campaignIndex++;if(campaignIndex===campaignSteps.length-1)campaignBuildReview();campaignMove();}}
campaignNext.addEventListener('click',function(e){if(campaignIndex<campaignSteps.length-1){e.preventDefault();campaignAdvance();}});campaignBack.addEventListener('click',function(){if(campaignIndex>0){campaignIndex--;campaignMove();}});
fm.addEventListener('change',function(){if(campaignError.textContent)campaignError.textContent='';});
fm.addEventListener('submit',function(e){if(fm.elements.hp.value){e.preventDefault();return;}e.preventDefault();if(campaignIndex<campaignSteps.length-1){campaignAdvance();return;}if(!campaignValidate())return;var success=document.createElement('section'),title=document.createElement('h3'),copy=document.createElement('p'),recap=campaignReview.cloneNode(true);success.className='campaign-success';success.setAttribute('role','status');success.setAttribute('tabindex','-1');title.textContent='Your demo game plan is ready, '+fm.elements.n.value.trim().split(/\s+/)[0]+'.';copy.textContent='This is a prototype. Nothing was sent or saved.';success.appendChild(title);success.appendChild(copy);success.appendChild(recap);fm.replaceChildren(success);success.focus();});
/* ---------- Anime.js motion layer (v4.5.0) ---------- */
(function(){var A=window.anime,H=document.documentElement;function show(){requestAnimationFrame(function(){requestAnimationFrame(function(){H.classList.remove('pre');});});}
 if(!A||reduce){H.classList.remove('pre');return;}
 setTimeout(function(){H.classList.remove('pre');},4000);
 try{var sp=A.splitText(document.querySelector('.hero2 h1'),{words:true});A.animate(sp.words,{opacity:[0,1],y:[28,0],duration:900,delay:A.stagger(70,{start:150}),ease:'outExpo'});}catch(e){}
 A.animate('.hero2 .ey,.hero2 .lead,.hero2 .cta',{opacity:[0,1],y:[18,0],duration:800,delay:A.stagger(110,{start:350}),ease:'outQuart'});
 show();})();
})();


/* =========================================================
   Explore controls
   ========================================================= */

(function(){
  function hideDuplicateHelper(){
    var root=document.getElementById('explore'); if(!root)return;
    Array.prototype.slice.call(root.querySelectorAll('div,span,p,button')).forEach(function(el){
      if((el.textContent||'').trim()==='Select a highlighted part for details'){
        el.style.setProperty('display','none','important');
        el.setAttribute('aria-hidden','true');
      }
    });
  }
  hideDuplicateHelper();
  var root=document.getElementById('explore');
  if(root){new MutationObserver(hideDuplicateHelper).observe(root,{childList:true,subtree:true});}
})();


/* =========================================================
   Hotspot title handling
   ========================================================= */

(function(){
  var root=document.getElementById('explore');
  if(!root)return;
  var longTitles=['Duplex Automatic Document Feeder','Touchscreen control panel'];
  function fitTitles(){
    Array.prototype.forEach.call(root.querySelectorAll('h1,h2,h3,div,span'),function(el){
      var t=(el.textContent||'').trim();
      if(longTitles.indexOf(t)===-1)return;
      el.style.setProperty('white-space','normal','important');
      el.style.setProperty('overflow-wrap','anywhere','important');
      el.style.setProperty('word-break','normal','important');
      el.style.setProperty('max-width','100%','important');
      el.style.setProperty('width','100%','important');
      el.style.setProperty('box-sizing','border-box','important');
      el.style.setProperty('font-size',t.length>28?'25px':'27px','important');
      el.style.setProperty('line-height','1.08','important');
      el.style.setProperty('font-weight','400','important');
    });
  }
  fitTitles();
  new MutationObserver(fitTitles).observe(root,{childList:true,subtree:true,characterData:true});
})();