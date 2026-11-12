/*
 * Apeos C7072 landing page
 * Stable non-3D site interactions
 * Three.js, Explore, hotspots and printer animation are maintained separately in explore-3d.js.
 */

/* =====================================================
   1. hero-loop-fix-v3
   ===================================================== */
(function(){
  var root=document.querySelector('.hero-video');
  if(!root)return;
  var vids=Array.prototype.slice.call(root.querySelectorAll('video'));
  if(vids.length!==3)return;
  var active=Math.max(0,vids.findIndex(function(v){return v.classList.contains('is-active');}));
  var timer=null,guard=false;
  vids.forEach(function(v){v.loop=false;v.muted=true;v.playsInline=true;v.preload='auto';v.removeAttribute('poster');});
  function schedule(v,index){
    clearTimeout(timer);
    if(!isFinite(v.duration)||v.duration<=0)return;
    timer=setTimeout(function(){advance(index);},Math.max(250,(v.duration-0.22)*1000));
  }
  function advance(from){
    if(guard||from!==active)return;
    guard=true;
    var next=(active+1)%vids.length,outgoing=vids[active],incoming=vids[next];
    try{incoming.currentTime=0;}catch(e){}
    incoming.classList.add('is-active');
    var p=incoming.play();if(p&&p.catch)p.catch(function(){});
    setTimeout(function(){
      outgoing.classList.remove('is-active');outgoing.pause();
      active=next;guard=false;schedule(incoming,active);
    },140);
  }
  vids.forEach(function(v,i){v.addEventListener('loadedmetadata',function(){if(i===active)schedule(v,i);});v.addEventListener('ended',function(){advance(i);});});
  vids.forEach(function(v,i){if(i!==active){v.classList.remove('is-active');v.pause();try{v.currentTime=0;}catch(e){}}});
  var p=vids[active].play();if(p&&p.catch)p.catch(function(){});if(vids[active].readyState>=1)schedule(vids[active],active);
})();

/* =====================================================
   2. anonymous-site-script
   ===================================================== */
(function(){var grid=document.querySelector('.usp-grid'),cards=Array.prototype.slice.call(grid.children),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;cards.forEach(function(card){var toggle=card.querySelector('.usp-toggle'),details=card.querySelector('.usp-details');toggle.addEventListener('click',function(){var wasActive=card.classList.contains('active'),before=cards.map(function(item){return item.getBoundingClientRect();});cards.forEach(function(item){item.classList.remove('active');item.querySelector('.usp-toggle').setAttribute('aria-expanded','false');var panel=item.querySelector('.usp-details');panel.setAttribute('aria-hidden','true');panel.inert=true;});if(!wasActive){card.classList.add('active');toggle.setAttribute('aria-expanded','true');details.setAttribute('aria-hidden','false');details.inert=false;}grid.classList.toggle('is-active',!wasActive);if(reduce||!Element.prototype.animate)return;cards.forEach(function(item,index){var from=before[index],to=item.getBoundingClientRect();if(!from.width||!to.width)return;var dx=from.left-to.left,dy=from.top-to.top;if(Math.abs(dx)+Math.abs(dy)<.01)return;item.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'translate(0,0)'}],{duration:520,easing:'cubic-bezier(.22,1,.36,1)'});});});});})();

/* =====================================================
   3. anonymous-site-script
   ===================================================== */
(function(){var tabs=Array.prototype.slice.call(document.querySelectorAll('#features [role="tab"]')),panels=Array.prototype.slice.call(document.querySelectorAll('#features [role="tabpanel"]'));function activate(index,moveFocus){tabs.forEach(function(tab,i){var selected=i===index;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;panels[i].hidden=!selected;});if(moveFocus)tabs[index].focus();}tabs.forEach(function(tab,index){tab.addEventListener('click',function(){activate(index,false);});/* features-hover-v1 */tab.addEventListener('mouseenter',function(){if(window.matchMedia('(hover:hover) and (pointer:fine)').matches&&tab.getAttribute('aria-selected')!=='true'){activate(index,false);}});tab.addEventListener('keydown',function(event){var next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();activate(next,true);});});})();

/* =====================================================
   4. anonymous-site-script
   ===================================================== */
(function(){var button=document.getElementById('live-chat-toggle'),panel=document.getElementById('chat-placeholder');if(!button||!panel)return;button.addEventListener('click',function(){var open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));panel.hidden=open;});document.addEventListener('click',function(event){if(!button.contains(event.target)&&!panel.contains(event.target)){button.setAttribute('aria-expanded','false');panel.hidden=true;}});document.addEventListener('keydown',function(event){if(event.key==='Escape'){button.setAttribute('aria-expanded','false');panel.hidden=true;}});})();

/* =====================================================
   5. mobile-remediation-v3
   ===================================================== */
