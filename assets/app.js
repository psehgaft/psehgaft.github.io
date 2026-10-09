'use strict';
// ---------- Language ----------
const LANGS=['es','en','fr','de'];
function detectLang(){try{const l=(navigator.language||'en').slice(0,2).toLowerCase();return LANGS.includes(l)?l:'en';}catch(e){return 'en';}}
function currentLang(){try{return localStorage.getItem('portfolio-lang')||detectLang();}catch(e){return detectLang();}}
const STR={
es:{
 title:'Heber Romero Téllez | psehgaft · OpenShift, DevSecOps y Open Source',
 switchLang:'Cambiar idioma', motionPause:'Pausar movimiento', motionResume:'Activar movimiento',
 themeToHacker:'Cambiar a estilo hacker', themeToExpedition:'Cambiar a estilo expedición',
 themeHacker:'Hacker', themeExpedition:'Expedición',
 help:'whoami · proyectos · redes · charlas · explorar · playlist · idioma · clear',
 whoami:'Heber Romero Téllez / psehgaft\nArquitectura · Open source · Comunidad · Exploración',
 unknown:'Comando no encontrado. Escribe help para ver opciones.',
 opening:'Abriendo /',
 langIs:'Idioma activo: español',
 repoStatus:(n,m)=>`${n} de ${m} repositorios · catálogo del 08.10.2026`,
 repoEmpty:'Sin coincidencias. Prueba otro nombre o cambia la cuenta.',
 repoError:'No se pudo cargar el catálogo. Puedes consultar todos los repositorios directamente en GitHub.'
},
en:{
 title:'Heber Romero Téllez | psehgaft · OpenShift, DevSecOps & Open Source',
 switchLang:'Change language', motionPause:'Pause motion', motionResume:'Resume motion',
 themeToHacker:'Switch to hacker style', themeToExpedition:'Switch to expedition style',
 themeHacker:'Hacker', themeExpedition:'Expedition',
 help:'whoami · projects · socials · talks · explore · playlist · lang · clear',
 whoami:'Heber Romero Téllez / psehgaft\nArchitecture · Open source · Community · Exploration',
 unknown:'Command not found. Type help for options.',
 opening:'Opening /',
 langIs:'Active language: English',
 repoStatus:(n,m)=>`${n} of ${m} repositories · catalog 08.10.2026`,
 repoEmpty:'No matches. Try another name or change the account.',
 repoError:'Could not load the catalog. You can browse all repositories directly on GitHub.'
},
fr:{
 title:'Heber Romero Téllez | psehgaft · OpenShift, DevSecOps et Open Source',
 switchLang:'Changer de langue', motionPause:'Pause de l’animation', motionResume:'Reprendre l’animation',
 themeToHacker:'Passer au style hacker', themeToExpedition:'Passer au style expédition',
 themeHacker:'Hacker', themeExpedition:'Expédition',
 help:'whoami · projets · reseaux · conferences · explorer · playlist · langue · clear',
 whoami:'Heber Romero Téllez / psehgaft\nArchitecture · Open source · Communauté · Exploration',
 unknown:'Commande introuvable. Tapez help pour voir les options.',
 opening:'Ouverture de /',
 langIs:'Langue active : français',
 repoStatus:(n,m)=>`${n} sur ${m} dépôts · catalogue du 08.10.2026`,
 repoEmpty:'Aucun résultat. Essayez un autre nom ou changez de compte.',
 repoError:'Impossible de charger le catalogue. Vous pouvez parcourir tous les dépôts directement sur GitHub.'
},
de:{
 title:'Heber Romero Téllez | psehgaft · OpenShift, DevSecOps und Open Source',
 switchLang:'Sprache ändern', motionPause:'Bewegung pausieren', motionResume:'Bewegung fortsetzen',
 themeToHacker:'Zum Hacker-Stil wechseln', themeToExpedition:'Zum Expeditions-Stil wechseln',
 themeHacker:'Hacker', themeExpedition:'Expedition',
 help:'whoami · projekte · netzwerke · vortraege · entdecken · playlist · sprache · clear',
 whoami:'Heber Romero Téllez / psehgaft\nArchitektur · Open Source · Community · Exploration',
 unknown:'Befehl nicht gefunden. Tippe help für Optionen.',
 opening:'Öffne /',
 langIs:'Aktive Sprache: Deutsch',
 repoStatus:(n,m)=>`${n} von ${m} Repositories · Katalog vom 08.10.2026`,
 repoEmpty:'Keine Treffer. Versuche einen anderen Namen oder wechsle das Konto.',
 repoError:'Katalog konnte nicht geladen werden. Du kannst alle Repositories direkt auf GitHub durchsuchen.'
}};
const T=key=>STR[currentLang()][key];
function swapText(suffix,prop){
 const sel=LANGS.map(l=>`[data-${l}${suffix}]`).join(',');
 document.querySelectorAll(sel).forEach(el=>{
  const esAttr='data-es'+suffix;
  if(!el.hasAttribute(esAttr))el.setAttribute(esAttr,prop==='html'?el.innerHTML:(el.getAttribute(prop)||''));
  const val=el.getAttribute('data-'+currentLang()+suffix);
  if(val!==null){if(prop==='html')el.innerHTML=val;else el.setAttribute(prop,val);}
 });
}
const langButton=document.querySelector('#lang');
function setLang(lang){
 try{localStorage.setItem('portfolio-lang',lang);}catch(e){}
 document.documentElement.lang=lang;
 document.title=STR[lang].title;
 swapText('','html');swapText('-aria','aria-label');swapText('-placeholder','placeholder');swapText('-alt','alt');swapText('-title','title');
 langButton.querySelector('span').textContent=lang.toUpperCase();
 langButton.setAttribute('aria-label',STR[lang].switchLang);
 syncMotion(lang);
 if(catalogReady)render();
}
langButton.addEventListener('click',()=>{const i=LANGS.indexOf(currentLang());setLang(LANGS[(i+1)%LANGS.length]);});

