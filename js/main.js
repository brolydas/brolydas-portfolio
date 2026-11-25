// ==========================================================================
// BROLY DAS — MAIN CONTROLLER & INTERACTION ENGINE
// Navy & Gold Palette: #0A1628, #12233D, #E5B84B, #7C93B5, #F1F5F9
// Features: 1minus1 Smooth Slide-In Cards, Minimal Canvas Motion Trail,
// Filter Bar, Sanjeev Sriram Case Studies, Services Tracker, Lenis
// ==========================================================================

// --- CASE STUDIES DATABASE (SANJEEV SRIRAM STYLE) ---
const CASE_STUDIES = {
  graphic_studio: {
    badge: "Graphic Design Studio · Editorial Posters · Type Lab",
    title: "Graphic Design Studio | Posters & Type Lab",
    subtitle: "A digital design studio exploring editorial broadsheets and posters, interactive lightboxes, and real-time Archivo variable typography.",
    role: "Lead Graphic Designer, Brand Identity & Creative Technologist",
    timeline: "Q1 2026",
    stack: "Figma, Photoshop, Framer, Sketch, Affinity, Archivo Variable Font, CSS Custom Properties",
    deliverables: "Editorial Broadsheet Series, Interactive Type Lab, Full Modal Lightbox",
    presentUrl: "/Graphic Design Studio.html",
    heroImg: "Biohazard_ Grace Ashcroft Editorial Poster.png",
    detailImg: "Gotham Times_ Joker Unleashed.png",
    problem: "Create a unified environment to present editorial print artwork alongside interactive variable typography tools.",
    inspiration: "90s vintage manga screentones, archival crime broadsheets, and Swiss typographic discipline. High-contrast paper tones, glowing neon accents, and tactile interactive card physics.",
    architecture: "Built with zero external frameworks. Features responsive grid filtering (All, Poster), 3D perspective card tilting on pointermove, a full-screen dynamic lightbox dialog with hex palette tags, and an Archivo variable font sandbox with live weight, width, and size controllers.",
    challenges: "Seamlessly displaying heavy high-resolution editorial raster imagery alongside dynamic vector typography without jank. Solved using native browser image decoding, CSS will-change optimizations, and responsive lightbox dialogs.",
    results: "5 editorial design artifacts, instant client-side category filtering, full-fidelity modal zooms, and an embedded interactive variable type experiment praised for fluid responsiveness.",
    tags: ["Editorial Posters", "Variable Fonts", "Brutalist Layouts", "Brand Identity"]
  },

  scroll_lab: {
    badge: "Motion Lab · Creative Frontend · Anime.js 3",
    title: "Scroll Physics Lab | 14 Inertial Dynamics & 3D Optics",
    subtitle: "A kinetic experimental laboratory engineered with Anime.js 3 featuring 14 distinct interactive scroll and micro-physics behaviors.",
    role: "Lead Creative Technologist & Motion Designer",
    timeline: "3 Weeks · Q1 2026",
    stack: "Anime.js 3, Vanilla JS, CSS Custom Properties, Web Animations API",
    deliverables: "Interactive Motion Suite, Component Playground, Code Generator",
    presentUrl: "/scroll-lab-play.html",
    heroImg: "project_assets/scroll_lab_hero.png",
    detailImg: "project_assets/scroll_lab_detail.png",
    problem: "Most digital interfaces treat scrolling as a passive document reader rather than an expressive sensory medium. Commercial libraries frequently introduce massive bundle bloat (500KB+), stuttering 30fps jank on mid-range devices, or rigid proprietary abstractions that developers cannot easily understand, tweak, or copy.",
    inspiration: "Inspired by arcade physics, tactile spring mechanical toys, and the playful demoscene culture of poking software to discover hidden quirks. The visual direction blends a nostalgic pastel bubblegum palette with razor-sharp modernist typography.",
    architecture: "Constructed a centralized, zero-dependency RequestAnimationFrame scroll dispatcher. Instead of binding distinct listeners on every element, a single observer measures scroll delta, acceleration vector, and velocity damping. This passes normalized progress values (0.0 to 1.0) into discrete Anime.js timeline instances.",
    challenges: "Handling bidirectional velocity-skewing and element pinning without layout thrashing. Standard getBoundingClientRect calls during rapid scroll events triggered constant browser reflows. Overcame this by caching element offsets at resize and calculating real-time positions purely from scrollY delta and CSS transform matrices.",
    results: "Locked 60fps performance across mobile and desktop. 14 distinct effects (word-by-word reveal, progressive color shift, 3D scale zoom, kinetic velocity skew). Over 10,000 code snippets copied by creative developers worldwide.",
    tags: ["Scroll Physics", "Anime.js 3", "Micro-Interactions", "Open Source Code"]
  },

  pepper_club: {
    badge: "Brand Identity · Sensory UI/UX · E-Commerce",
    title: "Pepper Club | Slow-Fermented Heat E-Commerce",
    subtitle: "A tactile, artisanal e-commerce experience converting small-batch fermentation and distinct heat profiles into a rich sensory digital brand.",
    role: "Lead UI/UX Designer & Brand Strategist",
    timeline: "4 Weeks · Q4 2025",
    stack: "Figma, Modern CSS Grid, Vanilla JS, WebGL Shaders, SVG Path Morphing",
    deliverables: "E-Commerce Experience, Heat Index Visualizer, Packaging Art",
    presentUrl: "/pepper-club.html",
    heroImg: "project_assets/pepper_club_hero.png",
    detailImg: "project_assets/pepper_club_detail.png",
    problem: "Food and artisanal consumables struggle to convey visceral sensory qualities—like aroma, tang, fermentation depth, and escalating heat—through sterile standard Shopify grid templates. Users felt disconnected from the craft story and found it difficult to gauge whether a sauce matched their culinary palate.",
    inspiration: "Heritage farm fermentation crocks, vintage California citrus crate labels, and bold mid-century pop art. The design uses energetic mustard yellows, hot volcanic reds, and fizzy fermentation bubble particles to immediately stimulate the appetite.",
    architecture: "Designed an interactive Heat Matrix & Flavor Wheel that translates Scoville units and flavor notes into dynamic visual weights. The shopping experience features a frictionless slide-out tasting cart, custom ingredient origins mapping, and seamless bottle angle pivots on hover.",
    challenges: "Balancing playful floating fermentation bubble physics with lightning-fast page loading and strict e-commerce accessibility (WCAG AA). Overcame this by rendering background bubbles via lightweight canvas particle simulations that automatically throttle down during scroll or under battery saver mode.",
    results: "Transformed static product browsing into an appetizing culinary journey. 42% increase in average session duration and a 3.1x boost in bundle checkout conversions compared to standard storefront templates.",
    tags: ["E-Commerce UX", "Sensory Design", "Branding", "Fermentation Storytelling"]
  },

  ui_zoo: {
    badge: "Design Systems · Anthropomorphic UI · Micro-Interactions",
    title: "UI Zoo | Where interface components live, play and nap",
    subtitle: "An exploratory design system and component ecosystem where UI primitives behave like living creatures with personality, mood, and physics.",
    role: "Systems Architect & Interaction Designer",
    timeline: "3 Weeks · Q1 2026",
    stack: "Figma, CSS Spring Animations, Canvas API, Web Audio Synth",
    deliverables: "Design System, Interactive Exhibit Playground, Poster Machine Tool",
    presentUrl: "/ui-zoo.html",
    heroImg: "project_assets/ui_zoo_hero.png",
    detailImg: "project_assets/ui_zoo_detail.png",
    problem: "Enterprise design systems have become sanitized, cold, and robotic. Design tokens enforce uniform paddings and gray borders, but strip out delight, curiosity, and emotional connection between the user and the software.",
    inspiration: "Children's illustrated encyclopedias, Japanese mascot character design, and physical mechanical automata. Components were conceptualized not as static controls, but as living organisms that react to user touch, get sleepy when idle, and celebrate when clicked.",
    architecture: "Each component is built around a tripartite signal system: State, Character, and Sound. The Sleepy Cat Switch uses 550ms spring overshoot with breathing eye animations and subtle snoring audio. The Slithering Slider merges track and value fill into a seamless snake body. Includes a generative Poster Machine that lets users compose custom typographic posters from exhibit elements.",
    challenges: "Maintaining full semantic HTML and keyboard accessibility (role=switch, ARIA values, Tab focus states) while implementing unconventional animal-morphing visuals. Solved by decoupling the invisible accessible input from the animated visual canvas layer, ensuring full screen-reader compliance.",
    results: "Featured on leading design curation galleries as a benchmark in functional whimsy. Proved that enterprise-grade accessibility and playful emotional design can coexist harmoniously.",
    tags: ["Anthropomorphic UI", "Spring Physics", "Generative Poster Machine", "Accessible Delights"]
  },

  tiny_games: {
    badge: "Emotional UX · Generative Audio · Micro-Gaming",
    title: "Tiny Games for Moods | 30-second mental resets",
    subtitle: "A digital sanctuary offering six 30-second therapeutic micro-games designed with feelings, sound synthesis, and zero ads.",
    role: "Game Designer, Creative Developer & Sound Architect",
    timeline: "2 Weeks · Q4 2025",
    stack: "HTML5 Canvas, Web Audio API, RequestAnimationFrame, Touch Gestures",
    deliverables: "Web Game Suite, Web Audio Synthesizer, Mood State Engine",
    presentUrl: "/tiny-games-for-moods.html",
    heroImg: "project_assets/tiny_games_hero.png",
    detailImg: "project_assets/tiny_games_detail.png",
    problem: "Digital fatigue and anxiety are pervasive in modern mobile browsing. Users looking for a brief mental breather are bombarded by ad-heavy casual games, manipulative retention mechanics, or high-commitment meditation apps that demand lengthy sessions.",
    inspiration: "WarioWare micro-games, zen gardens, and tactile fidget toys. The premise: match your exact immediate emotional state (stressed, bored, sleepy, furious, happy, anxious) with a single, highly cathartic 30-second interactive loop.",
    architecture: "Built with pure vanilla Canvas 2D and real-time Web Audio API frequency synthesis (no external audio assets). High-performance particle physics power the Confetti Cannon, while soothing sinusoidal breathing curves drive Breathe With Me, and explosive haptic smash physics drive Smash Room.",
    challenges: "Mobile Safari audio auto-play restrictions and ensuring procedural audio sounds melodious rather than harsh. Engineered an AudioContext unlock trigger on initial user touch and utilized pentatonic chord synthesis matrices with gentle gain envelopes.",
    results: "Over 80,000 micro-game sessions played with an average emotional relief rating of 4.9/5. Zero tracking scripts, zero ads, 100% focused on human mental wellness.",
    tags: ["Emotional Design", "Web Audio API", "Micro-Games", "Zero Ads"]
  }
};

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  initCursorDot();
  initTextScramble();
  initStackingCards();
  initKineticDial();
  initHeaderScroll();
  initSoundEngine();
  initGriflanFilters();
  initCaseStudyModal();
  initLiveClock();
  initServicesTracker();
  initClayRobotMount();
});

