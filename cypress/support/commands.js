Cypress.Commands.add("UserLogin", (username, password) => {
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

Cypress.Commands.add("AdminLogin", (username, password) => {
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

Cypress.Commands.add("createRoom", (title, seat) => {
  cy.get('button[type="button"]').contains("Create").click();
  if (title) {
    cy.get('div[class="oe_title"]').type(title);
  }

  if (seat) {
    cy.get(
      'input[class="o_field_integer o_field_number o_field_widget o_input"]'
    ).type(seat);
  }

  cy.get('button[type="button"]').contains("Save").click();
});