(function(){
if(innerWidth>700)return;

function makeDots(track,count){
var d=document.createElement("div");
d.className="mobile-dots";
for(var i=0;i<count;i++){var x=document.createElement("i");if(i===0)x.className="active";d.appendChild(x);}
track.parentNode.insertBefore(d,track.nextSibling);
function sync(){
var cx=track.scrollLeft+track.clientWidth/2,best=0,dist=Infinity;
Array.from(track.children).forEach(function(c,i){var n=Math.abs((c.offsetLeft+c.offsetWidth/2)-cx);if(n<dist){dist=n;best=i;}});
Array.from(d.children).forEach(function(x,i){x.classList.toggle("active",i===best);});
}
track.addEventListener("scroll",function(){requestAnimationFrame(sync)},{passive:true});
}

/* Features */
var features=document.getElementById("features");
if(features){
var panels=Array.from(features.querySelectorAll(".feature-panel"));
if(panels.length>1&&!features.querySelector(".feature-mobile-track")){
var ft=document.createElement("div");
ft.className="feature-mobile-track";
panels[0].parentNode.insertBefore(ft,panels[0]);
panels.forEach(function(p){p.hidden=false;p.removeAttribute("hidden");ft.appendChild(p);});
makeDots(ft,panels.length);
}
}

/* Office */
var office=document.getElementById("office");
if(office&&!office.querySelector(".office-mobile-track")){
var wrap=office.querySelector(".wrap");
var photos=Array.from(office.querySelectorAll(".ph"));
var captions=[
office.querySelector(".office-caption-one"),
office.querySelector(".office-caption-two")
];
if(wrap&&photos.length>=2){
var ot=document.createElement("div");
ot.className="office-mobile-track";
wrap.appendChild(ot);
for(var i=0;i<2;i++){
var slide=document.createElement("div");
slide.className="office-slide";
ot.appendChild(slide);
slide.appendChild(photos[i]);
if(captions[i])slide.appendChild(captions[i]);
}
makeDots(ot,2);
}
}
})();

/* =====================================================
   6. mobile-remediation-v4
   ===================================================== */
(function(){

if(window.innerWidth > 700) return;

/* Add the same live indicator used by the other sliders
   to Recognition & Certifications. */

var track=document.querySelector(".credential-strip");

if(!track) return;
if(track.dataset.mobileDotsV4) return;

var cards=Array.from(track.children).filter(function(el){
  return el.tagName && el.tagName.toLowerCase()==="article";
});

if(cards.length < 2) return;

track.dataset.mobileDotsV4="1";

var dots=document.createElement("div");
dots.className="mobile-dots recognition-mobile-dots";
dots.setAttribute("aria-hidden","true");

cards.forEach(function(card,index){
  var dot=document.createElement("i");
  if(index===0) dot.className="active";
  dots.appendChild(dot);
});

track.parentNode.insertBefore(dots,track.nextSibling);

function updateDots(){

  var centre=track.scrollLeft+(track.clientWidth/2);
  var active=0;
  var closest=Infinity;

  cards.forEach(function(card,index){

    var cardCentre=card.offsetLeft+(card.offsetWidth/2);
    var distance=Math.abs(cardCentre-centre);

    if(distance < closest){
      closest=distance;
      active=index;
    }

  });

  Array.from(dots.children).forEach(function(dot,index){
    dot.classList.toggle("active",index===active);
  });

}

var ticking=false;

track.addEventListener("scroll",function(){

  if(ticking) return;

  ticking=true;

  requestAnimationFrame(function(){
    ticking=false;
    updateDots();
  });

},{passive:true});

updateDots();

})();

/* =====================================================
   7. c7072-pin-gate-v1
   ===================================================== */
(function(){

  var KEY='c7072-preview-access-v1';
  var PIN='122200';

  var gate=document.getElementById('preview-pin-gate');
  var form=document.getElementById('preview-pin-form');
  var input=document.getElementById('preview-pin');
  var error=document.getElementById('pin-error');

  if(!gate||!form||!input)return;

  function unlock(){
    document.documentElement.classList.remove('pin-locked');
    gate.hidden=true;

    try{
      sessionStorage.setItem(KEY,'1');
    }catch(e){}

    window.scrollTo(0,0);
  }

  var unlocked=false;

  try{
    unlocked=sessionStorage.getItem(KEY)==='1';
  }catch(e){}

  if(unlocked){
    unlock();
    return;
  }

  /* pin-flash-fix-v2 */document.documentElement.classList.add('pin-locked');gate.hidden=false;

  requestAnimationFrame(function(){
    input.focus();
  });

  input.addEventListener('input',function(){
    input.value=input.value.replace(/\D/g,'').slice(0,6);
    error.textContent='';
  });

  form.addEventListener('submit',function(e){
    e.preventDefault();

    if(input.value===PIN){
      unlock();
      return;
    }

    error.textContent='Incorrect PIN. Please try again.';
    input.value='';
    input.focus();
  });

})();

/* =====================================================
   8. ecosystem-flow-v3
   ===================================================== */
