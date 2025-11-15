const fs = require('fs');
const path = require('path');

module.exports.info = {
  id: 'characters-autorefresh',
  name: 'Auto-refresh Character folder',
  description: 'Signals the UI whenever the character folder changes'
};

/**
 * @param {import('express').Router} router Express router
 * @returns {Promise<void>}
 */
module.exports.init = async function init(router) {
  const CHAR_DIR = path.resolve(__dirname, '..', '..', 'data', 'default-user', 'characters');
  let lastChange = Date.now();

  router.get('/last-change', (_req, res) =>
    res.json({ lastChange })
  );

  console.log('[auto-refresh] REST GET /api/plugins/characters-autorefresh/last-change registered');

  // use native fs.watch instead of chokidar
  let debounceTimer;
  fs.watch(CHAR_DIR, (eventType, filename) => {
    if (!filename || !filename.match(/\.(png|json|webp)$/i)) return;
    
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`[auto-refresh] ${eventType}: ${filename}`);
      lastChange = Date.now();
    }, 300);
  });

  console.log('[auto-refresh] Watching for character changes in:', CHAR_DIR);
};