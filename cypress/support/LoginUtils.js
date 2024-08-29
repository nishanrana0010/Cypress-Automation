export const login = (username, password) => {
  cy.visit("/login");

  if (username) {
    cy.get('input[id="login"]').type(username);
  }

  if (password) {
    cy.get('input[id="password"]').type(password);
  }

  cy.get('button[type="submit"]').click();
};
