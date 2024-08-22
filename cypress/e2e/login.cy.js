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

  it("Verify if validation message is displayed when mandatory fields are left empty.", () => {
    cy.login("", "").then(() => {
      cy.get('input[type="text"]').then(($input) => {
        expect($input[0].validationMessage).to.eq(
          credentials.EmptyvalidationMessage
        );
      });
    });
  });

  it("Verify that users cannot to login with invalid credentials.", () => {
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

  it("Verify that forgot password link is clickable and redirects to [resert password] page", () => {
    cy.get('form[role="form"]').within(() => {
      cy.get('div[class="justify-content-between mt-2 d-flex small"]')
        .contains("Reset Password")
        .click();
      cy.url().should("include", urls.forgotPassword);
    });
  });

  it("Verify if user can login with valid credentials.", () => {
    cy.login(userEmail, validPassword);
    cy.get(".full > .fa").click();
    cy.get('div[role="menu"]').should("not.contain.text", "Settings");
  });

  it("Verify if admin can login with valid credentials.", () => {
    cy.login(validEmail, validPassword);
    cy.get(".full > .fa").click();
    cy.get('div[role="menu"]').should("contain.text", "Settings");
  });
});
