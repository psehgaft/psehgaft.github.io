'use strict';
// Navigation commands are local shortcuts, never executable shell commands.

// ---------- Language ----------
const langButton=document.querySelector('#lang');
function currentLang(){try{return localStorage.getItem('portfolio-lang')||'es';}catch(e){return 'es';}}
function swapText(sel,esAttr,enAttr,prop){
  document.querySelectorAll(sel).forEach(el=>{
    if(!el.hasAttribute(esAttr))el.setAttribute(esAttr,prop==='html'?el.innerHTML:(el.getAttribute(prop)||''));
    const val=currentLang()==='en'?el.getAttribute(enAttr):el.getAttribute(esAttr);
    if(prop==='html')el.innerHTML=val;else el.setAttribute(prop,val);
  });
}
function setLang(lang){
  try{localStorage.setItem('portfolio-lang',lang);}catch(e){}
  document.documentElement.lang=lang;
  swapText('[data-en]','data-es','data-en','html');
  swapText('[data-en-aria]','data-es-aria','data-en-aria','aria-label');
  swapText('[data-en-placeholder]','data-es-placeholder','data-en-placeholder','placeholder');
  swapText('[data-en-alt]','data-es-alt','data-en-alt','alt');
  langButton.querySelector('span').textContent=lang==='en'?'ES':'EN';
  langButton.setAttribute('aria-label',lang==='en'?'Cambiar a español':'Switch to English');
  setTheme(document.documentElement.dataset.theme||'hacker',lang);
  if(catalogReady)render();
}
langButton.addEventListener('click',()=>{setLang(currentLang()==='en'?'es':'en');});

// ---------- Theme ----------
const themeButton=document.querySelector('#theme');
function themeName(expedition,lang){
  if(lang==='en')return expedition?'Hacker':'Expedition';
  return expedition?'Hacker':'Expedición';
}
function setTheme(value,lang){
  lang=lang||currentLang();
  const expedition=value==='expedition';
  document.documentElement.dataset.theme=expedition?'expedition':'hacker';
  themeButton.setAttribute('aria-pressed',String(expedition));
  themeButton.setAttribute('aria-label',lang==='en'
    ?(expedition?'Switch to hacker style':'Switch to expedition style')
    :(expedition?'Cambiar a estilo hacker':'Cambiar a estilo expedición'));
  themeButton.querySelector('span').textContent=themeName(expedition,lang);
}
themeButton.addEventListener('click',()=>{
  const next=document.documentElement.dataset.theme==='hacker'?'expedition':'hacker';
  setTheme(next);try{localStorage.setItem('portfolio-theme',next);}catch(e){}
});

// ---------- Terminal ----------
const output=document.querySelector('#terminal-output');
const field=document.querySelector('#command');
const STR={
  es:{
    help:'whoami · proyectos · redes · charlas · explorar · contacto · blog · tema · idioma · cv · clear',
    whoami:'Heber Romero Téllez\nArquitectura · Open source · Comunidad · Exploración',
    unknown:'Comando no encontrado. Escribe help para ver opciones.',
    opening:'Abriendo /',
    contact:'Email: psehgaft@psehgaft.org\nLinkedIn · GitHub · Instagram · Threads · X · YouTube',
    blog:'Blog: https://psehgaft.blogspot.com/',
    cv:'CV y trayectoria: https://www.linkedin.com/in/psehgaft/',
    themeIs:'Tema activo: ',
    langIs:'Idioma activo: español'
  },
  en:{
    help:'whoami · projects · socials · talks · explore · contact · blog · theme · lang · cv · clear',
    whoami:'Heber Romero Téllez\nArchitecture · Open source · Community · Exploration',
    unknown:'Command not found. Type help for options.',
    opening:'Opening /',
    contact:'Email: psehgaft@psehgaft.org\nLinkedIn · GitHub · Instagram · Threads · X · YouTube',
    blog:'Blog: https://psehgaft.blogspot.com/',
    cv:'CV and career: https://www.linkedin.com/in/psehgaft/',
    themeIs:'Active theme: ',
    langIs:'Active language: English'
  }
};
const T=key=>STR[currentLang()][key];
const shortcuts={proyectos:'proyectos',projects:'proyectos',redes:'conectar',socials:'conectar',charlas:'charlas',talks:'charlas',explorar:'explorar',explore:'explorar',travel:'explorar'};
document.querySelector('#terminal-form').addEventListener('submit',event=>{
  event.preventDefault();
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
  else if(command==='contacto'||command==='contact')result.textContent=T('contact');
  else if(command==='blog')result.textContent=T('blog');
  else if(command==='cv')result.textContent=T('cv');
  else if(command==='tema'||command==='theme'){
    const next=document.documentElement.dataset.theme==='hacker'?'expedition':'hacker';
    setTheme(next);try{localStorage.setItem('portfolio-theme',next);}catch(e){}
    result.textContent=T('themeIs')+themeName(next==='expedition',lang);
  }
  else if(command==='idioma'||command==='lang'){
    const next=lang==='en'?'es':'en';
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
  status.textContent=filtered.length
    ?(lang==='en'
      ?`${Math.min(limit,filtered.length)} of ${filtered.length} repositories · catalog 08.10.2026`
      :`${Math.min(limit,filtered.length)} de ${filtered.length} repositorios · catálogo del 08.10.2026`)
    :(lang==='en'
      ?'No matches. Try another name or change the account.'
      :'Sin coincidencias. Prueba otro nombre o cambia la cuenta.');
  more.hidden=limit>=filtered.length;
}
search.addEventListener('input',()=>{limit=12;render();});
owner.addEventListener('change',()=>{limit=12;render();});
more.addEventListener('click',()=>{limit+=24;render();});
fetch('assets/repositories.json').then(response=>{if(!response.ok)throw new Error('catalog');return response.json();}).then(data=>{catalog=data.repositories;catalogReady=true;render();}).catch(()=>{
  status.textContent=currentLang()==='en'
    ?'Could not load the catalog. You can browse all repositories directly on GitHub.'
    :'No se pudo cargar el catálogo. Puedes consultar todos los repositorios directamente en GitHub.';
  more.hidden=true;
});

// ---------- Init ----------
let storedTheme='hacker';
try{storedTheme=localStorage.getItem('portfolio-theme')||'hacker';}catch(e){}
setLang(currentLang());
setTheme(storedTheme);
