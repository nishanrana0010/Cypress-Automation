import { login } from "../support/LoginUtils";

Cypress.Commands.add("login", login);

describe("TODO App", () => {
  let credentials, urls;
  const validEmail = Cypress.env("validEmail");
  const validPassword = Cypress.env("validPassword");
  const userEmail = Cypress.env("userEmail");
  before(() => {
    cy.fixture("datas.json").then((data) => {
      credentials = data;
    });

    cy.fixture("urls.json").then((data) => {
      urls = data;
    });
  });
  beforeEach(() => {
    cy.visit(urls.LoginUrl);
  });

  it("validation message should be displayed when mandatory fields are left empty.", () => {
    cy.login("", "").then(() => {
      cy.get('input[type="text"]').then(($input) => {
        expect($input[0].validationMessage).to.eq(
          credentials.EmptyvalidationMessage
        );
      });
    });
  });

  it("users should not be to login with invalid credentials.", () => {
    cy.login(credentials.invalidEmail, credentials.invalidPassword).then(() => {
      cy.get('form[role="form"]').within(() => {
        cy.get('p[role="alert"]').should(
          "contain.text",
          credentials.WrongValidationMessage
        );
      });

      cy.get('input[id="login"]').clear();
      cy.get('input[id="password"]').clear();

      cy.login(validEmail, credentials.invalidPassword).then(() => {
        cy.get('form[role="form"]').within(() => {
          cy.get('p[role="alert"]').should(
            "contain.text",
            credentials.WrongValidationMessage
          );
        });
      });

      cy.get('input[id="login"]').clear();
      cy.get('input[id="password"]').clear();

      cy.login(credentials.invalidEmail, validPassword).then(() => {
        cy.get('p[role="alert"]').should(
          "contain.text",
          credentials.WrongValidationMessage
        );
      });
    });
  });

  it("forgot password link should be clickable and redirects user to [resert password] page", () => {
    cy.get('form[role="form"]').within(() => {
      cy.get('div[class="justify-content-between mt-2 d-flex small"]')
        .contains("Reset Password")
        .click();
      cy.url().should("include", urls.forgotPassword);
    });
  });

  it("user should be able to login with valid credentials.", () => {
    cy.login(userEmail, validPassword);
    cy.get('ul[class="o_menu_apps"]').click();
    cy.get('div[role="menu"]').should("not.contain.text", "Settings");
  });

  it("admin should be able to login with valid credentials.", () => {
    cy.login(validEmail, validPassword);
    cy.get('ul[class="o_menu_apps"]').click();
    cy.get('div[role="menu"]').should("contain.text", "Settings");
  });
});
