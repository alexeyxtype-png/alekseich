
// Minimal BURLOV preloader — no progress, no grain
(function(){
  const preloader=document.getElementById('preloader');
  if(!preloader){document.body.classList.remove('is-loading');return}
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal=()=>{
    document.body.classList.add('preloader-reveal');
    if(reduce){
      preloader.remove();
      document.body.classList.remove('is-loading');
      return;
    }
    preloader.classList.add('is-ready');
    setTimeout(()=>preloader.classList.add('is-leaving'),520);
    setTimeout(()=>{
      preloader.remove();
      document.body.classList.remove('is-loading');
    },1350);
  };
  if(document.readyState==='complete')setTimeout(reveal,450);
  else window.addEventListener('load',()=>setTimeout(reveal,450),{once:true});
  setTimeout(reveal,1800);
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


// Minimal BURLOV section transitions
const brandTransition=document.querySelector('#brandTransition');
let sectionTransitionBusy=false;
function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
async function goToSection(hash){
  const target=document.querySelector(hash);
  if(!target||sectionTransitionBusy)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||innerWidth<760){
    history.replaceState(null,'',hash);
    target.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  sectionTransitionBusy=true;
  document.body.classList.add('is-section-transitioning');
  brandTransition?.classList.remove('is-leaving');
  brandTransition?.classList.add('is-active');
  brandTransition?.setAttribute('aria-hidden','false');
  await wait(480);
  const top=Math.max(0,target.offsetTop);
  window.scrollTo({top,left:0,behavior:'auto'});
  history.replaceState(null,'',hash);
  await wait(120);
  brandTransition?.classList.add('is-leaving');
  await wait(620);
  brandTransition?.classList.remove('is-active','is-leaving');
  brandTransition?.setAttribute('aria-hidden','true');
  document.body.classList.remove('is-section-transitioning');
  sectionTransitionBusy=false;
}
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',event=>{
    const hash=link.getAttribute('href');if(!hash||hash==='#')return;
    event.preventDefault();setMenu(false);goToSection(hash);
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
    RUS:{index:'01',code:'RUS / ПРОЕКТЫ',title:'Россия',description:'Музыкальные клипы, коммерческие проекты и digital-контент — от идеи до финального выпуска.',tags:['МУЗЫКАЛЬНЫЕ КЛИПЫ','КОММЕРЧЕСКИЙ КОНТЕНТ','DIGITAL']},
    ARE:{index:'02',code:'UAE / ПРОЕКТЫ',title:'ОАЭ',description:'Контент для бизнеса, рекламные кампании и производство материалов для международных брендов.',tags:['БИЗНЕС','РЕКЛАМА','ПРОДАКШН']},
    USA:{index:'03',code:'USA / ПРОЕКТЫ',title:'США',description:'Удалённое продюсирование, AI-контент и монтаж для digital-платформ.',tags:['AI-КОНТЕНТ','МОНТАЖ','УДАЛЁННЫЙ ПРОДАКШН']},
    GEO:{index:'04',code:'GEO / ПРОЕКТЫ',title:'Грузия',description:'Съёмка и монтаж музыкальных видео — от подготовки площадки до финального мастера.',tags:['СЪЁМКА','МУЗЫКАЛЬНЫЕ ВИДЕО','МОНТАЖ']},
    KAZ:{index:'05',code:'KAZ / ПРОЕКТЫ',title:'Казахстан',description:'Коммерческое производство, рекламный контент и адаптация материалов под digital-форматы.',tags:['КОММЕРЧЕСКИЙ ПРОДАКШН','РЕКЛАМА','DIGITAL']},
    BLR:{index:'06',code:'BLR / ПРОЕКТЫ',title:'Беларусь',description:'Музыкальные проекты, монтаж и постпродакшн.',tags:['МУЗЫКА','МОНТАЖ','ПОСТПРОДАКШН']},
    CHN:{index:'07',code:'CHN / ПРОЕКТЫ',title:'Китай',description:'AI-контент и рекламные материалы для мобильных и digital-площадок.',tags:['AI-КОНТЕНТ','РЕКЛАМА','DIGITAL']},
    JPN:{index:'08',code:'JPN / ПРОЕКТЫ',title:'Япония',description:'Креативные digital-проекты, motion-дизайн и постпродакшн.',tags:['КРЕАТИВ','MOTION','ПОСТПРОДАКШН']},
    DEU:{index:'09',code:'DEU / ПРОЕКТЫ',title:'Германия',description:'Постпродакшн и коммерческий контент с акцентом на точность финальной сборки.',tags:['ПОСТПРОДАКШН','КОММЕРЧЕСКИЙ КОНТЕНТ','МОНТАЖ']},
    POL:{index:'10',code:'POL / ПРОЕКТЫ',title:'Польша',description:'Контент для бизнеса и социальных сетей: монтаж, адаптация и финальная упаковка.',tags:['БИЗНЕС','СОЦСЕТИ','МОНТАЖ']}
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



// BURLOV Director's Cut — kinetic typography and progressive geography
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  const heroBrand = document.querySelector('.brand-stage');
  const titles = [...document.querySelectorAll('.kinetic-title')];

  function updateKinetics(){
    if(reduce) return;
    const vh = innerHeight || 1;
    if(heroBrand){
      const heroRect = document.querySelector('.hero')?.getBoundingClientRect();
      if(heroRect){
        const p = Math.max(0, Math.min(1, -heroRect.top / Math.max(1, heroRect.height*.72)));
        heroBrand.style.setProperty('--brand-compress', String(1 - p*.16));
        heroBrand.style.setProperty('--brand-lift', `${p*-24}px`);
      }
    }
    titles.forEach(title=>{
      const rect=title.getBoundingClientRect();
      const enter=Math.max(0,Math.min(1,(vh-rect.top)/(vh*.72)));
      const leave=Math.max(0,Math.min(1,(vh*.18-rect.top)/(vh*.55)));
      const scale=1.08-enter*.08-leave*.13;
      const track=(-.02-enter*.02-leave*.035);
      title.style.setProperty('--title-scale',String(scale));
      title.style.setProperty('--title-track',`${track}em`);
    });
  }
  addEventListener('scroll',updateKinetics,{passive:true});
  addEventListener('resize',updateKinetics,{passive:true});
  updateKinetics();

  const mapSection=document.querySelector('.global-map');
  if(mapSection){
    const worked=[...mapSection.querySelectorAll('.map-country.is-worked')];
    const buttons=[...mapSection.querySelectorAll('.map-country-button')];
    worked.forEach(p=>p.classList.remove('is-discovered'));
    buttons.forEach(b=>b.classList.remove('is-discovered'));
    const observer=new IntersectionObserver(entries=>{
      if(!entries[0]?.isIntersecting)return;
      worked.forEach((path,index)=>setTimeout(()=>path.classList.add('is-discovered'),reduce?0:120+index*110));
      buttons.forEach((button,index)=>setTimeout(()=>button.classList.add('is-discovered'),reduce?0:180+index*70));
      observer.disconnect();
    },{threshold:.22});
    observer.observe(mapSection);
  }
})();

