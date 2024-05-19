(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.ts-CisRePzf.js")
    );
  })().catch(console.error);

})();
