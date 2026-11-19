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
