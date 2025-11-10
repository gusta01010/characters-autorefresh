# Character Auto-Refresher for SillyTavern
Automatically refreshes your character list when you add, edit, or delete a character card directly from the `characters` folder.

**Tired of constantly hitting the refresh button after managing your character files manually? This extension completely automates the process!**

This lightweight plugin works in the background to:
- Instantly detect new character cards (`.png`, `.webp`, `.json`) added to your folder.
- Update the character list seamlessly without needing a page reload.
- Keep your SillyTavern session running smoothly.

## Example in Action

![A GIF showing a character file being added to the characters folder and the SillyTavern UI updating automatically without any user intervention.](https://files.catbox.moe/your-gif-url-here.gif)
*(Recommendation: Record a short GIF of the feature working and replace the URL above to show users how it works!)*

## Installation

This extension has two parts: a **backend server plugin** and a **frontend UI extension**. You must install **both** for it to work.

### **Step 1: Backend Plugin (Manual Installation)**

1.  First, make sure you have enabled server plugins in SillyTavern.
    - Open the `config.yaml` file in your main SillyTavern folder.
    - Find the line `enableServerPlugins: false` and change it to `enableServerPlugins: true`.
    - Save the file.

2.  Navigate to your `SillyTavern/plugins/` directory.

3.  Create a new folder inside `plugins` and name it `characters-autorefresh`.

4.  Download the backend script file `index.js` from this repository.
    - [Click here to download the `index.js` file](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME/raw/main/index.js) *(Right-click -> Save Link As...)*

5.  Place the downloaded `index.js` file inside the folder you created. The final path should be: `SillyTavern/plugins/characters-autorefresh/index.js`.

### **Step 2: Frontend Extension (UI Installation)**

1.  Copy the URL of this GitHub repository.

2.  In the SillyTavern UI, click on the "Extensions" icon (stacked blocks) in the top menu.

3.  Click on the "Install from URL" tab.

4.  Paste the repository URL into the top field and click "Install".

### **Step 3: Final Activation**

1.  **Completely restart SillyTavern.** (Close the black terminal window and run `start.bat` or `start.sh` again).
2.  Open SillyTavern, go back to the "Extensions" menu.
3.  You should see "Character Auto-Refresher" in the list. **Enable it using the toggle switch.**

## Usage

Once installed and enabled, the extension works automatically. There is no UI to configure.

1.  Simply add, delete, or modify a character card in your `SillyTavern/data/default-user/characters` folder.
2.  The character list in the SillyTavern UI will update on its own within a few seconds.

## License

This project is licensed under the [MIT License](./LICENSE) - see the `LICENSE` file for details.

## Credits

-   Built on the powerful and flexible [SillyTavern](https://github.com/SillyTavern/SillyTavern) platform.
-   Uses the [chokidar](https://github.com/paulmillr/chokidar) library for file system watching.