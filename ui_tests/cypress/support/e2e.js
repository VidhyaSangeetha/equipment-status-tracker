    // cypress.config.js
    const { defineConfig } = require('cypress');

    module.exports = defineConfig({
      e2e: {
        supportFile: false, // Set to false if no support file is needed
      },
    });
