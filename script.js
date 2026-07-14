
// Editing-suite timeline preloader
(function(){
  const preloader=document.getElementById('preloader');
  if(!preloader){document.body.classList.remove('is-loading');return}
  const count=preloader.querySelector('.preloader-count');
  const playhead=preloader.querySelector('.playhead');
  const timelineProgress=preloader.querySelector('.timeline-progress');
  const timecode=preloader.querySelector('.edit-timecode');
  const previewBrand=preloader.querySelector('.preview-brand');
  const status=preloader.querySelector('.timeline-status');
  const heroVideo=document.querySelector('.hero-video-mono');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let progress=0,finished=false;
  const started=performance.now();
  const frameRate=25;

  const formatTimecode=value=>{
    const totalFrames=Math.round(value/100*10*frameRate);
    const seconds=Math.floor(totalFrames/frameRate);
    const frames=totalFrames%frameRate;
    return `00:00:${String(seconds).padStart(2,'0')}:${String(frames).padStart(2,'0')}`;
  };

  const setProgress=value=>{
    progress=Math.max(progress,Math.min(100,value));
    const rounded=Math.round(progress);
    count.textContent=`${String(rounded).padStart(2,'0')}%`;
    playhead.style.transform=`translateX(calc(${progress}% - 1px))`;
    timelineProgress.style.width=`${progress}%`;
    timecode.textContent=formatTimecode(progress);
    previewBrand.style.clipPath=`inset(0 ${100-progress}% 0 0)`;
    if(progress>8)previewBrand.classList.add('is-building');
    status.textContent=progress<35?'LOADING MEDIA':progress<72?'BUILDING SEQUENCE':progress<96?'RENDERING PREVIEW':'READY';
  };

  const finish=()=>{
    if(finished)return;
    finished=true;
    setProgress(100);
    document.body.classList.add('preloader-reveal');
    if(reduce){
      preloader.remove();
      document.body.classList.remove('is-loading');
      return;
    }
    setTimeout(()=>preloader.classList.add('is-glitching'),160);
    setTimeout(()=>preloader.classList.add('is-finishing'),520);
    setTimeout(()=>preloader.classList.add('is-leaving'),980);
    setTimeout(()=>{
      preloader.remove();
      document.body.classList.remove('is-loading');
    },2050);
  };

  const timer=setInterval(()=>{
    const elapsed=performance.now()-started;
    const ceiling=heroVideo&&heroVideo.readyState>=3?97:elapsed>1900?92:84;
    const step=progress<28?Math.random()*6+3:progress<70?Math.random()*3.2+1.1:Math.random()*1.25+.35;
    setProgress(Math.min(ceiling,progress+step));
    if(elapsed>2850)finish();
  },85);

  const ready=()=>{
    const minimum=Math.max(0,1500-(performance.now()-started));
    setTimeout(()=>{clearInterval(timer);finish()},minimum);
  };
  if(heroVideo){
    if(heroVideo.readyState>=3)ready();
    else heroVideo.addEventListener('canplay',ready,{once:true});
  }
  window.addEventListener('load',()=>setTimeout(ready,180),{once:true});
  setTimeout(()=>{clearInterval(timer);finish()},4600);
})();

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
const menu=document.querySelector('.menu-button'),nav=document.querySelector('.nav');
function setMenu(open){nav.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню')}
menu.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
const progress=document.querySelector('.scroll-progress');function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${max>0?scrollY/max*100:0}%`}addEventListener('scroll',updateProgress,{passive:true});updateProgress();
const hero=document.querySelector('[data-color-reveal]');if(hero&&matchMedia('(pointer:fine)').matches){let revealFrame=0,targetX=0,targetY=0,currentX=0,currentY=0;const paintReveal=()=>{currentX+=(targetX-currentX)*.2;currentY+=(targetY-currentY)*.2;hero.style.setProperty('--mx',`${currentX}px`);hero.style.setProperty('--my',`${currentY}px`);if(Math.abs(targetX-currentX)>.2||Math.abs(targetY-currentY)>.2)revealFrame=requestAnimationFrame(paintReveal);else revealFrame=0};hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();targetX=e.clientX-r.left;targetY=e.clientY-r.top;if(!currentX&&!currentY){currentX=targetX;currentY=targetY}hero.style.setProperty('--reveal-opacity','1');if(!revealFrame)revealFrame=requestAnimationFrame(paintReveal)});hero.addEventListener('pointerleave',()=>hero.style.setProperty('--reveal-opacity','0'));hero.addEventListener('pointerenter',()=>hero.style.setProperty('--reveal-opacity','1'))}
const heroMono=document.querySelector('.hero-video-mono'),heroColor=document.querySelector('.hero-video-color');if(heroMono&&heroColor){const syncHeroVideos=()=>{if(Math.abs(heroMono.currentTime-heroColor.currentTime)>.09)heroColor.currentTime=heroMono.currentTime;if(heroMono.paused){heroColor.pause()}else if(heroColor.paused){heroColor.play().catch(()=>{})}};heroMono.addEventListener('play',syncHeroVideos);heroMono.addEventListener('seeking',syncHeroVideos);heroMono.addEventListener('timeupdate',syncHeroVideos);heroColor.addEventListener('loadedmetadata',syncHeroVideos)}
const dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring');if(matchMedia('(pointer:fine)').matches){let mx=0,my=0,rx=0,ry=0;addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=`${mx}px`;dot.style.top=`${my}px`});function animateCursor(){rx+=(mx-rx)*.14;ry+=(my-ry)*.14;ring.style.left=`${rx}px`;ring.style.top=`${ry}px`;requestAnimationFrame(animateCursor)}animateCursor();document.querySelectorAll('.project-cover,.hero-reel').forEach(el=>{el.addEventListener('pointerenter',()=>ring.classList.add('is-project'));el.addEventListener('pointerleave',()=>ring.classList.remove('is-project'))});document.querySelectorAll('a,button:not(.project-cover):not(.hero-reel)').forEach(el=>{el.addEventListener('pointerenter',()=>ring.classList.add('is-link'));el.addEventListener('pointerleave',()=>ring.classList.remove('is-link'))});document.documentElement.addEventListener('mouseleave',()=>{dot.classList.add('cursor-hidden');ring.classList.add('cursor-hidden')});document.documentElement.addEventListener('mouseenter',()=>{dot.classList.remove('cursor-hidden');ring.classList.remove('cursor-hidden')})}
const modal=document.querySelector('.video-modal'),player=modal.querySelector('video'),modalTitle=modal.querySelector('.modal-title');function closeModal(){player.pause();modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');setTimeout(()=>{player.removeAttribute('src');player.load()},450)}
function openVideo(btn){const source=btn.querySelector('img')||document.querySelector('.hero-video-mono');if(source&&btn.classList.contains('project-cover')){const rect=source.getBoundingClientRect(),clone=source.cloneNode();clone.className='transition-clone';Object.assign(clone.style,{left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`});document.body.appendChild(clone);requestAnimationFrame(()=>{const targetW=Math.min(innerWidth*.82,1180),targetH=Math.min(innerHeight*.72,targetW*9/16);clone.style.left=`${(innerWidth-targetW)/2}px`;clone.style.top=`${(innerHeight-targetH)/2}px`;clone.style.width=`${targetW}px`;clone.style.height=`${targetH}px`;clone.style.opacity='.25';clone.style.filter='grayscale(1) blur(3px)'});setTimeout(()=>clone.remove(),900)}modalTitle.textContent=btn.dataset.title;player.src=btn.dataset.video;setTimeout(()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');player.play().catch(()=>{})},btn.classList.contains('project-cover')?420:0)}
document.querySelectorAll('.open-video').forEach(btn=>btn.addEventListener('click',()=>openVideo(btn)));modal.querySelector('.modal-backdrop').addEventListener('click',closeModal);modal.querySelector('.modal-close').addEventListener('click',closeModal);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});


