// ==========================================================================
// 3D STANDOUT CENTERPIECE — HYPER-CRYSTAL (DAIKI FUJITA STYLE)
// Navy & Gold Palette: #0A1628, #12233D, #E5B84B, #7C93B5, #F1F5F9
// ==========================================================================

(function initThreeCrystal() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  let scene, camera, renderer, crystalGroup, innerCore, outerCrystal, wireframe, particles;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let pulseSpeed = 1.0;

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 7;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    crystalGroup = new THREE.Group();
    scene.add(crystalGroup);

    // 1. Outer Faceted Crystal (Icosahedron)
    const outerGeo = new THREE.IcosahedronGeometry(1.6, 0);
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0x7c93b5,
      metalness: 0.15,
      roughness: 0.12,
      transmission: 0.88,
      ior: 1.55,
      reflectivity: 0.9,
      transparent: true,
      opacity: 0.85
    });
    outerCrystal = new THREE.Mesh(outerGeo, outerMat);
    crystalGroup.add(outerCrystal);

    // 2. Inner Glowing Core Polyhedron (Warm Gold Accent: #E5B84B)
    const innerGeo = new THREE.OctahedronGeometry(0.88, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xe5b84b,
      emissive: 0xe5b84b,
      emissiveIntensity: 0.75,
      roughness: 0.25,
      metalness: 0.85
    });
    innerCore = new THREE.Mesh(innerGeo, innerMat);
    crystalGroup.add(innerCore);

    // 3. Delicate Luminous Wireframe cage
    const wireGeo = new THREE.IcosahedronGeometry(1.64, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xe5b84b,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    wireframe = new THREE.Mesh(wireGeo, wireMat);
    crystalGroup.add(wireframe);

    // 4. Orbiting Stardust Particles (Gold & Slate)
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.4 + Math.random() * 2.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      posArray[i] = radius * Math.cos(theta) * Math.cos(phi);
      posArray[i + 1] = radius * Math.sin(phi);
      posArray[i + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xe5b84b,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lights (Navy & Gold Theme)
    const ambientLight = new THREE.AmbientLight(0x7c93b5, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe5b84b, 2.5); // Warm Gold Key Light
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x12233d, 3.0); // Navy Fill Light
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xe5b84b, 1.8, 12);
    pointLight.position.set(0, 0, 3.5);
    scene.add(pointLight);

    // Mouse Listeners
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    animate();
  }

  function onPointerMove(e) {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onResize() {
    if (!renderer || !camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    // Only render if hero is visible in viewport
    if (window.scrollY > window.innerHeight * 1.2) return;

    const delta = clock.getDelta();
    const time = clock.getElapsedTime() * pulseSpeed;

    // Smooth mouse lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Floating Breathing Motion
    crystalGroup.position.y = Math.sin(time * 0.8) * 0.12;

    // Outer crystal rotation
    crystalGroup.rotation.y += 0.005 + mouse.x * 0.015;
    crystalGroup.rotation.x += 0.003 + mouse.y * 0.015;

    // Inner core counter-rotation
    if (innerCore) {
      innerCore.rotation.y -= 0.01;
      innerCore.rotation.z += 0.006;
      const scale = 0.9 + Math.sin(time * 2.0) * 0.06;
      innerCore.scale.set(scale, scale, scale);
    }

    // Particle field slow orbit
    if (particles) {
      particles.rotation.y += 0.0018;
      particles.rotation.x = Math.sin(time * 0.4) * 0.08;
    }

    renderer.render(scene, camera);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
