/*
 * Apeos C7072 landing page
 * Stable non-3D site interactions
 * Three.js, Explore, hotspots and printer animation remain in index.html.
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
(function(){var tabs=Array.prototype.slice.call(document.querySelectorAll('#features [role="tab"]')),panels=Array.prototype.slice.call(document.querySelectorAll('#features [role="tabpanel"]'));function activate(index,moveFocus){tabs.forEach(function(tab,i){var selected=i===index;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;panels[i].hidden=!selected;});if(moveFocus)tabs[index].focus();}tabs.forEach(function(tab,index){tab.addEventListener('click',function(){activate(index,false);});tab.addEventListener('keydown',function(event){var next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();activate(next,true);});});})();

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

