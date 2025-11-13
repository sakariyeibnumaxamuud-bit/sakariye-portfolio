/* ---------------------------
  Helpers & DOM refs
----------------------------*/
const langSelectTop = document.getElementById('lang');
const miniLang = document.getElementById('miniLang');
const transEls = document.querySelectorAll('[data-en]');
const typingEl = document.querySelector('.typing');
const words = ["Software Developer","Cyber Security","Video Editor","Graphic Designer","Forex Trader"];
const themeSelect = document.getElementById('themeSelect');
const modeSelect = document.getElementById('modeSelect');
const mainNav = document.getElementById('mainNav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.main-nav .nav-link');
const skillFills = document.querySelectorAll('.skill-fill');

/* ---------------------------
  Language functions
----------------------------*/
function applyLanguage(lang = 'en'){
  transEls.forEach(el => {
    const v = el.getAttribute(`data-${lang}`);
    if(v !== null) el.textContent = v;
  });
}
if(langSelectTop) {
  langSelectTop.addEventListener('change', e => {
    applyLanguage(e.target.value);
    // sync miniLang
    if(miniLang) miniLang.value = e.target.value;
  });
}
if(miniLang){
  miniLang.addEventListener('change', e => {
    applyLanguage(e.target.value);
    if(langSelectTop) langSelectTop.value = e.target.value;
  });
}
// default language
applyLanguage('en');

/* ---------------------------
  Typing animation
----------------------------*/
let wIndex = 0, cIndex = 0, deleting = false;
function typeLoop(){
  if(!typingEl) return;
  const current = words[wIndex];
  if(!deleting){
    typingEl.textContent = current.slice(0, cIndex + 1);
    cIndex++;
    if(cIndex === current.length){
      deleting = true;
      setTimeout(typeLoop, 900);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, cIndex - 1);
    cIndex--;
    if(cIndex === 0){
      deleting = false;
      wIndex = (wIndex + 1) % words.length;
    }
  }
  setTimeout(typeLoop, deleting ? 80 : 120);
}
typeLoop();

/* ---------------------------
  Theme switcher
----------------------------*/
function applyTheme(theme){
  document.documentElement.classList.remove('theme-dark','theme-light','theme-gradient');
  if(theme === 'light') document.documentElement.classList.add('theme-light');
  else if(theme === 'gradient') document.documentElement.classList.add('theme-gradient');
  else document.documentElement.classList.add('theme-dark');
  // store preference
  try{ localStorage.setItem('site_theme', theme); }catch(e){}
}
if(themeSelect){
  themeSelect.addEventListener('change', e => applyTheme(e.target.value));
}
// restore saved theme
const savedTheme = (localStorage.getItem('site_theme') || 'dark');
if(themeSelect) themeSelect.value = savedTheme;
applyTheme(savedTheme);

/* ---------------------------
  Mode switcher (portfolio / freelancer / student)
  - shows/hides services/pricing or education emphasis
----------------------------*/
function applyMode(mode){
  // services section visible only for freelancer
  const services = document.getElementById('services');
  if(services){
    if(mode === 'freelancer'){ services.removeAttribute('aria-hidden'); services.classList.remove('hidden'); }
    else { services.setAttribute('aria-hidden','true'); services.classList.add('hidden'); }
  }
  // portfolio grid can adjust — (we keep all projects, but you could filter by tags)
  // education emphasis for student: scroll to education or highlight
  // (simple: if student, scroll to education on apply)
  if(mode === 'student'){
    const education = document.getElementById('education');
    if(education) education.scrollIntoView({behavior:'smooth', block:'start'});
  }
  try{ localStorage.setItem('site_mode', mode); }catch(e){}
}
if(modeSelect){
  modeSelect.addEventListener('change', e => applyMode(e.target.value));
}
const savedMode = (localStorage.getItem('site_mode') || 'portfolio');
if(modeSelect) modeSelect.value = savedMode;
applyMode(savedMode);

/* ---------------------------
  Hamburger & mobile nav
----------------------------*/
if(hamburger){
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    hamburger.classList.toggle('is-open');
  });
  // close on click outside
  document.addEventListener('click', (e)=> {
    if(!mainNav.contains(e.target) && !hamburger.contains(e.target)){
      mainNav.classList.remove('open');
      hamburger.classList.remove('is-open');
    }
  });
}

/* ---------------------------
  Smooth scroll + nav active on scroll
----------------------------*/
function onScroll(){
  const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href')));
  const scrollPos = window.scrollY + 140;
  sections.forEach((sec, i) => {
    if(!sec) return;
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if(scrollPos >= top && scrollPos < bottom){
      navLinks.forEach(l => l.classList.remove('active'));
      navLinks[i].classList.add('active');
    }
  });
}
window.addEventListener('scroll', onScroll);
navLinks.forEach(a => {
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if(!target) return;
    window.scrollTo({top: target.offsetTop - 100, behavior:'smooth'});
    mainNav.classList.remove('open');
  });
});

/* ---------------------------
  Animate skill bars when visible
----------------------------*/
function animateSkills(){
  skillFills.forEach(fill => {
    const rect = fill.getBoundingClientRect();
    if(rect.top < window.innerHeight - 100){
      const w = fill.getAttribute('data-width') || '0%';
      fill.style.width = w;
    }
  });
}
window.addEventListener('scroll', animateSkills);
window.addEventListener('load', () => { animateSkills(); onScroll(); });

/* ---------------------------
  CV download (optional placeholder)
----------------------------*/
const downloadCV = document.getElementById('downloadCV');
if(downloadCV){
  // if you have real CV file in folder, set href; otherwise leave as '#'
  // downloadCV.href = 'Sakariye_CV.pdf';
  downloadCV.addEventListener('click', (e)=>{
    if(downloadCV.getAttribute('href') === '#'){ 
      e.preventDefault();
      alert('Please add your CV file "Sakariye_CV.pdf" to the site folder to enable download.');
    }
  });
}

/* ---------------------------
  Persist language selection
----------------------------*/
try{
  const savedLang = localStorage.getItem('site_lang') || 'en';
  if(langSelectTop) langSelectTop.value = savedLang;
  if(miniLang) miniLang.value = savedLang;
  applyLanguage(savedLang);
}catch(e){}
if(langSelectTop){
  langSelectTop.addEventListener('change', (e)=>{
    localStorage.setItem('site_lang', e.target.value);
  });
}
if(miniLang){
  miniLang.addEventListener('change', (e)=>{
    localStorage.setItem('site_lang', e.target.value);
  });
}