(function(){

  var flow=document.querySelector('.ecosystem-flow-v3 .eco-flow');
  if(!flow)return;

  var steps=Array.from(flow.querySelectorAll('.eco-flow-step'));
  var detail=flow.querySelector('.eco-flow-detail');
  var number=flow.querySelector('.eco-flow-detail-number');
  var label=flow.querySelector('.eco-flow-detail-label');
  var title=flow.querySelector('.eco-flow-detail h3');
  var copy=flow.querySelector('.eco-flow-detail>div:last-child>p:last-child');
  var progress=flow.querySelector('.eco-flow-progress span');
  var dots=Array.from(flow.querySelectorAll('.eco-flow-dots i'));
  var rail=flow.querySelector('.eco-flow-rail');

  var content=[
    {
      label:'CAPTURE',
      title:'Turn workplace documents into digital information',
      copy:'Apeos C7072 digitises workplace documents so information can move into connected business workflows.'
    },
    {
      label:'UNDERSTAND',
      title:'Prepare information for business use',
      copy:'Classify and organise captured information so teams can find it, understand it and put it to work.'
    },
    {
      label:'CONNECT',
      title:'Link information with the tools your teams use',
      copy:'Connect captured information with cloud services, business applications and shared workflows.'
    },
    {
      label:'AUTOMATE',
      title:'Reduce repetitive document handling',
      copy:'Use connected workflows to reduce manual routing, repeated data handling and routine processing.'
    },
    {
      label:'ACT',
      title:'Move information and decisions forward',
      copy:'Make captured information easier to access, reuse and turn into meaningful business action.'
    }
  ];

  var active=0;
  var timer;

  function select(index,focusStep){

    index=Math.max(0,Math.min(index,steps.length-1));
    active=index;

    steps.forEach(function(step,i){
      var selected=i===index;
      step.classList.toggle('active',selected);
      step.setAttribute('aria-selected',String(selected));
    });

    dots.forEach(function(dot,i){
      dot.classList.toggle('active',i===index);
    });

    flow.dataset.active=String(index);
    progress.style.width=(index/(steps.length-1)*100)+'%';

    detail.classList.add('changing');

    clearTimeout(timer);

    timer=setTimeout(function(){
      number.textContent=String(index+1).padStart(2,'0');
      label.textContent=content[index].label;
      title.textContent=content[index].title;
      copy.textContent=content[index].copy;
      detail.classList.remove('changing');
    },150);

    if(innerWidth<=700){
      steps[index].scrollIntoView({
        behavior:'smooth',
        block:'nearest',
        inline:'center'
      });
    }

    if(focusStep){
      steps[index].focus();
    }
  }

  steps.forEach(function(step,index){

    step.addEventListener('click',function(){
      select(index,false);
    });

    step.addEventListener('keydown',function(event){

      if(event.key==='ArrowRight'){
        event.preventDefault();
        select((index+1)%steps.length,true);
      }

      if(event.key==='ArrowLeft'){
        event.preventDefault();
        select((index-1+steps.length)%steps.length,true);
      }

      if(event.key==='Home'){
        event.preventDefault();
        select(0,true);
      }

      if(event.key==='End'){
        event.preventDefault();
        select(steps.length-1,true);
      }

    });

  });

  var scrollTimer;

  rail.addEventListener('scroll',function(){

    if(innerWidth>700)return;

    clearTimeout(scrollTimer);

    scrollTimer=setTimeout(function(){

      var centre=rail.scrollLeft+(rail.clientWidth/2);
      var closest=0;
      var distance=Infinity;

      steps.forEach(function(step,index){
        var stepCentre=step.offsetLeft+(step.offsetWidth/2);
        var difference=Math.abs(stepCentre-centre);

        if(difference<distance){
          distance=difference;
          closest=index;
        }
      });

      if(closest!==active){
        select(closest,false);
      }

    },100);

  },{passive:true});

  select(0,false);

})();

/* =====================================================
   9. mobile-ux-v7
   ===================================================== */
(function(){

if(window.innerWidth>700)return;

/* ---------------------------------------------------------
   NAV
   Move burger into actual second-row nav-menu
   --------------------------------------------------------- */

var nav=document.querySelector('nav');
var navMenu=nav&&nav.querySelector('.nav-menu');
var burger=nav&&nav.querySelector('.mobile-nav-toggle');
var mobileMenu=nav&&nav.querySelector('.mobile-site-nav');

if(navMenu&&burger){
  navMenu.appendChild(burger);
}

if(navMenu&&mobileMenu){
  navMenu.appendChild(mobileMenu);
}


/* ---------------------------------------------------------
   ECOSYSTEM
   Build swipe cards from the existing verified content
   --------------------------------------------------------- */

var flow=document.querySelector('#ecosystem .eco-flow');
var rail=flow&&flow.querySelector('.eco-flow-rail');
var steps=flow?Array.from(flow.querySelectorAll('.eco-flow-step')):[];

if(!flow||!rail||steps.length<2)return;

var content=[
{
number:'01',
label:'CAPTURE',
title:'Turn workplace documents into digital information',
copy:'Apeos C7072 digitises workplace documents so information can move into connected business workflows.'
},
{
number:'02',
label:'UNDERSTAND',
title:'Prepare information for business use',
copy:'Classify and organise captured information so teams can find it, understand it and put it to work.'
},
{
number:'03',
label:'CONNECT',
title:'Link information with the tools your teams use',
copy:'Connect captured information with cloud services, business applications and shared workflows.'
},
{
number:'04',
label:'AUTOMATE',
title:'Reduce repetitive document handling',
copy:'Use connected workflows to reduce manual routing, repeated data handling and routine processing.'
},
{
number:'05',
label:'ACT',
title:'Move information and decisions forward',
copy:'Make captured information easier to access, reuse and turn into meaningful business action.'
}
];

var cards=flow.querySelector('.eco-mobile-cards');

if(!cards){

  cards=document.createElement('div');
  cards.className='eco-mobile-cards';

  content.forEach(function(item,index){

    var card=document.createElement('article');
    card.className='eco-mobile-card';
    card.dataset.index=String(index);

    var number=document.createElement('div');
    number.className='eco-mobile-card-number';
    number.textContent=item.number;

    var label=document.createElement('p');
    label.className='eco-mobile-card-label';
    label.textContent=item.label;

    var title=document.createElement('h3');
    title.textContent=item.title;

    var copy=document.createElement('p');
    copy.textContent=item.copy;

    card.appendChild(number);
    card.appendChild(label);
    card.appendChild(title);
    card.appendChild(copy);

    cards.appendChild(card);
  });

  rail.insertAdjacentElement('afterend',cards);
}

var cardList=Array.from(cards.children);
var dots=Array.from(flow.querySelectorAll('.eco-flow-dots i'));

function setActive(index,scrollTab){

  index=Math.max(0,Math.min(index,steps.length-1));

  steps.forEach(function(step,i){
    var active=i===index;
    step.classList.toggle('active',active);
    step.setAttribute('aria-selected',String(active));
  });

  dots.forEach(function(dot,i){
    dot.classList.toggle('active',i===index);
  });

  if(scrollTab){
    steps[index].scrollIntoView({
      behavior:'smooth',
      block:'nearest',
      inline:'center'
    });
  }
}

/* Tab click -> matching card */
steps.forEach(function(step,index){

  step.addEventListener('click',function(){

    cardList[index].scrollIntoView({
      behavior:'smooth',
      block:'nearest',
      inline:'start'
    });

    setActive(index,true);
  });

});


/* Card swipe -> matching tab and indicator */
var timer;

cards.addEventListener('scroll',function(){

  clearTimeout(timer);

  timer=setTimeout(function(){

    var centre=cards.scrollLeft+(cards.clientWidth/2);
    var closest=0;
    var distance=Infinity;

    cardList.forEach(function(card,index){

      var cardCentre=card.offsetLeft+(card.offsetWidth/2);
      var d=Math.abs(cardCentre-centre);

      if(d<distance){
        distance=d;
        closest=index;
      }
    });

    setActive(closest,true);

  },80);

},{passive:true});

setActive(0,false);

})();

