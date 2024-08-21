// Cypress.Commands.add("Sessionlogin", (username, password) => {
//   cy.session([username, password], () => {
//     cy.visit("/login");
//     cy.get('input[id="login"]').type(username);
//     cy.get('input[id="password"]').type(password);
//     cy.get('input[type="submit"]').click();
//     cy.url().should(
//       "include",
//       "/web#action=104&active_id=mailbox_inbox&cids=1&menu_id=83"
//     );
//     // cy.get('ul[class="o_menu_apps"]').click();

//     // cy.get('[href="#menu_id=107"]').contains("Todo").click();
//     // cy.get(".todo-nav-heading").contains("TODO APP");
//   });
// });
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
