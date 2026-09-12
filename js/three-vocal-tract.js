/**
 * Three.js 3D Vocal Tract & Articulatory Anatomical Simulation
 * High-fidelity 3D cross-section and oral cavity showing:
 * - Dynamic Tongue kinematics (tip, blade, dorsum, root)
 * - Upper & lower lips with lip-sync morphing
 * - Hard palate, soft palate (velum), uvula
 * - Upper/lower incisors & jaw aperture
 * - Dynamic pulmonary airflow particle system (nasal vs oral burst vectors)
 * - Voicing glow and larynx vibration
 */

class VocalTract3DViewer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = Object.assign({
      readOnly: false,
      enableControls: true,
      initialPhonemeId: 'ka',
      showAirflow: true,
      cameraView: 'sagittal' // 'sagittal', 'perspective', 'frontal'
    }, options);

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animId = null;

    // Anatomical components
    this.components = {
      tongue: null,
      velum: null,
      upperLip: null,
      lowerLip: null,
      jaw: null,
      upperTeeth: null,
      lowerTeeth: null,
      palate: null,
      pharynx: null,
      larynx: null,
      airflowParticles: null
    };

    // Current kinematic targets
    this.kinematics = {
      tongueHeight: 0.85,
      tongueAdvancement: -0.65,
      tongueCurl: 0.0,
      jawOpen: 0.35,
      lipOpen: 0.4,
      lipProtrusion: 0.1,
      velumElevated: true,
      airflowRate: 1.0,
      isVoiced: false
    };

    // Morph interpolation states
    this.currentKinematics = { ...this.kinematics };

    // Airflow particles data
    this.particles = [];
    this.particleCount = 140;

    this.init();
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 320;

    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a); // Deep modern slate navy

    // Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    this.setCameraView(this.options.cameraView);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    this.setupLighting();

    // Build anatomical structures
    this.buildAnatomy();

    // Build airflow particle engine
    this.buildAirflowParticles();

    // Mouse drag interaction
    this.setupInteraction();

    // Resize observer
    window.addEventListener('resize', () => this.onResize());

    // Start render loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    keyLight.position.set(5, 8, 10);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 0.9);
    rimLight.position.set(-8, -4, -6);
    this.scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xff6b81, 1.0, 15);
    pointLight.position.set(0, 0, 4);
    this.scene.add(pointLight);
  }

  setCameraView(view) {
    this.options.cameraView = view;
    if (view === 'sagittal') {
      // Direct cross-section side profile
      this.camera.position.set(0, 0.2, 9.5);
      this.camera.lookAt(0, 0.1, 0);
    } else if (view === 'perspective') {
      // 3/4 Angle
      this.camera.position.set(4.5, 2.5, 8.0);
      this.camera.lookAt(0, 0.1, 0);
    } else if (view === 'frontal') {
      // Front view of lips
      this.camera.position.set(6.8, 0.2, 3.5);
      this.camera.lookAt(1.8, 0.0, 0);
    }
  }

  buildAnatomy() {
    const anatomyGroup = new THREE.Group();
    this.anatomyGroup = anatomyGroup;

    // 1. Head Profile Silhouette Outline
    const headCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.8, -3.2, 0), // Neck back
      new THREE.Vector3(-3.2, -1.0, 0),
      new THREE.Vector3(-3.0, 2.0, 0),  // Occiput
      new THREE.Vector3(-2.0, 3.8, 0),  // Crown
      new THREE.Vector3(0.0, 4.2, 0),
      new THREE.Vector3(2.2, 3.2, 0),   // Forehead
      new THREE.Vector3(3.2, 1.8, 0),   // Nose bridge
      new THREE.Vector3(4.0, 1.0, 0),   // Nose tip
      new THREE.Vector3(2.8, 0.8, 0),   // Subnasale
      new THREE.Vector3(2.9, 0.5, 0),   // Upper lip outline
      new THREE.Vector3(2.6, -0.4, 0),  // Lower lip outline
      new THREE.Vector3(2.8, -1.2, 0),  // Chin
      new THREE.Vector3(1.5, -2.4, 0),  // Submental
      new THREE.Vector3(1.0, -3.2, 0)   // Throat anterior
    ]);
    const headGeom = new THREE.BufferGeometry().setFromPoints(headCurve.getPoints(80));
    const headMat = new THREE.LineBasicMaterial({ color: 0x334155, linewidth: 2, transparent: true, opacity: 0.6 });
    const headLine = new THREE.Line(headGeom, headMat);
    anatomyGroup.add(headLine);

    // 2. Hard Palate (Maxilla bone)
    const palateShape = new THREE.Shape();
    palateShape.moveTo(2.2, 0.6);
    palateShape.quadraticCurveTo(1.2, 1.5, -0.8, 1.3);
    palateShape.lineTo(-0.8, 2.0);
    palateShape.quadraticCurveTo(1.2, 2.2, 2.6, 1.2);
    palateShape.closePath();

    const extrudeSettings = { depth: 1.4, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.08, bevelThickness: 0.08 };
    const palateGeom = new THREE.ExtrudeGeometry(palateShape, extrudeSettings);
    palateGeom.center();
    palateGeom.translate(0.6, 1.4, 0);
    const palateMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.3,
      metalness: 0.1
    });
    this.components.palate = new THREE.Mesh(palateGeom, palateMat);
    anatomyGroup.add(this.components.palate);

    // Palate label text sprite / anchor
    this.createLabelSprite(this.components.palate, "Hard Palate", 0.6, 2.0, 0.8);

    // 3. Soft Palate (Velum) & Uvula
    const velumGeom = new THREE.CylinderGeometry(0.18, 0.08, 1.4, 16);
    velumGeom.translate(0, -0.7, 0);
    const velumMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.4,
      metalness: 0.0
    });
    this.components.velum = new THREE.Mesh(velumGeom, velumMat);
    this.components.velum.position.set(-0.7, 1.3, 0);
    this.components.velum.rotation.z = 0.4;
    anatomyGroup.add(this.components.velum);
    this.createLabelSprite(this.components.velum, "Velum (Soft Palate)", -1.2, 1.6, 0.8);

    // 4. Upper Incisors (Teeth)
    const toothGeom = new THREE.BoxGeometry(0.28, 0.5, 1.2);
    const toothMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    this.components.upperTeeth = new THREE.Mesh(toothGeom, toothMat);
    this.components.upperTeeth.position.set(2.0, 0.6, 0);
    anatomyGroup.add(this.components.upperTeeth);

    // 5. Lower Jaw & Incisors
    const jawGroup = new THREE.Group();
    jawGroup.position.set(0.2, -1.8, 0); // Pivot near TMJ
    this.components.jaw = jawGroup;

    const lowerToothMesh = new THREE.Mesh(toothGeom, toothMat);
    lowerToothMesh.position.set(1.7, 1.8, 0);
    jawGroup.add(lowerToothMesh);
    this.components.lowerTeeth = lowerToothMesh;

    // Lower Lip
    const lipGeom = new THREE.SphereGeometry(0.35, 16, 16);
    lipGeom.scale(1.2, 0.8, 2.2);
    const lipMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 });
    this.components.lowerLip = new THREE.Mesh(lipGeom, lipMat);
    this.components.lowerLip.position.set(2.3, 1.8, 0);
    jawGroup.add(this.components.lowerLip);

    anatomyGroup.add(jawGroup);

    // 6. Upper Lip
    this.components.upperLip = new THREE.Mesh(lipGeom, lipMat);
    this.components.upperLip.position.set(2.5, 0.65, 0);
    anatomyGroup.add(this.components.upperLip);

    // 7. Dynamic Tongue (Lofted organic geometry)
    this.updateTongueMesh();

    // 8. Pharynx Posterior Wall
    const pharynxCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, 1.6, 0),
      new THREE.Vector3(-2.1, 0.5, 0),
      new THREE.Vector3(-2.2, -1.0, 0),
      new THREE.Vector3(-2.0, -2.4, 0)
    ]);
    const pharynxGeom = new THREE.TubeGeometry(pharynxCurve, 24, 0.25, 8, false);
    const pharynxMat = new THREE.MeshStandardMaterial({ color: 0xdb2777, roughness: 0.6, transparent: true, opacity: 0.85 });
    this.components.pharynx = new THREE.Mesh(pharynxGeom, pharynxMat);
    anatomyGroup.add(this.components.pharynx);

    // 9. Larynx / Vocal Folds
    const larynxGeom = new THREE.BoxGeometry(0.9, 0.6, 0.9);
    const larynxMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.3
    });
    this.components.larynx = new THREE.Mesh(larynxGeom, larynxMat);
    this.components.larynx.position.set(-1.6, -2.6, 0);
    anatomyGroup.add(this.components.larynx);
    this.createLabelSprite(this.components.larynx, "Vocal Folds (Larynx)", -1.6, -3.2, 0.8);

    this.scene.add(anatomyGroup);
  }

  createLabelSprite(parent, text, x, y, z) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.roundRect(4, 4, 248, 56, 12);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.roundRect(4, 4, 248, 56, 12);
    ctx.stroke();

    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(x, y, z);
    sprite.scale.set(1.4, 0.35, 1);
    this.anatomyGroup.add(sprite);
  }

  /**
   * Rebuilds tongue geometry based on kinematic parameters
   */
  updateTongueMesh() {
    if (this.components.tongue) {
      this.anatomyGroup.remove(this.components.tongue);
      this.components.tongue.geometry.dispose();
    }

    const { tongueHeight, tongueAdvancement, tongueCurl } = this.currentKinematics;

    // Tongue spline control nodes
    // Root -> Dorsum -> Blade -> Tip
    const root = new THREE.Vector3(-1.3, -1.8, 0);
    const base = new THREE.Vector3(-1.0, -0.6, 0);

    // Dorsum coordinates influenced by height and backward advancement
    const dorsumX = -0.4 + tongueAdvancement * 0.5;
    const dorsumY = 0.0 + tongueHeight * 1.1;
    const dorsum = new THREE.Vector3(dorsumX, dorsumY, 0);

    // Blade
    const bladeX = 0.7 + tongueAdvancement * 0.4;
    const bladeY = -0.1 + (tongueHeight * 0.7) + (tongueCurl * 0.4);
    const blade = new THREE.Vector3(bladeX, bladeY, 0);

    // Tip position
    const tipX = 1.6 + (tongueAdvancement * 0.3) - (tongueCurl * 0.4);
    const tipY = -0.2 + (tongueCurl * 0.95);
    const tip = new THREE.Vector3(tipX, tipY, 0);

    const tongueCurve = new THREE.CatmullRomCurve3([root, base, dorsum, blade, tip]);
    const tongueGeom = new THREE.TubeGeometry(tongueCurve, 32, 0.65, 12, false);

    const tongueMat = new THREE.MeshStandardMaterial({
      color: 0xf87171, // Vibrant soft coral red
      roughness: 0.35,
      metalness: 0.05,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.15
    });

    this.components.tongue = new THREE.Mesh(tongueGeom, tongueMat);
    this.anatomyGroup.add(this.components.tongue);
  }

  /**
   * Build Airflow Simulation Particles
   */
  buildAirflowParticles() {
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      // Start in trachea / larynx
      positions[i * 3] = -1.6 + (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = -2.8 + Math.random() * 4.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      // Cyan / electric airflow color
      colors[i * 3] = 0.22;
      colors[i * 3 + 1] = 0.74;
      colors[i * 3 + 2] = 0.97;

      this.particles.push({
        t: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
        isNasal: false
      });
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle sprite
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(56,189,248,0.8)');
    grad.addColorStop(1, 'rgba(14,165,233,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const pTex = new THREE.CanvasTexture(canvas);
    const pMat = new THREE.PointsMaterial({
      size: 0.35,
      map: pTex,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.components.airflowParticles = new THREE.Points(particleGeom, pMat);
    this.scene.add(this.components.airflowParticles);
  }

  /**
   * Updates airflow particle paths along oral cavity or nasal cavity
   */
  updateAirflow() {
    if (!this.components.airflowParticles || !this.options.showAirflow) return;

    const positions = this.components.airflowParticles.geometry.attributes.position.array;
    const colors = this.components.airflowParticles.geometry.attributes.color.array;

    const velumClosed = this.currentKinematics.velumElevated;

    for (let i = 0; i < this.particleCount; i++) {
      const p = this.particles[i];
      p.t += p.speed * this.currentKinematics.airflowRate;
      if (p.t > 1.0) {
        p.t = 0;
        // Nasal or oral decision
        p.isNasal = !velumClosed && Math.random() > 0.4;
      }

      let x, y, z;
      if (p.isNasal) {
        // Path through pharynx into nasal cavity and out nose
        if (p.t < 0.4) {
          x = -1.6 + (p.t / 0.4) * 0.6;
          y = -2.8 + (p.t / 0.4) * 4.2;
        } else {
          const subT = (p.t - 0.4) / 0.6;
          x = -1.0 + subT * 4.8;
          y = 1.4 + Math.sin(subT * Math.PI) * 0.5 - subT * 0.4;
        }
        // Tint green-teal for nasal
        colors[i * 3] = 0.16;
        colors[i * 3 + 1] = 0.93;
        colors[i * 3 + 2] = 0.65;
      } else {
        // Path through oral cavity
        if (p.t < 0.4) {
          // Trachea / Pharynx up
          x = -1.6 + (p.t / 0.4) * 0.8;
          y = -2.8 + (p.t / 0.4) * 3.3;
        } else {
          // Oral channel forward
          const subT = (p.t - 0.4) / 0.6;
          x = -0.8 + subT * 4.2;
          // Follow palate profile
          const palateY = 0.5 - Math.sin(subT * Math.PI * 0.8) * 0.3;
          y = palateY;
        }

        // Voiced or burst coloring
        if (this.currentKinematics.isVoiced) {
          colors[i * 3] = 0.99;
          colors[i * 3 + 1] = 0.78;
          colors[i * 3 + 2] = 0.12; // Gold voiced
        } else {
          colors[i * 3] = 0.22;
          colors[i * 3 + 1] = 0.74;
          colors[i * 3 + 2] = 0.97; // Sky blue
        }
      }

      z = Math.sin(p.t * 12 + i) * 0.2;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    this.components.airflowParticles.geometry.attributes.position.needsUpdate = true;
    this.components.airflowParticles.geometry.attributes.color.needsUpdate = true;
  }

  /**
   * Set target phoneme articulatory configuration
   */
  setPhoneme(phoneme) {
    if (!phoneme) return;

    const sl = phoneme.soundLevel;
    const tp = sl.tonguePosition || { height: 0.5, advancement: 0.0, curl: 0.0 };
    const lp = sl.lipPosition || { open: 0.4, round: 0.1 };
    const jp = sl.jawPosition || { open: 0.3 };

    this.kinematics.tongueHeight = tp.height;
    this.kinematics.tongueAdvancement = tp.advancement;
    this.kinematics.tongueCurl = tp.curl;
    this.kinematics.jawOpen = jp.open;
    this.kinematics.lipOpen = lp.open;
    this.kinematics.lipProtrusion = lp.round;
    this.kinematics.velumElevated = !phoneme.id.includes('na') && !phoneme.id.includes('ma');
    this.kinematics.isVoiced = phoneme.category.includes('Voiced') || phoneme.category.includes('Anthastha') || phoneme.category.includes('Vowel');
  }

  setManualKinematics(param, value) {
    if (this.kinematics[param] !== undefined) {
      this.kinematics[param] = parseFloat(value);
    }
  }

  toggleComponentVisibility(name, visible) {
    if (this.components[name]) {
      this.components[name].visible = visible;
    }
    if (name === 'airflow') {
      this.options.showAirflow = visible;
      if (this.components.airflowParticles) {
        this.components.airflowParticles.visible = visible;
      }
    }
  }

  setupInteraction() {
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    this.container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !this.options.enableControls) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;

      if (this.anatomyGroup) {
        this.anatomyGroup.rotation.y += deltaX * 0.008;
        this.anatomyGroup.rotation.x += deltaY * 0.008;
        this.anatomyGroup.rotation.x = Math.max(-0.6, Math.min(0.6, this.anatomyGroup.rotation.x));
      }
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    // Touch support for tablets/smartphones
    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !this.options.enableControls || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouse.x;
      const deltaY = e.touches[0].clientY - prevMouse.y;

      if (this.anatomyGroup) {
        this.anatomyGroup.rotation.y += deltaX * 0.008;
        this.anatomyGroup.rotation.x += deltaY * 0.008;
      }
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    // Smooth lerping of kinematics
    const lerp = 0.12;
    this.currentKinematics.tongueHeight += (this.kinematics.tongueHeight - this.currentKinematics.tongueHeight) * lerp;
    this.currentKinematics.tongueAdvancement += (this.kinematics.tongueAdvancement - this.currentKinematics.tongueAdvancement) * lerp;
    this.currentKinematics.tongueCurl += (this.kinematics.tongueCurl - this.currentKinematics.tongueCurl) * lerp;
    this.currentKinematics.jawOpen += (this.kinematics.jawOpen - this.currentKinematics.jawOpen) * lerp;
    this.currentKinematics.lipOpen += (this.kinematics.lipOpen - this.currentKinematics.lipOpen) * lerp;

    // Apply jaw angle
    if (this.components.jaw) {
      this.components.jaw.rotation.z = -this.currentKinematics.jawOpen * 0.45;
    }

    // Apply velum angle
    if (this.components.velum) {
      const targetVelumAngle = this.kinematics.velumElevated ? 0.48 : 0.0;
      this.components.velum.rotation.z += (targetVelumAngle - this.components.velum.rotation.z) * lerp;
    }

    // Apply vocal folds vibration glow
    if (this.components.larynx) {
      if (this.kinematics.isVoiced) {
        const pulse = 0.5 + Math.sin(Date.now() * 0.02) * 0.3;
        this.components.larynx.material.emissiveIntensity = pulse;
      } else {
        this.components.larynx.material.emissiveIntensity = 0.1;
      }
    }

    // Recompute dynamic tongue curve
    this.updateTongueMesh();

    // Stream airflow particles
    this.updateAirflow();

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

window.VocalTract3DViewer = VocalTract3DViewer;
