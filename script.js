document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && !prefersReducedMotion && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  }, { passive: true });
}

if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.reveal, .reveal-lines').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: el.classList.contains('reveal-lines') ? 44 : 30 },
      { opacity: 1, y: 0, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });

  gsap.fromTo('.hero .display', { scale: 1.03 }, { scale: 1, duration: 1.5, ease: 'power3.out' });
  gsap.to('.hero-orbit', { yPercent: 35, rotation: 55, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-side', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  document.querySelectorAll('.project-card').forEach((card) => {
    gsap.fromTo(card, { scale: 0.975, y: 70 }, { scale: 1, y: 0, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 28%', scrub: 0.7 } });
    const visual = card.querySelector('.project-visual');
    if (visual) gsap.fromTo(visual, { yPercent: -5 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  gsap.to('#webgl', { opacity: 0.36, ease: 'none', scrollTrigger: { trigger: '.experience', start: 'top bottom', end: 'bottom top', scrub: true } });

  gsap.utils.toArray('.project-card').forEach((card, i) => {
    const colors = ['#ff9f43','#ff5fa2','#7c4dff','#47d7ff'];
    ScrollTrigger.create({
      trigger: card,
      start: 'top 45%',
      end: 'bottom 45%',
      onEnter: () => document.documentElement.style.setProperty('--accent', colors[i % colors.length]),
      onEnterBack: () => document.documentElement.style.setProperty('--accent', colors[i % colors.length])
    });
  });

  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (e) => {
      const r = button.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.16;
      const y = (e.clientY - r.top - r.height / 2) * 0.16;
      gsap.to(button, { x, y, duration: 0.3, ease: 'power2.out' });
    });
    button.addEventListener('pointerleave', () => gsap.to(button, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1,0.45)' }));
  });
}

if (window.THREE) {
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.4));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5.5;
  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(1.48, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0xff5fa2, wireframe: true, transparent: true, opacity: 0.28 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(1.7, -0.15, 0);
  group.add(mesh);

  const haloGeometry = new THREE.TorusGeometry(1.85, 0.006, 8, 160);
  const haloMaterial = new THREE.MeshBasicMaterial({ color: 0x47d7ff, transparent: true, opacity: 0.24 });
  const halo = new THREE.Mesh(haloGeometry, haloMaterial);
  halo.position.copy(mesh.position);
  halo.rotation.x = Math.PI * 0.42;
  halo.rotation.y = Math.PI * 0.14;
  group.add(halo);

  const halo2 = new THREE.Mesh(new THREE.TorusGeometry(2.22, 0.004, 8, 160), new THREE.MeshBasicMaterial({ color: 0xffbe0b, transparent: true, opacity: 0.15 }));
  halo2.position.copy(mesh.position);
  halo2.rotation.x = Math.PI * 0.2;
  halo2.rotation.y = Math.PI * 0.52;
  group.add(halo2);

  const pointsGeo = new THREE.BufferGeometry();
  const count = window.innerWidth < 700 ? 90 : 180;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pointsMat = new THREE.PointsMaterial({ color: 0xfff3d6, size: 0.017, transparent: true, opacity: 0.34 });
  const points = new THREE.Points(pointsGeo, pointsMat);
  scene.add(points);

  let mouseX = 0, mouseY = 0, scrollY = 0;
  if (!prefersReducedMotion) {
    window.addEventListener('pointermove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.45;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.45;
    }, { passive: true });
    window.addEventListener('scroll', () => { scrollY = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1); }, { passive: true });
  }

  const clock = new THREE.Clock();
  const animate = () => {
    const t = clock.getElapsedTime();
    if (!prefersReducedMotion) {
      group.rotation.x += ((mouseY * 0.5 + scrollY * 0.4) - group.rotation.x) * 0.025;
      group.rotation.y += ((mouseX * 0.55 + t * 0.06) - group.rotation.y) * 0.025;
      mesh.rotation.x = t * 0.08;
      mesh.rotation.y = t * 0.11;
      halo.rotation.z = t * 0.045;
      halo2.rotation.z = -t * 0.026;
      points.rotation.y = t * 0.012;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.4));
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}
