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
