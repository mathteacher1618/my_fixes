/**
 * iPad & Mobile Virtual Keyboard Viewport Fix
 */
(function () {
  // 1. 動態補全 viewport-fit=cover
  let meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'viewport';
    document.head.appendChild(meta);
  }
  if (!meta.content.includes('viewport-fit=cover')) {
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
  }

  // 2. 動態注入全域防遮擋 CSS 樣式
  const style = document.createElement('style');
  style.textContent = `
    html, body { min-height: 100dvh; }
    input, textarea, select, .quiz-card, .feedback-box {
      scroll-margin-bottom: 120px !important;
    }
  `;
  document.head.appendChild(style);

  // 3. 焦點元素平滑滾動至可視區域
  function keepFocusedElementInView(el) {
    if (!el) return;
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 250);
  }

  // 4. Visual Viewport 視窗改變監聽 (iOS/iPadOS 鍵盤彈出)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      const activeEl = document.activeElement;
      if (activeEl && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName)) {
        keepFocusedElementInView(activeEl);
      }
    });
  }

  // 5. 全局 focusin 降級相容
  document.addEventListener('focusin', (e) => {
    const target = e.target;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      keepFocusedElementInView(target);
    }
  });
})();
