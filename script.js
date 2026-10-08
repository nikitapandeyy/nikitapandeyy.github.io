// Projects come from projects.json, so adding a project = adding one entry there.
fetch('projects.json')
  .then(res => res.json())
  .then(projects => {
    const box = document.getElementById('project-list');
    box.innerHTML = projects.map(p => `
      <div class="project">
        <h3>${p.name}</h3>
        <p class="tags">${p.tags}</p>
        <p>${p.description}</p>
        ${p.link ? `<p><a href="${p.link}">${p.linkText || 'view'}</a></p>` : ''}
      </div>
    `).join('');
  })
  .catch(() => {
    document.getElementById('project-list').innerHTML = '<p class="muted">Projects could not be loaded.</p>';
  });

// train follows scroll progress
const train = document.getElementById('train');
function moveTrain() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? window.scrollY / max : 0;
  train.style.transform = `translateX(${p * (window.innerWidth - 44)}px)`;
}
window.addEventListener('scroll', moveTrain, { passive: true });
window.addEventListener('resize', moveTrain);
moveTrain();
