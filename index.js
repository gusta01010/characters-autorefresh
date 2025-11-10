(() => {
  const POLL_EVERY = 2000;            // 2 s
  let lastSeen = 0;

  async function poll() {
    try {
      const r = await fetch('/api/plugins/char-refresh/last-change');
      if (!r.ok) throw new Error(r.statusText);
      const { lastChange } = await r.json();

      if (lastChange > lastSeen) {
        lastSeen = lastChange;
        console.log('[auto-refresh] change detected → reload list');
        await SillyTavern.getContext().getCharacters();   // same fn the UI uses
      }
    } catch (e) {
      console.warn('[auto-refresh] poll failed:', e.message);
    }
  }

  function start() {
    setInterval(poll, POLL_EVERY);
    poll();
    console.log('[auto-refresh] polling started');
  }

  // wait until ST is fully booted
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();