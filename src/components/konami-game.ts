/**
 * Konami Code Easter Egg - Game Logic
 * Dynamically imported only when the konami code is entered.
 */

export function startGame() {
  let shipModeActive = false;
  let entitiesReady = false;

  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const hud = document.getElementById('ship-hud') as HTMLDivElement;
  const scoreValue = document.getElementById('score-value') as HTMLSpanElement;
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
  let scrollbarWidth = 0;
  let originalBodyPaddingRight = '';
  let originalPagePaddingRight = '';
  
  interface Entity {
    id: number; text: string; x: number; y: number;
    width: number; height: number; font: string; color: string;
    vx: number; vy: number; rotation: number; rotationSpeed: number;
    destroyed: boolean; alpha: number;
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
    mainContent.style.visibility = 'hidden';
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
    
    // Compensate for scrollbar removal to prevent layout shift
    scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const pageEl = document.querySelector('.page') as HTMLElement;
    
    // Store original padding values
    originalBodyPaddingRight = document.body.style.paddingRight;
    if (pageEl) originalPagePaddingRight = pageEl.style.paddingRight;
    
    // Get computed padding and add scrollbar width
    const bodyComputedPadding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    const pageComputedPadding = pageEl ? parseFloat(getComputedStyle(pageEl).paddingRight) || 0 : 0;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${bodyComputedPadding + scrollbarWidth}px`;
    if (pageEl) pageEl.style.paddingRight = `${pageComputedPadding + scrollbarWidth}px`;
    
    canvas.classList.add('active');
    extractCharacterEntities();
    ship.x = w / 2; ship.y = h - 100; ship.vx = 0; ship.vy = 0;
    score = 0; scoreValue.textContent = '0'; gameTime = 0;
    hud.classList.add('active');
    lastTime = performance.now();
    animId = requestAnimationFrame(gameLoop);
    flashScreen();
  }

  function deactivateShipMode() {
    if (!shipModeActive) return;
    shipModeActive = false; entitiesReady = false;
    window.removeEventListener('resize', resize);
    if (animId !== null) { cancelAnimationFrame(animId); animId = null; }
    canvas.classList.remove('active');
    hud.classList.remove('active');
    
    // Restore scrollbar and original padding
    document.body.style.overflow = '';
    document.body.style.paddingRight = originalBodyPaddingRight;
    const pageEl = document.querySelector('.page') as HTMLElement;
    if (pageEl) pageEl.style.paddingRight = originalPagePaddingRight;
    
    const mainContent = document.querySelector('main') as HTMLElement;
    if (mainContent) mainContent.style.visibility = '';
    entities = []; bullets.length = 0; particles.length = 0; backgroundCanvas = null;
    ctx.clearRect(0, 0, w, h);
  }

  function flashScreen() {
    const flash = document.createElement('div');
    flash.style.cssText = `position:fixed;inset:0;background:rgba(100,200,150,0.3);z-index:10003;pointer-events:none;animation:flash-out 0.4s ease-out forwards;`;
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

  function shoot() {
    const speed = 500, bulletAngle = ship.angle;
    bullets.push({ x: ship.x + Math.cos(bulletAngle) * 18, y: ship.y + Math.sin(bulletAngle) * 18, vx: Math.cos(bulletAngle) * speed + ship.vx * 0.3, vy: Math.sin(bulletAngle) * speed + ship.vy * 0.3, life: 2.5, radius: 4, pulse: Math.random() * Math.PI * 2 });
    for (let i = 0; i < 4; i++) {
      const angle = bulletAngle + (Math.random() - 0.5) * 0.8, spd = 60 + Math.random() * 80;
      particles.push({ x: ship.x + Math.cos(bulletAngle) * 18, y: ship.y + Math.sin(bulletAngle) * 18, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, life: 1, maxLife: 0.2, color: 'rgba(208,216,234,0.8)', radius: 1 + Math.random() * 0.8 });
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
      const bullet = bullets[i];
      for (const entity of entities) {
        if (entity.destroyed && entity.alpha <= 0) continue;
        if (bullet.x >= entity.x && bullet.x <= entity.x + entity.width && bullet.y >= entity.y && bullet.y <= entity.y + entity.height) {
          if (!entity.destroyed) destroyEntity(entity);
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

  function gameLoop(now: number) {
    const dt = Math.min((now - lastTime) / 1000, 0.1); lastTime = now; gameTime += dt;
    if (entitiesReady) { updateShip(dt); updateBullets(dt); updateEntities(dt); updateParticles(dt); checkBulletCollisions(); drawBackground(); drawEntities(); drawParticles(); drawBullets(); drawShip(); }
    else { ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, w, h); }
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
    deactivateShipMode(); 
    document.removeEventListener('keydown', handleKeyDown); 
    document.removeEventListener('keyup', handleKeyUp); 
    document.removeEventListener('astro:before-swap', cleanup); 
  }, { once: true });

  activateShipMode();
}