// BURLOV identity micro-interactions
(() => {
  const header = document.querySelector('.header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', updateHeader, {passive:true});
  updateHeader();

  if (!matchMedia('(pointer:fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const magneticItems = [
    {el:document.querySelector('.brand-lockup'),strength:.18,max:10},
    {el:document.querySelector('.brand-stage'),strength:.035,max:18}
  ];
  magneticItems.forEach(({el,strength,max})=>{
    if(!el)return;
    let raf=0,tx=0,ty=0,cx=0,cy=0;
    const render=()=>{
      cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;
      el.style.transform=`translate3d(${cx}px,${cy}px,0)`;
      if(Math.abs(tx-cx)>.05||Math.abs(ty-cy)>.05)raf=requestAnimationFrame(render);else raf=0;
    };
    el.addEventListener('pointermove',event=>{
      const rect=el.getBoundingClientRect();
      tx=Math.max(-max,Math.min(max,(event.clientX-rect.left-rect.width/2)*strength));
      ty=Math.max(-max,Math.min(max,(event.clientY-rect.top-rect.height/2)*strength));
      if(!raf)raf=requestAnimationFrame(render);
    });
    el.addEventListener('pointerleave',()=>{tx=0;ty=0;if(!raf)raf=requestAnimationFrame(render)});
  });
})();

/* =========================================================
   BURLOV 1.0 — signature brand, dolly scroll and motion polish
   ========================================================= */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const morph = document.querySelector('#morphBrand');
  const source = document.querySelector('.brand-source');
  const target = document.querySelector('.brand-target');
  const hero = document.querySelector('.hero');
  const media = document.querySelector('.hero-media');
  const heroVideos = [...document.querySelectorAll('.hero-video')];
  if(!morph || !source || !target || !hero) return;

  // Delay motion in the showreel: a short held frame makes the opening feel directed.
  heroVideos.forEach(video => { try{ video.pause(); }catch(_){} });

  let sourceRect, targetRect, sourceSize, raf = 0;
  function measure(){
    sourceRect = source.getBoundingClientRect();
    targetRect = target.getBoundingClientRect();
    sourceSize = parseFloat(getComputedStyle(source.querySelector('.brand-word')).fontSize) || sourceRect.height;
    morph.style.fontSize = `${sourceSize}px`;
  }
  function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }
  function draw(){
    raf=0;
    if(!sourceRect || !targetRect) measure();
    const heroRect=hero.getBoundingClientRect();
    const p=clamp(-heroRect.top / Math.max(1, hero.offsetHeight*.76),0,1);
    const sx=sourceRect.left;
    const sy=sourceRect.top;
    const ex=targetRect.left;
    const ey=targetRect.top;
    const endScale=Math.max(.02,targetRect.width / Math.max(1,sourceRect.width));
    const scale=1+(endScale-1)*p;
    const x=sx+(ex-sx)*p;
    const y=sy+(ey-sy)*p;
    morph.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale})`;
    morph.style.setProperty('--brand-progress',p);

    // Dolly rather than obvious parallax.
    hero.style.setProperty('--hero-ui-y',`${p*-22}px`);
    hero.style.setProperty('--hero-ui-opacity',String(1-p*.64));
    hero.style.setProperty('--hero-dolly-y',`${p*-18}px`);
    hero.style.setProperty('--hero-dolly-z',`${p*48}px`);
    hero.style.setProperty('--hero-dolly-scale',String(1+p*.028));
  }
  function requestDraw(){ if(!raf) raf=requestAnimationFrame(draw); }
  addEventListener('scroll',requestDraw,{passive:true});
  addEventListener('resize',()=>{sourceRect=targetRect=null;measure();draw()},{passive:true});

  // Camera focus happens once, then the brand remains calm.
  setTimeout(()=>morph.classList.add('is-focused'), reduce?0:430);
  setTimeout(()=>heroVideos.forEach(video=>video.play().catch(()=>{})), reduce?0:1050);
  measure();draw();

  let signatureTimer=0;
  morph.addEventListener('dblclick',()=>{
    clearTimeout(signatureTimer);
    morph.classList.add('show-signature');
    signatureTimer=setTimeout(()=>morph.classList.remove('show-signature'),3000);
  });

  // A restrained magnetic pull — only on fine pointers.
  if(matchMedia('(pointer:fine)').matches && !reduce){
    let tx=0,ty=0,cx=0,cy=0,magRaf=0;
    const renderMag=()=>{
      cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;
      morph.style.marginLeft=`${cx}px`;morph.style.marginTop=`${cy}px`;
      if(Math.abs(tx-cx)>.03||Math.abs(ty-cy)>.03)magRaf=requestAnimationFrame(renderMag);else magRaf=0;
    };
    morph.addEventListener('pointermove',e=>{
      const r=morph.getBoundingClientRect();
      tx=clamp((e.clientX-r.left-r.width/2)*.035,-3,3);
      ty=clamp((e.clientY-r.top-r.height/2)*.035,-3,3);
      if(!magRaf)magRaf=requestAnimationFrame(renderMag);
    });
    morph.addEventListener('pointerleave',()=>{tx=ty=0;if(!magRaf)magRaf=requestAnimationFrame(renderMag)});
  }
})();

// Make map copy changes feel like a restrained print dissolve.
(() => {
  const content=document.querySelector('.map-story-content');
  if(!content)return;
  document.querySelectorAll('.map-country-button').forEach(button=>{
    button.addEventListener('pointerenter',()=>{
      content.classList.add('is-changing');
      setTimeout(()=>content.classList.remove('is-changing'),180);
    });
  });
})();