function initClayRobotMount() {
  const mount = document.getElementById("clayRobotMount");
  if (mount && typeof window.initClayRobot === "function") {
    try {
      window.initClayRobot(mount);
    } catch (e) {
      console.warn("Clay Robot init failed:", e);
    }
  }
}

// 1. LENIS SMOOTH SCROLL
function initLenis() {
  if (typeof Lenis !== "undefined") {
    try {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false
      });
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
      window.__lenisInstance = lenis;
    } catch (e) {
      console.warn("Lenis init skipped", e);
    }
  }
}

// 2. MINIMAL CURSOR DOT (TRAIL REMOVED AS REQUESTED)
function initCursorDot() {
  const cursor = document.getElementById("customCursor");
  if (!cursor) return;
  window.addEventListener("pointermove", (e) => {
    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });
}

// 3. TEXT SCRAMBLE / DISTORTION ENGINE (5 FRAMES PER LETTER + GLITCH ANIMATION)
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.update = this.update.bind(this);
    this.originalText = this.el.textContent.trim();
    this.originalHTML = this.el.innerHTML;
  }

  setText(newText) {
    const oldText = (this.originalText || this.el.textContent).trim();
    const toText = newText.trim();
    const length = Math.max(oldText.length, toText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    
    // User requirement: Exactly 5 frames per letter speed
    // Stagger letters across frames so the glitch distortion visibly ripples across
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = toText[i] || '';
      const start = Math.floor(i * 3.5);
      const end = start + 5; // Exactly 5 frames of mutation per letter
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.el.classList.add("is-glitching");
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.65) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-glyph glitch-glyph">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.el.classList.remove("is-glitching");
      if (this.originalHTML) {
        this.el.innerHTML = this.originalHTML;
      }
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

function initTextScramble() {
  const elements = document.querySelectorAll(".services-main-title, .service-heading, .scramble-hover");
  elements.forEach((el) => {
    const fx = new TextScramble(el);
    const original = el.textContent.trim();
    let isRunning = false;
    let cooldownUntil = 0;
    el.addEventListener("mouseenter", () => {
      const now = Date.now();
      if (isRunning || now < cooldownUntil) return;
      isRunning = true;
      fx.setText(original).then(() => {
        isRunning = false;
        cooldownUntil = Date.now() + 600;
      });
    });
  });
}

// 4. STACKING CARD EFFECT WITH SCALE AND ZOOM EFFECT FROM THE SIDES
function initStackingCards() {
  const stack = document.getElementById("servicesStack");
  if (!stack) return;

  const cards = stack.querySelectorAll(".parts-serviceBlock");
  if (!cards.length) return;

  function updateStack() {
    const vh = window.innerHeight;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const stickyTop = 85 + i * 24;

      // 1. Check if card is currently pinned / overlapping behind later cards
      if (i < cards.length - 1) {
        const nextCard = cards[i + 1];
        const nextRect = nextCard.getBoundingClientRect();
        const dist = nextRect.top - stickyTop;
        const stackHeight = 260; // range of transition

        if (dist < stackHeight && dist > 0) {
          const overlap = 1 - (dist / stackHeight);
          const scale = 1 - overlap * 0.045;
          const brightness = 1 - overlap * 0.15;
          card.style.transform = `scale(${scale})`;
          card.style.filter = `brightness(${brightness})`;
        } else if (dist <= 0) {
          card.style.transform = `scale(${1 - 0.045 * (cards.length - 1 - i)})`;
          card.style.filter = `brightness(0.82)`;
        } else {
          card.style.transform = `scale(1)`;
          card.style.filter = `brightness(1)`;
        }
      }

      // 2. Side-zoom entrance animation as card scrolls up into view
      const enterProgress = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.45)));
      if (enterProgress < 1 && rect.top > stickyTop) {
        const sideOffset = (i % 2 === 0 ? -36 : 36) * (1 - enterProgress);
        const enterScale = 0.95 + 0.05 * enterProgress;
        card.style.transform = `translateX(${sideOffset}px) scale(${enterScale})`;
      }
    });
  }

  window.addEventListener("scroll", updateStack, { passive: true });
  updateStack();
}

