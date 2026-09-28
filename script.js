/**
 * KINESIS AI — CORE ENGINE INTERACTION SCRIPT
 * Production-ready, zero-dependency, ultra-smooth interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ===================================================================
     1. AMBIENT AUDIO SYNTHESIZER (WEB AUDIO API)
     Subtle, futuristic micro-feedback. Muted by default.
     =================================================================== */
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.enabled = false;
      this.initToggle();
    }

    init() {
      if (!this.ctx && typeof AudioContext !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    initToggle() {
      const toggleBtn = document.getElementById('sound-toggle-btn');
      if (!toggleBtn) return;

      toggleBtn.addEventListener('click', () => {
        this.enabled = !this.enabled;
        if (this.enabled) {
          this.init();
          toggleBtn.classList.add('active');
          toggleBtn.setAttribute('title', 'Sound FX: Enabled');
          toggleBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          `;
          showToast('Futuristic Sound FX: Enabled', 'info');
          this.playBeep(640, 0.08, 'sine');
        } else {
          toggleBtn.classList.remove('active');
          toggleBtn.setAttribute('title', 'Sound FX: Muted');
          toggleBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          `;
          showToast('Sound FX: Muted', 'info');
        }
      });
    }

    playTone(freq = 440, type = 'sine', duration = 0.1, gainVal = 0.04) {
      if (!this.enabled) return;
      try {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio feedback error', e);
      }
    }

    playBeep(freq = 520, duration = 0.08, type = 'sine') {
      this.playTone(freq, type, duration, 0.035);
    }

    playSuccess() {
      if (!this.enabled) return;
      this.playTone(480, 'sine', 0.1, 0.04);
      setTimeout(() => this.playTone(720, 'sine', 0.18, 0.04), 90);
    }

    playClick() {
      this.playTone(800, 'triangle', 0.04, 0.02);
    }
  }

  const sound = new SoundFX();

  /* ===================================================================
     2. TOAST NOTIFICATION ENGINE
     =================================================================== */
  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" style="color: var(--accent-cyan)" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hide');
      setTimeout(() => toast.remove(), 320);
    }, 3800);
  }

  /* ===================================================================
     3. INTERACTIVE NEURAL MESH CANVAS
     Real-time interactive particle physics with cursor gravity
     =================================================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 16000), 80);
    const maxDistance = 140;

    const mouse = {
      x: null,
      y: null,
      radius: 160
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.8 + 1.2;
        this.baseColor = Math.random() > 0.4 ? 'rgba(99, 102, 241, ' : 'rgba(6, 182, 212, ';
        this.alpha = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Gentle attraction towards mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 1.2;
            this.y += (dy / dist) * force * 1.2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.baseColor}${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        particles[i].update();
        particles[i].draw();
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* ===================================================================
     4. STICKY NAVBAR & SMOOTH SCROLL SPY
     =================================================================== */
  const headerNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerNav?.classList.add('scrolled');
    } else {
      headerNav?.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  /* ===================================================================
     5. MOBILE MENU DRAWER
     =================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileToggle?.classList.add('active');
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
    sound.playClick();
  }

  function closeDrawer() {
    mobileToggle?.classList.remove('active');
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', () => {
    if (mobileDrawer?.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerCloseBtn?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  /* ===================================================================
     6. CARD SPOTLIGHT HOVER EFFECT
     Radial gradient that tracks cursor over cards
     =================================================================== */
  const spotlightCards = document.querySelectorAll('.card-spotlight, .pricing-card, .comp-card');
  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ===================================================================
     7. HERO COCKPIT SIMULATION RUNNER
     Interactive preset switcher & live telemetry execution
     =================================================================== */
  const presetChips = document.querySelectorAll('.preset-chip');
  const runSimBtn = document.getElementById('run-sim-btn');
  const simOutputStream = document.getElementById('sim-output-stream');
  const hudThroughput = document.getElementById('hud-throughput');
  const hudLatency = document.getElementById('hud-latency');
  const hudAgents = document.getElementById('hud-agents');

  const presetData = {
    swarm: {
      name: 'Swarm Synthesis',
      throughput: '142,800',
      latency: '8.4ms',
      agents: '1,024',
      stream: 'Synthesizing 1,024 distributed actor nodes... Consensus verified.'
    },
    arbitrage: {
      name: 'Financial Arbitrage',
      throughput: '298,400',
      latency: '3.2ms',
      agents: '4,096',
      stream: 'Global orderbook synchronized across Tokyo, NY4 & LD4. Zero-loss lock.'
    },
    kinematics: {
      name: 'Robotic Kinematics',
      throughput: '89,500',
      latency: '4.8ms',
      agents: '512',
      stream: 'Multi-joint trajectory validated. TEE cryptographic safety pass.'
    }
  };

  presetChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      sound.playClick();
      presetChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const key = chip.getAttribute('data-preset');
      const data = presetData[key];
      if (data) {
        if (hudThroughput) hudThroughput.textContent = data.throughput + ' tps';
        if (hudLatency) hudLatency.textContent = data.latency;
        if (hudAgents) hudAgents.textContent = data.agents;
        if (simOutputStream) simOutputStream.textContent = data.stream;
      }
    });
  });

  if (runSimBtn) {
    runSimBtn.addEventListener('click', () => {
      sound.playTone(400, 'sine', 0.1, 0.05);
      runSimBtn.disabled = true;
      const originalText = runSimBtn.innerHTML;
      runSimBtn.innerHTML = `
        <svg class="spin-icon" style="animation: spin 1s linear infinite" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg> Executing Swarm...
      `;

      let step = 0;
      const steps = [
        'Ingesting multi-modal sensor telemetry...',
        'Spawning 1,024 neural worker actors...',
        'Reconciling vector embeddings in episodic memory...',
        'Achieving Byzantine cryptographic consensus...',
        'Swarm pipeline executed with 0 errors in 7.9ms!'
      ];

      const interval = setInterval(() => {
        if (step < steps.length) {
          if (simOutputStream) {
            simOutputStream.innerHTML = `
              <span class="live-beacon" style="display:inline-block; margin-right:6px"></span>
              ${steps[step]}
            `;
          }
          sound.playTone(440 + step * 60, 'sine', 0.05, 0.02);
          step++;
        } else {
          clearInterval(interval);
          runSimBtn.disabled = false;
          runSimBtn.innerHTML = originalText;
          sound.playSuccess();
          showToast('Swarm simulation finished successfully in 7.9ms!', 'success');
        }
      }, 420);
    });
  }

  // Copy Install Command
  const copyBtn = document.getElementById('copy-cmd-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const cmd = 'npm i @kinesis/core';
      navigator.clipboard.writeText(cmd).then(() => {
        sound.playBeep(880, 0.1);
        showToast('Copied to clipboard: npm i @kinesis/core', 'success');
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          `;
        }, 2200);
      });
    });
  }

  /* ===================================================================
     8. INTERSECTION OBSERVER: SCROLL REVEALS & NUMBER COUNTERS
     =================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((el) => revealObserver.observe(el));

  // Animated counters
  const counters = document.querySelectorAll('.stat-counter');
  let countersStarted = false;

  function runCounters() {
    counters.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const duration = 1800;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = (target * easeOut).toFixed(decimals);

        counter.textContent = `${prefix}${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = `${prefix}${target}${suffix}`;
        }
      }

      requestAnimationFrame(update);
    });
  }

  const statsSection = document.getElementById('statistics');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        runCounters();
      }
    }, { threshold: 0.2 });

    statsObserver.observe(statsSection);
  }

  /* ===================================================================
     9. INTERACTIVE ARCHITECTURE SIMULATOR
     =================================================================== */
  const simNavBtns = document.querySelectorAll('.sim-step-btn');
  const simStageIndicator = document.getElementById('sim-stage-indicator');
  const simStageTitle = document.getElementById('sim-stage-title');
  const simStageDesc = document.getElementById('sim-stage-desc');
  const simMetricThroughput = document.getElementById('sim-metric-throughput');
  const simMetricLatency = document.getElementById('sim-metric-latency');
  const simMetricMemory = document.getElementById('sim-metric-memory');
  const simMetricSafety = document.getElementById('sim-metric-safety');
  const simCodeDisplay = document.getElementById('sim-code-display');
  const stressToggle = document.getElementById('stress-test-toggle');

  const stageStages = [
    {
      stage: 'STAGE 01 // INGESTION',
      title: 'Ultra-Low Latency Multimodal Telemetry Ingestion',
      desc: 'High-throughput binary packet parser ingestion engine. Compresses visual, audio, spatial kinematics, and natural language into normalized low-entropy latent tensors.',
      throughput: '1.24 GB/sec',
      latency: '1.2 ms',
      memory: '42 MB RAM',
      safety: 'Zero-Copy TEE',
      code: `<span class="code-keyword">import</span> { IngestionPipeline, StreamFormat } <span class="code-keyword">from</span> <span class="code-str">'@kinesis/core'</span>;

<span class="code-comment">// Establish sub-millisecond edge websocket link</span>
<span class="code-keyword">const</span> pipeline = <span class="code-keyword">new</span> <span class="code-fn">IngestionPipeline</span>({
  edgePoP: <span class="code-str">'sfo-zone-1'</span>,
  compression: <span class="code-str">'zstandard-latent'</span>,
  encryption: <span class="code-str">'xchacha20-poly1305'</span>
});

<span class="code-keyword">await</span> pipeline.<span class="code-fn">bindMultimodalStream</span>({
  vision: StreamFormat.H265_RAW,
  spatial: StreamFormat.QUATERNION_6DOF,
  audio: StreamFormat.OPUS_SPATIAL
});`
    },
    {
      stage: 'STAGE 02 // REASONING',
      title: 'Decentralized Cognitive Agent Swarm Consensus',
      desc: 'Asynchronous actor system orchestrating task decomposition. Deconstructs ambiguous objectives into deterministic DAG workflows with automated self-consistency verification.',
      throughput: '86,400 Ops/sec',
      latency: '4.8 ms',
      memory: '128 MB RAM',
      safety: 'Byzantine Proven',
      code: `<span class="code-keyword">import</span> { AgentSwarm, ConsensusProtocol } <span class="code-keyword">from</span> <span class="code-str">'@kinesis/agents'</span>;

<span class="code-keyword">const</span> swarm = <span class="code-keyword">new</span> <span class="code-fn">AgentSwarm</span>({
  actorCount: <span class="code-num">64</span>,
  protocol: ConsensusProtocol.BYZANTINE_FAULT_TOLERANT,
  hallucinationThreshold: <span class="code-num">0.0001</span>
});

<span class="code-keyword">const</span> plan = <span class="code-keyword">await</span> swarm.<span class="code-fn">decomposeObjective</span>({
  goal: <span class="code-str">'Optimize multi-hop liquidity routing with zero slippage'</span>,
  constraints: [<span class="code-str">'max_gas_gwei: 15'</span>, <span class="code-str">'execution_window_ms: 25'</span>]
});`
    },
    {
      stage: 'STAGE 03 // MEMORY',
      title: 'Infinite Vector Context & Episodic Retrieval',
      desc: 'Sub-millisecond semantic index combining HNSW vector graphs with episodic knowledge graphs. Features sub-10ms lookup across billions of embeddings without precision decay.',
      throughput: '410,000 QPS',
      latency: '2.1 ms',
      memory: '256 MB RAM',
      safety: 'Cryptographic Hash',
      code: `<span class="code-keyword">import</span> { EpisodicMemory, VectorIndex } <span class="code-keyword">from</span> <span class="code-str">'@kinesis/memory'</span>;

<span class="code-keyword">const</span> memory = <span class="code-keyword">new</span> <span class="code-fn">EpisodicMemory</span>({
  vectorIndex: VectorIndex.HNSW_QUANTIZED,
  dimensions: <span class="code-num">1536</span>,
  similarityMetric: <span class="code-str">'cosine'</span>
});

<span class="code-keyword">const</span> context = <span class="code-keyword">await</span> memory.<span class="code-fn">queryContext</span>({
  embedding: tensorEmbedding,
  topK: <span class="code-num">10</span>,
  filter: { tenantId: <span class="code-str">'ent_94812'</span>, classification: <span class="code-str">'confidential'</span> }
});`
    },
    {
      stage: 'STAGE 04 // DISPATCH',
      title: 'Hardware-Enclave Action Dispatch & Execution',
      desc: 'Deterministic dispatch engine executing actions into external APIs, physical robotics controllers, or blockchain contracts with hardware-enforced rollback guarantees.',
      throughput: '120,000 Tx/sec',
      latency: '3.4 ms',
      memory: '64 MB RAM',
      safety: 'Hardware SGX TEE',
      code: `<span class="code-keyword">import</span> { SecureDispatcher, SandboxEnv } <span class="code-keyword">from</span> <span class="code-str">'@kinesis/runtime'</span>;

<span class="code-keyword">const</span> dispatcher = <span class="code-keyword">new</span> <span class="code-fn">SecureDispatcher</span>({
  sandbox: SandboxEnv.WASM_MICROVM,
  allowNetworkOutbound: <span class="code-keyword">false</span>,
  auditLog: <span class="code-keyword">true</span>
});

<span class="code-keyword">const</span> receipt = <span class="code-keyword">await</span> dispatcher.<span class="code-fn">executeAction</span>({
  actionType: <span class="code-str">'ROBOT_TRAJECTORY_APPLY'</span>,
  payload: plan.verifiedActionBuffer
});`
    }
  ];

  function setSimulatorStage(index) {
    sound.playClick();
    simNavBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    const data = stageStages[index];
    if (!data) return;

    if (simStageIndicator) simStageIndicator.textContent = data.stage;
    if (simStageTitle) simStageTitle.textContent = data.title;
    if (simStageDesc) simStageDesc.textContent = data.desc;
    if (simMetricThroughput) simMetricThroughput.textContent = data.throughput;
    if (simMetricLatency) simMetricLatency.textContent = data.latency;
    if (simMetricMemory) simMetricMemory.textContent = data.memory;
    if (simMetricSafety) simMetricSafety.textContent = data.safety;
    if (simCodeDisplay) simCodeDisplay.innerHTML = data.code;
  }

  simNavBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => setSimulatorStage(index));
  });

  if (stressToggle) {
    stressToggle.addEventListener('click', () => {
      const isActive = stressToggle.classList.toggle('active');
      sound.playBeep(isActive ? 680 : 380, 0.08);
      if (isActive) {
        stressToggle.textContent = 'Simulating 10x Edge Load (Active)';
        stressToggle.classList.add('btn-primary');
        if (simMetricThroughput) simMetricThroughput.textContent = '12.4 GB/sec (Burst)';
        if (simMetricLatency) simMetricLatency.textContent = '2.9 ms (+1.7ms)';
        showToast('Injected 10x synthetic stress. Auto-scaling across 160 edge nodes.', 'info');
      } else {
        stressToggle.textContent = 'Inject Edge Stress Test';
        stressToggle.classList.remove('btn-primary');
        showToast('Stress simulation normalized.', 'info');
        // Reset to active stage
        const activeIdx = Array.from(simNavBtns).findIndex(b => b.classList.contains('active'));
        if (activeIdx >= 0) setSimulatorStage(activeIdx);
      }
    });
  }

  /* ===================================================================
     10. COMPUTE & ROI BENCHMARK CALCULATOR
     =================================================================== */
  const rangeInferences = document.getElementById('range-inferences');
  const rangeSwarms = document.getElementById('range-swarms');
  const valInferences = document.getElementById('val-inferences');
  const valSwarms = document.getElementById('val-swarms');
  const roiSavings = document.getElementById('roi-savings');
  const roiLatency = document.getElementById('roi-latency');
  const roiEfficiency = document.getElementById('roi-efficiency');
  const roiTflops = document.getElementById('roi-tflops');

  function calculateROI() {
    const infVal = parseInt(rangeInferences?.value || '10', 10); // Millions
    const swarmsVal = parseInt(rangeSwarms?.value || '50', 10);

    if (valInferences) valInferences.textContent = `${infVal}M / month`;
    if (valSwarms) valSwarms.textContent = `${swarmsVal} Swarms`;

    // Standard baseline cost vs Kinesis optimized cost calculation
    // Typical monolithic cost: ~$1.80 per 10k inferences
    const legacyCost = (infVal * 1000000 / 10000) * 1.80;
    // Kinesis cost: ~$0.32 per 10k inferences
    const kinesisCost = (infVal * 1000000 / 10000) * 0.32 + (swarmsVal * 40);
    const savedDollars = Math.max(0, Math.round(legacyCost - kinesisCost));

    // Latency reduction
    const baseLatency = 380; // ms
    const optimizedLatency = (baseLatency * (1 - 0.94)).toFixed(1);

    // Compute efficiency
    const efficiency = (94.2 + (swarmsVal / 500) * 4.2).toFixed(1);
    const tflops = (infVal * 0.42 + swarmsVal * 0.18).toFixed(1);

    if (roiSavings) {
      roiSavings.textContent = `$${savedDollars.toLocaleString()} /mo`;
    }
    if (roiLatency) {
      roiLatency.textContent = `< ${optimizedLatency} ms`;
    }
    if (roiEfficiency) {
      roiEfficiency.textContent = `+${efficiency}%`;
    }
    if (roiTflops) {
      roiTflops.textContent = `${tflops} PFLOPS-eq`;
    }
  }

  rangeInferences?.addEventListener('input', () => {
    calculateROI();
    sound.playTone(320 + rangeInferences.value * 5, 'sine', 0.02, 0.01);
  });

  rangeSwarms?.addEventListener('input', () => {
    calculateROI();
    sound.playTone(300 + rangeSwarms.value * 2, 'sine', 0.02, 0.01);
  });

  calculateROI();

  /* ===================================================================
     11. ECOSYSTEM SHOWCASE TABS
     =================================================================== */
  const showcaseTabs = document.querySelectorAll('.showcase-tab-pill');
  const showcaseTag = document.getElementById('showcase-tag');
  const showcaseTitle = document.getElementById('showcase-title');
  const showcaseDesc = document.getElementById('showcase-desc');
  const showcaseBullets = document.getElementById('showcase-bullets');

  const showcaseData = {
    robotics: {
      tag: 'ENTERPRISE ROBOTICS & EMBODIED AI',
      title: 'Sub-Millisecond Distributed Closed-Loop Kinematics',
      desc: 'Orchestrating warehouse fleets, robotic quadrupeds, and autonomous arms with deterministic micro-second telemetry coordination and verifiable safety boundaries.',
      bullets: [
        'Real-time SLAM & 3D point cloud streaming over P2P mesh',
        'Hardware-enforced virtual safety zones with automatic emergency stop',
        'Fleet-wide federated model synchronization with zero network degradation'
      ]
    },
    finance: {
      tag: 'QUANTUM ARBITRAGE & HIGH-FREQUENCY SWARMS',
      title: 'Deterministic Multi-Exchange Microsecond Arbitrage',
      desc: 'Deploying autonomous risk-hedging agents across decentralized liquidity pools and traditional exchange colocation facilities with cryptographically verified settlement.',
      bullets: [
        'Sub-3.2ms execution window across global PoPs',
        'Zero-knowledge proof verification for zero front-running exposure',
        'Self-balancing liquidity allocations with automated collateral re-hedging'
      ]
    },
    biotech: {
      tag: 'BIO-COMPUTATION & PROTEIN FOLDING',
      title: 'Autonomous Molecular Dynamics Simulation Swarms',
      desc: 'Simulating complex ligand interactions and protein conformational dynamics using distributed vector spaces and asynchronous graph neural networks.',
      bullets: [
        'Infinite episodic memory for billions of chemical structure vectors',
        'Multi-agent hypothesis generation and automated virtual assay testing',
        'SOC2 Type II and HIPAA compliant enclave processing'
      ]
    },
    devtools: {
      tag: 'DEVELOPER RUNTIME & NEURAL APIS',
      title: 'The Universal SDK for Synthetic Intelligence Swarms',
      desc: 'A unified TypeScript, Python, and Rust runtime that turns any complex multi-model pipeline into a resilient, self-healing distributed microservice.',
      bullets: [
        'Full typed SDK for TypeScript, Python, Rust, and Go',
        'Local sandbox simulator with instant mock telemetry replay',
        'One-click deployment to 160 edge PoPs worldwide'
      ]
    }
  };

  showcaseTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      sound.playClick();
      showcaseTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const key = tab.getAttribute('data-tab');
      const data = showcaseData[key];
      if (!data) return;

      if (showcaseTag) showcaseTag.textContent = data.tag;
      if (showcaseTitle) showcaseTitle.textContent = data.title;
      if (showcaseDesc) showcaseDesc.textContent = data.desc;

      if (showcaseBullets) {
        showcaseBullets.innerHTML = data.bullets.map((b) => `
          <div class="feature-bullet">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${b}</span>
          </div>
        `).join('');
      }
    });
  });

  /* ===================================================================
     12. TESTIMONIALS SLIDER
     =================================================================== */
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const prevTestimonialBtn = document.getElementById('prev-testimonial-btn');
  const nextTestimonialBtn = document.getElementById('next-testimonial-btn');
  let currentSlide = 0;

  function showSlide(index) {
    if (!testimonialSlides.length) return;
    testimonialSlides.forEach((s) => s.classList.remove('active'));
    currentSlide = (index + testimonialSlides.length) % testimonialSlides.length;
    testimonialSlides[currentSlide].classList.add('active');
  }

  prevTestimonialBtn?.addEventListener('click', () => {
    sound.playClick();
    showSlide(currentSlide - 1);
  });

  nextTestimonialBtn?.addEventListener('click', () => {
    sound.playClick();
    showSlide(currentSlide + 1);
  });

  // Auto advance every 8 seconds
  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 8000);

  /* ===================================================================
     13. PRICING BILLING TOGGLE
     =================================================================== */
  const pricingToggle = document.getElementById('pricing-toggle');
  const monthlyLabel = document.getElementById('label-monthly');
  const annualLabel = document.getElementById('label-annual');
  const pricePro = document.getElementById('price-pro');
  const periodPro = document.getElementById('period-pro');
  let isAnnual = false;

  pricingToggle?.addEventListener('click', () => {
    isAnnual = !isAnnual;
    sound.playClick();
    pricingToggle.classList.toggle('active', isAnnual);
    monthlyLabel?.classList.toggle('active', !isAnnual);
    annualLabel?.classList.toggle('active', isAnnual);

    if (pricePro) {
      pricePro.textContent = isAnnual ? '$79' : '$99';
    }
    if (periodPro) {
      periodPro.textContent = isAnnual ? '/ month (billed annually)' : '/ month (billed monthly)';
    }

    showToast(isAnnual ? 'Switched to Annual Billing (25% Savings)' : 'Switched to Monthly Billing', 'info');
  });

  /* ===================================================================
     14. FAQ ACCORDION & SEARCH FILTER
     =================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearchInput = document.getElementById('faq-search-input');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question-btn');
    questionBtn?.addEventListener('click', () => {
      sound.playClick();
      const isOpen = item.classList.contains('open');
      // Close other items
      faqItems.forEach((other) => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });

  faqSearchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    faqItems.forEach((item) => {
      const qText = item.querySelector('.faq-question-btn')?.textContent.toLowerCase() || '';
      const aText = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';
      if (!query || qText.includes(query) || aText.includes(query)) {
        item.style.display = 'block';
        if (query) item.classList.add('open');
      } else {
        item.style.display = 'none';
        item.classList.remove('open');
      }
    });
  });

  /* ===================================================================
     15. FINAL CTA FORM & ACCESS MODAL
     =================================================================== */
  const accessModal = document.getElementById('access-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const earlyAccessForm = document.getElementById('early-access-form');
  const bannerCtaForm = document.getElementById('banner-cta-form');
  const bannerEmailInput = document.getElementById('banner-email-input');

  function openAccessModal(prefillEmail = '') {
    if (!accessModal) return;
    accessModal.classList.add('open');
    sound.playClick();
    document.body.style.overflow = 'hidden';
    const emailField = document.getElementById('modal-email-input');
    if (emailField && prefillEmail) {
      emailField.value = prefillEmail;
    }
  }

  function closeAccessModal() {
    if (!accessModal) return;
    accessModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAccessModal();
    });
  });

  modalCloseBtn?.addEventListener('click', closeAccessModal);
  accessModal?.addEventListener('click', (e) => {
    if (e.target === accessModal) {
      closeAccessModal();
    }
  });

  // Banner Quick CTA
  bannerCtaForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = bannerEmailInput?.value.trim();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid business email.', 'info');
      bannerEmailInput?.focus();
      return;
    }
    openAccessModal(email);
  });

  // Modal Form Submission
  earlyAccessForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('modal-name-input');
    const emailInput = document.getElementById('modal-email-input');
    const companyInput = document.getElementById('modal-company-input');
    const submitBtn = earlyAccessForm.querySelector('button[type="submit"]');

    if (!nameInput?.value.trim()) {
      showToast('Please enter your full name.', 'info');
      nameInput?.focus();
      return;
    }

    if (!emailInput?.value.trim() || !emailInput.value.includes('@')) {
      showToast('Please enter a valid work email.', 'info');
      emailInput?.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spin-icon" style="animation: spin 1s linear infinite" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg> Provisioning Neural Keys...
      `;
    }

    setTimeout(() => {
      sound.playSuccess();
      showToast(`Welcome ${nameInput.value.trim()}! Your early access token has been generated. Check your inbox.`, 'success');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Request Early Access Key';
      }
      earlyAccessForm.reset();
      closeAccessModal();
    }, 1200);
  });

  /* ===================================================================
     16. COMMAND PALETTE (CTRL + K)
     =================================================================== */
  const commandPalette = document.getElementById('command-palette');
  const commandInput = document.getElementById('command-input');
  const commandItems = document.querySelectorAll('.command-item');

  function openCommandPalette() {
    if (!commandPalette) return;
    commandPalette.classList.add('open');
    sound.playClick();
    document.body.style.overflow = 'hidden';
    setTimeout(() => commandInput?.focus(), 50);
  }

  function closeCommandPalette() {
    if (!commandPalette) return;
    commandPalette.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.addEventListener('keydown', (e) => {
    // Open on Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (commandPalette?.classList.contains('open')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    }
    // Close on Escape
    if (e.key === 'Escape') {
      closeCommandPalette();
      closeAccessModal();
    }
  });

  commandPalette?.addEventListener('click', (e) => {
    if (e.target === commandPalette) {
      closeCommandPalette();
    }
  });

  const openCmdBtn = document.getElementById('cmd-palette-btn');
  openCmdBtn?.addEventListener('click', openCommandPalette);

  // Filter commands
  commandInput?.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    commandItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(val) ? 'flex' : 'none';
    });
  });

  // Click command item
  commandItems.forEach((item) => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      closeCommandPalette();

      if (action === 'simulator') {
        document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'calculator') {
        document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'access') {
        openAccessModal();
      } else if (action === 'sound') {
        document.getElementById('sound-toggle-btn')?.click();
      } else if (action === 'pricing') {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'faq') {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  console.log('%c KINESIS AI Core Engine v3.4 Initialized ', 'background: #6366f1; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
});
