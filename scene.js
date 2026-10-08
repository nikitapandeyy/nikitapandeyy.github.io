// 3D pastel hills for the hero (Three.js).
(function () {
  const hero = document.querySelector('.hero');
  if (!window.THREE || !hero) return;

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
  catch (e) { return; }            // no WebGL: keep the flat SVG hills

  const canvas = renderer.domElement;
  canvas.className = 'hero-canvas';
  hero.prepend(canvas);
  hero.classList.add('has-3d');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf8e4e4, 20, 65);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);
  camera.position.set(0, 6, 18);

  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const sun = new THREE.DirectionalLight(0xffffff, 0.55);
  sun.position.set(-6, 10, 6);
  scene.add(sun);

  // hill layers: colour, depth (z), base height (y), hill size, wave offset
  const PALETTE = [0xcfe3f0, 0xf6d5dc, 0xd4e8d0];
  const layerDefs = [
    [0xcfe3f0, -16, 0.0, 3.4, 1.0],
    [0xf6d5dc, -8, -1.0, 2.6, 2.3],
    [0xd4e8d0, 0, -2.2, 1.9, 3.7],
    [0xf3ead8, 8, -3.2, 1.2, 5.1]
  ];
  const layers = layerDefs.map(([color, z, y, amp, seed]) => {
    const geo = new THREE.PlaneGeometry(100, 14, 140, 12);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const h = Math.sin(x * 0.12 + seed) + 0.5 * Math.sin(x * 0.31 + seed * 2) + 0.25 * Math.sin(x * 0.7 + seed * 3);
      pos.setZ(i, amp * (h + 1.2));
    }
    geo.rotateX(-Math.PI / 2);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color, flatShading: true }));
    mesh.position.set(0, y, z);
    scene.add(mesh);
    return mesh;
  });

  // small floating pastel shapes
  const shapes = [];
  for (let i = 0; i < 14; i++) {
    const geo = i % 2 ? new THREE.IcosahedronGeometry(0.35, 0) : new THREE.OctahedronGeometry(0.42);
    const mat = new THREE.MeshLambertMaterial({ color: PALETTE[i % 3], flatShading: true });
    const m = new THREE.Mesh(geo, mat);
    m.position.set((Math.random() - 0.5) * 30, 3 + Math.random() * 6, -10 + Math.random() * 14);
    m.userData = { baseY: m.position.y, speed: 0.4 + Math.random() * 0.6, phase: Math.random() * 6 };
    scene.add(m);
    shapes.push(m);
  }

  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let mx = 0, sy = 0, t = 0, visible = true, looping = false;
  window.addEventListener('mousemove', e => { mx = (e.clientX / window.innerWidth - 0.5) * 2; });
  window.addEventListener('scroll', () => { sy = Math.min(window.scrollY, 700); }, { passive: true });

  function draw() {
    camera.position.x += (mx * 3 - camera.position.x) * 0.04;
    camera.position.y += ((6 - sy * 0.004) - camera.position.y) * 0.05;
    camera.position.z = 18 - sy * 0.012;
    camera.lookAt(0, 1.5, 0);
    layers.forEach((l, i) => { l.position.x = Math.sin(t * 0.5 + i) * 0.6; });
    shapes.forEach(s => {
      s.position.y = s.userData.baseY + Math.sin(t * s.userData.speed + s.userData.phase) * 0.4;
      s.rotation.y += 0.004; s.rotation.x += 0.002;
    });
    renderer.render(scene, camera);
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { draw(); return; }   // one still frame

  function loop() {
    if (!visible) { looping = false; return; }
    t += 0.01;
    draw();
    requestAnimationFrame(loop);
  }
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && !looping) { looping = true; loop(); }
  }).observe(hero);
  looping = true; loop();
})();
