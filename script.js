// 1. Projects come from projects.json (add a project = add one entry there)
fetch('projects.json')
  .then(res => res.json())
  .then(projects => {
    document.getElementById('project-list').innerHTML = projects.map(p => `
      <div class="project">
        <h3>${p.name}</h3>
        <p class="tags">${p.tags}</p>
        <p>${p.description}</p>
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