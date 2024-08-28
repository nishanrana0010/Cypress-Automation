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
  it("Verify the [Filter] functionality", () => {
    cy.get('div[class="btn-group o_dropdown"]').contains(" Filters ").click();
    cy.get('button[type="button"]').contains("Add Custom Filter").click();

    cy.get('div[role="menuitem"]').within(() => {
      cy.get("select.o_input.o_searchview_extended_prop_field").select(
        "Member"
      );
      cy.get('input[class="o_input"]').type("Mitchell Adminnn");
    });

    cy.get('button[type="button"]').contains("Apply").click();
    cy.get('tr[class="o_data_row"]').should("contain.text", "Mitchell Adminnn");
  });
  it("Verify the [Search] functionality", () => {
    cy.get('input[type="text"]').type("End of the day {enter}");
    cy.get('td[title="End of the day"]').should(
      "contain.text",
      "End of the day"
    );
  });
  it("Verify that Meetings details displays correct information", () => {
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
    cy.wait(5000);
    cy.get('ol[class="breadcrumb"]').within(() => {
      cy.contains("a", "Meetings").click();
    });
    cy.get('tr[class="o_data_row"]')
      .eq(0)
      .within(() => {
        cy.get('div[name="member_ids"]').should("contain.text", "Ace User");
        cy.get('td[title="Mitchell Adminnn"]').should(
          "contain.text",
          "Mitchell Adminnn"
        );
      });
  });

  it("Verify that user cannot create a minute without entering mandatory fields", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]').contains("QA Meeting").click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.wait(1000);
    cy.get('button[type="button"]').contains("Create").click();
    cy.get('input[placeholder="Minute Title"]').type("New QA Minute");
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('div[class="o_notification_manager"]').should(
      "contain.text",
      "The following fields are invalid:"
    );
  });
  it("Verify that users can create a minute sucessfully", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]').contains("QA Meeting").click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.wait(1000);
    cy.get('button[type="button"]').contains("Create").click();
    cy.get('input[placeholder="Minute Title"]').type("New QA Minute");
    // cy.get('input[type="text"]').click();
    cy.get('div[name="next_scribe"]').type("Ace User {enter}");
    cy.get('div[name="next_timekeeper"]').click();
    cy.get('ul[id="ui-id-5"]').within(() => {
      cy.get('li[class="ui-menu-item"]').contains("Mitchell Adminnn").click();
    });
    cy.get('input[name="next_meeting_date"]').type("09/04/2024");
    cy.get('li[class="nav-item"]').contains("Updates").click();
    cy.get('div[class="note-editable panel-body"]')
      .find("p")
      .eq(0)
      .type("- All Good {enter} - Improvement in lunch ");

    cy.get('li[class="nav-item"]').contains("Action Items").click();
    cy.get('div[class="note-editable panel-body"]')
      .find("p")
      .should("be.visible")
      .eq(2)
      .type(" -Bug Resolution{enter} - Test Case Development {enter}");

    cy.get('button[type="button"]').contains("Save").click();
    cy.get('li[class="breadcrumb-item"]').contains("a", "QA Meeting").click();
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.get('tbody[class="ui-sortable"]')
      .contains("New QA Minute")
      .should("exist");
  });
  it("Verify that the Minutes details displays correct details", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]').contains("QA Meeting").click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.get("tr.o_data_row").within(() => {
      cy.get('td[title="Mitchell Adminnn"]').should("exist");
    });
  });
  it("Verify that user can edit a Minute", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]').contains("QA Meeting").click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.get('tr[class="o_data_row"]').contains("New QA Minute").click();
    cy.get('button[type="button"]').contains("Edit").click();
    cy.get('input[placeholder="Minute Title"]')
      .clear()
      .type("Edited QA Minute");
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('li[class="breadcrumb-item"]').contains("a", "QA Meeting").click();
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.get('tr[class="o_data_row"]').should("contain.text", "Edited QA Minute");
  });

  it("Verify that user can delete a Minute", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]').contains("QA Meeting").click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.get('tr[class="o_data_row"]').contains("Edited QA Minute").click();
    cy.get('div[class="btn-group o_dropdown"]').contains("Action").click();
    cy.get('div[role="menu"]').contains("a", "Delete").click();
    cy.get('div[class="modal-content"]').within(() => {
      cy.get('button[type="button"]').contains("Ok").click();
    });
    cy.get('tbody[class="ui-sortable"').should(
      "not.contain.text",
      "Edited QA Minute"
    );
  });
  it("Verify that contents the [Action items] of current minutes are shifted to the [Updates] of next minutes", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]').contains("QA Meeting").click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.wait(1000);
    cy.get('button[type="button"]').contains("Create").click();
    cy.get('input[placeholder="Minute Title"]').type("New QA Minute");
    // cy.get('input[type="text"]').click();
    cy.get('div[name="next_scribe"]').type("Ace User {enter}");
    cy.get('div[name="next_timekeeper"]').click();
    cy.get('ul[id="ui-id-5"]').within(() => {
      cy.get('li[class="ui-menu-item"]').contains("Mitchell Adminnn").click();
    });
    cy.get('input[name="next_meeting_date"]').type("09/04/2024");
    cy.get('li[class="nav-item"]').contains("Updates").click();
    cy.get('div[class="note-editable panel-body"]')
      .find("p")
      .eq(0)
      .type("- All Good {enter} - Improvement in lunch ");

    cy.get('li[class="nav-item"]').contains("Action Items").click();
    cy.get('div[class="note-editable panel-body"]')
      .find("p")
      .should("be.visible")
      .eq(2)
      .type(" -Bug Resolution{enter} - Test Case Development {enter}");

    cy.get('button[type="button"]').contains("Save").click();
    cy.wait(1000);
    cy.get('div[class="o_form_statusbar"]').within(() => {
      cy.get('button[type="button"]').contains("New Minute").click();
    });

    cy.get('li[class="nav-item"]').contains("a", "Updates").click();
    cy.get('div[class="tab-content"]').should(
      "contain.text",
      "-Bug Resolution"
    );
  });
  it("Verify that the contents of current [Parking Lot] is transferred to the [Parking Lot] of next minute", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]').contains("QA Meeting").click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.wait(1000);
    cy.get('button[type="button"]').contains("Create").click();
    cy.get('input[placeholder="Minute Title"]').type("New QA Minute");
    // cy.get('input[type="text"]').click();
    cy.get('div[name="next_scribe"]').type("Ace User {enter}");
    cy.get('div[name="next_timekeeper"]').click();
    cy.get('ul[id="ui-id-5"]').within(() => {
      cy.get('li[class="ui-menu-item"]').contains("Mitchell Adminnn").click();
    });
    cy.get('input[name="next_meeting_date"]').type("09/04/2024");
    cy.get('li[class="nav-item"]').contains("Updates").click();
    cy.get('div[class="note-editable panel-body"]')
      .find("p")
      .eq(0)
      .type("- All Good {enter} - Improvement in lunch ");

    cy.get('li[class="nav-item"]').contains("Action Items").click();
    cy.get('div[class="note-editable panel-body"]')
      .find("p")
      .should("be.visible")
      .eq(2)
      .type(" -Bug Resolution{enter} - Test Case Development {enter}");

    cy.get('li[class="nav-item"]').contains("Parking Lot").click();
    cy.get('div[name="parking_lot"]').within(() => {
      cy.get('div[class="note-editing-area"]').within(() => {
        cy.get("p").type("- Hardware{enter} - Software{enter}");
      });
    });

    cy.get('button[type="button"]').contains("Save").click();
    cy.wait(1000);
    cy.get('div[class="o_form_statusbar"]').within(() => {
      cy.get('button[type="button"]').contains("New Minute").click();
    });

    cy.get('li[class="nav-item"]').contains("a", "Parking Lot").click();
    cy.get('div[class="tab-content"]').should("contain.text", "- Hardware");
  });

  it("Verify that current minute and next minute dates cannot be same", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]').contains("QA Meeting").click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.wait(1000);
    cy.get('button[type="button"]').contains("Create").click();
    cy.get('input[placeholder="Minute Title"]').type("New QA Minute");
    // cy.get('input[type="text"]').click();
    cy.get('div[name="next_scribe"]').type("Ace User {enter}");
    cy.get('div[name="next_timekeeper"]').click();
    cy.get('ul[id="ui-id-5"]').within(() => {
      cy.get('li[class="ui-menu-item"]').contains("Mitchell Adminnn").click();
    });
    cy.get('input[name="next_meeting_date"]').type("08/28/2024");

    cy.get('button[type="button"]').contains("Save").click();
    cy.get('div[class="modal-content"]').should(
      "contain.text",
      "Entered next meeting date is invalid. Please choose a date after the following day."
    );
  });
});
