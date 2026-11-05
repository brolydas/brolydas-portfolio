// ==========================================================================
// 1MINUS1 3D WEBGL UNDULATING PIXEL CURTAIN / GRID (ATMOSPHERIC)
// Inspired by 1minus1.com WebGL Scene in Navy & Gold (#0A1628 / #E5B84B)
// Subtle, elegant background depth that preserves 100% text legibility
// ==========================================================================

(function() {
  if (typeof THREE === "undefined") return;

  const canvas = document.getElementById("webglCanvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 8, 32);
  camera.lookAt(0, -2, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create 3D waving pixel grid
  const cols = 55;
  const rows = 35;
  const count = cols * rows;
  const spacing = 1.4;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const basePositions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const goldColor = new THREE.Color("#E5B84B");
  const steelColor = new THREE.Color("#7C93B5");

  let i3 = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - cols / 2) * spacing;
      const z = (r - rows / 2) * spacing;
      const y = 0;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      // Color variation across grid
      const factor = (Math.sin(c * 0.12) + Math.cos(r * 0.12)) * 0.5 + 0.5;
      const cMix = goldColor.clone().lerp(steelColor, factor * 0.5);
      colors[i3] = cMix.r;
      colors[i3 + 1] = cMix.g;
      colors[i3 + 2] = cMix.b;

      i3 += 3;
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // Custom square pixel point texture
  const pCanvas = document.createElement("canvas");
  pCanvas.width = 32;
  pCanvas.height = 32;
  const pCtx = pCanvas.getContext("2d");
  pCtx.fillStyle = "#ffffff";
  pCtx.fillRect(2, 2, 28, 28);
  const pointTexture = new THREE.CanvasTexture(pCanvas);
  pointTexture.magFilter = THREE.NearestFilter;
  pointTexture.minFilter = THREE.NearestFilter;

  const material = new THREE.PointsMaterial({
    size: 2.8,
    map: pointTexture,
    transparent: true,
    opacity: 0.22,
    vertexColors: true,
    depthWrite: false
  });

  const pointsMesh = new THREE.Points(geometry, material);
  pointsMesh.rotation.x = 0.55;
  pointsMesh.position.y = -6;
  scene.add(pointsMesh);

  // Pointer & Scroll Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener("pointermove", (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let scrollOffset = 0;
  window.addEventListener("scroll", () => {
    scrollOffset = window.scrollY * 0.0025;
  }, { passive: true });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Lerp mouse
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Subtle tilt
    pointsMesh.rotation.y = mouseX * 0.12;
    pointsMesh.rotation.x = 0.55 - mouseY * 0.08;

    const pos = geometry.attributes.position.array;

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const baseX = basePositions[idx];
        const baseZ = basePositions[idx + 2];

        // Gentle, mesmerizing wave equations
        const wave1 = Math.sin(baseX * 0.1 + time * 1.4 + scrollOffset) * 1.6;
        const wave2 = Math.cos(baseZ * 0.12 + time * 1.1) * 1.4;
        const distFromCenter = Math.sqrt(baseX * baseX + baseZ * baseZ);
        const wave3 = Math.sin(distFromCenter * 0.08 - time * 1.8) * 1.0;

        // Interactive pointer ripple
        const dx = baseX - (mouseX * 14);
        const dz = baseZ - (mouseY * 14);
        const distPointer = Math.sqrt(dx * dx + dz * dz);
        const pointerRipple = Math.exp(-distPointer * 0.18) * Math.sin(distPointer * 0.45 - time * 2.5) * 2.2;

        pos[idx + 1] = wave1 + wave2 + wave3 + pointerRipple;
        idx += 3;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }

  animate();
})();
