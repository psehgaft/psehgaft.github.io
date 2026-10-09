'use strict';
// Motion is optional, accessible, and independent from the visible page content.
const motionButton=document.querySelector('#theme');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let motionPreference=true;
try{motionPreference=localStorage.getItem('portfolio-motion')!=='off';}catch{}
function syncMotion(){
 const enabled=motionPreference&&!reducedMotion.matches;
 document.documentElement.dataset.motion=enabled?'on':'off';
 motionButton.setAttribute('aria-pressed',String(enabled));
 motionButton.setAttribute('aria-label',enabled?'Pausar movimiento':'Activar movimiento');
 motionButton.querySelector('span').textContent=enabled?'Pausar movimiento':'Activar movimiento';
}
syncMotion();
motionButton.addEventListener('click',()=>{
 motionPreference=!motionPreference;syncMotion();
 try{localStorage.setItem('portfolio-motion',motionPreference?'on':'off');}catch{}
});
reducedMotion.addEventListener('change',syncMotion);
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
const output=document.querySelector('#terminal-output');
const shortcuts={proyectos:'proyectos',projects:'proyectos',redes:'conectar',socials:'conectar',charlas:'charlas',talks:'charlas',explorar:'explorar',travel:'explorar',playlist:'playlist',musica:'playlist'};
document.querySelector('#terminal-form').addEventListener('submit',event=>{event.preventDefault();const field=document.querySelector('#command');const raw=field.value.trim().slice(0,120);if(!raw)return;field.value='';const command=raw.toLowerCase();if(command==='clear'){output.replaceChildren();return;}const line=document.createElement('p');line.textContent='$ '+raw;output.append(line);const result=document.createElement('p');if(command==='help')result.textContent='whoami · proyectos · redes · charlas · explorar · playlist · clear';else if(command==='whoami')result.textContent='Heber Romero Téllez / psehgaft\nArquitectura · Open source · Comunidad · Exploración';else if(shortcuts[command]){result.textContent='Abriendo /'+shortcuts[command]+'…';document.getElementById(shortcuts[command]).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}else result.textContent='Comando no encontrado. Escribe help para ver opciones.';output.append(result);while(output.children.length>30)output.firstElementChild.remove();output.scrollTop=output.scrollHeight;});
const search=document.querySelector('#repo-search'),owner=document.querySelector('#repo-owner'),list=document.querySelector('#repo-list'),status=document.querySelector('#repo-status'),more=document.querySelector('#load-more');
let catalog=[],limit=12;
function render(){const term=search.value.trim().toLowerCase();const filtered=catalog.filter(repo=>(owner.value==='all'||repo.owner===owner.value)&&repo.name.toLowerCase().includes(term));const fragment=document.createDocumentFragment();filtered.slice(0,limit).forEach(repo=>{const a=document.createElement('a');a.className='repo';a.href=repo.url;a.target='_blank';a.rel='noopener noreferrer';const text=document.createElement('div'),name=document.createElement('h4'),account=document.createElement('p'),arrow=document.createElement('span');name.textContent=repo.name;account.textContent=repo.owner;arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');text.append(name,account);a.append(text,arrow);fragment.append(a);});list.replaceChildren(fragment);status.textContent=filtered.length?`${Math.min(limit,filtered.length)} de ${filtered.length} repositorios · catálogo del 08.10.2026`:'Sin coincidencias. Prueba otro nombre o cambia la cuenta.';more.hidden=limit>=filtered.length;}
search.addEventListener('input',()=>{limit=12;render();});owner.addEventListener('change',()=>{limit=12;render();});more.addEventListener('click',()=>{limit+=24;render();});
fetch('assets/repositories.json').then(response=>{if(!response.ok)throw new Error('catalog');return response.json();}).then(data=>{catalog=data.repositories;render();}).catch(()=>{status.textContent='No se pudo cargar el catálogo. Puedes consultar todos los repositorios directamente en GitHub.';more.hidden=true;});

// A lightweight pointer halo preserves the native cursor and follows fine pointers only.
const pointerHalo=document.querySelector(".pointer-halo");
const finePointer=matchMedia("(hover: hover) and (pointer: fine)");
let pointerFrame=0,pointerX=0,pointerY=0;
addEventListener("pointermove",event=>{
 if(event.pointerType!=="mouse"||!finePointer.matches||document.documentElement.dataset.motion!=="on")return;
 pointerX=event.clientX;pointerY=event.clientY;
 if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{const half=pointerHalo.classList.contains("is-interactive")?22:15;pointerHalo.style.transform=`translate3d(${pointerX-half}px,${pointerY-half}px,0)`;pointerHalo.classList.add("is-visible");pointerFrame=0;});
},{passive:true});
document.addEventListener("pointerover",event=>{pointerHalo.classList.toggle("is-interactive",Boolean(event.target.closest("a,button,input,select")));},{passive:true});
document.documentElement.addEventListener("pointerleave",()=>pointerHalo.classList.remove("is-visible"));
addEventListener("blur",()=>pointerHalo.classList.remove("is-visible"));
document.querySelectorAll("iframe").forEach(frame=>frame.addEventListener("pointerenter",()=>pointerHalo.classList.remove("is-visible")));