// ---------- Motion (optional, accessible, independent from visible content) ----------
const motionButton=document.querySelector('#theme');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let motionPreference=true;
try{motionPreference=localStorage.getItem('portfolio-motion')!=='off';}catch(e){}
function syncMotion(lang){
 lang=lang||currentLang();
 const enabled=motionPreference&&!reducedMotion.matches;
 document.documentElement.dataset.motion=enabled?'on':'off';
 motionButton.setAttribute('aria-pressed',String(enabled));
 const label=enabled?STR[lang].motionPause:STR[lang].motionResume;
 motionButton.setAttribute('aria-label',label);
 motionButton.querySelector('span').textContent=label;
}
motionButton.addEventListener('click',()=>{
 motionPreference=!motionPreference;syncMotion();
 try{localStorage.setItem('portfolio-motion',motionPreference?'on':'off');}catch(e){}
});
reducedMotion.addEventListener('change',()=>syncMotion());

// ---------- Scroll progress + reveal + nav highlight ----------
const progress=document.querySelector('.scroll-progress');
let scrollFrame=0;
function updateProgress(){
 const total=document.documentElement.scrollHeight-innerHeight;
 progress.style.transform='scaleX('+(total>0?Math.min(1,Math.max(0,scrollY/total)):0)+')';
 scrollFrame=0;
}
addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateProgress);},{passive:true});
addEventListener('resize',updateProgress);
updateProgress();
if('IntersectionObserver' in window){
 const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){
   if(document.documentElement.dataset.motion==='on')entry.target.classList.add('reveal-visible');
   revealObserver.unobserve(entry.target);
  }});
 },{threshold:.12});
 document.querySelectorAll('.section-heading,.feature-card,.terminal,.explore-grid,.mention-grid,.social-grid').forEach(element=>revealObserver.observe(element));
 const navigationLinks=[...document.querySelectorAll('nav a[href^="#"]')];
 const navObserver=new IntersectionObserver(entries=>{
  const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
  if(!visible.length)return;
  navigationLinks.forEach(link=>{
   if(link.getAttribute('href')==='#'+visible[0].target.id)link.setAttribute('aria-current','true');
   else link.removeAttribute('aria-current');
  });
 },{rootMargin:'-20% 0px -55% 0px',threshold:0});
 navigationLinks.forEach(link=>{const section=document.querySelector(link.getAttribute('href'));if(section)navObserver.observe(section);});
}

// ---------- Terminal ----------
// Navigation commands are local shortcuts, never executable shell commands.
const output=document.querySelector('#terminal-output');
const shortcuts={proyectos:'proyectos',projects:'proyectos',projets:'proyectos',projekte:'proyectos',
 redes:'conectar',socials:'conectar',reseaux:'conectar',netzwerke:'conectar',netzwerk:'conectar',
 charlas:'charlas',talks:'charlas',conferences:'charlas',vortraege:'charlas',
 explorar:'explorar',explore:'explorar',explorer:'explorar',entdecken:'explorar',
 travel:'explorar',playlist:'playlist',musica:'playlist',music:'playlist',musique:'playlist',musik:'playlist'};
