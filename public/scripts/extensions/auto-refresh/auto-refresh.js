const fs       = require('fs');
const path     = require('path');
const chokidar = require('chokidar');

const CHAR_DIR = path.resolve(__dirname, '..', '..', 'data', 'default-user', 'characters');
let   lastChange = Date.now();

module.exports.info = {
  id : 'char-refresh',
  name : 'Character folder refresher',
  description : 'Signals the UI whenever the character folder changes'
};

module.exports.init = async function init(router) {


  router.get('/last-change', (_req, res)=>
    res.json({ lastChange }) );

  console.log('[char-refresh] REST  GET /last-change  registered');

  const watcher = chokidar.watch(CHAR_DIR, {
    ignoreInitial: true,
    usePolling: true,
    interval: 1000,
    depth: 0,
    awaitWriteFinish: { stabilityThreshold: 300 }
  });

  watcher.on('all', (evt, file) => {
    if (!file.match(/\.(png|json)$/i)) return;  // only cards
    console.log(`[char-watcher] ${evt}: ${path.basename(file)}`);
    lastChange = Date.now();
  });

  console.log('[char-refresh] Watching', CHAR_DIR);
};