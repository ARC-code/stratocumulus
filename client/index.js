// The client root index.
// If you modify this file, you need to rebuild the docker image
// for the changes to take effect.

const app = require('./lib')

// Start the app only after all HTML and scripts are loaded.
document.addEventListener('DOMContentLoaded', function () {
  app.start();
});
