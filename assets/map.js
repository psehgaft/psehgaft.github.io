/* PSEHGAFT // OPEN WORLD — interactive GTA radar map */
(function(){
'use strict';
var NS='http://www.w3.org/2000/svg';

/* ---------------- i18n ---------------- */
var STR={
es:{
  hudTitle:'PSEHGAFT // OPEN WORLD', back:'Volver al mapa', radar:'Radar', terminal:'Terminal',
  chatTitle:'CHAT DEL JUEGO', chatPlaceholder:'Escribe tu mensaje…', chatSend:'Enviar',
  srv1:'[SERVIDOR] Conectado como invitado_', srv2:'[SERVIDOR] Escribe para enviar un DM a psehgaft',
  usa:'USA', mexico:'MÉXICO',
  d_repos:'BARRIO DE LOS REPOSITORIOS', d_repos_desc:'Laboratorios, código y experimentos en abierto. El catálogo completo se regenera solo cada mañana.',
  d_social:'BARRIO DE LAS REDES SOCIALES', d_social_desc:'El barrio donde vivo en internet: once casas, once formas de conectar.',
  d_talks:'BARRIO DE LAS PLÁTICAS', d_talks_desc:'Del laboratorio al escenario: charlas sobre plataformas, virtualización, IA y experiencia de desarrollo.',
  d_learn:'BARRIO DEL ENTRENAMIENTO', d_learn_desc:'Entrenamiento continuo: credenciales, comunidad open source y notas de laboratorio.',
  d_hq:'CUARTEL GENERAL', d_hq_desc:'La línea directa. Escríbeme por el chat del juego o abre tu correo.',
  open:'Abrir ↗', locations:'UBICACIONES', backToList:'⟵ Volver a la lista',
  repoSearchPh:'Buscar en el catálogo: ansible, gpu, quarkus…', repoLoading:'Cargando catálogo…', repoNone:'Sin resultados. Prueba con otra palabra.',
  repoCount:function(n){return n+' repositorios en el catálogo';},
  emailMe:'Envíame un correo', chatFocus:'Chat del juego', chatFocusDesc:'Enfoca el chat para escribirme un DM',
  termWelcome:'psehgaft@open-world:~$ escribe "help" para ver comandos',
  tHelp:'comandos: help · whoami · redes · proyectos · charlas · blog · contacto · mapa · cv · lang · clear',
  tWho:'Heber Romero Téllez — @psehgaft\nArchitect @ Red Hat\nOpenShift · Kubernetes · DevSecOps · automatización · IA · open source',
  tRedes:'redes: linkedin · github · instagram · threads · facebook · x · youtube · spotify · tellonym · blogger · credly',
  tProy:'proyectos destacados:\n· ocp-ansible-agent-installer — OpenShift con Ansible\n· automation_governance_model — gobierno de automatización\n· open-ecosystem-services — ecosistemas abiertos\n· openshift-quarkus-game — aprender jugando',
  tCharlas:'charlas recientes: DevConf.US 2026 (3) · Red Hat webinar · DevConf.US 2025 (2)\nAbre el Barrio de las Pláticas en el mapa para verlas todas.',
  tBlog:'blog: https://psehgaft.blogspot.com/',
  tContacto:'contacto: psehgaft@psehgaft.org',
  tMapa:'Volviendo al mapa general…',
  tCv:'CV y trayectoria: https://www.linkedin.com/in/psehgaft/',
  tLang:'Idioma cambiado a English. Type "lang" to switch back.',
  tUnknown:function(c){return 'comando no encontrado: '+c+' — prueba "help"';}
},
en:{
  hudTitle:'PSEHGAFT // OPEN WORLD', back:'Back to map', radar:'Radar', terminal:'Terminal',
  chatTitle:'GAME CHAT', chatPlaceholder:'Type your message…', chatSend:'Send',
  srv1:'[SERVER] Connected as guest_', srv2:'[SERVER] Type to send a DM to psehgaft',
  usa:'USA', mexico:'MEXICO',
  d_repos:'REPOSITORIES DISTRICT', d_repos_desc:'Labs, code and experiments in the open. The full catalog regenerates itself every morning.',
  d_social:'SOCIAL NETWORKS DISTRICT', d_social_desc:'The neighborhood where I live online: eleven houses, eleven ways to connect.',
  d_talks:'TALKS DISTRICT', d_talks_desc:'From the lab to the stage: talks on platforms, virtualization, AI and developer experience.',
  d_learn:'TRAINING DISTRICT', d_learn_desc:'Continuous training: credentials, open source community and lab notes.',
  d_hq:'HEADQUARTERS', d_hq_desc:'The direct line. Message me through the game chat or open your email.',
  open:'Open ↗', locations:'LOCATIONS', backToList:'⟵ Back to list',
  repoSearchPh:'Search the catalog: ansible, gpu, quarkus…', repoLoading:'Loading catalog…', repoNone:'No results. Try another word.',
  repoCount:function(n){return n+' repositories in the catalog';},
  emailMe:'Email me', chatFocus:'Game chat', chatFocusDesc:'Focus the chat to send me a DM',
  termWelcome:'psehgaft@open-world:~$ type "help" for commands',
  tHelp:'commands: help · whoami · redes · proyectos · charlas · blog · contacto · mapa · cv · lang · clear',
  tWho:'Heber Romero Téllez — @psehgaft\nArchitect @ Red Hat\nOpenShift · Kubernetes · DevSecOps · automation · AI · open source',
  tRedes:'networks: linkedin · github · instagram · threads · facebook · x · youtube · spotify · tellonym · blogger · credly',
  tProy:'featured projects:\n· ocp-ansible-agent-installer — OpenShift with Ansible\n· automation_governance_model — automation governance\n· open-ecosystem-services — open ecosystems\n· openshift-quarkus-game — learning by playing',
  tCharlas:'recent talks: DevConf.US 2026 (3) · Red Hat webinar · DevConf.US 2025 (2)\nOpen the Talks District on the map to see them all.',
  tBlog:'blog: https://psehgaft.blogspot.com/',
  tContacto:'contact: psehgaft@psehgaft.org',
  tMapa:'Zooming back out to the full map…',
  tCv:'CV and career: https://www.linkedin.com/in/psehgaft/',
  tLang:'Language switched to Español. Escribe "lang" para volver.',
  tUnknown:function(c){return 'command not found: '+c+' — try "help"';}
}};

var lang=localStorage.getItem('psehgaft-map-lang')||'es';
function T(k){var v=STR[lang][k];return v;}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

/* ---------------- data ---------------- */
var DEVCONF26='https://pretalx.devconf.info/devconf-us-2026/speaker/DCTSUB/';
var DISTRICTS={
repos:{cx:170,cy:300,zoom:190,r:42,label:'d_repos',desc:'d_repos_desc',items:[
  {name:'ocp-ansible-agent-installer',owner:'psehgaft',url:'https://github.com/psehgaft/ocp-ansible-agent-installer',es:'Instalación de OpenShift con Ansible',en:'OpenShift installation with Ansible'},
  {name:'automation_governance_model',owner:'Open-Industries',url:'https://github.com/Open-Industries/automation_governance_model',es:'Gobierno de automatización: roles y prácticas',en:'Automation governance: roles and practices'},
  {name:'open-ecosystem-services',owner:'Open-Industries',url:'https://github.com/Open-Industries/open-ecosystem-services',es:'Servicios y ecosistemas abiertos',en:'Open services and ecosystems'},
  {name:'openshift-quarkus-game',owner:'psehgaft',url:'https://github.com/psehgaft/openshift-quarkus-game',es:'Aprender jugando con Quarkus',en:'Learning by playing with Quarkus'},
  {name:'catálogo',catalog:true,es:'Catálogo completo: busca entre todos los repositorios',en:'Full catalog: search across every repository'}
]},
social:{cx:340,cy:295,zoom:200,r:46,label:'d_social',desc:'d_social_desc',items:[
  {name:'LinkedIn',url:'https://www.linkedin.com/in/psehgaft/',es:'Trayectoria profesional',en:'Professional journey'},
  {name:'GitHub',url:'https://github.com/psehgaft',es:'Código y laboratorios',en:'Code and labs'},
  {name:'Instagram',url:'https://www.instagram.com/psehgaft/',es:'Diario visual',en:'Visual diary'},
  {name:'Threads',url:'https://www.threads.com/@psehgaft',es:'Ideas y momentos',en:'Ideas and moments'},
  {name:'Facebook',url:'https://www.facebook.com/psehgaft/',es:'Comunidad',en:'Community'},
  {name:'X',url:'https://twitter.com/psehgaft',es:'Conversación en la red',en:'Conversation on the network'},
  {name:'YouTube',url:'https://www.youtube.com/@Psehgaft/videos',es:'Charlas y sesiones',en:'Talks and sessions'},
  {name:'Spotify',url:'https://open.spotify.com/user/12126013095',es:'Música y playlists',en:'Music and playlists'},
  {name:'Tellonym',url:'https://tellonym.me/psehgaft',es:'Preguntas anónimas',en:'Anonymous questions'},
  {name:'Blogger',url:'https://psehgaft.blogspot.com/',es:'Escritos y memoria',en:'Writings and memory'},
  {name:'Credly',url:'https://www.credly.com/users/psehgaft/badges',es:'Certificaciones',en:'Certifications'}
]},
hq:{cx:255,cy:348,zoom:170,r:38,label:'d_hq',desc:'d_hq_desc',items:[
  {name:'psehgaft@psehgaft.org',url:'mailto:psehgaft@psehgaft.org?subject=Hola%20desde%20el%20mapa',email:true,es:'Escríbeme un correo directo',en:'Send me a direct email'},
  {name:'chat',chat:true,es:'Chat del juego: envíame un DM',en:'Game chat: send me a DM'}
]},
talks:{cx:235,cy:392,zoom:180,r:40,label:'d_talks',desc:'d_talks_desc',items:[
  {name:'Your Platform Team Is Not a Ticket Queue',tag:'DEVCONF.US 2026',url:DEVCONF26,es:'Plataformas como producto y autoservicio',en:'Platforms as product and self-service'},
  {name:'GPUs, DRA, and Smarter Scheduling for AI',tag:'DEVCONF.US 2026',url:DEVCONF26,es:'Kubernetes para cargas de IA aceleradas',en:'Kubernetes for accelerated AI workloads'},
  {name:'KubeVirt Without Fear',tag:'DEVCONF.US 2026',url:DEVCONF26,es:'VMs y contenedores en una plataforma',en:'VMs and containers on one platform'},
  {name:'Unified Workload Migration',tag:'RED HAT WEBINAR',url:'https://www.redhat.com/en/events/webinar/unified-workload-migration-moving-vms-and-containers-to-openshift-with-openshift-virtualization',es:'Modernización con OpenShift Virtualization',en:'Modernization with OpenShift Virtualization'},
  {name:'Intelligent Pipelines',tag:'DEVCONF.US 2025',url:'https://pretalx.devconf.info/devconf-us-2025/talk/KXCC3S/',es:'AI/ML en flujos de entrega y seguridad',en:'AI/ML in delivery and security pipelines'},
  {name:'Unifying Developer Experience',tag:'DEVCONF.US 2025',url:'https://pretalx.devconf.info/devconf-us-2025/talk/7GHCRQ/',es:'Mundos virtual y cloud native unidos',en:'Virtual and cloud native worlds united'},
  {name:'YouTube',tag:'CANAL',url:'https://www.youtube.com/@Psehgaft/videos',es:'Charlas y sesiones en video',en:'Talks and sessions on video'},
  {name:'Blog',tag:'BLOGGER',url:'https://psehgaft.blogspot.com/',es:'Escritos y memoria',en:'Writings and memory'}
]},
learn:{cx:242,cy:440,zoom:170,r:38,label:'d_learn',desc:'d_learn_desc',items:[
  {name:'Credly · DO316',url:'https://www.credly.com/users/psehgaft/badges',es:'Insignia: OpenShift Virtualization (DO316)',en:'Badge: OpenShift Virtualization (DO316)'},
  {name:'OpenCommunity',url:'https://github.com/psehgaft/OpenCommunity',es:'Comunidad y aprendizaje abierto',en:'Open learning community'},
  {name:'Lab notes',url:'https://psehgaft.blogspot.com/',es:'Notas desde el laboratorio',en:'Notes from the lab'},
  {name:'Soundtrack',url:'https://open.spotify.com/playlist/2sCKbm0MhLFjAsT8ETjfn3',es:'La banda sonora del aprendizaje',en:'The learning soundtrack'}
]}};

/* ---------------- language ---------------- */
function setLang(l){
  lang=l; localStorage.setItem('psehgaft-map-lang',l);
  document.documentElement.lang=l;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var v=T(el.getAttribute('data-i18n')); if(typeof v==='string') el.textContent=v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
    var v=T(el.getAttribute('data-i18n-ph')); if(typeof v==='string') el.setAttribute('placeholder',v);
  });
  document.querySelectorAll('[data-dlabel]').forEach(function(el){
    el.textContent=T(DISTRICTS[el.getAttribute('data-dlabel')].label);
  });
  renderChatIntro();
  if(sidebarState.key) renderSidebar();
}
document.getElementById('btn-lang').addEventListener('click',function(){setLang(lang==='es'?'en':'es');});

