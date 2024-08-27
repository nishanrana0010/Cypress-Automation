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

// Cypress.Commands.add("createBooking", (rowIndex, credentials) => {
//   cy.get('tbody[class="ui-sortable"]').within(() => {
//     cy.get('tr[class="o_data_row"]')
//       .eq(rowIndex)
//       .within(() => {
//         cy.get('button[type="button"]').eq(1).click();
//       });
//   });

//   cy.get('div[class="oe_title"]').type(credentials.BookingTitle);
//   cy.get('div[name="start"]').clear().type(credentials.Date);
//   cy.get('span[class="fa fa-check primary"]').click();
//   cy.get('input[name="duration"]').clear().type(credentials.Duration);
//   cy.get('button[type="button"]').contains("Save").click();
// });
Cypress.Commands.add("createBooking", (rowIndex, credentials) => {
  cy.get('tbody[class="ui-sortable"]').within(() => {
    cy.get('tr[class="o_data_row"]')
      .eq(rowIndex)
      .within(() => {
        cy.get('button[type="button"]').eq(1).click();
      });
  });

  if (credentials.BookingTitle) {
    cy.get('div[class="oe_title"]').type(credentials.BookingTitle);
  }
  if (credentials.Date) {
    cy.get('div[name="start"]').clear().type(credentials.Date);
    cy.get('span[class="fa fa-check primary"]').click();
  }

  if (credentials.Duration) {
    cy.get('input[name="duration"]').clear().type(credentials.Duration);
  }
  cy.get('button[type="button"]').contains("Save").click();
});
