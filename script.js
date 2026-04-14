// ── 커서 이동
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let ringX = 0, ringY = 0;
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
  spawnParticle(mouseX, mouseY);
});

// 링은 약간 지연 따라오기
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// ── 클릭 시 링 튀기기
document.addEventListener('mousedown', () => {
  ring.style.width  = '20px';
  ring.style.height = '20px';
  ring.style.opacity = '1';
});
document.addEventListener('mouseup', () => {
  ring.style.width  = '36px';
  ring.style.height = '36px';
  ring.style.opacity = '0.6';
});

// ── 파티클 생성
const COLORS = ['#7B3FB5','#9B59CC','#D4A8F0','#B87FE0','#C49EEB','#E8D0FF'];
const SHAPES = ['💜','✦','·','⋆','✿','❋'];
let lastSpawn = 0;

function spawnParticle(x, y) {
  const now = Date.now();
  if (now - lastSpawn < 30) return; // 30ms 간격 제한
  lastSpawn = now;

  const useEmoji = Math.random() < 0.3;
  const p = document.createElement('div');
  p.classList.add('particle');

  const size  = Math.random() * 8 + 4;
  const dx    = (Math.random() - 0.5) * 60;
  const dy    = -(Math.random() * 50 + 20);
  const dur   = Math.random() * 0.5 + 0.6;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  if (useEmoji) {
    p.style.cssText = `
      left:${x}px; top:${y}px;
      font-size:${size + 6}px;
      --dx:${dx}px; --dy:${dy}px;
      animation-duration:${dur}s;
      background: transparent;
      border-radius: 0;
    `;
    p.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  } else {
    p.style.cssText = `
      left:${x}px; top:${y}px;
      width:${size}px; height:${size}px;
      background:${color};
      --dx:${dx}px; --dy:${dy}px;
      animation-duration:${dur}s;
      opacity:0.8;
    `;
  }

  document.body.appendChild(p);
  p.addEventListener('animationend', () => p.remove());
}

// ── 숫자 카운트업 (Intersection Observer)
function animateCount(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const value = Math.floor(ease * target);
    el.textContent = value.toLocaleString('ko-KR');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString('ko-KR');
  }
  requestAnimationFrame(update);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.count').forEach(el => observer.observe(el));

// ── 클릭 시 파티클 폭발
document.addEventListener('click', (e) => {
  for (let i = 0; i < 12; i++) {
    setTimeout(() => spawnParticleBurst(e.clientX, e.clientY), i * 20);
  }
});

function spawnParticleBurst(x, y) {
  const p = document.createElement('div');
  p.classList.add('particle');
  const angle = Math.random() * Math.PI * 2;
  const dist  = Math.random() * 60 + 20;
  const dx    = Math.cos(angle) * dist;
  const dy    = Math.sin(angle) * dist;
  const size  = Math.random() * 10 + 5;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  p.style.cssText = `
    left:${x}px; top:${y}px;
    width:${size}px; height:${size}px;
    background:${color};
    --dx:${dx}px; --dy:${dy}px;
    animation-duration:${Math.random()*0.4+0.5}s;
    opacity:0.9;
  `;
  document.body.appendChild(p);
  p.addEventListener('animationend', () => p.remove());
}