/* ---------------- map: build houses ---------------- */
var svg=document.getElementById('map');
function houseEl(){
  var g=document.createElementNS(NS,'g'); g.setAttribute('class','house');
  g.innerHTML='<path class="roof" d="M-10,3 L0,-7 L10,3 Z"/>'+
    '<rect class="walls" x="-7.5" y="3" width="15" height="10"/>'+
    '<rect class="door" x="-2.5" y="7" width="5" height="6"/>'+
    '<circle class="ping" cx="0" cy="-10" r="2.5"/>';
  return g;
}
Object.keys(DISTRICTS).forEach(function(key){
  var d=DISTRICTS[key];
  var g=document.querySelector('.district[data-district="'+key+'"] .houses');
  var n=d.items.length;
  d.items.forEach(function(it,i){
    var h=houseEl();
    var a=Math.PI*(5/3)+ (n>1? (i/(n-1))*Math.PI*(4/3) : Math.PI*(2/3));
    var x=Math.cos(a)*d.r, y=Math.sin(a)*d.r;
    h.setAttribute('transform','translate('+x.toFixed(1)+','+y.toFixed(1)+')');
    h.dataset.district=key; h.dataset.idx=i;
    h.setAttribute('tabindex','0'); h.setAttribute('role','button');
    g.appendChild(h);
  });
  d.houseEls=g.children;
});
function itemLabel(key,i){
  var it=DISTRICTS[key].items[i];
  if(it.chat) return T('chatFocus');
  return it.owner? it.owner+'/'+it.name : it.name;
}

