(() => {
  const POLL_EVERY = 3000;
  const NOTIFICATION_ID = 'autorefresh-plugin-notice';
  const STORAGE_KEY = 'autorefresh-hide-notice'; // Key for localStorage

  let pollingInterval;
  let lastSeen = 0;


  function showNotification() {
    if (document.getElementById(NOTIFICATION_ID)) return;

    const notice = document.createElement('div');
    notice.id = NOTIFICATION_ID;

    notice.innerHTML = `
      <style>
        #${NOTIFICATION_ID} {
          position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
          width: 90%; max-width: 650px; background-color: #2a2d36; color: #e9e9e9;
          padding: 20px; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          z-index: 10000; font-family: Arial, sans-serif; font-size: 15px;
        }
        #${NOTIFICATION_ID} h4 { margin: 0 0 10px 0; color: #58a6ff; font-size: 1.2em; }
        #${NOTIFICATION_ID} p { margin: 1em 0; line-height: 1.5; }
        

        #${NOTIFICATION_ID} code {
          display: block;
          white-space: nowrap;
          overflow-x: auto;
          background-color: #1c1e24;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #444;
          scrollbar-width: thin;
          scrollbar-color: #555 #1c1e24;
        }
        #${NOTIFICATION_ID} code::-webkit-scrollbar { height: 8px; }
        #${NOTIFICATION_ID} code::-webkit-scrollbar-track { background: #1c1e24; }
        #${NOTIFICATION_ID} code::-webkit-scrollbar-thumb { background-color: #555; border-radius: 4px; }

        #${NOTIFICATION_ID} .dismiss-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #aaa; font-size: 24px; cursor: pointer; }
        #${NOTIFICATION_ID} .persist-option { float: right; margin-top: 10px; font-size: 13px; display: flex; align-items: center; gap: 5px; }
      </style>
      
      <button class="dismiss-btn" title="Dismiss this time">&times;</button>
      <h4>Action Required: Auto-Refresh Plugin</h4>
      
      <p>The server component for this extension is not running. You must manually copy the <code>characters-autorefresh</code> plugin folder and restart SillyTavern.</p>
      
      <p>
        <b>1. Find the source folder:</b><br>
        If installed for <b>all users</b>: <code>SillyTavern/public/scripts/extensions/third-party/plugins/characters-autorefresh</code><br>
        If installed for <b>just you</b>: <code>SillyTavern/data/default-user/extensions/plugins/characters-autorefresh</code>
      </p>

      <p><b>2. Move that characters-autorefresh folder into:</b> <code>SillyTavern/plugins/</code></p>

      <div class="persist-option">
        <label for="autorefresh-hide-forever">Don't show this again</label>
        <input type="checkbox" id="autorefresh-hide-forever">
      </div>
    `;

    document.body.appendChild(notice);

    const hideForeverCheckbox = notice.querySelector('#autorefresh-hide-forever');
    notice.querySelector('.dismiss-btn').addEventListener('click', () => notice.remove());
    hideForeverCheckbox.addEventListener('change', () => {
      localStorage.setItem(STORAGE_KEY, String(hideForeverCheckbox.checked));
    });
  }

  async function poll() {
    try {
      const response = await fetch('/api/plugins/characters-autorefresh/last-change');
      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);

      const notice = document.getElementById(NOTIFICATION_ID);
      if (notice) notice.remove();

      const { lastChange } = await response.json();
      if (lastChange > lastSeen) {
        lastSeen = lastChange;
        console.log('[Auto-Refresh] Change detected → Reloading character list.');
        if (window.SillyTavern?.getContext) {
          await SillyTavern.getContext().getCharacters();
        }
      }
    } catch (error) {
      console.error('[Auto-Refresh] Polling failed, plugin not detected.', error.message);
      if (pollingInterval) clearInterval(pollingInterval);
      showNotification();
    }
  }

  function initialize() {
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      console.log('[Auto-Refresh] Notice is permanently hidden by user setting.');
      return;
    }
    
    console.log('[Auto-Refresh] Initializing poll process.');
    pollingInterval = setInterval(poll, POLL_EVERY);
    poll();
  }

  if (document.readyState === 'complete') {
    initialize();
  } else {
    window.addEventListener('load', initialize);
  }
})();