/* cloud-film-defer-v1 */
(function(){

  var section=document.getElementById('film');
  if(!section)return;

  var video=section.querySelector('video');
  if(!video)return;

  var loaded=false;

  /* Nothing should download before activation. */
  video.preload='none';

  function loadFilm(){

    if(loaded)return;

    var sources=video.querySelectorAll('source[data-src]');

    sources.forEach(function(source){
      source.src=source.dataset.src;
      source.removeAttribute('data-src');
    });

    loaded=true;
    video.preload='metadata';
    video.load();
  }

  if('IntersectionObserver' in window){

    var observer=new IntersectionObserver(function(entries){

      if(entries.some(function(entry){
        return entry.isIntersecting;
      })){
        loadFilm();
        observer.disconnect();
      }

    },{
      rootMargin:'900px 0px'
    });

    observer.observe(section);

  }else{
    loadFilm();
  }

})();

/* mobile-ux-fixes-v5 - externalized from index.html */

(function(){

  if(window.innerWidth>700)return;

  var nav=document.querySelector('nav');
  if(!nav || nav.querySelector('.mobile-nav-toggle'))return;

  var button=document.createElement('button');
  button.type='button';
  button.className='mobile-nav-toggle';
  button.setAttribute('aria-label','Open navigation menu');
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-controls','mobile-site-nav');
  button.innerHTML='<span aria-hidden="true"></span>';

  var panel=document.createElement('div');
  panel.id='mobile-site-nav';
  panel.className='mobile-site-nav';
  panel.hidden=true;

  var wanted=[
    {label:"What's New",href:'#whats-new'},
    {label:'Why Upgrade',href:'#fit'},
    {label:'Explore Apeos',href:'#explore'},
    {label:'Cloud + AI',href:'#film'},
    {label:'Specifications',href:'#specs'}
  ];

  wanted.forEach(function(item){
    var a=document.createElement('a');
    a.href=item.href;
    a.textContent=item.label;
    panel.appendChild(a);
  });

  nav.appendChild(button);
  nav.appendChild(panel);

  function closeMenu(){
    panel.hidden=true;
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-label','Open navigation menu');
  }

  function openMenu(){
    panel.hidden=false;
    button.setAttribute('aria-expanded','true');
    button.setAttribute('aria-label','Close navigation menu');
  }

  button.addEventListener('click',function(event){
    event.stopPropagation();

    if(panel.hidden){
      openMenu();
    }else{
      closeMenu();
    }
  });

  panel.addEventListener('click',function(event){
    if(event.target.closest('a')){
      closeMenu();
    }
  });

  document.addEventListener('click',function(event){
    if(!nav.contains(event.target)){
      closeMenu();
    }
  });

  document.addEventListener('keydown',function(event){
    if(event.key==='Escape'){
      closeMenu();
      button.focus();
    }
  });

})();


/* hero-entrance-v1 */
(function(){var hero=document.querySelector('.hero'),h1=hero&&hero.querySelector('h1'),lead=hero&&hero.querySelector('.lead'),cta=hero&&hero.querySelector('.cta');if(!hero||!h1||h1.dataset.heroEntranceV1)return;h1.dataset.heroEntranceV1='1';var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,words=h1.textContent.trim().split(/\s+/);h1.innerHTML=words.map(function(w){return '<span class="hero-word">'+w+'</span>'}).join(' ');hero.classList.add('hero-entrance-v1');if(reduce){Array.from(h1.children).concat([lead,cta]).filter(Boolean).forEach(function(el){el.style.opacity='1';el.style.filter='none';el.style.transform='none'});return}function start(){var spans=Array.from(h1.querySelectorAll('.hero-word'));spans.forEach(function(span,i){span.animate([{opacity:0,filter:'blur(5px)',transform:'translateY(14px)'},{opacity:1,filter:'blur(0)',transform:'translateY(0)'}],{duration:500,delay:180+(i*125),easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'})});var end=180+((spans.length-1)*125)+500;if(lead)lead.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:end+240,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});if(cta)cta.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:400,delay:end+780,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'})}if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){requestAnimationFrame(start)})}else requestAnimationFrame(start)})();

/* office-expand-production-v1 */
(function(){if(window.innerWidth<=900)return;var office=document.getElementById('office');if(!office)return;var wrap=office.querySelector('.wrap');var photos=Array.from(office.querySelectorAll('.ph')).slice(0,2);var captions=[office.querySelector('.office-caption-one'),office.querySelector('.office-caption-two')];if(!wrap||photos.length!==2)return;var labels=captions.map(function(c,i){return c?c.textContent.trim():(i===0?'With optional finisher':'Open-plan placement')});var gallery=document.createElement('div');gallery.className='office-expand-gallery';photos[0].parentNode.insertBefore(gallery,photos[0]);photos.forEach(function(photo,i){gallery.appendChild(photo);photo.classList.toggle('is-active',i===0);photo.tabIndex=0;photo.setAttribute('role','button');photo.setAttribute('aria-label',labels[i]);var label=document.createElement('span');label.className='office-expand-label';label.textContent=labels[i];photo.appendChild(label);function activate(){photos.forEach(function(item,j){item.classList.toggle('is-active',j===i)});}photo.addEventListener('mouseenter',activate);photo.addEventListener('focus',activate);photo.addEventListener('click',activate);});office.classList.add('office-expand-production-v1');})();

