/* ═══════════════════════════════════════
   CANVAS BACKGROUND
═══════════════════════════════════════ */
(function(){
  const cvs = document.getElementById('cvs');
  const ctx = cvs.getContext('2d');
  let W, H, pts = [];
  const PALETTE = ['rgba(123,108,240,','rgba(34,211,200,','rgba(232,121,160,'];

  function resize(){ W = cvs.width = window.innerWidth; H = cvs.height = window.innerHeight; }

  function Pt(){
    this.x = Math.random()*W; this.y = Math.random()*H;
    this.vx = (Math.random()-.5)*.18; this.vy = (Math.random()-.5)*.18;
    this.r = Math.random()*1.6+.4;
    this.c = PALETTE[Math.floor(Math.random()*3)];
    this.a = Math.random()*.4+.1;
  }
  Pt.prototype.tick = function(){
    this.x+=this.vx; this.y+=this.vy;
    if(this.x<0||this.x>W)this.vx*=-1;
    if(this.y<0||this.y>H)this.vy*=-1;
  };

  function draw(){
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<150){
          ctx.beginPath();
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=`rgba(123,108,240,${(1-d/150)*.055})`;
          ctx.lineWidth=.5; ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(pts[i].x,pts[i].y,pts[i].r,0,Math.PI*2);
      ctx.fillStyle=pts[i].c+pts[i].a+')';
      ctx.fill();
      pts[i].tick();
    }
    requestAnimationFrame(draw);
  }

  resize();
  pts = Array.from({length:70},()=>new Pt());
  draw();
  setTimeout(()=>cvs.classList.add('on'),120);
  window.addEventListener('resize',resize,{passive:true});
})();

/* ═══════════════════════════════════════
   NAV SCROLL
═══════════════════════════════════════ */
const navEl = document.getElementById('nav');
window.addEventListener('scroll',()=>navEl.classList.toggle('stuck',scrollY>60),{passive:true});

/* ═══════════════════════════════════════
   REVEAL
═══════════════════════════════════════ */
const revObs = new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');revObs.unobserve(e.target);}
}),{threshold:.1});
document.querySelectorAll('.rev').forEach(el=>revObs.observe(el));

/* ═══════════════════════════════════════
   FULL-PAGE ARTICLE VIEW
═══════════════════════════════════════ */
const articlePage = document.getElementById('article-page');
const mainContent = document.getElementById('main-content');
const aTag = document.getElementById('a-tag');
const aDate = document.getElementById('a-date');
const aRt = document.getElementById('a-rt');
const aTitle = document.getElementById('a-title');
const aBody = document.getElementById('a-body');
const aHeroImg = document.getElementById('article-hero-img');
const backBtn = document.getElementById('article-back-btn');
const footerBack = document.getElementById('article-footer-back');

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function openArticle(idx) {
  const a = ARTICLES[idx];
  if (!a) return;

  aTag.textContent = a.category;
  aDate.textContent = a.dateDisplay;
  aRt.textContent = a.readTime;
  aTitle.textContent = a.title;
  aBody.innerHTML = a.body;
  aHeroImg.style.backgroundImage = `url('${a.cover}')`;

  mainContent.classList.add('hidden');
  navEl.style.display = 'none';

  articlePage.classList.add('entering');
  articlePage.style.display = 'block';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      articlePage.classList.remove('entering');
      articlePage.classList.add('open');
    });
  });

  articlePage.scrollTop = 0;
  document.body.style.overflow = 'hidden';

  history.pushState({ article: idx }, '', '#/writing/' + slugify(a.title));
}

function closeArticle() {
  articlePage.classList.remove('open');
  articlePage.style.display = 'none';
  mainContent.classList.remove('hidden');
  navEl.style.display = '';
  document.body.style.overflow = '';
  history.pushState({}, '', window.location.pathname);
}

if (backBtn) backBtn.addEventListener('click', (e) => { e.preventDefault(); closeArticle(); });
if (footerBack) footerBack.addEventListener('click', (e) => { e.preventDefault(); closeArticle(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && articlePage.classList.contains('open')) closeArticle();
});

window.addEventListener('popstate', () => {
  const hash = window.location.hash;
  if (hash.startsWith('#/writing/')) {
    const slug = hash.replace('#/writing/', '');
    const idx = ARTICLES.findIndex(a => slugify(a.title) === slug);
    if (idx >= 0) openArticle(idx);
  } else {
    if (articlePage.classList.contains('open')) closeArticle();
  }
});

/* ═══════════════════════════════════════
   CATEGORY CSS CLASS HELPER
═══════════════════════════════════════ */
function catClass(cat) {
  const map = { 'AI Systems': 'ai', 'Architecture': 'ar', 'Reflection': 'rf', 'Leadership': 'ld' };
  return map[cat] || 'ar';
}

