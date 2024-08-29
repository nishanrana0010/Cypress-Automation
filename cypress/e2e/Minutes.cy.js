const { describe } = require("mocha");

describe("Minutes", () => {
  const serverID = "mirf4v6c";
  const serverDomain = "mirf4v6c.mailosaur.net";
  let credentials, urls;
  const validEmail = Cypress.env("validEmail");
  const validPassword = Cypress.env("validPassword");
  const mailosaurApiKey = Cypress.env("CYPRESS_MAILOSAUR_API_KEY");

  before(() => {
    cy.fixture("Minutes.json").then((data) => {
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
      credentials.ValidationMessage
    );
  });

  it("Verify that user can sucessfully create a Meeting", () => {
    cy.get('span[class="d-none d-sm-inline"]').contains("Create").click();
    cy.get('input[placeholder="Meeting Title"]').type(credentials.MeetingTitle);
    cy.get('div[name="member_ids"]').eq(0).click();
    cy.get('li[class="ui-menu-item"]').contains(credentials.Attendees1).click();

    cy.get('div[name="member_ids"]').eq(0).click();
    cy.get('li[class="ui-menu-item"]').contains(credentials.Attendees2).click();

    cy.get('input[name="prior_notification"]')
      .clear()
      .type(credentials.NotificationDays);
    cy.get('div[class="note-editable panel-body"]').type(
      credentials.MeetingDescription
    );
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('ol[class="breadcrumb"]').within(() => {
      cy.contains("a", "Meetings").click();
    });
    cy.get('tbody[class="ui-sortable"]').should(
      "contain.text",
      credentials.MeetingTitle
    );
  });

  it("Verify that user can delete a Meeting that doesnt have minutes", () => {
    cy.get('tbody[class="ui-sortable"]')
      .contains(credentials.MeetingTitle)
      .eq(0)
      .click();
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
      credentials.MeetingTitle
    );
  });
  it("Verify that user can edit a Meeting", () => {
    cy.get('span[class="d-none d-sm-inline"]').contains("Create").click();
    cy.get('input[placeholder="Meeting Title"]').type(credentials.MeetingTitle);
    cy.get('div[name="member_ids"]').eq(0).click();
    cy.get('li[class="ui-menu-item"]').contains(credentials.Attendees1).click();

    cy.get('div[name="member_ids"]').eq(0).click();
    cy.get('li[class="ui-menu-item"]').contains(credentials.Attendees2).click();

    cy.get('input[name="prior_notification"]')
      .clear()
      .type(credentials.NotificationDays);
    cy.get('div[class="note-editable panel-body"]').type(
      credentials.MeetingDescription
    );
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('ol[class="breadcrumb"]').within(() => {
      cy.contains("a", "Meetings").click();
    });
    cy.get('tbody[class="ui-sortable"]')
      .contains(credentials.MeetingTitle)
      .click();
    cy.get('button[type="button"]').contains("Edit").click();
    cy.get('input[placeholder="Meeting Title"]')
      .clear()
      .type(credentials.NewMeetingTitle);
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('ol[class="breadcrumb"]').within(() => {
      cy.contains("a", "Meetings").click();
    });
    cy.get('tbody[class="ui-sortable"]').should(
      "contain.text",
      credentials.NewMeetingTitle
    );
  });
  it("Verify that user cannot delete a Meeting that has Minutes in it", () => {
    cy.get('tbody[class="ui-sortable"]')
      .contains(credentials.NewMeetingTitle)
      .click();
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
    cy.get('button[type="button"]').contains(credentials.Filter).click();

    cy.get('div[role="menuitem"]').within(() => {
      cy.get("select.o_input.o_searchview_extended_prop_field").select(
        "Member"
      );
      cy.get('input[class="o_input"]').type(credentials.AdminName);
    });

    cy.get('button[type="button"]').contains("Apply").click();
    cy.get('tr[class="o_data_row"]').should(
      "contain.text",
      credentials.AdminName
    );
  });
  it("Verify the [Search] functionality", () => {
    cy.get('input[type="text"]').type(`${credentials.EOD} {enter}`);
    cy.get('td[title="End of the day"]').should(
      "contain.text",
      credentials.EOD
    );
  });
  it("Verify that Meetings details displays correct information", () => {
    cy.get('span[class="d-none d-sm-inline"]').contains("Create").click();
    cy.get('input[placeholder="Meeting Title"]').type(credentials.MeetingTitle);
    cy.get('div[name="member_ids"]').eq(0).click();
    cy.get('li[class="ui-menu-item"]').contains(credentials.Attendees1).click();

    cy.get('div[name="member_ids"]').eq(0).click();
    cy.get('li[class="ui-menu-item"]').contains(credentials.Attendees2).click();

    cy.get('input[name="prior_notification"]')
      .clear()
      .type(credentials.NotificationDays);
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
        cy.get('div[name="member_ids"]').should(
          "contain.text",
          credentials.Attendees1
        );
        cy.get('td[title="Mitchell Adminnn"]').should(
          "contain.text",
          credentials.AdminName
        );
      });
  });

  it("Verify that user cannot create a minute without entering mandatory fields", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .contains(credentials.MeetingTitle)
        .click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.wait(1000);
    cy.get('button[type="button"]').contains("Create").click();
    cy.get('input[placeholder="Minute Title"]').type(credentials.MeetingTitle);
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('div[class="o_notification_manager"]').should(
      "contain.text",
      credentials.ValidationMessage
    );
  });
  it("Verify that users can create a minute sucessfully", () => {
    cy.createMinutes(credentials);
    cy.get('li[class="breadcrumb-item"]')
      .contains("a", credentials.MeetingTitle)
      .click();
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.get('tbody[class="ui-sortable"]')
      .contains(credentials.MinuteTitle)
      .should("exist");
  });
  it("Verify that the Minutes details displays correct details", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .contains(credentials.MeetingTitle)
        .click();
    });
    cy.get('button[class="btn oe_stat_button"]').should("be.visible").click();
    cy.get("tr.o_data_row")
      .eq(0)
      .within(() => {
        cy.get('td[title="Mitchell Adminnn"]').should("exist");
      });
  });
  it("Verify that user can edit a Minute", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .contains(credentials.MeetingTitle)
        .click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.get('tr[class="o_data_row"]').contains(credentials.MinuteTitle).click();
    cy.get('button[type="button"]').contains("Edit").click();
    cy.get('input[placeholder="Minute Title"]')
      .clear()
      .type(credentials.EditedTitle);
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('li[class="breadcrumb-item"]')
      .contains("a", credentials.MeetingTitle)
      .click();
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.get('tr[class="o_data_row"]').should(
      "contain.text",
      credentials.EditedTitle
    );
  });

  it("Verify that user can delete a Minute", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .contains(credentials.MeetingTitle)
        .click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.get('tr[class="o_data_row"]').contains(credentials.EditedTitle).click();
    cy.get('div[class="btn-group o_dropdown"]').contains("Action").click();
    cy.get('div[role="menu"]').contains("a", "Delete").click();
    cy.get('div[class="modal-content"]').within(() => {
      cy.get('button[type="button"]').contains("Ok").click();
    });
    cy.get('tbody[class="ui-sortable"').should(
      "not.contain.text",
      credentials.EditedTitle
    );
  });
  it("Verify that contents the [Action items] of current minutes are shifted to the [Updates] of next minutes", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .contains(credentials.MeetingTitle)
        .click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.wait(1000);
    cy.get('button[type="button"]').contains("Create").click();
    cy.get('input[placeholder="Minute Title"]').type(credentials.MinuteTitle);
    cy.get('div[name="next_scribe"]').type("Ace User {enter}");
    cy.get('div[name="next_timekeeper"]').click();
    cy.get('ul[id="ui-id-5"]').within(() => {
      cy.get('li[class="ui-menu-item"]')
        .contains(credentials.AdminName)
        .click();
    });
    cy.get('input[name="next_meeting_date"]').type(credentials.NextDate);
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
      credentials.UpdatesContents
    );
  });
  it("Verify that the contents of current [Parking Lot] is transferred to the [Parking Lot] of next minute", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .contains(credentials.MeetingTitle)
        .click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.wait(1000);
    cy.get('button[type="button"]').contains("Create").click();
    cy.get('input[placeholder="Minute Title"]').type(credentials.MinuteTitle);

    cy.get('div[name="next_scribe"]').type("Ace User {enter}");
    cy.get('div[name="next_timekeeper"]').click();
    cy.get('ul[id="ui-id-5"]').within(() => {
      cy.get('li[class="ui-menu-item"]')
        .contains(credentials.AdminName)
        .click();
    });
    cy.get('input[name="next_meeting_date"]').type(credentials.NextDate);
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
      cy.get('tr[class="o_data_row"]')
        .contains(credentials.MeetingTitle)
        .click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.wait(1000);
    cy.get('button[type="button"]').contains("Create").click();
    cy.get('input[placeholder="Minute Title"]').type("New QA Minute");
    cy.get('div[name="next_scribe"]').type("Ace User {enter}");
    cy.get('div[name="next_timekeeper"]').click();
    cy.get('ul[id="ui-id-5"]').within(() => {
      cy.get('li[class="ui-menu-item"]').contains("Mitchell Adminnn").click();
    });
    cy.get('input[name="next_meeting_date"]').type(credentials.NextDate2);

    cy.get('button[type="button"]').contains("Save").click();
    cy.get('div[class="modal-content"]').should(
      "contain.text",
      credentials.DateValidation
    );
  });

  it("Verify that notification mail is sent to the attendees", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .contains(credentials.MeetingTitle)
        .click();
    });
    cy.get('button[class="btn oe_stat_button"]').click();
    cy.get('div[class="table-responsive"]').should("be.visible");
    cy.get('button[type="button"]').contains("Create").click();
    cy.get('input[placeholder="Minute Title"]').type(credentials.MinuteTitle);
    cy.get('div[name="next_scribe"]').type(`${credentials.Attendees1} {enter}`);
    cy.get('div[name="next_timekeeper"]').click();
    cy.get('ul[id="ui-id-5"]').within(() => {
      cy.get('li[class="ui-menu-item"]', { timeout: 10000 })
        .contains(credentials.AdminName)
        .click();
    });
    cy.get('input[name="next_meeting_date"]').type(credentials.NextDate);

    cy.get('li[class="nav-item"]').contains("Updates").click();
    cy.get('div[class="note-editable panel-body"]')
      .find("p")
      .eq(0)
      .type("- All Good {enter} - Improvement in lunch");

    cy.get('li[class="nav-item"]').contains("Action Items").click();
    cy.get('div[class="note-editable panel-body"]')
      .find("p")
      .should("be.visible")
      .eq(2)
      .type(" - Bug Resolution{enter} - Test Case Development {enter}");
    cy.get('button[type="button"]').contains("Send Email").click();

    cy.get('button[type="button"]').contains("Ok").click();
    cy.get('button[type="button"]', { timeout: 10000 })
      .contains("Save")
      .should("be.visible");
    cy.mailosaurGetMessage(
      serverID,
      {
        sentTo: `aceuser@${serverID}.mailosaur.net`,
      },
      {
        timeout: 60000,
      }
    ).then((email) => {
      expect(email.subject).to.include("Minutes: QA Meeting");
    });
  });
});
