/**
 * Konami Code Easter Egg - Game Logic
 * Dynamically imported only when the konami code is entered.
 */

export function startGame(onDeactivate?: () => void) {
  let shipModeActive = false;
  let entitiesReady = false;

  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const hud = document.getElementById('ship-hud') as HTMLDivElement;
  const scoreValue = document.getElementById('score-value') as HTMLSpanElement;
  const bombIndicator = document.getElementById('bomb-indicator') as HTMLDivElement;
  const loadingEl = document.getElementById('capture-loading') as HTMLDivElement;
  if (!canvas || !hud) return;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  let w = 0, h = 0;
  let dpr = 1;
  let score = 0;
  let animId: number | null = null;
  let lastTime = 0;
  let gameTime = 0;
  let backgroundCanvas: HTMLCanvasElement | null = null;
  
  interface Entity {
    id: number; text: string; x: number; y: number;
    width: number; height: number; font: string; color: string;
    vx: number; vy: number; rotation: number; rotationSpeed: number;
    destroyed: boolean; alpha: number;
    edge?: boolean; // mostly off-screen — rendered but doesn't count for victory
  }
  let entities: Entity[] = [];

  interface ShipStar { x: number; y: number; radius: number; phase: number; }
  const shipStars: ShipStar[] = [
    { x: 0, y: -14, radius: 2.5, phase: 0 },
    { x: -10, y: 4, radius: 2.0, phase: 1.2 },
    { x: 10, y: 4, radius: 2.0, phase: 2.4 },
    { x: -5, y: 10, radius: 1.6, phase: 3.6 },
    { x: 5, y: 10, radius: 1.6, phase: 4.8 },
  ];

  const ship = { x: 0, y: 0, vx: 0, vy: 0, angle: -Math.PI / 2, thrust: false, width: 24, height: 30 };
  const keys: Record<string, boolean> = {};
  
  interface Bullet { x: number; y: number; vx: number; vy: number; life: number; radius: number; pulse: number; }
  const bullets: Bullet[] = [];
  
  interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; radius: number; }
  const particles: Particle[] = [];
  
  // Upgrade state
  let spreadLevel = 1; // 1 = single, 3 = triple, 5 = penta
  let bulletSizeMultiplier = 1;
  let hasBlackHoleBomb = false;
  let lastUpgradeScore = 0;
  
  interface Pickup { x: number; y: number; type: 'blackhole'; radius: number; pulse: number; }
  const pickups: Pickup[] = [];
  
  interface BlackHole { x: number; y: number; radius: number; maxRadius: number; life: number; maxLife: number; sucking: boolean; }
  const blackHoles: BlackHole[] = [];

  // Victory state
  let victoryTriggered = false;
  let victoryTime = 0;
  const victoryMessages = [
    "Mission successful: time wasted!",
    "Congratulations! You broke the internet.",
    "You monster... that page had a family.",
    "DOM: Destroyed On Mayhem",
    "ctrl+z won't save you now",
    "Achievement Unlocked: Keyboard Warrior",
  ];
  let victoryMessage = "";

  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Intro state
  let introActive = false;
  let introTime = 0;
  const introDuration = 1.2; // seconds for ship to fly in
  let introShipStartY = 0;
  let introShipEndY = 0;
  let domHidden = false;

  function extractCharacterEntities(): void {
    loadingEl.classList.add('active');
    const starsCanvas = document.getElementById('stars') as HTMLCanvasElement;
    if (starsCanvas) {
      backgroundCanvas = document.createElement('canvas');
      backgroundCanvas.width = w * dpr;
      backgroundCanvas.height = h * dpr;
      const bgCtx = backgroundCanvas.getContext('2d')!;
      bgCtx.drawImage(starsCanvas, 0, 0, w * dpr, h * dpr);
    }

    const mainContent = document.querySelector('main');
    if (!mainContent) { loadingEl.classList.remove('active'); entitiesReady = true; return; }

    let entityId = 0;
    const walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => (node.textContent && node.textContent.trim().length > 0) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });

    const textNodes: Text[] = [];
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) textNodes.push(node);

    const colorCanvas = document.createElement('canvas');
    colorCanvas.width = 1; colorCanvas.height = 1;
    const colorCtx = colorCanvas.getContext('2d')!;
    function getColorAsRgba(cssColor: string): string {
      colorCtx.clearRect(0, 0, 1, 1);
      colorCtx.fillStyle = cssColor;
      colorCtx.fillRect(0, 0, 1, 1);
      const data = colorCtx.getImageData(0, 0, 1, 1).data;
      return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
    }

    for (const textNode of textNodes) {
      const parent = textNode.parentElement;
      if (!parent) continue;
      const text = textNode.textContent || '';
      const styles = window.getComputedStyle(parent);
      const font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
      const color = getColorAsRgba(styles.color);
      const range = document.createRange();
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ' || char === '\n' || char === '\t') continue;
        try {
          range.setStart(textNode, i);
          range.setEnd(textNode, i + 1);
          const rect = range.getBoundingClientRect();
          if (rect.width < 1 || rect.height < 1) continue;
          entities.push({ id: entityId++, text: char, x: rect.left, y: rect.top, width: rect.width, height: rect.height, font, color, vx: 0, vy: 0, rotation: 0, rotationSpeed: 0, destroyed: false, alpha: 1 });
        } catch (e) { continue; }
      }
    }
    // Drop fully off-screen entities; mark ones barely clipping the edge
    // so they still render but don't block victory
    const edgeMargin = 10;
    entities = entities.filter(e => {
      const visX = Math.min(e.x + e.width, w) - Math.max(e.x, 0);
      const visY = Math.min(e.y + e.height, h) - Math.max(e.y, 0);
      if (visX <= 0 || visY <= 0) return false;
      if (visX < edgeMargin || visY < edgeMargin) e.edge = true;
      return true;
    });

    // Don't hide DOM content yet — we'll hide it after the first canvas frame
    // is painted so there's never a gap where neither is visible
    loadingEl.classList.remove('active');
    entitiesReady = true;
  }

  function activateShipMode() {
    if (shipModeActive) return;
    shipModeActive = true;
    resize();
    window.addEventListener('resize', resize);
    document.body.appendChild(canvas);
    document.body.appendChild(hud);
    document.body.appendChild(loadingEl);
    
    score = 0; scoreValue.textContent = '0'; gameTime = 0;
    lastTime = performance.now();
    beginIntro();
  }

  // Lock scroll position without removing the scrollbar (prevents layout shift)
  let scrollLockY = 0;
  function onScrollLock() { window.scrollTo(0, scrollLockY); }

  function beginIntro() {
    // Lock scroll in place — the scrollbar stays, so zero layout shift
    scrollLockY = window.scrollY;
    window.addEventListener('scroll', onScrollLock);

    // Skip the CSS opacity transition so canvas appears instantly over the DOM —
    // no fade means no frame where both are visible
    canvas.style.transition = 'none';
    canvas.classList.add('active');
    // Force style recalc, then restore transition for the exit fade-out
    canvas.offsetHeight;
    canvas.style.transition = '';

    extractCharacterEntities();

    // Ship starts below the screen and flies to center
    ship.x = w / 2;
    introShipStartY = h + 80;
    introShipEndY = h / 2;
    ship.y = introShipStartY;
    ship.vx = 0; ship.vy = 0;
    ship.angle = -Math.PI / 2; // pointing up
    introActive = true;
    introTime = 0;

    animId = requestAnimationFrame(gameLoop);
  }

  let outroActive = false;
  let outroTime = 0;
  let domRevealed = false;
  const outroDuration = 0.5;

  function cleanupShipMode() {
    shipModeActive = false; entitiesReady = false;
    window.removeEventListener('resize', resize);
    if (animId !== null) { cancelAnimationFrame(animId); animId = null; }
    canvas.style.opacity = '';
    canvas.classList.remove('active');
    hud.classList.remove('active');

    // Unlock scrolling
    window.removeEventListener('scroll', onScrollLock);

    const mainContent = document.querySelector('main') as HTMLElement;
    if (mainContent) mainContent.style.visibility = '';
    entities = []; bullets.length = 0; particles.length = 0; backgroundCanvas = null;
    pickups.length = 0; blackHoles.length = 0;
    victoryTriggered = false; victoryTime = 0; victoryMessage = "";
    introActive = false; introTime = 0; domHidden = false;
    outroActive = false; outroTime = 0; domRevealed = false;
    spreadLevel = 1; bulletSizeMultiplier = 1; hasBlackHoleBomb = false; lastUpgradeScore = 0;
    bombIndicator?.classList.remove('active');
    ctx.clearRect(0, 0, w, h);
    onDeactivate?.();
  }

  function deactivateShipMode(instant = false) {
    if (!shipModeActive || outroActive) return;
    if (instant) { cleanupShipMode(); return; }

    outroActive = true;
    outroTime = 0;
    hud.classList.remove('active');

    // DOM stays hidden — we reveal it partway through once distortion is heavy enough
    if (animId !== null) { cancelAnimationFrame(animId); animId = null; }
    lastTime = performance.now();
    animId = requestAnimationFrame(outroLoop);
  }

  function outroLoop(now: number) {
    try {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      outroTime += dt;
      const t = Math.min(1, outroTime / outroDuration);

      // Redraw the game frame (frozen — no updates)
      drawBackground();
      drawEntities();
      drawParticles();
      drawBullets();
      if (!victoryTriggered) drawShip();

      // Glitch distortion ramps UP (reverse of intro)
      const intensity = t * t;
      drawGlitchDistortion(intensity);

      // Phase 1 (0–0.6): pure glitch ramp, canvas stays fully opaque
      // Phase 2 (0.6–1.0): reveal DOM, fade canvas out with purple flash
      if (t > 0.6) {
        // Reveal DOM once distortion is heavy enough to mask the swap
        if (!domRevealed) {
          domRevealed = true;
          const mainContent = document.querySelector('main') as HTMLElement;
          if (mainContent) mainContent.style.visibility = '';
        }

        const fadeT = (t - 0.6) / 0.4; // 0→1 over the fade phase
        const flashAlpha = fadeT * 0.35;
        ctx.fillStyle = `rgba(160, 128, 196, ${flashAlpha})`;
        ctx.fillRect(0, 0, w, h);

        canvas.style.opacity = `${1 - fadeT * fadeT}`;
      }

      if (t >= 1) {
        cleanupShipMode();
        return;
      }

      animId = requestAnimationFrame(outroLoop);
    } catch (_) {
      cleanupShipMode();
    }
  }

  const glitchDuration = 0.45; // seconds of distortion at intro start
  let glitchTmp: HTMLCanvasElement | null = null;

  function drawGlitchDistortion(intensity: number) {
    // intensity 0→1: no distortion → full distortion

    // --- Horizontal slice displacement (VHS tracking) ---
    const sliceCount = 8 + Math.floor(Math.random() * 12 * intensity);
    for (let i = 0; i < sliceCount; i++) {
      const y = Math.floor(Math.random() * h);
      const sliceH = Math.max(1, Math.floor(2 + Math.random() * (20 * intensity)));
      const offset = (Math.random() - 0.5) * 40 * intensity;
      if (Math.abs(offset) > 1) {
        const srcY = Math.max(0, y * dpr);
        const srcH = Math.min(sliceH * dpr, h * dpr - srcY);
        if (srcH > 0) {
          try {
            const imgData = ctx.getImageData(0, srcY, w * dpr, srcH);
            ctx.putImageData(imgData, offset * dpr, srcY);
          } catch (_) { /* skip this slice */ }
        }
      }
    }

    // --- Noise bands (horizontal static bars) ---
    const bandCount = Math.floor(3 * intensity + Math.random() * 4 * intensity);
    for (let i = 0; i < bandCount; i++) {
      const y = Math.random() * h;
      const bandH = 1 + Math.random() * 4;
      ctx.fillStyle = `rgba(187, 154, 221, ${(0.08 + Math.random() * 0.15) * intensity})`;
      ctx.fillRect(0, y, w, bandH);
    }

    // --- Chromatic aberration (color channel offset via compositing) ---
    if (intensity > 0.3) {
      const shift = Math.round(2 * intensity + Math.random() * 2);
      // Snapshot current frame to a temp canvas to avoid self-referencing draws
      if (!glitchTmp) {
        glitchTmp = document.createElement('canvas');
      }
      glitchTmp.width = canvas.width;
      glitchTmp.height = canvas.height;
      const tmpCtx = glitchTmp.getContext('2d')!;
      tmpCtx.drawImage(canvas, 0, 0);
      // Draw offset copies with lighter blending
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.12 * intensity;
      ctx.drawImage(glitchTmp, shift, 0);
      ctx.globalAlpha = 0.08 * intensity;
      ctx.drawImage(glitchTmp, -shift, 0);
      ctx.restore();
    }

    // --- Scanlines ---
    ctx.fillStyle = `rgba(0, 0, 0, ${0.06 * intensity})`;
    for (let y = 0; y < h; y += 3) {
      ctx.fillRect(0, y, w, 1);
    }
  }

  function drawGlitchOverlay(t: number) {
    // t goes from 0→1 over glitchDuration — intro: distortion fades out
    const intensity = 1 - t * t;
    drawGlitchDistortion(intensity);

    // Brief bright flash in first 30%
    if (t < 0.3) {
      const flashAlpha = (0.3 - t) / 0.3 * 0.25;
      ctx.fillStyle = `rgba(160, 128, 196, ${flashAlpha})`;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function flashScreen() {
    const flash = document.createElement('div');
    flash.style.cssText = `position:fixed;inset:0;background:rgba(160,128,196,0.3);z-index:10003;pointer-events:none;animation:flash-out 0.4s ease-out forwards;`;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 400);
  }

  function spawnExplosion(x: number, y: number, entityWidth = 20, entityHeight = 20, color = 'rgba(208,216,234,1)') {
    const size = Math.max(entityWidth, entityHeight);
    const count = Math.min(30, Math.max(12, Math.floor(size / 3)));
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 80;
      const offsetX = (Math.random() - 0.5) * entityWidth * 0.8;
      const offsetY = (Math.random() - 0.5) * entityHeight * 0.8;
      particles.push({ x: x + offsetX, y: y + offsetY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, maxLife: 0.5 + Math.random() * 0.6, color, radius: 1 + Math.random() * 2.5 });
    }
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 100;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, maxLife: 0.3 + Math.random() * 0.3, color: 'rgba(160,128,196,1)', radius: 0.5 + Math.random() * 1 });
    }
  }

  function spawnFirework(x: number, y: number) {
    const colors = [
      'rgba(255,180,120,1)',  // orange
      'rgba(160,128,196,1)',  // purple (site accent)
      'rgba(120,220,180,1)',  // teal
      'rgba(255,120,150,1)',  // pink
      'rgba(208,216,234,1)',  // cream (site text)
      'rgba(255,220,100,1)',  // gold
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = 40 + Math.floor(Math.random() * 30);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 200;
      const life = 0.8 + Math.random() * 0.8;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50, // slight upward bias
        life: 1,
        maxLife: life,
        color,
        radius: 2 + Math.random() * 3
      });
    }
    // Add sparkle core
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 60;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 0.4 + Math.random() * 0.3,
        color: 'rgba(255,255,255,1)',
        radius: 1 + Math.random() * 1.5
      });
    }
  }

  function triggerVictory() {
    if (victoryTriggered) return;
    victoryTriggered = true;
    victoryTime = gameTime;
    victoryMessage = victoryMessages[Math.floor(Math.random() * victoryMessages.length)];
    
    // Initial burst of fireworks
    const positions = [
      { x: w * 0.2, y: h * 0.3 },
      { x: w * 0.5, y: h * 0.25 },
      { x: w * 0.8, y: h * 0.3 },
      { x: w * 0.35, y: h * 0.5 },
      { x: w * 0.65, y: h * 0.5 },
    ];
    positions.forEach((pos, i) => {
      setTimeout(() => spawnFirework(pos.x, pos.y), i * 150);
    });
  }

  function checkVictory() {
    if (victoryTriggered || !entitiesReady) return;
    // Edge entities (barely clipping viewport) don't count — they're there
    // visually but shouldn't block the win
    const remaining = entities.filter(e => !e.destroyed && !e.edge).length;
    if (remaining === 0 && entities.length > 0) {
      triggerVictory();
      // Hide the HUD for cleaner victory screen
      hud.classList.remove('active');
    }
  }

  function shoot() {
    // Black hole bomb takes priority
    if (hasBlackHoleBomb) {
      hasBlackHoleBomb = false;
      bombIndicator?.classList.remove('active');
      const speed = 400;
      const bx = ship.x + Math.cos(ship.angle) * 18;
      const by = ship.y + Math.sin(ship.angle) * 18;
      // Create a special "black hole bullet" - we'll track it separately
      bullets.push({ 
        x: bx, y: by, 
        vx: Math.cos(ship.angle) * speed + ship.vx * 0.3, 
        vy: Math.sin(ship.angle) * speed + ship.vy * 0.3, 
        life: 5, radius: 12, pulse: 0, 
        isBlackHole: true 
      } as any);
      // Purple flash effect
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2, spd = 80 + Math.random() * 100;
        particles.push({ x: bx, y: by, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, life: 1, maxLife: 0.3, color: 'rgba(120,80,180,1)', radius: 2 + Math.random() * 2 });
      }
      return;
    }
    
    const speed = 500;
    const baseAngle = ship.angle;
    const bulletRadius = 4 * bulletSizeMultiplier;
    const spreadAngle = 0.15; // radians between spread bullets
    
    // Calculate angles based on spread level
    const angles: number[] = [];
    if (spreadLevel === 1) {
      angles.push(baseAngle);
    } else if (spreadLevel === 3) {
      angles.push(baseAngle - spreadAngle, baseAngle, baseAngle + spreadAngle);
    } else if (spreadLevel >= 5) {
      angles.push(baseAngle - spreadAngle * 2, baseAngle - spreadAngle, baseAngle, baseAngle + spreadAngle, baseAngle + spreadAngle * 2);
    }
    
    for (const bulletAngle of angles) {
      bullets.push({ 
        x: ship.x + Math.cos(bulletAngle) * 18, 
        y: ship.y + Math.sin(bulletAngle) * 18, 
        vx: Math.cos(bulletAngle) * speed + ship.vx * 0.3, 
        vy: Math.sin(bulletAngle) * speed + ship.vy * 0.3, 
        life: 2.5, 
        radius: bulletRadius, 
        pulse: Math.random() * Math.PI * 2 
      });
    }
    
    // Muzzle particles
    for (let i = 0; i < 4; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * 0.8, spd = 60 + Math.random() * 80;
      particles.push({ x: ship.x + Math.cos(baseAngle) * 18, y: ship.y + Math.sin(baseAngle) * 18, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, life: 1, maxLife: 0.2, color: 'rgba(208,216,234,0.8)', radius: 1 + Math.random() * 0.8 });
    }
  }
  
  function spawnPickup(x: number, y: number) {
    pickups.push({ x, y, type: 'blackhole', radius: 20, pulse: 0 });
  }
  
  function detonateBlackHole(x: number, y: number) {
    blackHoles.push({ x, y, radius: 10, maxRadius: 200, life: 2, maxLife: 2, sucking: true });
    // Spawn effect
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2, spd = 30 + Math.random() * 50;
      particles.push({ x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, life: 1, maxLife: 0.5, color: 'rgba(80,40,120,1)', radius: 3 + Math.random() * 3 });
    }
  }
  
  function checkUpgrades() {
    // Spread upgrades
    if (score >= 500 && spreadLevel < 3) {
      spreadLevel = 3;
      flashScreen();
    }
    if (score >= 1500 && spreadLevel < 5) {
      spreadLevel = 5;
      flashScreen();
    }
    
    // Bullet size upgrades
    if (score >= 300) bulletSizeMultiplier = 1.25;
    if (score >= 800) bulletSizeMultiplier = 1.5;
    if (score >= 1200) bulletSizeMultiplier = 1.75;
    
    // Spawn black hole pickup every 1000 points (if we don't already have one)
    const pickupThreshold = Math.floor(score / 1000) * 1000;
    if (pickupThreshold > lastUpgradeScore && pickupThreshold > 0 && !hasBlackHoleBomb) {
      lastUpgradeScore = pickupThreshold;
      // Spawn pickup at random position (not too close to edges)
      const px = 100 + Math.random() * (w - 200);
      const py = 100 + Math.random() * (h - 200);
      spawnPickup(px, py);
    }
  }
  
  function updatePickups(dt: number) {
    for (let i = pickups.length - 1; i >= 0; i--) {
      const p = pickups[i];
      p.pulse += dt * 4;
      
      // Check collision with ship
      const dx = ship.x - p.x, dy = ship.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < p.radius + 15) {
        hasBlackHoleBomb = true;
        bombIndicator?.classList.add('active');
        pickups.splice(i, 1);
        flashScreen();
      }
    }
  }
  
  function updateBlackHoles(dt: number) {
    for (let i = blackHoles.length - 1; i >= 0; i--) {
      const bh = blackHoles[i];
      bh.life -= dt;
      
      // Grow radius
      const progress = 1 - (bh.life / bh.maxLife);
      bh.radius = bh.maxRadius * Math.min(1, progress * 2);
      
      // Suck in entities
      if (bh.sucking) {
        for (const entity of entities) {
          if (entity.destroyed) continue;
          const dx = bh.x - (entity.x + entity.width / 2);
          const dy = bh.y - (entity.y + entity.height / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < bh.radius) {
            // Pull toward center
            const force = (1 - dist / bh.radius) * 800;
            entity.vx += (dx / dist) * force * dt;
            entity.vy += (dy / dist) * force * dt;
            entity.x += entity.vx * dt;
            entity.y += entity.vy * dt;
            
            // Destroy if close to center
            if (dist < 30) {
              destroyEntity(entity);
            }
          }
        }
      }
      
      // Spawn swirl particles
      if (Math.random() < 0.3) {
        const angle = Math.random() * Math.PI * 2;
        const dist = bh.radius * (0.5 + Math.random() * 0.5);
        particles.push({
          x: bh.x + Math.cos(angle) * dist,
          y: bh.y + Math.sin(angle) * dist,
          vx: -Math.sin(angle) * 100,
          vy: Math.cos(angle) * 100,
          life: 1, maxLife: 0.4,
          color: 'rgba(120,80,180,0.8)',
          radius: 2 + Math.random() * 2
        });
      }
      
      if (bh.life <= 0) blackHoles.splice(i, 1);
    }
  }
  
  function drawPickups() {
    for (const p of pickups) {
      const pulse = Math.sin(p.pulse) * 0.3 + 0.7;
      const r = p.radius * pulse;
      
      // Outer glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(80,40,120,0.3)';
      ctx.fill();
      
      // Inner orb
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(120,80,180,0.8)';
      ctx.fill();
      
      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180,140,220,1)';
      ctx.fill();
    }
  }
  
  function drawBlackHoles() {
    for (const bh of blackHoles) {
      const alpha = bh.life / bh.maxLife;
      
      // Outer distortion ring
      ctx.beginPath();
      ctx.arc(bh.x, bh.y, bh.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(80,40,120,${alpha * 0.5})`;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Inner void
      ctx.beginPath();
      ctx.arc(bh.x, bh.y, bh.radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(20,10,40,${alpha})`;
      ctx.fill();
      
      // Event horizon
      ctx.beginPath();
      ctx.arc(bh.x, bh.y, bh.radius * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${alpha})`;
      ctx.fill();
    }
  }

  function destroyEntity(entity: Entity) {
    if (entity.destroyed) return;
    entity.destroyed = true; entity.alpha = 0;
    const cx = entity.x + entity.width / 2, cy = entity.y + entity.height / 2;
    spawnExplosion(cx, cy, entity.width, entity.height, entity.color);
    score += 10; scoreValue.textContent = score.toString();
  }

  function checkBulletCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i] as any;
      for (const entity of entities) {
        if (entity.destroyed && entity.alpha <= 0) continue;
        if (bullet.x >= entity.x && bullet.x <= entity.x + entity.width && bullet.y >= entity.y && bullet.y <= entity.y + entity.height) {
          if (bullet.isBlackHole) {
            // Detonate black hole at impact point
            detonateBlackHole(bullet.x, bullet.y);
          } else {
            if (!entity.destroyed) destroyEntity(entity);
          }
          bullets.splice(i, 1);
          break;
        }
      }
    }
  }

  function updateShip(dt: number) {
    const acceleration = 800, friction = 0.98, maxSpeed = 500, turnSpeed = 4;
    if (keys['ArrowLeft'] || keys['KeyA']) ship.angle -= turnSpeed * dt;
    if (keys['ArrowRight'] || keys['KeyD']) ship.angle += turnSpeed * dt;
    ship.thrust = keys['ArrowUp'] || keys['KeyW'];
    if (ship.thrust) { ship.vx += Math.cos(ship.angle) * acceleration * dt; ship.vy += Math.sin(ship.angle) * acceleration * dt; }
    if (keys['ArrowDown'] || keys['KeyS']) { ship.vx -= Math.cos(ship.angle) * acceleration * 0.5 * dt; ship.vy -= Math.sin(ship.angle) * acceleration * 0.5 * dt; }
    ship.vx *= friction; ship.vy *= friction;
    const speed = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
    if (speed > maxSpeed) { ship.vx = (ship.vx / speed) * maxSpeed; ship.vy = (ship.vy / speed) * maxSpeed; }
    ship.x += ship.vx * dt; ship.y += ship.vy * dt;
    if (ship.x < -30) ship.x = w + 30; if (ship.x > w + 30) ship.x = -30;
    if (ship.y < -30) ship.y = h + 30; if (ship.y > h + 30) ship.y = -30;
    if (ship.thrust && Math.random() > 0.4) {
      const exhaust = ship.angle + Math.PI + (Math.random() - 0.5) * 0.6, spd = 80 + Math.random() * 80;
      particles.push({ x: ship.x - Math.cos(ship.angle) * 14, y: ship.y - Math.sin(ship.angle) * 14, vx: Math.cos(exhaust) * spd + ship.vx * 0.4, vy: Math.sin(exhaust) * spd + ship.vy * 0.4, life: 1, maxLife: 0.3 + Math.random() * 0.2, color: 'rgba(187,154,221,1)', radius: 1 + Math.random() * 1.2 });
    }
  }

  function updateBullets(dt: number) {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt; b.pulse += dt * 10;
      if (b.life <= 0 || b.y > h + 50) bullets.splice(i, 1);
    }
  }

  function updateEntities(dt: number) {
    for (const entity of entities) {
      if (entity.destroyed) { entity.vy += 400 * dt; entity.x += entity.vx * dt; entity.y += entity.vy * dt; entity.rotation += entity.rotationSpeed * dt; entity.alpha -= dt * 1.2; }
    }
  }

  function updateParticles(dt: number) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy *= 0.96; p.life -= dt / p.maxLife;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function drawBackground() {
    ctx.clearRect(0, 0, w, h);
    if (backgroundCanvas) {
      ctx.drawImage(backgroundCanvas, 0, 0, w, h);
    } else {
      ctx.fillStyle = '#08090e';
      ctx.fillRect(0, 0, w, h);
    }
  }

  function drawEntities() {
    for (const entity of entities) {
      if (entity.alpha <= 0) continue;
      ctx.save(); ctx.globalAlpha = Math.max(0, entity.alpha);
      let drawX = entity.x, drawY = entity.y;
      if (entity.destroyed) { const cx = entity.x + entity.width / 2, cy = entity.y + entity.height / 2; ctx.translate(cx, cy); ctx.rotate(entity.rotation); drawX = -entity.width / 2; drawY = -entity.height / 2; }
      ctx.font = entity.font; ctx.fillStyle = entity.color; ctx.textBaseline = 'top'; ctx.textAlign = 'left'; ctx.fillText(entity.text, drawX, drawY);
      ctx.restore();
    }
  }

  function drawShip() {
    ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(ship.angle + Math.PI / 2);
    const spread = ship.thrust ? 1.15 : 1.0;
    const pos = shipStars.map(s => ({ x: s.x * spread, y: s.y * spread, radius: s.radius, phase: s.phase }));
    const lineAlpha = ship.thrust ? 0.6 : 0.4;
    ctx.strokeStyle = `rgba(180,150,210,${lineAlpha})`; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(pos[0].x, pos[0].y); ctx.lineTo(pos[1].x, pos[1].y); ctx.lineTo(pos[3].x, pos[3].y); ctx.lineTo(pos[4].x, pos[4].y); ctx.lineTo(pos[2].x, pos[2].y); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = `rgba(160,128,196,${lineAlpha * 0.25})`; ctx.fill();
    for (let i = 0; i < pos.length; i++) {
      const star = pos[i], twinkle = Math.sin(gameTime * 4 + shipStars[i].phase), alpha = 0.6 + 0.4 * twinkle, thrustBoost = ship.thrust ? 1.3 : 1.0;
      ctx.beginPath(); ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2); ctx.fillStyle = `rgba(160,128,196,${alpha * 0.25 * thrustBoost})`; ctx.fill();
      ctx.beginPath(); ctx.arc(star.x, star.y, star.radius * 1.8, 0, Math.PI * 2); ctx.fillStyle = `rgba(187,154,221,${alpha * 0.4 * thrustBoost})`; ctx.fill();
      ctx.beginPath(); ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(235,230,245,${alpha * thrustBoost})`; ctx.fill();
    }
    if (ship.thrust) { const pulse = 0.4 + 0.3 * Math.sin(gameTime * 12); ctx.beginPath(); ctx.arc(0, pos[3].y + 6, 5, 0, Math.PI * 2); ctx.fillStyle = `rgba(187,154,221,${pulse})`; ctx.fill(); }
    ctx.restore();
    
    // Draw "armed" indicator when bomb is ready
    if (hasBlackHoleBomb) {
      const pulse = 0.7 + 0.3 * Math.sin(gameTime * 6);
      ctx.save();
      ctx.font = `bold 14px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      // Glow layers
      ctx.fillStyle = `rgba(120,80,180,${pulse * 0.4})`;
      ctx.fillText('ARMED', ship.x - 1, ship.y - 35);
      ctx.fillText('ARMED', ship.x + 1, ship.y - 35);
      ctx.fillText('ARMED', ship.x, ship.y - 34);
      ctx.fillText('ARMED', ship.x, ship.y - 36);
      // Main text
      ctx.fillStyle = `rgba(180,140,220,${pulse})`;
      ctx.fillText('ARMED', ship.x, ship.y - 35);
      ctx.restore();
    }
  }

  function drawBullets() {
    for (const b of bullets) {
      const twinkle = Math.sin(gameTime * 6 + b.pulse), alpha = 0.7 + 0.3 * twinkle, r = b.radius;
      ctx.beginPath(); ctx.arc(b.x, b.y, r * 2, 0, Math.PI * 2); ctx.fillStyle = `rgba(208,216,234,${alpha * 0.2})`; ctx.fill();
      ctx.beginPath(); ctx.arc(b.x, b.y, r * 0.6, 0, Math.PI * 2); ctx.fillStyle = `rgba(208,216,234,${alpha})`; ctx.fill();
    }
  }

  function drawParticles() {
    for (const p of particles) { ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2); ctx.fillStyle = p.color.replace('1)', `${p.life})`); ctx.fill(); }
  }

  function drawVictory() {
    if (!victoryTriggered) return;
    
    const elapsed = gameTime - victoryTime;
    const fadeIn = Math.min(1, elapsed / 0.5);
    
    // Draw message with glow
    ctx.save();
    ctx.globalAlpha = fadeIn;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Glow layers
    ctx.font = `bold 42px monospace`;
    ctx.fillStyle = 'rgba(160,128,196,0.3)';
    ctx.fillText(victoryMessage, w / 2, h / 2 - 2);
    ctx.fillText(victoryMessage, w / 2, h / 2 + 2);
    ctx.fillText(victoryMessage, w / 2 - 2, h / 2);
    ctx.fillText(victoryMessage, w / 2 + 2, h / 2);
    
    // Main text
    ctx.fillStyle = 'rgba(235,230,245,1)';
    ctx.fillText(victoryMessage, w / 2, h / 2);
    
    // Score display
    ctx.font = `24px monospace`;
    ctx.fillStyle = 'rgba(208,216,234,0.8)';
    ctx.fillText(`FINAL SCORE: ${score}`, w / 2, h / 2 + 50);
    
    // Exit hint (fade in after 1.5s)
    if (elapsed > 1.5) {
      const hintAlpha = Math.min(0.6, (elapsed - 1.5) / 0.5);
      ctx.globalAlpha = hintAlpha;
      ctx.font = `16px monospace`;
      ctx.fillStyle = 'rgba(208,216,234,1)';
      ctx.fillText('ESC to return to reality', w / 2, h / 2 + 100);
    }
    
    ctx.restore();
  }

  function updateVictory() {
    if (!victoryTriggered) return;
    
    const elapsed = gameTime - victoryTime;
    
    // Spawn periodic fireworks for first 3 seconds
    if (elapsed < 3 && Math.random() < 0.08) {
      spawnFirework(
        w * (0.15 + Math.random() * 0.7),
        h * (0.2 + Math.random() * 0.4)
      );
    }
  }

  function updateIntro(dt: number) {
    introTime += dt;
    // Ease out cubic
    const t = Math.min(1, introTime / introDuration);
    const eased = 1 - Math.pow(1 - t, 3);
    ship.y = introShipStartY + (introShipEndY - introShipStartY) * eased;

    // Engine exhaust particles during fly-in
    if (Math.random() > 0.2) {
      const exhaust = ship.angle + Math.PI + (Math.random() - 0.5) * 0.6;
      const spd = 100 + Math.random() * 120;
      particles.push({
        x: ship.x + (Math.random() - 0.5) * 6,
        y: ship.y + 14, // behind the ship (pointing up)
        vx: Math.cos(exhaust) * spd * 0.3,
        vy: Math.sin(exhaust) * spd + 60,
        life: 1, maxLife: 0.4 + Math.random() * 0.3,
        color: 'rgba(187,154,221,1)',
        radius: 1.5 + Math.random() * 1.5
      });
    }

    if (t >= 1) {
      introActive = false;
      ship.y = introShipEndY;
      hud.classList.add('active');
    }
  }

  function gameLoop(now: number) {
    const dt = Math.min((now - lastTime) / 1000, 0.1); lastTime = now; gameTime += dt;
    if (entitiesReady) {
      if (introActive) {
        // Intro phase: ship flies in, no player control
        updateIntro(dt);
        updateParticles(dt);
        drawBackground();
        drawEntities();
        drawParticles();
        drawShip();
        // VHS glitch overlay masks the DOM→canvas transition
        if (introTime < glitchDuration) {
          drawGlitchOverlay(introTime / glitchDuration);
        }
      } else {
        // Normal gameplay
        updateShip(dt); 
        updateBullets(dt); 
        updateEntities(dt); 
        updateParticles(dt);
        updatePickups(dt);
        updateBlackHoles(dt);
        checkBulletCollisions();
        checkUpgrades();
        checkVictory();
        updateVictory();
        drawBackground(); 
        drawEntities();
        drawBlackHoles();
        drawPickups();
        drawParticles(); 
        drawBullets(); 
        if (!victoryTriggered) drawShip();
        drawVictory();
      }
    }
    else { ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, w, h); }
    // Hide DOM after the first canvas frame is painted so there's no visible gap
    if (!domHidden && entitiesReady) {
      domHidden = true;
      const mainContent = document.querySelector('main') as HTMLElement;
      if (mainContent) mainContent.style.visibility = 'hidden';
    }
    if (shipModeActive) animId = requestAnimationFrame(gameLoop);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) e.preventDefault();
    if (e.code === 'Escape') { deactivateShipMode(); return; }
    keys[e.code] = true;
    if (e.code === 'Space') shoot();
  }

  function handleKeyUp(e: KeyboardEvent) { keys[e.code] = false; }

  // Start the game immediately
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('astro:before-swap', function cleanup() {
    deactivateShipMode(true);
    document.removeEventListener('keydown', handleKeyDown); 
    document.removeEventListener('keyup', handleKeyUp); 
    document.removeEventListener('astro:before-swap', cleanup); 
  }, { once: true });

  activateShipMode();
}
