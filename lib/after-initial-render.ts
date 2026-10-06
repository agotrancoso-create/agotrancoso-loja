/** Schedule legacy DOM translation only after the initial document load.
 * Directly editing server-rendered text while React is still hydrating can cause
 * recoverable hydration failures on slower mobile browsers. Waiting for load,
 * then two animation frames and an idle turn, keeps the legacy translator out
 * of React's initial hydration window.
 */
export function afterInitialRender(callback: () => void) {
  let firstFrame = 0;
  let secondFrame = 0;
  let idle = 0;
  let timer = 0;
  let cancelled = false;
  let waitingForLoad = false;

  const run = () => { if (!cancelled) callback(); };
  const schedule = () => {
    if (cancelled) return;
    firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        if (typeof window.requestIdleCallback === 'function') {
          idle = window.requestIdleCallback(run, { timeout: 1500 });
        } else {
          timer = window.setTimeout(run, 32);
        }
      });
    });
  };

  const onLoad = () => {
    waitingForLoad = false;
    schedule();
  };

  if (document.readyState === 'complete') schedule();
  else {
    waitingForLoad = true;
    window.addEventListener('load', onLoad, { once: true });
  }

  return () => {
    cancelled = true;
    if (waitingForLoad) window.removeEventListener('load', onLoad);
    cancelAnimationFrame(firstFrame);
    cancelAnimationFrame(secondFrame);
    if (idle) window.cancelIdleCallback(idle);
    if (timer) window.clearTimeout(timer);
  };
}