/* connected-support-production-v1 */
(function(){if(window.innerWidth<=900)return;var sections=Array.from(document.querySelectorAll('section'));var section=sections.find(function(s){var h=s.querySelector('h2');return h&&h.textContent.trim()==='Stay ahead of interruptions';});if(!section)return;var titles=['Monitor device health','Keep supplies moving','Resolve common issues faster'];var shortCopy=['Health checks & fault alerts','Automatic consumable delivery','Self Help & Remote Assistance'];var detailCopy=['Internet-connected service can support meter-count verification, device-status monitoring and fault notifications. Services vary by region.','Automatic consumable delivery can reduce the need to manually track routine supply requirements. Services vary by region.','Use Self Help on the control panel, scan the support QR code on a phone, or use Remote Assistance where available.'];var sources=['final-assets/01-Approved-Assets/images/embedded/embedded-image-01.jpg','final-assets/01-Approved-Assets/images/C7072 4.jpg','final-assets/01-Approved-Assets/images/embedded/embedded-image-04.jpg'];var headings=Array.from(section.querySelectorAll('h3')).filter(function(h){return titles.indexOf(h.textContent.trim())!==-1;});if(headings.length!==3)return;var original=headings[0].parentElement.parentElement;original.classList.add('support-production-original');var stage=document.createElement('div');stage.className='support-production-stage';var nav=document.createElement('div');nav.className='support-production-nav';var visual=document.createElement('div');visual.className='support-production-visual';var images=sources.map(function(src,i){var image=document.createElement('img');image.className='support-production-image'+(i===0?' is-active':'');image.src=src;image.alt=titles[i];image.loading='eager';image.decoding='async';visual.appendChild(image);return image;});var overlay=document.createElement('div');overlay.className='support-production-overlay';var kicker=document.createElement('span');kicker.textContent='CONNECTED SUPPORT';var heading=document.createElement('h3');var copy=document.createElement('p');overlay.appendChild(kicker);overlay.appendChild(heading);overlay.appendChild(copy);visual.appendChild(overlay);stage.appendChild(nav);stage.appendChild(visual);original.parentNode.insertBefore(stage,original);var buttons=[];function activate(index,focus){buttons.forEach(function(button,i){button.setAttribute('aria-selected',String(i===index));});images.forEach(function(image,i){image.classList.toggle('is-active',i===index);});heading.textContent=titles[index];copy.textContent=detailCopy[index];if(focus)buttons[index].focus();}titles.forEach(function(title,i){var button=document.createElement('button');button.type='button';button.className='support-production-item';button.setAttribute('aria-selected',String(i===0));button.innerHTML='<span class="support-production-num">0'+(i+1)+'</span><span><strong>'+title+'</strong><small>'+shortCopy[i]+'</small></span>';button.addEventListener('mouseenter',function(){activate(i,false);});button.addEventListener('click',function(){activate(i,false);});button.addEventListener('keydown',function(event){var next=i;if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(i+1)%buttons.length;else if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(i+buttons.length-1)%buttons.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=buttons.length-1;else return;event.preventDefault();activate(next,true);});buttons.push(button);nav.appendChild(button);});activate(0,false);section.classList.add('connected-support-production-v1');})();

/* mobile-production-fixes-v1 */
(function(){if(window.innerWidth>700)return;var nav=document.querySelector('nav');var navMenu=nav&&nav.querySelector('.nav-menu');var burger=nav&&nav.querySelector('.mobile-nav-toggle');var panel=nav&&nav.querySelector('.mobile-site-nav');if(!navMenu||!burger)return;if(burger.parentElement!==navMenu)navMenu.appendChild(burger);if(panel&&panel.parentElement!==navMenu)navMenu.appendChild(panel);})();

/* mobile-hero-fallback-v2-disabled */
(function(){})();

