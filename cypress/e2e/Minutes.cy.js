const { describe } = require("mocha");

describe("Minutes", () => {
  let credentials, urls;
  const validEmail = Cypress.env("validEmail");
  const validPassword = Cypress.env("validPassword");

  before(() => {
    cy.fixture("datas.json").then((data) => {
      credentials = data;
    });
    cy.fixture("urls.json").then((data) => {
      urls = data;
    });
  });
  beforeEach(() => {
    cy.session("AdminLogin", () => {
      cy.AdminLogin(validEmail, validPassword);
    });

    cy.visit(urls.MinutesUrl);
    cy.get('ul[class="o_menu_apps"]').click();
    cy.get('div[role="menu"]').find("a").contains("Minutes").click();
  });

  it("Verify that user cannot create a [Meeting] without entering the mandatory fields ", () => {
    cy.get('span[class="d-none d-sm-inline"]').contains("Create").click();
    cy.get('span[class="d-none d-sm-inline"]').contains("Save").click();
    cy.get('div[class="o_notification_manager"]').should(
      "contain.text",
      "The following fields are invalid:"
    );
  });

  it("Verify that user can sucessfully create a Meeting", () => {
    cy.get('span[class="d-none d-sm-inline"]').contains("Create").click();
    cy.get('input[placeholder="Meeting Title"]').type("QA Meeting");
    cy.get('div[name="member_ids"]').eq(0).click();
    cy.get('li[class="ui-menu-item"]').contains("Ace User").click();

    cy.get('div[name="member_ids"]').eq(0).click();
    cy.get('li[class="ui-menu-item"]').contains("Aceuser").click();
    // .eq(0).type("ace User {enter}");
    cy.get('input[name="prior_notification"]').clear().type("2");
    cy.get('div[class="note-editable panel-body"]').type(
      "This meeting will cover {enter} - Discuss testing strategies and plans{enter} - Review current testing progress"
    );
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('ol[class="breadcrumb"]').within(() => {
      cy.contains("a", "Meetings").click();
    });
    cy.get('tbody[class="ui-sortable"]').should("contain.text", "QA Meeting");
  });

  it("Verify that user can delete a Meeting that doesnt have minutes", () => {
    cy.get('tbody[class="ui-sortable"]').contains("QA Meeting").eq(0).click();
    cy.get('div[class="btn-group"]').contains("Action").click();
    cy.get('div[role="menu"]').contains("Delete").click();
    cy.get('div[class="modal-content"]').within(() => {
      cy.get('button[type="button"]').contains("Ok").click();
    });
    cy.get('ol[class="breadcrumb"]').within(() => {
      cy.contains("a", "Meetings").click();
    });
    cy.get('tbody[class="ui-sortable"]').should(
      "not.contain.text",
      "QA Meeting"
    );
  });
  it("Verify that user can edit a Meeting", () => {
    cy.get('span[class="d-none d-sm-inline"]').contains("Create").click();
    cy.get('input[placeholder="Meeting Title"]').type("QA Meeting");
    cy.get('div[name="member_ids"]').eq(0).click();
    cy.get('li[class="ui-menu-item"]').contains("Ace User").click();

    cy.get('div[name="member_ids"]').eq(0).click();
    cy.get('li[class="ui-menu-item"]').contains("Aceuser").click();

    cy.get('input[name="prior_notification"]').clear().type("2");
    cy.get('div[class="note-editable panel-body"]').type(
      "This meeting will cover {enter} - Discuss testing strategies and plans{enter} - Review current testing progress"
    );
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('ol[class="breadcrumb"]').within(() => {
      cy.contains("a", "Meetings").click();
    });
    cy.get('tbody[class="ui-sortable"]').contains("QA Meeting").click();
    cy.get('button[type="button"]').contains("Edit").click();
    cy.get('input[placeholder="Meeting Title"]').clear().type("New QA Meeting");
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('ol[class="breadcrumb"]').within(() => {
      cy.contains("a", "Meetings").click();
    });
    cy.get('tbody[class="ui-sortable"]').should(
      "contain.text",
      "New QA Meeting"
    );
  });
  it("Verify that user cannot delete a Meeting that has Minutes in it", () => {
    cy.get('tbody[class="ui-sortable"]').contains("New QA Meeting").click();
    cy.get('div[name="minutes_count"]').click();
    // cy.get('button[type="button"]').contains("Create").click();
    // cy.get('input[placeholder="Minute Title"]').type("Meeting Minutes");
    // cy.get('div[class="o_input_dropdown"]').eq(0).click();
    // cy.get('li[class="ui-menu-item"]').contains("Ace User").click();
    // cy.get('div[class="o_input_dropdown"]').eq(1).click();
    // cy.get('li[class="ui-menu-item"]').contains("ace user2").click();
    // cy.get('input[name="next_meeting_date"]').type("08/28/2024");
    // cy.get('li[class="nav-item"]').contains("Update").click();
    // cy.get('div[class="note-editable panel-body"]').type(
    //   "- Food Improvement {enter} - Mentor Selection"
    // );
    // cy.get('li[class="nav-item"]').contains("Action Items").click();
    // cy.get('div[class="note-editable panel-body"]').type(
    //   "- Khana bhayena {enter} - Mentor Ramro xa"
    // );
    // cy.get('button[type="button"]').contains("Save").click();
  });
  //   it.only("Verify the Graph View functionality ", () => {
  //     cy.get('button[data-view-type="graph"]').click();
  //   });
  it.only("Verify the [Filter] functionality", () => {
    cy.get('div[role="search"]').eq(1).click();
    cy.get('button[type="button"]').contains("Add Custom Filter").click();
    cy.get('select[class="o_input o_searchview_extended_prop_field"]').click();
    cy.get('option[value="member_ids"]').click();
  });
});
