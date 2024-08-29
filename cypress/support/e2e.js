import "cypress-mailosaur";
import "./commands";
Cypress.on("uncaught:exception", (err) => {
  Cypress.log({
    name: "Uncaught Exception",
    message: err.message,
    consoleProps: () => ({
      error: err,
      message: err.message,
      stack: err.stack,
    }),
  });
  return false;
});