// Editing-suite section transitions — target-first preview, smooth timeline release
const editorTransition=document.querySelector('#editorTransition');
const transitionPreview=document.querySelector('#transitionPreview');
const transitionPlayhead=editorTransition?.querySelector('.transition-playhead');
const transitionGlow=editorTransition?.querySelector('.transition-timeline-glow');
const transitionTimecode=editorTransition?.querySelector('.transition-timecode');
const transitionSequence=editorTransition?.querySelector('.transition-sequence-name');
const transitionTargetLabel=editorTransition?.querySelector('.transition-target-label');
const transitionState=editorTransition?.querySelector('.transition-state');
let sectionTransitionBusy=false;
const transitionSections=[
  {hash:'#top',name:'HOME',position:7},
  {hash:'#work',name:'WORK',position:28},
  {hash:'#map',name:'MAP',position:49},
  {hash:'#about',name:'ABOUT',position:70},
  {hash:'#contact',name:'CONTACT',position:91}
];
function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
function closestTransitionSection(){
  const y=scrollY+innerHeight*.45;
  let result=transitionSections[0];
  transitionSections.forEach(item=>{const el=document.querySelector(item.hash);if(el&&el.offsetTop<=y)result=item});
  return result;
}
function timelineTimecode(position){
  const totalFrames=Math.round(position/100*20*25);
  const seconds=Math.floor(totalFrames/25),frames=totalFrames%25;
  return `00:00:${String(seconds).padStart(2,'0')}:${String(frames).padStart(2,'0')}`;
}
function makePageCapture(scrollOffset,extraClass=''){
  const capture=document.createElement('div');capture.className=`transition-capture ${extraClass}`.trim();
  const inner=document.createElement('div');inner.className='transition-capture-inner';
  const headerClone=document.querySelector('.header')?.cloneNode(true);
  const mainClone=document.querySelector('main')?.cloneNode(true);
  const footerClone=document.querySelector('footer')?.cloneNode(true);
  if(headerClone){headerClone.style.position='absolute';headerClone.style.top=`${scrollOffset}px`;inner.appendChild(headerClone)}
  if(mainClone)inner.appendChild(mainClone);
  if(footerClone)inner.appendChild(footerClone);
  inner.style.transform=`translateY(${-scrollOffset}px)`;
  capture.appendChild(inner);document.body.appendChild(capture);return {capture,inner};
}
function placeCaptureInPreview(capture,rect){
  Object.assign(capture.style,{left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,borderRadius:'2px'});
}
function animatePlayhead(from,to,duration){
  if(!transitionPlayhead||!transitionGlow)return Promise.resolve();
  transitionPlayhead.getAnimations().forEach(animation=>animation.cancel());
  transitionGlow.getAnimations().forEach(animation=>animation.cancel());
  const head=transitionPlayhead.animate([{left:`${from}%`},{left:`${to}%`}],{duration,easing:'cubic-bezier(.16,.76,.22,1)',fill:'forwards'});
  const glow=transitionGlow.animate([{width:`${from}%`},{width:`${to}%`}],{duration,easing:'cubic-bezier(.16,.76,.22,1)',fill:'forwards'});
  const started=performance.now();
  const tick=now=>{const p=Math.min(1,(now-started)/duration),smooth=1-Math.pow(1-p,3),v=from+(to-from)*smooth;if(transitionTimecode)transitionTimecode.textContent=timelineTimecode(v);if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);
  return Promise.all([head.finished.catch(()=>{}),glow.finished.catch(()=>{})]).then(()=>{
    transitionPlayhead.style.left=`${to}%`;transitionGlow.style.width=`${to}%`;
  });
}
function animatePreviewScroll(inner,fromScroll,toScroll,duration){
  if(!inner)return Promise.resolve();
  inner.getAnimations().forEach(animation=>animation.cancel());
  const distance=Math.abs(toScroll-fromScroll);
  if(distance<2){inner.style.transform=`translateY(${-toScroll}px)`;return Promise.resolve()}
  const scrollAnimation=inner.animate([
    {transform:`translateY(${-fromScroll}px)`},
    {transform:`translateY(${-toScroll}px)`}
  ],{duration,easing:'cubic-bezier(.16,.76,.22,1)',fill:'forwards'});
  return scrollAnimation.finished.catch(()=>{}).then(()=>{inner.style.transform=`translateY(${-toScroll}px)`});
}
async function goToSection(hash){
  const target=document.querySelector(hash);if(!target||sectionTransitionBusy)return;
  if(matchMedia('(max-width: 700px)').matches){setMenu(false);target.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'',hash);return}
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!editorTransition||!transitionPreview){target.scrollIntoView({behavior:'smooth'});return}
  sectionTransitionBusy=true;document.body.classList.add('is-section-transitioning');
  const from=closestTransitionSection();const to=transitionSections.find(item=>item.hash===hash)||from;
  transitionSequence.textContent=`SEQUENCE / ${to.name}`;
  transitionTargetLabel.textContent=`${from.name} → ${to.name}`;
  transitionState.textContent='CAPTURING';

  const oldScroll=scrollY;
  const {capture:sourceCapture}=makePageCapture(oldScroll,'is-source');
  editorTransition.classList.remove('is-releasing','is-finishing');
  editorTransition.classList.add('is-active');editorTransition.setAttribute('aria-hidden','false');
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));

  const previewRect=transitionPreview.getBoundingClientRect();
  const shrink=sourceCapture.animate([
    {left:'0px',top:'0px',width:`${innerWidth}px`,height:`${innerHeight}px`,borderRadius:'0px'},
    {left:`${previewRect.left}px`,top:`${previewRect.top}px`,width:`${previewRect.width}px`,height:`${previewRect.height}px`,borderRadius:'2px'}
  ],{duration:680,easing:'cubic-bezier(.76,0,.18,1)',fill:'forwards'});
  await shrink.finished.catch(()=>{});
  placeCaptureInPreview(sourceCapture,previewRect);

  // Build a second capture at the current scroll position. It will scrub inside
  // the Program Monitor to the destination while the playhead moves.
  const maxScroll=Math.max(0,document.documentElement.scrollHeight-innerHeight);
  const targetScroll=Math.max(0,Math.min(target.offsetTop,maxScroll));
  const {capture:targetCapture,inner:targetInner}=makePageCapture(oldScroll,'is-target');
  placeCaptureInPreview(targetCapture,previewRect);
  targetCapture.style.opacity='0';
  targetCapture.style.zIndex='912';
  sourceCapture.style.zIndex='911';

  transitionState.textContent='LOADING NEXT CLIP';
  const previewSwap=targetCapture.animate([{opacity:0,filter:'brightness(.55)'},{opacity:1,filter:'brightness(1)'}],{duration:330,easing:'ease-out',fill:'forwards'});
  const sourceFade=sourceCapture.animate([{opacity:1},{opacity:0}],{duration:260,easing:'ease-in',fill:'forwards'});
  await Promise.all([previewSwap.finished.catch(()=>{}),sourceFade.finished.catch(()=>{})]);
  sourceCapture.remove();
  targetCapture.style.opacity='1';targetCapture.style.filter='none';

  // Scrub the mini-page to the requested section in sync with the timeline.
  transitionState.textContent='SCRUBBING TO TARGET';
  const scrubDuration=1120;
  await Promise.all([
    animatePlayhead(from.position,to.position,scrubDuration),
    animatePreviewScroll(targetInner,oldScroll,targetScroll,scrubDuration)
  ]);

  // Update the real page only after the requested object is already visible
  // in the Program Monitor, preventing a flash behind the editor UI.
  window.scrollTo({top:targetScroll,left:0,behavior:'auto'});
  history.replaceState(null,'',hash);
  transitionState.textContent='TARGET LOCKED';
  await wait(120);

  // Timeline/chrome leave smoothly while the destination expands from the monitor.
  transitionState.textContent='OUTPUT';
  editorTransition.classList.add('is-releasing');
  const expand=targetCapture.animate([
    {left:`${previewRect.left}px`,top:`${previewRect.top}px`,width:`${previewRect.width}px`,height:`${previewRect.height}px`,borderRadius:'2px'},
    {left:'0px',top:'0px',width:`${innerWidth}px`,height:`${innerHeight}px`,borderRadius:'0px'}
  ],{duration:760,easing:'cubic-bezier(.76,0,.18,1)',fill:'forwards'});
  await expand.finished.catch(()=>{});
  targetCapture.style.boxShadow='none';
  editorTransition.classList.add('is-finishing');
  await wait(190);
  targetCapture.animate([{opacity:1},{opacity:0}],{duration:180,easing:'ease-out',fill:'forwards'});
  await wait(190);
  targetCapture.remove();
  editorTransition.classList.remove('is-active','is-releasing','is-finishing');
  editorTransition.setAttribute('aria-hidden','true');
  document.body.classList.remove('is-section-transitioning');
  sectionTransitionBusy=false;
}
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',event=>{
    const hash=link.getAttribute('href');if(!hash||hash==='#')return;
    event.preventDefault();nav.classList.remove('open');document.body.style.overflow='';goToSection(hash);
  });
});

