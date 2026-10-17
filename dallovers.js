(() => {
  'use strict';
  const header = document.querySelector('#page-header.full_page');
  if (!header) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const subtitle = document.getElementById('subtitle');
  const subtitleText = '大工本科在读 · 记录学习，探索世界';
  let typingTimer;
  let typingIndex = 0;
  function stopTyping() {
    clearInterval(typingTimer);
    if (subtitle) subtitle.textContent = subtitleText;
  }
  if (subtitle && !reducedMotion.matches) {
    subtitle.textContent = '';
    typingTimer = setInterval(() => {
      subtitle.textContent = subtitleText.slice(0, ++typingIndex);
      if (typingIndex >= subtitleText.length) clearInterval(typingTimer);
    }, 100);
  }
  const canvas = document.createElement('canvas');
  canvas.id = 'dallovers-particles';
  canvas.setAttribute('aria-hidden', 'true');
  header.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = 0;
  let previousTime = 0;
  let visible = true;
  function resize() {
    width = header.clientWidth;
    height = header.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: width < 560 ? 26 : 64 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: .5 + Math.random() * 1.5,
      speed: 7 + Math.random() * 15,
      phase: Math.random() * Math.PI * 2,
      opacity: .2 + Math.random() * .5
    }));
    paint(0, 0);
  }
  function paint(delta, time) {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.y -= p.speed * delta;
      p.x += Math.sin(time * .0003 + p.phase) * delta * 5;
      if (p.y < -5) p.y = height + 5;
      if (p.x < -5) p.x = width + 5;
      if (p.x > width + 5) p.x = -5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(238, 209, 148, ${p.opacity})`;
      ctx.shadowColor = '#e5bf75';
      ctx.shadowBlur = 7;
      ctx.fill();
    }
  }
  function frame(time) {
    const delta = previousTime ? Math.min((time - previousTime) / 1000, .05) : 0;
    previousTime = time;
    paint(delta, time);
    animationFrame = requestAnimationFrame(frame);
  }
  function syncAnimation() {
    cancelAnimationFrame(animationFrame);
    previousTime = 0;
    if (!reducedMotion.matches && !document.hidden && visible) {
      animationFrame = requestAnimationFrame(frame);
    } else if (reducedMotion.matches) {
      stopTyping();
      paint(0, 0);
    }
  }
  new ResizeObserver(resize).observe(header);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    syncAnimation();
  }).observe(header);
  document.addEventListener('visibilitychange', syncAnimation);
  reducedMotion.addEventListener('change', syncAnimation);
  resize();
  syncAnimation();
})();