/* mobile-hero-parallax-v4 */
(function(){if(window.innerWidth>700||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;var hero=document.querySelector('.hero2');if(!hero)return;var current=0,target=0,running=false;function frame(){current+=(target-current)*0.12;hero.style.setProperty('--mobile-hero-parallax',current.toFixed(2)+'px');if(Math.abs(target-current)>.1){requestAnimationFrame(frame)}else{current=target;hero.style.setProperty('--mobile-hero-parallax',current.toFixed(2)+'px');running=false}}function update(){target=Math.min(window.scrollY*.38,hero.offsetHeight*.24);if(!running){running=true;requestAnimationFrame(frame)}}window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update,{passive:true});update();})();
/* demo-unified-production-v1 */(function(){var sections=Array.from(document.querySelectorAll("section"));var workplace=sections.find(function(s){var h=s.querySelector("h2");return h&&h.textContent.trim()==="See what Apeos C7072 could change in your workplace";});var request=sections.find(function(s){var h=s.querySelector("h2");return h&&h.textContent.trim()==="Request a demo";});if(!workplace||!request)return;var wrap=workplace.querySelector(".wrap");var campaign=request.querySelector(".campaign");if(!wrap||!campaign)return;var ey=wrap.querySelector(".ey");var heading=wrap.querySelector("h2");var sub=wrap.querySelector(".sub");var layout=document.createElement("div");layout.className="demo-unified-layout";var copy=document.createElement("div");copy.className="demo-unified-copy";var planner=document.createElement("div");planner.className="demo-unified-planner";[ey,heading,sub].forEach(function(el){if(el)copy.appendChild(el);});planner.appendChild(campaign);layout.appendChild(copy);layout.appendChild(planner);Array.from(wrap.children).forEach(function(el){if(el!==layout&&el!==copy&&el!==planner)el.classList.add("demo-unified-hidden");});wrap.appendChild(layout);workplace.classList.add("demo-unified-production-v1");request.hidden=true;})();
/* demo-unified-refine-v3 */
(function(){var root=document.querySelector('.demo-unified-production-v1');if(!root)return;var campaign=root.querySelector('.campaign');if(!campaign)return;var progress=campaign.querySelector('.campaign-progress');if(progress&&!progress.dataset.segmented){progress.dataset.segmented='1';var current=progress.querySelector('span');if(current){for(var i=1;i<5;i++){var segment=document.createElement('span');segment.className='demo-progress-segment';progress.appendChild(segment);}}}function refine(){var steps=Array.from(campaign.querySelectorAll('.campaign-step'));var activeIndex=steps.findIndex(function(step){return !step.hidden&&getComputedStyle(step).display!=='none';});if(activeIndex<0)activeIndex=0;var segments=Array.from(progress?progress.querySelectorAll('span'):[]);segments.forEach(function(segment,i){segment.style.background=i<=activeIndex?'#20c99a':'#cbd7d3';segment.style.width='100%';});var primary=campaign.querySelector('.campaign-step:not([hidden]) .btn.p');if(primary){if(activeIndex<3)primary.textContent='Continue';else if(activeIndex===3)primary.textContent='Review my demo';else primary.textContent='Request my demo';}}var observer=new MutationObserver(refine);observer.observe(campaign,{subtree:true,attributes:true,attributeFilter:['hidden','class','style']});campaign.addEventListener('click',function(){requestAnimationFrame(refine)});refine();})();

/* demo-unified-fixes-v4 */
(function(){var sections=Array.from(document.querySelectorAll('section'));var workplace=sections.find(function(s){var h=s.querySelector('h2');return h&&h.textContent.trim()==='See what Apeos C7072 could change in your workplace';});var request=sections.find(function(s){var h=s.querySelector('h2');return h&&h.textContent.trim()==='Request a demo';});if(!workplace)return;var copy=workplace.querySelector('.demo-unified-copy');var campaign=workplace.querySelector('.campaign');if(!copy||!campaign)return;if(request&&request.id){var targetId=request.id;request.removeAttribute('id');workplace.id=targetId;}else if(!workplace.id){workplace.id='contact';}var nav=document.querySelector('nav');if(nav){var requestLink=Array.from(nav.querySelectorAll('a')).find(function(a){return a.textContent.trim().toLowerCase()==='request a demo';});if(requestLink){requestLink.href='#'+workplace.id;requestLink.addEventListener('click',function(){setTimeout(function(){requestLink.blur();},80);});}}if(!copy.querySelector('.demo-unified-points')){var points=document.createElement('div');points.className='demo-unified-points';['Tailored to your workflow priorities','Suitable for existing-fleet upgrades','Explore Cloud + AI in context'].forEach(function(text){var item=document.createElement('div');item.className='demo-unified-point';item.textContent=text;points.appendChild(item);});copy.appendChild(points);}var steps=Array.from(campaign.querySelectorAll('.campaign-step'));var progress=campaign.querySelector('.campaign-progress');var back=campaign.querySelector('#campaign-back');function sync(){var active=steps.findIndex(function(step){return !step.hidden&&getComputedStyle(step).display!=='none';});if(active<0)active=0;var segments=Array.from(progress?progress.querySelectorAll('span'):[]);segments.forEach(function(segment,i){segment.classList.toggle('is-progress-active',i<=active);segment.style.width='100%';});if(back)back.disabled=active===0;}var observer=new MutationObserver(sync);observer.observe(campaign,{subtree:true,attributes:true,attributeFilter:['hidden','class','style']});campaign.addEventListener('click',function(){requestAnimationFrame(sync);});sync();})();

/* demo-unified-functional-v5 */
(function(){var root=document.querySelector('.demo-unified-production-v1');if(!root)return;var planner=root.querySelector('.demo-unified-planner');var form=document.getElementById('fm');var campaign=root.querySelector('.campaign');if(!planner||!form||!campaign)return;if(campaign.parentElement!==form)form.appendChild(campaign);if(form.parentElement!==planner)planner.appendChild(form);var progress=document.querySelector('.campaign-progress');if(progress){Array.from(progress.querySelectorAll('span')).forEach(function(span){if(span.id!=='campaign-progress')span.remove();});var bar=document.getElementById('campaign-progress');if(bar){bar.className='';bar.style.background='';}}var label=document.getElementById('campaign-label');if(label)label.setAttribute('aria-hidden','true');})();

/* demo-progress-sync-v6 */
(function(){var progress=document.querySelector('.demo-unified-production-v1 .campaign-progress');var bar=document.getElementById('campaign-progress');if(!progress||!bar)return;function sync(){var step=parseInt(progress.getAttribute('aria-valuenow'),10)||1;var total=parseInt(progress.getAttribute('aria-valuemax'),10)||5;bar.style.setProperty('width',((step/total)*100)+'%','important');}new MutationObserver(sync).observe(progress,{attributes:true,attributeFilter:['aria-valuenow']});sync();})();

/* demo-progress-final-v7 */
(function(){var rail=document.querySelector('.demo-unified-production-v1 .campaign-progress');if(!rail)return;function sync(){var step=parseInt(rail.getAttribute('aria-valuenow'),10)||1;step=Math.max(1,Math.min(5,step));rail.style.setProperty('--demo-progress',(step*20)+'%');}new MutationObserver(sync).observe(rail,{attributes:true,attributeFilter:['aria-valuenow']});sync();})();

