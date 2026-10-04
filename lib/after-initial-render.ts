/** Schedule legacy DOM translation after React's initial commit and paint.
 * Do not edit server-rendered text from an early sibling's mount effect: other
 * client boundaries may still be hydrating, particularly in WebKit.
 */
export function afterInitialRender(callback: () => void) {
  let secondFrame = 0;
  let idle = 0;
  let timer = 0;
  let cancelled = false;
  const run = () => { if (!cancelled) callback(); };
  const firstFrame = requestAnimationFrame(() => {
    secondFrame = requestAnimationFrame(() => {
      if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(run, { timeout: 1000 });
      else timer = window.setTimeout(run, 0);
    });
  });
  return () => {
    cancelled = true;
    cancelAnimationFrame(firstFrame);
    cancelAnimationFrame(secondFrame);
    if (idle) window.cancelIdleCallback(idle);
    if (timer) window.clearTimeout(timer);
  };
}