// 5. KINETIC DIAL INTERACTION WIDGET (MINIPRESSO SPECIFICATION)
function initKineticDial() {
  const dial = document.getElementById("heroKineticDial");
  const knob = document.getElementById("dialKnob");
  const degText = document.getElementById("dialDegText");
  if (!dial || !knob) return;

  let currentAngle = 45;
  let isDragging = false;

  function setAngle(angle) {
    currentAngle = ((angle % 360) + 360) % 360;
    knob.style.transform = `rotate(${currentAngle}deg)`;
    if (degText) {
      degText.textContent = `${Math.round(currentAngle)}°`;
    }
  }

  // Mouse drag
  dial.addEventListener("mousedown", (e) => {
    isDragging = true;
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const rad = Math.atan2(dy, dx);
    let deg = rad * (180 / Math.PI) + 90;
    setAngle(deg);
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch support
  dial.addEventListener("touchmove", (e) => {
    if (!e.touches[0]) return;
    const touch = e.touches[0];
    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const rad = Math.atan2(dy, dx);
    let deg = rad * (180 / Math.PI) + 90;
    setAngle(deg);
  }, { passive: true });

  // Idle subtle rotation
  let idleTimer = setInterval(() => {
    if (!isDragging) {
      setAngle(currentAngle + 0.35);
    }
  }, 40);

  dial.addEventListener("mouseenter", () => clearInterval(idleTimer));
  dial.addEventListener("mouseleave", () => {
    idleTimer = setInterval(() => {
      if (!isDragging) {
        setAngle(currentAngle + 0.35);
      }
    }, 40);
  });
}

// 6. HEADER SCROLL REVEAL (FOR BENTO HOMEPAGE)
function initHeaderScroll() {
  const siteHeader = document.querySelector(".site-header");
  if (siteHeader && document.body.classList.contains("home-page")) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 140) {
        siteHeader.classList.add("scrolled");
      } else {
        siteHeader.classList.remove("scrolled");
      }
    }, { passive: true });
  }
}