// Small parallax for project covers
if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.project-cover').forEach(card=>{
    const image=card.querySelector('img');
    card.addEventListener('pointermove',event=>{
      const r=card.getBoundingClientRect();
      const x=(event.clientX-r.left)/r.width-.5;
      const y=(event.clientY-r.top)/r.height-.5;
      image.style.transform=`scale(1.045) translate(${x*-8}px,${y*-8}px)`;
    });
    card.addEventListener('pointerleave',()=>{image.style.transform=''});
  });
}


// Interactive project geography map
(function(){
  const root=document.querySelector('[data-map]');
  if(!root)return;
  const tooltip=root.querySelector('.map-tooltip');
  const tooltipText=tooltip.querySelector('span');
  const paths=[...root.querySelectorAll('.map-country')];
  const buttons=[...document.querySelectorAll('.map-country-button')];
  const story={
    index:document.querySelector('.map-index'), code:document.querySelector('.map-country-code'),
    title:document.querySelector('.map-country-title'), description:document.querySelector('.map-country-description'),
    tags:document.querySelector('.map-country-tags')
  };
  const countries={
    RUS:{index:'01',code:'RUS / PROJECTS',title:'Россия',description:'Государственные и коммерческие проекты, монтаж, продюсирование полного цикла и AI-контент.',tags:['PRODUCTION','EDITING','AI CONTENT']},
    ARE:{index:'02',code:'UAE / PROJECTS',title:'ОАЭ',description:'Коммерческий digital-контент и визуальные решения для международных брендов.',tags:['COMMERCIAL','DIGITAL','AI VISUALS']},
    USA:{index:'03',code:'USA / PROJECTS',title:'США',description:'Удалённый постпродакшн, монтаж и адаптация контента для digital-площадок.',tags:['POST','EDITING','REMOTE']},
    UKR:{index:'04',code:'UKR / PROJECTS',title:'Украина',description:'Монтаж, драматургия и финальная сборка видеоматериалов для авторских проектов.',tags:['EDITING','STORY','DELIVERY']},
    BLR:{index:'05',code:'BLR / PROJECTS',title:'Беларусь',description:'Постпродакшн, графика и подготовка материалов к публикации.',tags:['POST','MOTION','DELIVERY']},
    KAZ:{index:'06',code:'KAZ / PROJECTS',title:'Казахстан',description:'Контент для социальных сетей, адаптация форматов и монтаж роликов.',tags:['SOCIAL','EDITING','CONTENT']},
    JPN:{index:'07',code:'JPN / PROJECTS',title:'Япония',description:'Креативные форматы, AI-визуал и motion-дизайн.',tags:['AI CONTENT','MOTION','CREATIVE']},
    CHN:{index:'08',code:'CHN / PROJECTS',title:'Китай',description:'Digital-контент, монтаж и адаптация материалов для мобильных площадок.',tags:['DIGITAL','EDITING','LOCALIZATION']},
    POL:{index:'09',code:'POL / PROJECTS',title:'Польша',description:'Коммерческие и авторские проекты, монтаж и постпродакшн.',tags:['COMMERCIAL','POST','CONTENT']},
    DEU:{index:'10',code:'DEU / PROJECTS',title:'Германия',description:'Коммерческий контент с акцентом на точность и качество производства.',tags:['COMMERCIAL','PRODUCTION','EDITING']},
    FRA:{index:'11',code:'FRA / PROJECTS',title:'Франция',description:'Имиджевые и креативные видеоформаты с акцентом на стиль и атмосферу.',tags:['IMAGE FILM','CREATIVE','STYLE']}
  };
  const allowed=new Set(Object.keys(countries));
  let active='RUS';
  paths.forEach(path=>{
    const enabled=allowed.has(path.dataset.iso);
    path.classList.toggle('is-worked',enabled);
    path.classList.toggle('is-disabled',!enabled);
    path.setAttribute('aria-disabled',String(!enabled));
  });
  function render(iso){
    const data=countries[iso];if(!data)return;
    active=iso;
    story.index.textContent=data.index;story.code.textContent=data.code;
    story.title.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,easing:'cubic-bezier(.16,.8,.2,1)'});
    story.title.textContent=data.title;story.description.textContent=data.description;
    story.tags.innerHTML=data.tags.map(tag=>`<span>${tag}</span>`).join('');
    paths.forEach(path=>path.classList.toggle('is-active',path.dataset.iso===iso));
    buttons.forEach(button=>button.classList.toggle('active',button.dataset.country===iso));
  }
  paths.forEach(path=>{
    const iso=path.dataset.iso;
    if(!allowed.has(iso)) return;
    path.addEventListener('pointerenter',()=>{
      path.classList.add('is-hovered');root.classList.add('has-hover');
      tooltipText.textContent=countries[iso].title;tooltip.classList.add('visible');render(iso);
    });
    path.addEventListener('pointermove',event=>{const r=root.getBoundingClientRect();tooltip.style.left=`${event.clientX-r.left}px`;tooltip.style.top=`${event.clientY-r.top}px`;});
    path.addEventListener('pointerleave',()=>{path.classList.remove('is-hovered');root.classList.remove('has-hover');tooltip.classList.remove('visible');render(active);});
    path.addEventListener('click',()=>render(iso));
  });
  buttons.forEach(button=>{button.addEventListener('pointerenter',()=>render(button.dataset.country));button.addEventListener('click',()=>render(button.dataset.country));});
  render(active);
})();