/* ---------------- zoom ---------------- */
var FULL={x:0,y:0,w:457,h:472};
var cur={x:0,y:0,w:1000,h:720}, tgt={x:0,y:0,w:1000,h:720}, raf=null;
function applyVB(){svg.setAttribute('viewBox',cur.x+' '+cur.y+' '+cur.w+' '+cur.h); updateMini();}
function animate(){
  if(raf) cancelAnimationFrame(raf);
  var from={x:cur.x,y:cur.y,w:cur.w,h:cur.h}, t0=performance.now(), dur=650;
  function step(t){
    var k=Math.min(1,(t-t0)/dur);
    var e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    cur={x:from.x+(tgt.x-from.x)*e,y:from.y+(tgt.y-from.y)*e,w:from.w+(tgt.w-from.w)*e,h:from.h+(tgt.h-from.h)*e};
    applyVB();
    if(k<1) raf=requestAnimationFrame(step); else raf=null;
  }
  raf=requestAnimationFrame(step);
}
var btnBack=document.getElementById('btn-back');
function zoomTo(key){
  var d=DISTRICTS[key], h=d.zoom*1.03;
  tgt={x:d.cx-d.zoom/2,y:d.cy-h/2,w:d.zoom,h:h};
  animate(); btnBack.hidden=false; openDistrict(key);
}
function zoomOut(){
  tgt={x:FULL.x,y:FULL.y,w:FULL.w,h:FULL.h};
  animate(); btnBack.hidden=true; closeSidebar();
}
btnBack.addEventListener('click',zoomOut);
document.addEventListener('keydown',function(e){if(e.key==='Escape') zoomOut();});

