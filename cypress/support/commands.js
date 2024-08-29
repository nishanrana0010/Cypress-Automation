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

Cypress.Commands.add(
  "createMeeting",
  (meetingTitle, member1, member2, priorNotification, meetingDescription) => {
    cy.get('span[class="d-none d-sm-inline"]').contains("Create").click();

    cy.get('input[placeholder="Meeting Title"]').type(meetingTitle);

    cy.get('div[name="member_ids"]').eq(0).click();
    cy.get('li[class="ui-menu-item"]').contains(member1).click();

    cy.get('div[name="member_ids"]').eq(0).click();
    cy.get('li[class="ui-menu-item"]').contains(member2).click();

    cy.get('input[name="prior_notification"]').clear().type(priorNotification);

    cy.get('div[class="note-editable panel-body"]').type(meetingDescription);

    cy.get('button[type="button"]').contains("Save").click();

    cy.get('ol[class="breadcrumb"]').within(() => {
      cy.contains("a", "Meetings").click();
    });
  }
);

Cypress.Commands.add("createMinutes", (credentials) => {
  cy.get('tbody[class="ui-sortable"]').within(() => {
    cy.get('tr[class="o_data_row"]').contains(credentials.MeetingTitle).click();
  });

  cy.get('button[class="btn oe_stat_button"]').click();
  cy.wait(1000);

  cy.get('button[type="button"]').contains("Create").click();
  cy.get('input[placeholder="Minute Title"]').type(credentials.MinuteTitle);
  cy.get('div[name="next_scribe"]').type(`${credentials.Attendees1} {enter}`);
  cy.get('div[name="next_timekeeper"]').click();
  cy.get('ul[id="ui-id-5"]').within(() => {
    cy.get('li[class="ui-menu-item"]').contains(credentials.AdminName).click();
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
  cy.get('button[type="button"]').contains("Save").click();
});

// CYPRESS_MAILOSAUR_API_KEY=PfeK9vNV00JcFuXWTP2RabJg76ga2MOt npx cypress open
