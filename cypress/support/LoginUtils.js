Cypress.Commands.add("Sessionlogin", (username, password) => {
  cy.session([username, password], () => {
    cy.visit("/login");
    cy.get('input[type="text"]').type(username);
    cy.get('input[type="password"]').type(password);
    cy.get('input[type="submit"]').click();
    cy.url().should(
      "include",
      "web#action=97&active_id=mailbox_inbox&cids=1&menu_id=79"
    );
    cy.get('ul[class="o_menu_apps"]').click();

    cy.get('[href="#menu_id=107"]').contains("Todo").click();
    cy.get(".todo-nav-heading").contains("TODO APP");
  });
});
