const { defineConfig } = require("cypress");
const { downloadFile } = require("cypress-downloadfile/lib/addPlugin");

module.exports = defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true,
    json: true,
  },
  e2e: {
    baseUrl: "http://192.168.88.150:8000/web",
    downloadsFolder: "cypress/downloads",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