/* ---------------- sidebar ---------------- */
var sidebar=document.getElementById('sidebar'), sideBody=document.getElementById('side-body');
var sidebarState={key:null,idx:null};
function openDistrict(key){
  sidebarState={key:key,idx:null};
  renderSidebar();
  sidebar.classList.add('open');
}
function closeSidebar(){sidebar.classList.remove('open'); sidebarState={key:null,idx:null};}
document.getElementById('side-close').addEventListener('click',closeSidebar);
function renderSidebar(){
  var key=sidebarState.key; if(!key) return;
  var d=DISTRICTS[key];
  if(sidebarState.idx===null){
    var html='<p class="side-kicker">'+esc(T('locations'))+'</p>'+
      '<h2>'+esc(T(d.label))+'</h2>'+
      '<p class="side-desc">'+esc(T(d.desc))+'</p><ul class="side-list">';
    d.items.forEach(function(it,i){
      var tag=it.tag?'<span class="tag">'+esc(it.tag)+'</span>':(it.catalog?'<span class="tag">⌕</span>':(it.chat?'<span class="tag">💬</span>':'<span>→</span>'));
      html+='<li><button type="button" class="side-item" data-idx="'+i+'"><span>'+esc(itemLabel(key,i))+'</span>'+tag+'</button></li>';
    });
    sideBody.innerHTML=html+'</ul>';
    sideBody.querySelectorAll('.side-item').forEach(function(b){
      b.addEventListener('click',function(){sidebarState.idx=parseInt(b.dataset.idx,10); renderSidebar();});
    });
  } else {
    var it=d.items[sidebarState.idx];
    if(it.catalog){ renderRepoSearch(); return; }
    if(it.chat){
      closeSidebar();
      var ci=document.getElementById('chat-input'); ci.focus();
      addChatLine('srv',T('srv2'));
      return;
    }
    var desc=it[lang]||it.es;
    sideBody.innerHTML='<button type="button" class="side-back" id="side-backbtn">'+esc(T('backToList'))+'</button>'+
      '<div class="side-detail"><p class="side-kicker">'+esc(T(d.label))+'</p>'+
      '<h3>'+esc(itemLabel(key,sidebarState.idx))+'</h3>'+
      '<p>'+esc(desc)+'</p>'+
      '<a class="btn-open" href="'+esc(it.url)+'" target="_blank" rel="noopener noreferrer">'+esc(T('open'))+'</a></div>';
    document.getElementById('side-backbtn').addEventListener('click',function(){sidebarState.idx=null; renderSidebar();});
  }
}

