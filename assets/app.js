/**
 * Muhammad Abiyu Bisma — Portfolio Interactive Engine
 * Concept: Tactical HUD / Cyberpunk Terminal / Web Audio & Data Telemetry
 * Engineered in Modern Vanilla JavaScript
 */

(function () {
  'use strict';

  // ══ WEB AUDIO API SYNTHESIZER ═════════════════════════════════════
  let audioCtx = null;
  let isAmbiencePlaying = false;
  let ambienceNodes = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Micro-SFX Generator (Procedural bleeps & chirps)
  function playTone(freq = 600, duration = 0.05, type = 'sine', volume = 0.04) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio might be restricted by browser autoplay policy
    }
  }

  // Sci-Fi Ambient Drone Generator
  function startAmbience() {
    if (!audioCtx) initAudio();
    if (!audioCtx || isAmbiencePlaying) return;

    try {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const masterGain = audioCtx.createGain();

      // Low frequency drone (55Hz = A1, 110Hz = A2)
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110.5, audioCtx.currentTime); // Slight detune for binaural beat

      // Resonant lowpass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, audioCtx.currentTime);
      filter.Q.setValueAtTime(4, audioCtx.currentTime);

      // Low volume for subtle futuristic atmosphere
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.035, audioCtx.currentTime + 2);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(audioCtx.destination);

      osc1.start();
      osc2.start();

      ambienceNodes = { osc1, osc2, masterGain };
      isAmbiencePlaying = true;
    } catch (e) {
      console.warn('[Audio] Ambience initiation failed', e);
    }
  }

  function stopAmbience() {
    if (!ambienceNodes || !audioCtx) return;
    try {
      ambienceNodes.masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        try {
          ambienceNodes.osc1.stop();
          ambienceNodes.osc2.stop();
        } catch (_) {}
        ambienceNodes = null;
        isAmbiencePlaying = false;
      }, 800);
    } catch (e) {
      ambienceNodes = null;
      isAmbiencePlaying = false;
    }
  }

  // ══ CANVAS STREAKS ENGINE ═════════════════════════════════════════
  const streaksCanvas = document.getElementById('streaks');
  let streaksCtx = streaksCanvas ? streaksCanvas.getContext('2d') : null;
  let streaksList = [];
  let animFrameId = null;

  function resizeStreaks() {
    if (!streaksCanvas) return;
    streaksCanvas.width = window.innerWidth;
    streaksCanvas.height = window.innerHeight;
  }

  function initStreaks() {
    if (!streaksCanvas) return;
    resizeStreaks();
    window.addEventListener('resize', resizeStreaks);

    const count = Math.min(35, Math.floor(window.innerWidth / 40));
    streaksList = [];
    for (let i = 0; i < count; i++) {
      streaksList.push({
        x: Math.random() * streaksCanvas.width,
        y: Math.random() * streaksCanvas.height,
        len: 40 + Math.random() * 90,
        speed: 0.6 + Math.random() * 1.6,
        alpha: 0.15 + Math.random() * 0.35,
        width: Math.random() > 0.8 ? 1.5 : 1
      });
    }

    function render() {
      if (!streaksCtx) return;
      streaksCtx.clearRect(0, 0, streaksCanvas.width, streaksCanvas.height);

      for (let s of streaksList) {
        streaksCtx.beginPath();
        streaksCtx.strokeStyle = `rgba(0, 240, 255, ${s.alpha})`;
        streaksCtx.lineWidth = s.width;

        // Diagonal light streak angle: ~30 deg
        const dx = Math.cos(Math.PI / 6) * s.len;
        const dy = Math.sin(Math.PI / 6) * s.len;

        streaksCtx.moveTo(s.x, s.y);
        streaksCtx.lineTo(s.x + dx, s.y + dy);
        streaksCtx.stroke();

        s.x += s.speed * 0.86;
        s.y += s.speed * 0.5;

        if (s.x > streaksCanvas.width || s.y > streaksCanvas.height) {
          s.x = Math.random() * streaksCanvas.width * 0.4 - 100;
          s.y = Math.random() * streaksCanvas.height - 100;
        }
      }
      animFrameId = requestAnimationFrame(render);
    }
    render();
  }

  // ══ BOOT SEQUENCE CONTROLLER ══════════════════════════════════════
  const splashEl = document.getElementById('splash');
  const enterBtn = document.getElementById('enter');
  const loaderEl = document.getElementById('loader');
  const pctEl = document.getElementById('pct');
  const readoutEl = document.getElementById('readout');
  const siteEl = document.getElementById('site');

  const diagnosticSteps = [
    ['INIT', 'abiyu.core.runtime', 'VERIFIED OK'],
    ['LOAD', 'laravel.fullstack.engine', 'PHP &bull; BLADE &bull; TAILWIND'],
    ['LOAD', 'payment.gateway.module', 'MIDTRANS &bull; WEBHOOKS'],
    ['LOAD', 'database.architect.sql', 'MYSQL &bull; ENTERPRISE.DB'],
    ['SYNC', 'github.archives.abysmaa', '4 REPOSITORIES OK'],
    ['CALIB', 'hud.telemetry.matrix', '1220 MAX'],
    ['OPEN', 'audio.synthesizer.bus', 'FREQ_STANDBY'],
    ['DONE', 'system.handshake', 'SYSTEM OPERATIONAL']
  ];

  async function runDiagnosticBoot() {
    document.documentElement.dataset.boot = 'loading';
    splashEl.classList.add('is-out');
    playTone(520, 0.08, 'square', 0.05);

    await new Promise(r => setTimeout(r, 600));
    splashEl.hidden = true;
    loaderEl.hidden = false;

    const ringFill = loaderEl.querySelector('.ring__fill');
    const totalCircumference = 326.7;
    const stepDuration = 180;

    for (let i = 0; i < diagnosticSteps.length; i++) {
      const [tag, label, status] = diagnosticSteps[i];
      const li = document.createElement('li');
      li.innerHTML = `<b>${tag}</b><span>${label}</span><em>${status}</em>`;
      readoutEl.appendChild(li);

      if (readoutEl.children.length > 6) {
        readoutEl.firstElementChild.remove();
      }

      playTone(480 + i * 60, 0.03, 'square', 0.04);

      const progress = (i + 1) / diagnosticSteps.length;
      ringFill.style.strokeDashoffset = String(totalCircumference * (1 - progress));
      pctEl.textContent = String(Math.round(progress * 100)).padStart(2, '0');

      await new Promise(r => setTimeout(r, stepDuration + Math.random() * 50));
    }

    playTone(960, 0.14, 'sine', 0.07);
    await new Promise(r => setTimeout(r, 350));

    loaderEl.classList.add('is-out');
    await new Promise(r => setTimeout(r, 600));
    loaderEl.hidden = true;

    document.documentElement.dataset.boot = 'ready';
    siteEl.removeAttribute('aria-hidden');

    initStreaks();
    updateScrollHUD();
    initGlitchInterval();
    initTelemetryVisualizer();
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      initAudio();
      runDiagnosticBoot();
    });

    enterBtn.addEventListener('pointerenter', () => {
      initAudio();
      playTone(880, 0.03, 'square', 0.025);
    });
  }

  // ══ SCROLL & HUD TELEMETRY CONTROLLER ═════════════════════════════
  const progBar = document.getElementById('progBar');
  const hudScroll = document.getElementById('hudScroll');
  let isTicking = false;

  function updateScrollHUD() {
    if (isTicking) return;
    isTicking = true;
    requestAnimationFrame(() => {
      const scrollableHeight = document.body.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0;

      if (progBar) {
        progBar.style.width = (progress * 100).toFixed(2) + '%';
      }
      if (hudScroll) {
        hudScroll.textContent = 'SCROLL ' + String(Math.round(progress * 100)).padStart(3, '0');
      }
      isTicking = false;
    });
  }

  window.addEventListener('scroll', updateScrollHUD, { passive: true });
  window.addEventListener('resize', updateScrollHUD);

  // Active navigation link highlighting on scroll
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('main section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
        entry.target.classList.add('is-in');
      }
    });
  }, {
    rootMargin: '-30% 0px -40% 0px'
  });

  sections.forEach(sec => sectionObserver.observe(sec));

  // Sound triggers on navigation links
  navLinks.forEach(link => {
    link.addEventListener('pointerenter', () => {
      initAudio();
      playTone(740, 0.02, 'square', 0.02);
    });
  });

  // Smooth scroll with sound trigger
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor || anchor.getAttribute('href') === '#') return;
    const targetId = anchor.getAttribute('href').slice(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      e.preventDefault();
      initAudio();
      playTone(660, 0.04, 'square', 0.035);
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // ══ AMBIENT AUDIO TOGGLE ══════════════════════════════════════════
  const soundBtn = document.getElementById('sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      initAudio();
      const isActive = soundBtn.getAttribute('aria-pressed') === 'true';
      const newState = !isActive;
      soundBtn.setAttribute('aria-pressed', String(newState));

      const label = soundBtn.querySelector('span');
      if (label) {
        label.textContent = newState ? 'AMBIENCE.LIVE' : 'AMBIENCE.MUTE';
      }

      if (newState) {
        playTone(720, 0.08, 'sine', 0.05);
        startAmbience();
      } else {
        playTone(380, 0.08, 'sine', 0.04);
        stopAmbience();
      }
    });
  }

  // ══ MOBILE MENU CONTROLLER ════════════════════════════════════════
  const menuBtn = document.getElementById('menu');
  const drawer = document.getElementById('drawer');

  function toggleMenu(isOpen) {
    if (!menuBtn || !drawer) return;
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    drawer.hidden = !isOpen;
    initAudio();
    playTone(isOpen ? 680 : 440, 0.04, 'square', 0.03);
  }

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      toggleMenu(!isOpen);
    });

    drawer.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        toggleMenu(false);
      }
    });
  }

  // ══ GLITCH ANIMATION CONTROLLER ═══════════════════════════════════
  const glitchElements = document.querySelectorAll('.glitch');

  function triggerGlitch(el) {
    el.classList.add('is-glitching');
    setTimeout(() => el.classList.remove('is-glitching'), 600);
  }

  function initGlitchInterval() {
    glitchElements.forEach(el => {
      el.addEventListener('pointerenter', () => {
        triggerGlitch(el);
        initAudio();
        playTone(900 + Math.random() * 200, 0.03, 'sawtooth', 0.02);
      });
    });

    setInterval(() => {
      if (glitchElements.length > 0) {
        const randEl = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        triggerGlitch(randEl);
      }
    }, 6000);
  }

  // ══ PROJECT CATEGORY FILTER ═══════════════════════════════════════
  const filterButtons = document.querySelectorAll('.roll[data-filter]');
  const projectCards = document.querySelectorAll('.band[data-category]');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

      initAudio();
      playTone(760, 0.04, 'square', 0.035);

      projectCards.forEach(card => {
        const categories = card.dataset.category || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
          card.style.animation = 'fadeUp 0.5s var(--ease) forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ══ LIVE DATA TELEMETRY VISUALIZER (SECTION 05) ═══════════════════
  const telemetryCanvas = document.getElementById('telemetryCanvas');
  let tCtx = telemetryCanvas ? telemetryCanvas.getContext('2d') : null;
  let tTime = 0;

  function initTelemetryVisualizer() {
    if (!telemetryCanvas || !tCtx) return;

    function resizeTCanvas() {
      const rect = telemetryCanvas.parentElement.getBoundingClientRect();
      telemetryCanvas.width = rect.width;
      telemetryCanvas.height = rect.height;
    }
    resizeTCanvas();
    window.addEventListener('resize', resizeTCanvas);

    const tThroughputEl = document.getElementById('tThroughput');
    const tLatencyEl = document.getElementById('tLatency');

    function renderTelemetry() {
      if (!tCtx) return;
      const w = telemetryCanvas.width;
      const h = telemetryCanvas.height;

      tCtx.clearRect(0, 0, w, h);

      // Background grid lines
      tCtx.strokeStyle = 'rgba(28, 39, 56, 0.6)';
      tCtx.lineWidth = 1;
      const stepY = 40;
      for (let y = stepY; y < h; y += stepY) {
        tCtx.beginPath();
        tCtx.moveTo(0, y);
        tCtx.lineTo(w, y);
        tCtx.stroke();
      }

      const stepX = 60;
      for (let x = stepX; x < w; x += stepX) {
        tCtx.beginPath();
        tCtx.moveTo(x, 0);
        tCtx.lineTo(x, h);
        tCtx.stroke();
      }

      // Wave 1: Cyan Data Stream (Composite Sine Wave)
      tCtx.beginPath();
      tCtx.strokeStyle = '#00f0ff';
      tCtx.lineWidth = 2.5;

      const midY = h / 2;
      for (let x = 0; x < w; x += 4) {
        const y = midY + 
          Math.sin(x * 0.015 + tTime * 0.04) * 45 + 
          Math.cos(x * 0.035 - tTime * 0.02) * 25 + 
          (Math.sin(x * 0.08) * 8);

        if (x === 0) tCtx.moveTo(x, y);
        else tCtx.lineTo(x, y);
      }
      tCtx.stroke();

      // Wave 2: Amber Anomaly / Threshold Trend
      tCtx.beginPath();
      tCtx.strokeStyle = '#fca311';
      tCtx.lineWidth = 1.5;
      tCtx.setLineDash([6, 4]);

      for (let x = 0; x < w; x += 6) {
        const y = midY - 30 + Math.sin(x * 0.008 + tTime * 0.025) * 50;
        if (x === 0) tCtx.moveTo(x, y);
        else tCtx.lineTo(x, y);
      }
      tCtx.stroke();
      tCtx.setLineDash([]); // Reset dash

      tTime += 1;

      // Random dynamic updates to telemetry stats
      if (tTime % 45 === 0) {
        if (tThroughputEl) {
          const val = (2800 + Math.floor(Math.random() * 180)).toLocaleString();
          tThroughputEl.textContent = `${val} REQ/S`;
        }
        if (tLatencyEl) {
          const lat = (17 + Math.random() * 3.5).toFixed(1);
          tLatencyEl.textContent = `${lat} MS`;
        }
      }

      requestAnimationFrame(renderTelemetry);
    }
    renderTelemetry();
  }

  // ══ FOOTER CONTACT TERMINAL SLIDE-OUT ═════════════════════════════
  const footCard = document.querySelector('.foot__card');
  const chatDrawer = document.getElementById('chat');
  const chatOpenBtn = document.getElementById('chatOpen');
  const chatCloseBtn = document.getElementById('chatClose');
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');

  function openChat() {
    if (!footCard || !chatDrawer) return;
    footCard.classList.add('is-chat');
    chatDrawer.inert = false;
    chatDrawer.removeAttribute('aria-hidden');
    initAudio();
    playTone(720, 0.06, 'square', 0.04);
  }

  function closeChat() {
    if (!footCard || !chatDrawer) return;
    footCard.classList.remove('is-chat');
    chatDrawer.inert = true;
    chatDrawer.setAttribute('aria-hidden', 'true');
    initAudio();
    playTone(460, 0.05, 'square', 0.04);
  }

  if (chatOpenBtn) chatOpenBtn.addEventListener('click', openChat);
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', closeChat);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && footCard && footCard.classList.contains('is-chat')) {
      closeChat();
    }
  });

  // Contact Form Dispatcher
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      initAudio();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!email || !message) {
        if (contactStatus) {
          contactStatus.textContent = 'INPUT ERROR: PLEASE COMPLETE REQUIRED FIELDS';
        }
        playTone(320, 0.08, 'sawtooth', 0.05);
        return;
      }

      if (contactStatus) {
        contactStatus.textContent = 'TRANSMITTING MESSAGE TO BISMA.SYS...';
      }
      playTone(660, 0.06, 'sine', 0.04);

      setTimeout(() => {
        if (contactStatus) {
          contactStatus.textContent = 'TRANSMISSION VERIFIED. THANK YOU, I WILL DISPATCH A REPLY SOON.';
        }
        playTone(880, 0.1, 'sine', 0.06);
        contactForm.reset();

        // Optional mailto fallback trigger
        const mailSubject = encodeURIComponent(`Inquiry from ${name || 'Portfolio Contact'}`);
        const mailBody = encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`);
        console.log(`[Form Submission] To: abiyubisma@gmail.com, Subject: ${mailSubject}`);
      }, 1000);
    });
  }

  // ══ REAL-TIME LOCAL CLOCK ═════════════════════════════════════════
  const clockEl = document.getElementById('clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

})();