/* ═══════════════════════════════════════
   RENDER THINKING SECTION
═══════════════════════════════════════ */
function renderThinking() {
  const sidebar = document.getElementById('thinking-sidebar');
  const cards = document.getElementById('thinking-cards');
  if (!sidebar || !cards || !THINKING.length) return;

  THINKING.forEach((t, i) => {
    const item = document.createElement('a');
    item.href = '#';
    item.className = 't-sb-item' + (i === 0 ? ' on' : '');
    item.onclick = () => false;
    item.innerHTML = '<span class="t-sb-pip"></span><span class="t-sb-txt">' + t.sidebarText + '</span>';
    sidebar.appendChild(item);
  });

  THINKING.forEach(t => {
    const div = document.createElement('div');
    div.className = 'tc' + (t.featured ? ' feat' : '');
    div.innerHTML =
      '<span class="tc-tag ' + t.tagClass + '">' + t.tag + '</span>' +
      '<h3>' + t.title + '</h3>' +
      '<p>' + t.body + '</p>';
    cards.appendChild(div);
  });
}

/* ═══════════════════════════════════════
   RENDER WRITING CARDS
═══════════════════════════════════════ */
function renderWritingCard(article, idx, big) {
  const div = document.createElement('div');
  div.className = 'pc' + (big ? ' big' : '');
  div.dataset.article = idx;
  div.innerHTML =
    '<div class="pc-cover" style="background-image:url(\'' + article.coverThumb + '\')"></div>' +
    '<div class="pc-meta"><span class="pc-cat ' + catClass(article.category) + '">' + article.category + '</span><span class="pc-date">' + article.dateDisplay + '</span></div>' +
    '<h3>' + article.title + '</h3>' +
    '<p>' + article.excerpt + '</p>' +
    '<div class="pc-foot"><span>' + article.readTime + '</span><span class="pc-arr">→</span></div>';
  div.addEventListener('click', () => openArticle(idx));
  return div;
}

function renderWritings() {
  const featRow = document.getElementById('feat-row');
  const gridRow1 = document.getElementById('grid-row-1');
  const gridRow2 = document.getElementById('grid-row-2');
  if (!featRow || !ARTICLES.length) return;

  // Featured row: first 2 articles (first one is big)
  if (ARTICLES[0]) featRow.appendChild(renderWritingCard(ARTICLES[0], 0, true));
  if (ARTICLES[1]) featRow.appendChild(renderWritingCard(ARTICLES[1], 1, false));

  // Second row: articles 2-4
  for (let i = 2; i < 5 && i < ARTICLES.length; i++) {
    gridRow1.appendChild(renderWritingCard(ARTICLES[i], i, false));
  }

  // Third row (hidden): articles 5+
  for (let i = 5; i < ARTICLES.length; i++) {
    gridRow2.appendChild(renderWritingCard(ARTICLES[i], i, false));
  }
}

/* ═══════════════════════════════════════
   WRITING FILTERS
═══════════════════════════════════════ */
function initFilters() {
  document.querySelectorAll('.wf[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.wf').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const f = btn.dataset.filter;
      document.querySelectorAll('.pc').forEach(card => {
        if (f === 'all') {
          card.style.display = 'flex';
        } else {
          const hascat = card.querySelector('.pc-cat');
          const catTxt = hascat ? hascat.textContent.trim() : '';
          card.style.display = catTxt === f ? 'flex' : 'none';
        }
      });
      if (f !== 'all') {
        document.getElementById('grid-row-2').style.display = 'grid';
        document.getElementById('load-more').style.display = 'none';
      }
    });
  });
}

/* ═══════════════════════════════════════
   LOAD MORE
═══════════════════════════════════════ */
function initLoadMore() {
  var btn = document.getElementById('load-more');
  if (!btn) return;
  btn.addEventListener('click', function() {
    document.getElementById('grid-row-2').style.display = 'grid';
    this.style.display = 'none';
    document.querySelectorAll('#grid-row-2 .pc').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .55s ease, transform .55s ease';
      el.style.transitionDelay = (i * 0.06) + 's';
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'none'; }, 50);
    });
  });
}

