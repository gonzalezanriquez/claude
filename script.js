document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.reveal, .reveal-lines', {
    opacity: 1,
    y: 0,
    duration: 1.05,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: {
      trigger: 'body',
      start: 'top 90%'
    }
  });

  document.querySelectorAll('.reveal, .reveal-lines').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      }
    );
  });

  gsap.to('.hero-orbit', {
    yPercent: 28,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('#webgl', {
    opacity: 0.32,
    ease: 'none',
    scrollTrigger: {
      trigger: '.experience',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
}

if (window.THREE) {
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5.5;

  const geometry = new THREE.IcosahedronGeometry(1.45, 2);
  const material = new THREE.MeshBasicMaterial({
    color: 0xc7ff4a,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(1.7, -0.15, 0);
  scene.add(mesh);

  const pointsGeo = new THREE.BufferGeometry();
  const count = 180;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pointsMat = new THREE.PointsMaterial({ color: 0xf2efe8, size: 0.016, transparent: true, opacity: 0.3 });
  const points = new THREE.Points(pointsGeo, pointsMat);
  scene.add(points);

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('pointermove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  }, { passive: true });

  const clock = new THREE.Clock();
  const animate = () => {
    const t = clock.getElapsedTime();
    if (!prefersReducedMotion) {
      mesh.rotation.x = t * 0.08 + mouseY;
      mesh.rotation.y = t * 0.11 + mouseX;
      points.rotation.y = t * 0.015;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}
