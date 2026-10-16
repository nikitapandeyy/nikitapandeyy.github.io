// 1. Projects come from projects.json (add a project = add one entry there)
fetch('projects.json')
  .then(res => res.json())
  .then(projects => {
    document.getElementById('project-list').innerHTML = projects.map(p => `
      <div class="project">
        <h3>${p.name}</h3>
        ${p.summary ? `<p class="summary">${p.summary}</p>` : ''}
        <p class="tags">${p.tags}</p>
        ${p.points ? `<ul>${p.points.map(x => `<li>${x}</li>`).join('')}</ul>` : `<p>${p.description}</p>`}
        ${p.link ? `<a href="${p.link}">${p.linkText || 'view'}</a>` : ''}
      </div>
    `).join('');
  })
  .catch(() => {
    document.getElementById('project-list').innerHTML = '<p class="muted">Projects could not be loaded.</p>';
  });

// 2. Welcome screen: the cat waves by cycling its three pictures
(function () {
  const intro = document.getElementById('intro');
  const frames = intro.querySelectorAll('.stage img');
  const order = [0, 1, 2, 1];           // paw down, paw up, paw tilted, paw up
  let step = 0, delay = 280, timer;

  let seen = false;
  try { seen = sessionStorage.getItem('seen') === '1'; } catch (e) {}
  if (seen) { intro.remove(); document.body.classList.remove('intro-open'); return; }

  function wave() {
    frames.forEach((img, i) => img.classList.toggle('on', i === order[step]));
    step = (step + 1) % order.length;
    timer = setTimeout(wave, delay);
  }
  wave();

  // tap or click the cat to make it wave faster for a moment
  intro.querySelector('.stage').addEventListener('pointerdown', () => {
    delay = 140;
    setTimeout(() => { delay = 280; }, 1500);
  });

  function enter() {
    intro.classList.add('leave');
    document.body.classList.remove('intro-open');
    try { sessionStorage.setItem('seen', '1'); } catch (e) {}
    setTimeout(() => { clearTimeout(timer); intro.remove(); }, 900);
  }
  document.getElementById('enter').addEventListener('click', enter);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') enter(); });
})();

// 3. The winged cat floats down the page as you scroll; the girl watches it
(function () {
  const cat = document.getElementById('flycat');
  const girl = [...document.querySelectorAll('#girl img')];
  const wings = [...cat.querySelectorAll('img')];
  const says = cat.querySelector('.cat-says');
  const lines = ['meow!', 'keep scrolling!', 'I love my human', 'ask her about RAG'];
  let n = 0, timer;
  cat.addEventListener('click', () => {      // tap the cat and it talks
    says.textContent = lines[n++ % lines.length];
    says.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => { says.textContent = 'say hi!'; says.classList.toggle('show', progress() > 0.93); }, 1800);
  });
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let target = 0, cur = 0, dir = 1, last = window.scrollY;

  function progress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? window.scrollY / max : 0;
  }
  function pose(p) {                     // looking up, looking higher, smiling (found the cat)
    const i = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
    says.classList.toggle('show', p > 0.93);
    girl.forEach((img, k) => img.classList.toggle('on', k === i));
  }
  function place() {
    const room = window.innerHeight - cat.offsetHeight - 24;
    const sway = reduce ? 0 : Math.sin(cur * 12) * 14;
    const tilt = reduce ? 0 : dir * 5;
    cat.style.transform = `translate(${sway}px, ${12 + cur * room}px) rotate(${tilt}deg)`;
  }

  window.addEventListener('scroll', () => {
    target = progress();
    dir = window.scrollY > last ? 1 : -1;   // tilts one way going down, the other going up
    last = window.scrollY;
    pose(target);
    if (reduce) { cur = target; place(); }
  }, { passive: true });
  window.addEventListener('resize', place);

  target = cur = progress(); pose(target); place();
  if (reduce) return;

  setInterval(() => wings.forEach(img => img.classList.toggle('on')), 380);  // flap
  (function loop() {
    cur += (target - cur) * 0.08;           // glide instead of jump
    place();
    requestAnimationFrame(loop);
  })();
})();

// 4. "copy email" button
const copyBtn = document.getElementById('copy-email');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('nikitapandey1020@gmail.com')
      .then(() => { copyBtn.textContent = 'copied!'; setTimeout(() => { copyBtn.textContent = 'copy email'; }, 1600); })
      .catch(() => { window.location.href = 'mailto:nikitapandey1020@gmail.com'; });
  });
}

// 5. menu highlights the section you are reading
const navLinks = [...document.querySelectorAll('.nav a')];
const navSecs = navLinks.map(a => document.querySelector(a.getAttribute('href')));
window.addEventListener('scroll', () => {
  let cur = -1;
  navSecs.forEach((sec, i) => { if (sec && sec.getBoundingClientRect().top < window.innerHeight * 0.4) cur = i; });
  navLinks.forEach((a, i) => a.classList.toggle('active', i === cur));
}, { passive: true });

// 6. "how I ship ML": tap or hover a step to see what I did there
const flowSteps = [
  'PyTorch, scikit-learn and Hugging Face models, tested with controlled experiments. MetaRoBERTa reached 90.5% Macro F1, and I caught a feature that would not exist at prediction time.',
  'FastAPI services. The hybrid retrieval service answers with sub-400 ms p95 latency.',
  'Services are packaged with Docker. AgentRedTeam runs this way.',
  'Automated tests and CI/CD with GitHub Actions on AgentRedTeam. At STMicroelectronics I automated QA checks and cut a 2-hour workflow to about 20 minutes.',
  'The AgentRedTeam backend runs on GCP Cloud Run with PostgreSQL.',
  'AI agents and RAG answers are checked with rule-based checks, an LLM judge, and grounding tests against the source passages.'
];
const flowBtns = [...document.querySelectorAll('#flow button')];
const flowText = document.getElementById('flow-text');
function showStep(i) {
  flowBtns.forEach((b, k) => b.classList.toggle('on', k === i));
  flowText.textContent = flowSteps[i];
}
flowBtns.forEach((b, i) => {
  b.addEventListener('click', () => showStep(i));
  b.addEventListener('mouseenter', () => showStep(i));
});
showStep(0);

// 7. buttons: stars burst out on click; "coming soon" buttons do nothing yet
document.addEventListener('click', e => {
  const t = e.target.closest('.soc, .btn-main, .btn-soft');
  if (!t) return;
  if (t.classList.contains('soon')) e.preventDefault();
  const r = t.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  for (let i = 0; i < 10; i++) {
    const sp = document.createElement('span');
    sp.className = 'spark';
    sp.textContent = ['\u273F', '\u2726', '\u2665'][i % 3];
    const ang = (Math.PI * 2 * i) / 10, dist = 40 + Math.random() * 40;
    sp.style.left = x + 'px'; sp.style.top = y + 'px';
    sp.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    sp.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
    document.body.appendChild(sp);
    setTimeout(() => sp.remove(), 800);
  }
});