/* ═══════════════════════════════════════
   VIEW ALL
═══════════════════════════════════════ */
var viewAllBtn = document.getElementById('view-all-btn');
if (viewAllBtn) {
  viewAllBtn.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('grid-row-2').style.display = 'grid';
    document.getElementById('load-more').style.display = 'none';
    document.getElementById('writing').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════
   SMOOTH SCROLL FOR NAV
═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href.startsWith('#/')) return;
    const tgt = document.querySelector(href);
    if (tgt) { e.preventDefault(); tgt.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ═══════════════════════════════════════
   FLOATING CHIP ANIMATION DELAYS
═══════════════════════════════════════ */
document.querySelectorAll('.h-chips .chip').forEach((chip, i) => {
  chip.style.setProperty('--i', i);
});

/* ═══════════════════════════════════════
   PARALLAX FOR HERO ON SCROLL
═══════════════════════════════════════ */
const hero = document.getElementById('hero');
if (hero) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      hero.style.transform = `translateY(${y * 0.15}px)`;
      hero.style.opacity = 1 - (y / (window.innerHeight * 1.2));
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════
   MOBILE BURGER MENU
═══════════════════════════════════════ */
const burger = document.getElementById('nav-burger');
const drawer = document.getElementById('nav-drawer');
if (burger && drawer) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });
  drawer.querySelectorAll('.nd-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ═══════════════════════════════════════
   PYTHON SYNTAX HIGHLIGHTING
═══════════════════════════════════════ */
function highlightPython(code) {
  var tokens = [];
  var placeholder = function(cls, text) {
    var idx = tokens.length;
    tokens.push('<span class="' + cls + '">' + text + '</span>');
    return '\x00T' + idx + '\x00';
  };

  // Escape HTML first
  var s = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // Triple-quoted strings
  s = s.replace(/"""[\s\S]*?"""|'''[\s\S]*?'''/g, function(m){ return placeholder('st', m); });
  // Comments
  s = s.replace(/#[^\n]*/g, function(m){ return placeholder('cm', m); });
  // Decorators
  s = s.replace(/@\w+/g, function(m){ return placeholder('dc', m); });
  // f-strings and regular strings
  s = s.replace(/f?"[^"]*"|f?'[^']*'/g, function(m){ return placeholder('st', m); });
  // Keywords
  s = s.replace(/\b(class|def|async|await|for|if|elif|else|return|import|from|with|as|yield|raise|try|except|finally|not|and|or|in|is|None|True|False|self|lambda|pass|break|continue)\b/g, function(m){ return placeholder('kw', m); });
  // Numbers
  s = s.replace(/\b(\d+\.?\d*)\b/g, function(m){ return placeholder('nr', m); });
  // Restore tokens
  s = s.replace(/\x00T(\d+)\x00/g, function(_, i){ return tokens[parseInt(i)]; });
  return s;
}

/* ═══════════════════════════════════════
   RENDER SHOWCASE SECTION
═══════════════════════════════════════ */
function renderShowcase() {
  var container = document.getElementById('showcase-container');
  if (!container || typeof SHOWCASE === 'undefined' || !SHOWCASE.length) return;

  SHOWCASE.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'sc-item' + (i === 0 ? ' active' : '');
    div.dataset.showcase = i;

    div.innerHTML =
      '<div class="sc-header">' +
        '<div class="sc-header-text">' +
          '<span class="sc-tag ' + item.tagClass + '">' + item.tag + '</span>' +
          '<h3>' + item.title + '</h3>' +
          '<p>' + item.description + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="sc-content">' +
        '<div class="sc-diagram-wrap">' +
          '<div class="sc-diagram-label">Architecture</div>' +
          item.diagram +
        '</div>' +
        '<div class="sc-code-wrap">' +
          '<div class="sc-code-header">' +
            '<span class="sc-code-dot"></span><span class="sc-code-dot"></span><span class="sc-code-dot"></span>' +
            '<span class="sc-code-lang">' + item.lang + '</span>' +
          '</div>' +
          '<pre class="sc-code-block"><code>' + highlightPython(item.code) + '</code></pre>' +
        '</div>' +
      '</div>';

    container.appendChild(div);
  });
}

function initShowcaseTabs() {
  var tabs = document.querySelectorAll('.sc-tab');
  var container = document.getElementById('showcase-container');
  if (!tabs.length || !container) return;

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t){ t.classList.remove('on'); });
      tab.classList.add('on');
      var idx = parseInt(tab.dataset.sc);
      container.querySelectorAll('.sc-item').forEach(function(item, i) {
        if (i === idx) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });
  });
}

/* ═══════════════════════════════════════
   INIT — Render content from content-data.js
═══════════════════════════════════════ */
renderThinking();
renderWritings();
renderShowcase();
initShowcaseTabs();
initFilters();
initLoadMore();

// Check hash on load for deep-linked articles
(function() {
  const hash = window.location.hash;
  if (hash.startsWith('#/writing/')) {
    const slug = hash.replace('#/writing/', '');
    const idx = ARTICLES.findIndex(a => slugify(a.title) === slug);
    if (idx >= 0) setTimeout(() => openArticle(idx), 300);
  }
})();