/* demo-step-scroll-v8 */
(function(){var root=document.querySelector('.demo-unified-production-v1');if(!root)return;var campaign=root.querySelector('.campaign');var count=document.getElementById('campaign-count');if(!campaign||!count)return;var previous=count.textContent.trim();function scrollPlannerTop(){var nav=document.querySelector('nav');var navHeight=nav?nav.getBoundingClientRect().height:0;var top=campaign.getBoundingClientRect().top+window.scrollY-navHeight-16;window.scrollTo({top:Math.max(0,top),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}var observer=new MutationObserver(function(){var current=count.textContent.trim();if(current===previous)return;previous=current;requestAnimationFrame(function(){requestAnimationFrame(scrollPlannerTop);});});observer.observe(count,{childList:true,subtree:true,characterData:true});})();

/* demo-review-polish-v9 */
(function(){var root=document.querySelector('.demo-unified-production-v1');if(!root)return;var steps=Array.from(root.querySelectorAll('.campaign-step'));if(steps.length<5)return;var step=steps[4];function findValue(label){var rows=Array.from(step.querySelectorAll('div,li,p'));var match=rows.find(function(el){return el.children.length>=2&&el.children[0].textContent.trim().toLowerCase()===label.toLowerCase();});if(match&&match.children[1])return match.children[1].textContent.trim();var text=step.innerText;var rx=new RegExp(label+'\\\\s*\\\\n?([^\\\\n]+)','i');var m=text.match(rx);return m?m[1].trim():'';}function build(){if(step.querySelector('.demo-review-polished'))return;var focus=findValue('Demo focus');var office=findValue('Office size');var volume=findValue('Monthly print volume');var timing=findValue('Timing');var name=findValue('Name');var company=findValue('Company');var email=findValue('Work email');var note=findValue('Demo note');if(!focus&&!name)return;var old=Array.from(step.children).filter(function(el){return !el.classList.contains('campaign-actions');});old.forEach(function(el){el.style.display='none';});var review=document.createElement('div');review.className='demo-review-polished';function item(label,value,cls){return '<div class="demo-review-item '+(cls||'')+'"><span>'+label+'</span><strong>'+value+'</strong></div>';}var person=name+(company&&company!=='None added'?' · '+company:'');var noteEmpty=!note||/^none added$/i.test(note);review.innerHTML='<p class="demo-review-ey">YOUR DEMO PLAN</p><h3>Your demo game plan is ready'+(name?', '+name:'')+'.</h3><p class="demo-review-note">Prototype preview. Nothing has been sent or saved.</p><div class="demo-review-group"><p class="demo-review-group-title">YOUR DEMO</p>'+item('Demo focus',focus)+item('Workplace',[office,volume].filter(Boolean).join(' · '))+item('Timing',timing)+'</div><div class="demo-review-group"><p class="demo-review-group-title">YOUR DETAILS</p>'+item('Contact',person,'demo-review-person')+item('Work email',email,'demo-review-email')+item('Demo note',noteEmpty?'No additional notes':note,noteEmpty?'demo-review-muted':'')+'</div>';var actions=step.querySelector('.campaign-actions');step.insertBefore(review,actions||null);}var observer=new MutationObserver(function(){if(!step.hidden)requestAnimationFrame(build);});observer.observe(step,{attributes:true,attributeFilter:['hidden','style','class']});if(!step.hidden)build();})();


/* spec-notes-position-fix-v1 */
(function(){var demo=document.querySelector('.demo-unified-production-v1');if(!demo)return;var nodes=Array.from(document.querySelectorAll('body *'));var terms=nodes.find(function(el){return el.children.length===0&&el.textContent.trim().indexOf('Specification terms:')===0;});if(!terms)return;var container=terms.parentElement;if(!container)return;var text=container.textContent||'';if(text.indexOf('Specification terms:')===-1||text.indexOf('*1')===-1)return;demo.parentNode.insertBefore(container,demo);})();

/* ecosystem-cards-production-v1 */
(function(){var section=document.querySelector('.ecosystem-flow-v3');if(!section)return;var wrap=section.querySelector('.wrap');var oldFlow=section.querySelector('.eco-flow');if(!wrap||!oldFlow||section.querySelector('.eco-card-grid'))return;var heading=wrap.querySelector('h2');var sub=wrap.querySelector('.sub');if(heading)heading.innerHTML='One sheet of paper.<br>Five steps to action.';if(sub)sub.textContent='See how a document moves from capture to organised information, connected workflows and business action.';var data=[['01','DIGITISE','Paper becomes data.','Capture documents at up to 300 ppm and bring workplace information into digital workflows.'],['02','ORGANISE','Information, structured.','Recognise, classify and organise captured information so it is easier to find, reuse and prepare for AI.'],['03','CONNECT','Into the cloud.','Connect organised information with cloud services, business applications and shared workflows.'],['04','AUTOMATE','Less manual handling.','Route information through connected workflows and reduce repetitive document processing.'],['05','ACT','Put information to work.','Make organisational information easier to use in AI applications and business processes.']];var grid=document.createElement('div');grid.className='eco-card-grid';data.forEach(function(item,index){var card=document.createElement('article');card.className='eco-card';card.innerHTML='<span class="eco-card-num">'+item[0]+'</span><span class="eco-card-line" aria-hidden="true"></span><p class="eco-card-stage">'+item[1]+'</p><h3>'+item[2]+'</h3><p>'+item[3]+'</p>';grid.appendChild(card);});oldFlow.after(grid);section.classList.add('ecosystem-cards-production-v1');})();

/* ecosystem-headline-final-v3 */
(function(){var section=document.querySelector('.ecosystem-cards-production-v1');if(!section)return;var heading=section.querySelector('.wrap h2');var sub=section.querySelector('.wrap .sub');if(heading)heading.textContent='Turn workplace information into knowledge your business can use.';if(sub)sub.textContent='Digitise, organise and connect information through Cloud + AI, helping teams reduce manual work and put organisational knowledge to better use.';})();

/* cloud-ai-film-band-v2 */
(function(){var sections=Array.from(document.querySelectorAll('section'));var section=sections.find(function(sec){var ey=sec.querySelector('.ey');return ey&&ey.textContent.trim().toLowerCase()==='cloud + ai in action';});if(!section)return;var heading=section.querySelector('h2');var sub=section.querySelector('.sub');if(heading)heading.textContent='See it in action.';if(sub)sub.textContent='Watch information move from capture into a connected workflow.';section.classList.add('cloud-ai-film-band-v2');})();

/* hero-kinetic-v1 */
(function(){var hero=document.querySelector('.hero-kinetic-v1');var canvas=hero&&hero.querySelector('.hero-kinetic-canvas');if(!hero||!canvas||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;var ctx=canvas.getContext('2d');if(!ctx)return;var dpr=Math.min(window.devicePixelRatio||1,1.5),w=0,h=0,points=[],mx=-9999,my=-9999,tx=-9999,ty=-9999,raf=0,last=0;function resize(){var r=hero.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);build();}function build(){points=[];var spacing=w<700?58:48;var startX=w<900?0:w*.31;for(var y=spacing*.65;y<h;y+=spacing){for(var x=startX+spacing*.45;x<w;x+=spacing){points.push({x:x,y:y,bx:x,by:y});}}}function pointer(e){var r=hero.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;}function leave(){tx=-9999;ty=-9999;}function draw(t){raf=requestAnimationFrame(draw);if(document.hidden)return;if(t-last<16)return;last=t;mx+=(tx-mx)*.105;my+=(ty-my)*.105;ctx.clearRect(0,0,w,h);var radius=w<700?135:280;points.forEach(function(p){var dx=mx-p.bx,dy=my-p.by,dist=Math.sqrt(dx*dx+dy*dy),force=dist<radius?(1-dist/radius):0;var nx=dist?dx/dist:0,ny=dist?dy/dist:0;var shift=force*26;p.x+=(p.bx+nx*shift-p.x)*.11;p.y+=(p.by+ny*shift-p.y)*.11;});ctx.lineWidth=.7;for(var i=0;i<points.length;i++){var a=points[i];for(var k=i+1;k<points.length;k++){var b=points[k],dx=a.x-b.x,dy=a.y-b.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<69){var alpha=(1-dist/69)*.18;ctx.strokeStyle='rgba(1,145,109,'+alpha.toFixed(3)+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}}points.forEach(function(p){var dx=mx-p.x,dy=my-p.y,dist=Math.sqrt(dx*dx+dy*dy),near=dist<radius?1-dist/radius:0;ctx.fillStyle='rgba(1,145,109,'+(0.20+near*.24).toFixed(3)+')';ctx.beginPath();ctx.arc(p.x,p.y,1.25+near*.65,0,Math.PI*2);ctx.fill();});}hero.addEventListener('pointermove',pointer,{passive:true});hero.addEventListener('pointerleave',leave,{passive:true});window.addEventListener('resize',resize,{passive:true});resize();raf=requestAnimationFrame(draw);})();

/* hero-kinetic-v2 */

/* hero-field-polish-v6 */

/* hero-kinetic-mobile-loop-v10 */
(function(){if(window.innerWidth>700||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;var hero=document.querySelector('.hero-kinetic-v1');var canvas=hero&&hero.querySelector('.hero-kinetic-canvas');if(!hero||!canvas)return;var phase=0,running=true,start=performance.now();function loop(now){if(!running)return;phase=(now-start)/1000;var x=58+Math.sin(phase*.72)*18;var y=61+Math.sin(phase*.54+1.2)*15;canvas.style.setProperty('--mobile-flow-x',x+'%');canvas.style.setProperty('--mobile-flow-y',y+'%');canvas.style.filter='drop-shadow(0 0 '+(3+Math.sin(phase*.9)*1.5)+'px rgba(1,145,109,.14))';canvas.style.opacity=(.42+Math.sin(phase*.82)*.10).toFixed(3);requestAnimationFrame(loop);}var observer=new IntersectionObserver(function(entries){running=entries[0]&&entries[0].isIntersecting;if(running){start=performance.now()-phase*1000;requestAnimationFrame(loop);}},{threshold:.05});observer.observe(hero);requestAnimationFrame(loop);})();

/* hero-origin-glow-border-v14 */
(function(){if(window.innerWidth>700)return;var product=document.querySelector('.hero-redesign-v1 .hero-product');if(!product||product.querySelector('.hero-origin-glow-border'))return;var glow=document.createElement('span');glow.className='hero-origin-glow-border';glow.setAttribute('aria-hidden','true');product.insertBefore(glow,product.firstChild);})();

/* hero-product-silhouette-pulse-v15 */
(function(){if(window.innerWidth>700)return;var product=document.querySelector('.hero-redesign-v1 .hero-product');var image=product&&product.querySelector('img:not(.hero-product-silhouette-glow)');if(!product||!image||product.querySelector('.hero-product-silhouette-glow'))return;var glow=image.cloneNode(false);glow.className='hero-product-silhouette-glow';glow.alt='';glow.setAttribute('aria-hidden','true');product.insertBefore(glow,image);})();

/* page-reload-top-v1 */
(function(){if('scrollRestoration' in history){history.scrollRestoration='manual';}if(!location.hash){window.addEventListener('pageshow',function(e){if(e.persisted||performance.getEntriesByType('navigation')[0]?.type==='reload'){window.scrollTo(0,0);}});}})();
