const { defineConfig } = require("cypress");
const { downloadFile } = require("cypress-downloadfile/lib/addPlugin");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://192.168.88.150:8000/web",
    downloadsFolder: "cypress/downloads",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