/* ---------------- repo catalog search ---------------- */
var repoCache=null;
function getRepos(){
  if(repoCache) return Promise.resolve(repoCache);
  return fetch('assets/repositories.json').then(function(r){return r.json();}).then(function(j){
    repoCache=j.repositories||[]; return repoCache;
  });
}
function renderRepoSearch(){
  sideBody.innerHTML='<button type="button" class="side-back" id="side-backbtn">'+esc(T('backToList'))+'</button>'+
    '<p class="side-kicker">⌕ '+esc(T('d_repos'))+'</p><h2>'+esc(itemLabel(sidebarState.key,sidebarState.idx))+'</h2>'+
    '<input id="repo-q" class="repo-search" type="search" placeholder="'+esc(T('repoSearchPh'))+'" aria-label="search">'+
    '<p class="repo-count" id="repo-count">'+esc(T('repoLoading'))+'</p><div id="repo-results"></div>';
  document.getElementById('side-backbtn').addEventListener('click',function(){sidebarState.idx=null; renderSidebar();});
  var q=document.getElementById('repo-q'), count=document.getElementById('repo-count'), res=document.getElementById('repo-results');
  function draw(list){
    count.textContent=T('repoCount')(list.length);
    if(!list.length){res.innerHTML='<p class="side-desc">'+esc(T('repoNone'))+'</p>';return;}
    res.innerHTML=list.slice(0,30).map(function(r){
      return '<a class="repo-row" href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer"><span class="owner">'+esc(r.owner)+'/</span><strong>'+esc(r.name)+'</strong></a>';
    }).join('');
  }
  getRepos().then(function(all){
    draw(all);
    q.addEventListener('input',function(){
      var s=q.value.trim().toLowerCase();
      draw(s?all.filter(function(r){return (r.name+' '+r.owner).toLowerCase().indexOf(s)>-1;}):all);
    });
    q.focus();
  }).catch(function(){
    count.textContent='error';
  });
}

