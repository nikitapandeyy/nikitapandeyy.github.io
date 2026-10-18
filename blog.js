// The blog list comes from posts.json: to publish a part, paste its Medium link into "url".
fetch('posts.json')
  .then(res => res.json())
  .then(allSeries => {
    document.getElementById('series-list').innerHTML = allSeries.map(s => {
      const done = s.parts.filter(p => p.url).length;
      const rows = s.parts.map((p, i) => `
        <li class="${p.url ? '' : 'todo'}">
          <span class="part-no">${i + 1}</span>
          <span class="part-title">${p.title}</span>
          ${p.url
            ? `<a class="btn-soft" href="${p.url}" target="_blank" rel="noopener">read on Medium</a>`
            : '<span class="soon-tag">coming soon</span>'}
        </li>`).join('');
      return `
        <section class="series">
          <h2>${s.series}</h2>
          <p>${s.blurb}</p>
          <p class="progress">${done} of ${s.parts.length} parts published</p>
          <ul class="parts">${rows}</ul>
        </section>`;
    }).join('');
  })
  .catch(() => {
    document.getElementById('series-list').innerHTML = '<p class="muted">Posts could not be loaded.</p>';
  });
