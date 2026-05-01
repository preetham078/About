// Main JS for portfolio app
// Handles: rendering projects, localStorage, add form, search, filter, GitHub fetch, theme toggle

const LS_KEY = 'portfolio-projects-v1';
const THEME_KEY = 'portfolio-theme-v1';

// Sample starter projects
const starter = [
  {title:'Personal Website',description:'A personal site built with HTML/CSS/JS',tech:['HTML','CSS','JavaScript'],github:'',demo:''},
  {title:'Todo App',description:'A small React todo app with localStorage',tech:['JavaScript','React'],github:'',demo:''},
  {title:'Arduino Weather Station',description:'Reads sensors and logs data',tech:['Arduino','C++'],github:'',demo:''}
];

// State
let projects = [];
let selectedTags = new Set();

// DOM
const el = id=>document.getElementById(id);
const projectsEl = el('projects');
const tagListEl = el('tagList');
const searchEl = el('search');
const modal = el('modal');

function save(){localStorage.setItem(LS_KEY,JSON.stringify(projects))}
function load(){
  const raw = localStorage.getItem(LS_KEY);
  if(raw) projects = JSON.parse(raw);
  else {projects = starter; save();}
}

function getAllTags(){
  const s = new Set();
  projects.forEach(p=>p.tech.forEach(t=>s.add(t.trim())));
  return Array.from(s).sort();
}

function renderTags(){
  tagListEl.innerHTML = '';
  getAllTags().forEach(tag=>{
    const b=document.createElement('button');
    b.className='tag'+(selectedTags.has(tag)?' selected':'');
    b.textContent=tag;
    b.onclick=()=>{
      if(selectedTags.has(tag)) selectedTags.delete(tag); else selectedTags.add(tag);
      renderTags(); renderProjects();
    };
    tagListEl.appendChild(b);
  });
}

function createCard(p){
  const card=document.createElement('article');card.className='card';
  const title=document.createElement('h3');title.textContent=p.title;card.appendChild(title);
  const meta=document.createElement('div');meta.className='meta';meta.textContent=p.description;card.appendChild(meta);
  const techWrap=document.createElement('div');techWrap.className='tech';
  p.tech.forEach(t=>{const c=document.createElement('span');c.className='chip';c.textContent=t;techWrap.appendChild(c)});
  card.appendChild(techWrap);
  const actions=document.createElement('div');actions.className='actions';
  if(p.github){const a=document.createElement('a');a.className='btn';a.href=p.github;a.target='_blank';a.rel='noopener';a.innerHTML='<i class="fa fa-code-branch"></i> GitHub';actions.appendChild(a)}
  if(p.demo){const d=document.createElement('a');d.className='btn';d.href=p.demo;d.target='_blank';d.rel='noopener';d.innerHTML='<i class="fa fa-arrow-up-right-from-square"></i> Demo';actions.appendChild(d)}
  card.appendChild(actions);
  return card;
}

function renderProjects(){
  const q = searchEl.value.trim().toLowerCase();
  projectsEl.innerHTML='';
  const filtered = projects.filter(p=>{
    if(q){
      if(!(p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))) return false;
    }
    if(selectedTags.size>0){
      const has = p.tech.some(t=>selectedTags.has(t));
      if(!has) return false;
    }
    return true;
  });
  if(filtered.length===0){projectsEl.innerHTML='<p style="color:var(--muted)">No projects found.</p>';return}
  filtered.forEach(p=>{const c=createCard(p);projectsEl.appendChild(c)});
}

// Modal + Form
const openAdd = el('openAdd');
const closeAdd = el('closeAdd');
const cancelAdd = el('cancelAdd');
const addForm = el('addForm');

function showModal(){modal.setAttribute('aria-hidden','false')}
function hideModal(){modal.setAttribute('aria-hidden','true')}

openAdd.addEventListener('click',showModal);
closeAdd.addEventListener('click',hideModal);
cancelAdd.addEventListener('click',hideModal);

addForm.addEventListener('submit',e=>{
  e.preventDefault();
  const f = new FormData(addForm);
  const title=f.get('title').trim();
  const description=f.get('description').trim();
  const tech = f.get('tech')?f.get('tech').split(',').map(t=>t.trim()).filter(Boolean):[];
  const github=f.get('github').trim();
  const demo=f.get('demo').trim();
  const proj={title,description,tech,github,demo};
  projects.unshift(proj);
  save(); renderTags(); renderProjects(); hideModal(); addForm.reset();
});

// Search
searchEl.addEventListener('input',()=>renderProjects());

// GitHub fetch
el('fetchGH').addEventListener('click',async ()=>{
  const user = el('ghUser').value.trim();
  if(!user) return alert('Enter a GitHub username to fetch repos');
  try{
    const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100`);
    if(!res.ok) throw new Error('GitHub fetch failed');
    const data = await res.json();
    const mapped = data.map(r=>({
      title:r.name,
      description:r.description||'No description',
      tech:(r.language? [r.language] : []),
      github:r.html_url,
      demo:r.homepage||''
    }));
    // Merge: add new repos to front but avoid duplicates by github url
    const existing = new Set(projects.map(p=>p.github));
    mapped.forEach(m=>{if(m.github && !existing.has(m.github)) projects.unshift(m)});
    save(); renderTags(); renderProjects();
  }catch(err){console.error(err);alert('Could not fetch GitHub repos. Check console.')}
});

// Theme toggle
const themeToggle = el('themeToggle');
function applyTheme(t){
  if(t==='light'){document.body.classList.add('light'); themeToggle.innerHTML='<i class="fa fa-sun"></i>'}
  else {document.body.classList.remove('light'); themeToggle.innerHTML='<i class="fa fa-moon"></i>'}
  localStorage.setItem(THEME_KEY,t);
}
themeToggle.addEventListener('click',()=>{
  const current = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(current==='dark'?'light':'dark');
});

// Init
function init(){
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(savedTheme);
  load(); renderTags(); renderProjects();
}

init();