/* ---------------- tooltip + map clicks ---------------- */
var tip=document.getElementById('tooltip');
svg.addEventListener('mousemove',function(e){
  var h=e.target.closest?e.target.closest('.house'):null;
  if(h){
    tip.hidden=false;
    tip.textContent=itemLabel(h.dataset.district,parseInt(h.dataset.idx,10));
    tip.style.left=e.clientX+'px'; tip.style.top=e.clientY+'px';
  } else tip.hidden=true;
});
svg.addEventListener('mouseleave',function(){tip.hidden=true;});
svg.addEventListener('click',function(e){
  var h=e.target.closest?e.target.closest('.house'):null;
  if(h){
    var key=h.dataset.district, idx=parseInt(h.dataset.idx,10);
    var d=DISTRICTS[key];
    var hh=d.zoom*1.03;
    tgt={x:d.cx-d.zoom/2,y:d.cy-hh/2,w:d.zoom,h:hh};
    animate(); btnBack.hidden=false;
    sidebarState={key:key,idx:idx}; renderSidebar(); sidebar.classList.add('open');
    return;
  }
  var dt=e.target.closest?e.target.closest('.district'):null;
  if(dt){ zoomTo(dt.dataset.district); return; }
  /* any other click on the map background zooms back out */
  zoomOut();
});
document.querySelectorAll('.district').forEach(function(g){
  g.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){e.preventDefault();zoomTo(g.dataset.district);}
  });
  g.setAttribute('tabindex','0'); g.setAttribute('role','button');
});

/* ---------------- minimap ---------------- */
(function(){
  var md=document.getElementById('mini-dots');
  Object.keys(DISTRICTS).forEach(function(k){
    var c=document.createElementNS(NS,'circle');
    c.setAttribute('cx',DISTRICTS[k].cx); c.setAttribute('cy',DISTRICTS[k].cy);
    c.setAttribute('r',7); c.setAttribute('fill','#ff3131');
    md.appendChild(c);
  });
})();
function updateMini(){
  var r=document.getElementById('minirect');
  r.setAttribute('x',cur.x); r.setAttribute('y',cur.y);
  r.setAttribute('width',cur.w); r.setAttribute('height',cur.h);
}