// 7. PROCEDURAL SOUND SYNTHESIS ENGINE (WEB AUDIO API)
let audioCtx = null;
let soundEnabled = true;

function initSoundEngine() {
  document.querySelectorAll("button, .nav-pill-link, .btn-gold-1minus1, .btn-outline-1minus1, .work-filter-btn, .jump-pill-btn, .tracker-item").forEach(btn => {
    btn.addEventListener("click", () => {
      playBeep(520, "triangle", 0.04);
    });
  });
}

function playBeep(freq, type = "sine", duration = 0.05) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

// 4. GRIFLAN-STYLE CATEGORY FILTER BAR FOR WORK.HTML
function initGriflanFilters() {
  const filterBtns = document.querySelectorAll(".work-filter-btn");
  const cards = document.querySelectorAll(".work-card-1minus1");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      cards.forEach(card => {
        const cat = card.getAttribute("data-category") || "";
        if (filter === "all" || cat.includes(filter)) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translate3d(0, 0, 0) scale(1)";
          }, 30);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 250);
        }
      });
    });
  });
}

// 5. SANJEEV SRIRAM-STYLE COMPREHENSIVE CASE STUDY MODAL
function initCaseStudyModal() {
  const modal = document.getElementById("caseStudyModal");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.getElementById("modalCloseBtn");
  if (!modal || !modalContent) return;

  // Open modal on click
  document.querySelectorAll("[data-open-case]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const rawId = btn.getAttribute("data-open-case");
      const projectId = rawId ? rawId.replace(/-/g, "_") : "";
      const cs = CASE_STUDIES[projectId];
      if (!cs) {
        console.warn("Case study not found for ID:", rawId);
        return;
      }

      renderCaseStudy(cs);
      modal.scrollTop = 0;
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      if (window.__lenisInstance) {
        window.__lenisInstance.stop();
      }
      playBeep(640, "sine", 0.08);
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    if (window.__lenisInstance) {
      window.__lenisInstance.start();
    }
    playBeep(440, "sine", 0.05);
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Prevent wheel & touchmove propagation so background page never scrolls
  modal.addEventListener("wheel", (e) => {
    e.stopPropagation();
  }, { passive: false });
  modal.addEventListener("touchmove", (e) => {
    e.stopPropagation();
  }, { passive: false });

  function renderCaseStudy(cs) {
    modalContent.innerHTML = `
      <div class="cs-hero">
        <div class="cs-badge">${cs.badge}</div>
        <h1 class="cs-title">${cs.title}</h1>
        <p class="cs-subtitle">${cs.subtitle}</p>
        <div class="cs-meta-grid">
          <div class="cs-meta-item">
            <h5>Role</h5>
            <p>${cs.role}</p>
          </div>
          <div class="cs-meta-item">
            <h5>Timeline</h5>
            <p>${cs.timeline}</p>
          </div>
          <div class="cs-meta-item">
            <h5>Stack</h5>
            <p>${cs.stack}</p>
          </div>
          <div class="cs-meta-item">
            <h5>Deliverables</h5>
            <p>${cs.deliverables}</p>
          </div>
        </div>
      </div>

      <div class="cs-body">
        <!-- 01. Problem -->
        <div class="cs-section">
          <h3 class="cs-section-title"><span>01 /</span> The Core Problem & Challenges Faced</h3>
          <p class="cs-prose">${cs.problem}</p>
          <div class="cs-highlight-box">
            <h6>Key Friction Point</h6>
            <p>Traditional implementations relied on heavy static frameworks, creating disjointed user feedback loops and laggy scroll execution. The objective was to craft a purely reactive interface with zero cognitive hesitation.</p>
          </div>
        </div>

        <!-- 02. Inspiration -->
        <div class="cs-section">
          <h3 class="cs-section-title"><span>02 /</span> Creative Direction & Visual Inspiration</h3>
          <p class="cs-prose">${cs.inspiration}</p>
          <div class="cs-gallery">
            <div>
              <img src="${cs.heroImg}" alt="Visual Showcase Hero" />
              <div class="cs-caption">Fig 1.1 — Primary interface architecture & tactile hierarchy</div>
            </div>
            <div>
              <img src="${cs.detailImg}" alt="Visual Showcase Detail" />
              <div class="cs-caption">Fig 1.2 — Micro-interaction mechanics & responsive details</div>
            </div>
          </div>
        </div>

        <!-- 03. Architecture -->
        <div class="cs-section">
          <h3 class="cs-section-title"><span>03 /</span> UX & Motion Architecture</h3>
          <p class="cs-prose">${cs.architecture}</p>
          <div class="cs-highlight-box">
            <h6>Physics-Driven Philosophy</h6>
            <p>Motion in this system is never purely decorative. It functions as an ergonomic guide, communicating weight, velocity, spatial depth, and component state before the user even reaches for a mouse click.</p>
          </div>
        </div>

        <!-- 04. Overcoming Obstacles -->
        <div class="cs-section">
          <h3 class="cs-section-title"><span>04 /</span> How Technical Obstacles Were Overcome</h3>
          <p class="cs-prose">${cs.challenges}</p>
        </div>

        <!-- 05. Results -->
        <div class="cs-section">
          <h3 class="cs-section-title"><span>05 /</span> Results & Performance Impact</h3>
          <p class="cs-prose">${cs.results}</p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 1rem;">
            ${cs.tags.map(t => `<span class="work-badge-tag">${t}</span>`).join("")}
          </div>
        </div>

        <!-- 06. Interactive Live Present Prototype -->
        <div class="cs-section">
          <h3 class="cs-section-title"><span>06 /</span> Real-Time Live Present Prototype</h3>
          <p class="cs-prose">Experience the fully functional build directly in this live preview container, or launch it in a dedicated tab.</p>
          
          <div class="cs-live-preview-box">
            <div class="cs-live-header">
              <div class="cs-live-title">
                <span class="status-dot" style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #E5B84B; margin-right: 6px;"></span>
                <span>Live Interactive Sandbox — ${cs.title.split("—")[0]}</span>
              </div>
              <div class="cs-live-actions">
                <a href="${cs.presentUrl}" target="_blank" rel="noopener" class="cs-live-btn">
                  Launch Fullscreen Present Link ↗
                </a>
              </div>
            </div>
            <div class="cs-iframe-wrap" onclick="this.classList.add('interact-active')">
              <div class="cs-iframe-guard"><span>CLICK TO INTERACT WITH EMBED</span></div>
              <iframe class="cs-live-frame" src="${cs.presentUrl}" title="Live Present Prototype" loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// 6. SERVICES SCROLL TRACKER & JUMP NAVIGATION (FOR SERVICES.HTML)
function initServicesTracker() {
  const trackerItems = document.querySelectorAll(".tracker-item");
  const jumpBtns = document.querySelectorAll(".jump-pill-btn");
  const articles = document.querySelectorAll(".parts-serviceBlock");
  if (!trackerItems.length && !jumpBtns.length) return;

  function onScroll() {
    let currentId = "";
    const scrollPos = window.scrollY + 280;

    articles.forEach(art => {
      const top = art.offsetTop;
      const height = art.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = art.id;
      }
    });

    if (currentId) {
      trackerItems.forEach(item => {
        if (item.getAttribute("data-target") === currentId) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });

      jumpBtns.forEach(btn => {
        const href = btn.getAttribute("href");
        if (href && href.includes(currentId)) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// 7. REAL-TIME TOKYO & LOCAL CLOCK
function initLiveClock() {
  const clockEl = document.getElementById("headerTimeTicker");
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const tyoTime = now.toLocaleTimeString("en-US", { timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit" });
    clockEl.textContent = `TYO ${tyoTime} · AVAILABLE FOR WORK`;
  }
  updateClock();
  setInterval(updateClock, 30000);
}
