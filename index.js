const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

module.exports.info = {
  id: 'char-refresh',
  name: 'Character Folder Refresher',
  description: 'Signals the UI whenever the character folder changes'
};

/**
 * @param {import('express').Router} router Express router
 * @returns {Promise<void>}
 */
module.exports.init = async function init(router) {
  const CHAR_DIR = path.resolve(__dirname, '..', '..', '..', 'public', 'characters');
  let lastChange = Date.now();

  router.get('/last-change', (_req, res) =>
    res.json({ lastChange })
  );

  console.log('[char-refresh] REST GET /api/plugins/char-refresh/last-change registered');

  const watcher = chokidar.watch(CHAR_DIR, {
    ignoreInitial: true,
    usePolling: true,
    interval: 1000,
    depth: 0,
    awaitWriteFinish: { stabilityThreshold: 300 }
  });

  watcher.on('all', (evt, file) => {
    if (!file.match(/\.(png|json|webp)$/i)) return;
    console.log(`[char-refresh] ${evt}: ${path.basename(file)}`);
    lastChange = Date.now();
  });

  console.log('[char-refresh] Watching for character changes in:', CHAR_DIR);
};