document.querySelector('#terminal-form').addEventListener('submit',event=>{
 event.preventDefault();
 const field=document.querySelector('#command');
 const raw=field.value.trim().slice(0,120);
 if(!raw)return;
 field.value='';
 const command=raw.toLowerCase();
 if(command==='clear'){output.replaceChildren();return;}
 const line=document.createElement('p');line.textContent='$ '+raw;output.append(line);
 const result=document.createElement('p');
 const lang=currentLang();
 if(command==='help')result.textContent=T('help');
 else if(command==='whoami')result.textContent=T('whoami');
 else if(['idioma','lang','langue','sprache'].includes(command)){
  const i=LANGS.indexOf(lang),next=LANGS[(i+1)%LANGS.length];
  setLang(next);
  result.textContent=STR[next].langIs;
 }
 else if(shortcuts[command]){
  result.textContent=T('opening')+shortcuts[command]+'…';
  document.getElementById(shortcuts[command]).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 else result.textContent=T('unknown');
 output.append(result);
 while(output.children.length>30)output.firstElementChild.remove();
 output.scrollTop=output.scrollHeight;
});

// ---------- Repository explorer ----------
const search=document.querySelector('#repo-search'),owner=document.querySelector('#repo-owner'),list=document.querySelector('#repo-list'),status=document.querySelector('#repo-status'),more=document.querySelector('#load-more');
let catalog=[],limit=12,catalogReady=false;
function render(){
 const lang=currentLang();
 const term=search.value.trim().toLowerCase();
 const filtered=catalog.filter(repo=>(owner.value==='all'||repo.owner===owner.value)&&repo.name.toLowerCase().includes(term));
 const fragment=document.createDocumentFragment();
 filtered.slice(0,limit).forEach(repo=>{
  const a=document.createElement('a');a.className='repo';a.href=repo.url;a.target='_blank';a.rel='noopener noreferrer';
  const text=document.createElement('div'),name=document.createElement('h4'),account=document.createElement('p'),arrow=document.createElement('span');
  name.textContent=repo.name;account.textContent=repo.owner;arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
  text.append(name,account);a.append(text,arrow);fragment.append(a);
 });
 list.replaceChildren(fragment);
 status.textContent=filtered.length?STR[lang].repoStatus(Math.min(limit,filtered.length),filtered.length):STR[lang].repoEmpty;
 more.hidden=limit>=filtered.length;
}
search.addEventListener('input',()=>{limit=12;render();});
owner.addEventListener('change',()=>{limit=12;render();});
more.addEventListener('click',()=>{limit+=24;render();});
fetch('assets/repositories.json').then(response=>{if(!response.ok)throw new Error('catalog');return response.json();}).then(data=>{catalog=data.repositories;catalogReady=true;render();}).catch(()=>{
 status.textContent=T('repoError');
 more.hidden=true;
});

// ---------- Pointer halo ----------
const pointerHalo=document.querySelector('.pointer-halo');
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
let pointerFrame=0,pointerX=0,pointerY=0;
addEventListener('pointermove',event=>{
 if(event.pointerType!=='mouse'||!finePointer.matches||document.documentElement.dataset.motion!=='on')return;
 pointerX=event.clientX;pointerY=event.clientY;
 if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{const half=pointerHalo.classList.contains('is-interactive')?22:15;pointerHalo.style.transform=`translate3d(${pointerX-half}px,${pointerY-half}px,0)`;pointerHalo.classList.add('is-visible');pointerFrame=0;});
},{passive:true});
document.addEventListener('pointerover',event=>{pointerHalo.classList.toggle('is-interactive',Boolean(event.target.closest('a,button,input,select')));},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>pointerHalo.classList.remove('is-visible'));
addEventListener('blur',()=>pointerHalo.classList.remove('is-visible'));
document.querySelectorAll('iframe').forEach(frame=>frame.addEventListener('pointerenter',()=>pointerHalo.classList.remove('is-visible')));

// ---------- Init ----------
let storedMotion='on';
try{storedMotion=localStorage.getItem('portfolio-motion')||'on';}catch(e){}
motionPreference=storedMotion!=='off';
setLang(currentLang());