/* ---------------- game chat ---------------- */
var chatLog=document.getElementById('chat-log'), chatForm=document.getElementById('chat-form'), chatInput=document.getElementById('chat-input');
function addChatLine(cls,txt){
  var p=document.createElement('p'); p.className=cls; p.textContent=txt;
  chatLog.appendChild(p); chatLog.scrollTop=chatLog.scrollHeight;
}
function renderChatIntro(){
  chatLog.innerHTML='';
  addChatLine('srv',T('srv1')); addChatLine('srv',T('srv2'));
}
chatForm.addEventListener('submit',function(e){
  e.preventDefault();
  var msg=chatInput.value.trim(); if(!msg) return;
  addChatLine('dm','[DM → psehgaft] '+msg);
  chatInput.value='';
  window.location.href='mailto:psehgaft@psehgaft.org?subject='+encodeURIComponent('DM desde el mapa // DM from the map')+'&body='+encodeURIComponent(msg);
});

/* ---------------- radar toggle ---------------- */
var btnRadar=document.getElementById('btn-radar');
btnRadar.addEventListener('click',function(){
  var off=document.body.classList.toggle('radar-off');
  btnRadar.setAttribute('aria-pressed',String(!off));
});

/* ---------------- terminal ---------------- */
var termToggle=document.getElementById('term-toggle'), terminal=document.getElementById('terminal');
var termOut=document.getElementById('term-out'), termForm=document.getElementById('term-form'), termIn=document.getElementById('term-in');
function tprint(html,cls){
  var p=document.createElement('p'); if(cls)p.className=cls; p.innerHTML=html;
  termOut.appendChild(p); termOut.scrollTop=termOut.scrollHeight;
}
function tprintln(txt){tprint(esc(txt).replace(/\n/g,'<br>'));}
termToggle.addEventListener('click',function(){
  terminal.hidden=!terminal.hidden;
  if(!terminal.hidden){termIn.focus(); if(!termOut.children.length) tprintln(T('termWelcome'));}
});
document.getElementById('term-close').addEventListener('click',function(){terminal.hidden=true;});
function link(u,label){return '<a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer" style="color:#ff3131">'+esc(label||u)+'</a>';}
termForm.addEventListener('submit',function(e){
  e.preventDefault();
  var raw=termIn.value.trim(); termIn.value='';
  tprint('<span class="prompt">$</span> '+esc(raw));
  var c=raw.toLowerCase();
  if(!c) return;
  if(c==='help'||c==='ayuda') tprintln(T('tHelp'));
  else if(c==='whoami') tprintln(T('tWho'));
  else if(c==='redes') tprintln(T('tRedes'));
  else if(c==='proyectos') tprintln(T('tProy'));
  else if(c==='charlas') tprintln(T('tCharlas'));
  else if(c==='blog') tprint(link('https://psehgaft.blogspot.com/'));
  else if(c==='contacto') tprint(link('mailto:psehgaft@psehgaft.org','psehgaft@psehgaft.org'));
  else if(c==='mapa'){tprintln(T('tMapa')); zoomOut();}
  else if(c==='cv') tprint(link('https://www.linkedin.com/in/psehgaft/'));
  else if(c==='lang'){setLang(lang==='es'?'en':'es'); tprintln(T('tLang'));}
  else if(c==='clear') termOut.innerHTML='';
  else tprintln(T('tUnknown')(c));
});

/* ---------------- player ---------------- */
var player=document.getElementById('player');
document.getElementById('player-toggle').addEventListener('click',function(){
  var hidden=player.classList.toggle('hidden');
  document.body.classList.toggle('player-off',hidden);
});

/* ---------------- init ---------------- */
setLang(lang);
applyVB();
})();
