(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.note-reader').forEach(reader => {
    const sheets = [...reader.querySelectorAll('[data-note-sheet]')];
    const select = reader.querySelector('[data-note-page]');
    const prev = reader.querySelector('[data-note-prev]');
    const next = reader.querySelector('[data-note-next]');
    const zoom = reader.querySelector('[data-note-zoom]');
    let current = 1;
    const update = n => {
      current = n;
      select.value = String(n);
      prev.disabled = n === 1;
      next.disabled = n === sheets.length;
    };
    const go = n => {
      n = Math.max(1, Math.min(sheets.length, n));
      update(n);
      const toolbar = reader.querySelector('.note-toolbar');
      const offset = parseFloat(getComputedStyle(toolbar).top) + toolbar.getBoundingClientRect().height + 12;
      window.scrollTo({top: window.scrollY + sheets[n - 1].getBoundingClientRect().top - offset,
        behavior: reduced.matches ? 'instant' : 'smooth'});
    };
    select.addEventListener('change', () => go(Number(select.value)));
    prev.addEventListener('click', () => go(current - 1));
    next.addEventListener('click', () => go(current + 1));
    zoom.addEventListener('click', () => {
      const expanded = reader.classList.toggle('is-zoomed');
      zoom.setAttribute('aria-pressed', String(expanded));
      zoom.textContent = expanded ? '适合宽度' : '放大阅读';
    });
    let queued = false;
    const trackPage = () => {
      if(queued) return;
      queued = true;
      requestAnimationFrame(() => {
        const toolbar = reader.querySelector('.note-toolbar');
        const line = parseFloat(getComputedStyle(toolbar).top) + toolbar.getBoundingClientRect().height + 24;
        const active = sheets.find(sheet => sheet.getBoundingClientRect().bottom > line) || sheets[sheets.length - 1];
        update(Number(active.dataset.noteSheet));
        queued = false;
      });
    };
    addEventListener('scroll', trackPage, {passive:true});
    addEventListener('resize', trackPage);
  });
})();
