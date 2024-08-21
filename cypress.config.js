const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://192.168.88.150:8000/web",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
