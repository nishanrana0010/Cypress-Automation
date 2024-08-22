Cypress.Commands.add("loginThroughApi", (username, password) => {
  cy.request("/login").then((response) => {
    const $html = (Cypress.html = Cypress.$(response.body));
    const $csrf = $html.find("input[name=csrf_token]").val();
    cy.request({
      method: "POST",
      url: "/login",
      form: true,
      body: {
        csrf_token: $csrf,
        login: username,
        password: password,
      },
    });
    cy.url().should("not.contain", "login");
  });
});
