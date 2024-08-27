describe("Bookings", () => {
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
    cy.session("UserLogin", () => {
      cy.UserLogin(validEmail, validPassword);
    });

    cy.visit(urls.BookingsUrl);
    cy.get('ul[class="o_menu_apps"]').click();
    cy.get('div[role="menu"]').find("a").contains("Bookings").click();
  });

  it("Verify that [bookings] is clickable in the menu list", () => {
    cy.get('a[class="o_menu_brand"]').should("include.text", "Bookings");
  });

  it("Verify that the user can view the schedules of a meeting room.", () => {
    //first
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .first()
        .within(() => {
          cy.get('button[type="button"]').eq(0).click();
        });
    });
    cy.get('div[class="o_cp_right"]').within(() => {
      cy.get('button[data-original-title="View list"]').click();
    });
    cy.get('div[class="o_control_panel"]').within(() => {
      cy.contains("a", "Rooms").click();
    });
    //2nd
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .eq(1)
        .within(() => {
          cy.get('button[type="button"]').eq(0).click();
        });
    });
    cy.get('div[class="o_cp_right"]').within(() => {
      cy.get('button[data-original-title="View list"]').click();
    });
    cy.get('div[class="o_control_panel"]').within(() => {
      cy.contains("a", "Rooms").click();
    });
  });

  it("Verify that user cannot book room without filling mandatory fields", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .first()
        .within(() => {
          cy.get('button[type="button"]').eq(1).click();
        });
    });
    cy.get('div[class="oe_title"]').type("New QA Meet");
    cy.get('button[class="btn btn-primary o_form_button_save"]').click();
    cy.get('div[class="o_notification_manager"]').should(
      "contain.text",
      credentials.validationMessage
    );
  });

  it("Verify that a validation message is displayed while booking a room that is already booked", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .eq(1)
        .within(() => {
          cy.get('button[type="button"]').eq(1).click();
        });
    });
    cy.get('div[class="oe_title"]').type(credentials.BookingTitle);
    cy.get('div[name="start"]').clear().type(credentials.Date);

    cy.get('span[class="fa fa-check primary"]').click();
    cy.get('input[name="duration"]').clear().type(credentials.Duration);
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('div[class="modal-content"]').should(
      "contain.text",
      credentials.BookedValidation
    );
  });

  it("Verify that the [Current Status] and [Current schedules] dispalys correct informations", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .eq(1)
        .within(() => {
          cy.get('button[type="button"]').eq(1).click();
        });
    });
    cy.get('div[class="oe_title"]').type(credentials.BookingTitle2);
    cy.get('div[name="start"]').clear().type(credentials.Date2);

    cy.get('span[class="fa fa-check primary"]').click();
    cy.get('input[name="duration"]').clear().type(credentials.Duration);
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('[accesskey="b"] > a').click();
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('td[title="Available"]')
        .eq(1)
        .should("contain.text", credentials.CurrentStatus);
      cy.get('td[title="No Schedule"]').should(
        "contain.text",
        credentials.CurrentSchedule
      );
    });
  });

  it("Verify that users can book available rooms sucessfully on filling the mandatory fields", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .eq(0)
        .within(() => {
          cy.get('button[type="button"]').eq(0).click();
        });
    });
    cy.get('div[class="btn-group"]').within(() => {
      cy.get('button[type="button"]').eq(0).click();
    });
    cy.get('tr[data-time="11:00:00"]').click();
    cy.get('div[class="modal-content"]').within(() => {
      cy.get('div[class="oe_title"]').type(credentials.BookingTitle);
      cy.get('div[name="start"]').clear().type(credentials.Date);

      cy.get('span[class="o_datepicker_button"]').click({ force: true });
      cy.get('input[name="duration"]').clear().type(credentials.Duration);
      cy.get('button[type="button"]').contains("Save").click();
    });
    cy.get('div[class="btn-group"]').within(() => {
      cy.get('button[type="button"]').eq(0).click();
    });
    cy.get('div[class="fc-content"]').should(
      "contain.text",
      credentials.BookingTitle
    );
  });

  it("Verify that users can edit bookings", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .eq(0)
        .within(() => {
          cy.get('button[type="button"]').eq(0).click();
        });
    });
    cy.get('div[class="btn-group"]').within(() => {
      cy.get('button[type="button"]').eq(0).click();
    });
    cy.get('tr[data-time="11:00:00"]').click();
    cy.get('div[class="modal-content"]').within(() => {
      cy.get('div[class="oe_title"]').type(credentials.BookingTitle10);
      cy.get('div[name="start"]').clear().type(credentials.Date);

      cy.get('span[class="o_datepicker_button"]').click({ force: true });
      cy.get('input[name="duration"]').clear().type(credentials.Duration);
      cy.get('button[type="button"]').contains("Save").click();
    });
    cy.get('nav[class="o_main_navbar"]').within(() => {
      cy.get('a[class="o_menu_brand"]').contains("Bookings").click();
    });
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .eq(0)
        .within(() => {
          cy.get('button[type="button"]').eq(0).click();
        });
    });
    cy.get('div[class="btn-group"]').within(() => {
      cy.get('button[type="button"]').eq(0).click();
    });

    cy.get('tbody[class="fc-body"]').within(() => {
      cy.get('div[class="fc-scroller fc-time-grid-container"]')
        .contains(credentials.BookingTitle10)
        .eq(0)
        .click();
    });
    cy.get('div[class="o_cw_body"]').within(() => {
      cy.get('div[class="card-footer border-top"]').within(() => {
        cy.get('a[class="btn btn-primary o_cw_popover_edit"]')
          .contains("Edit")
          .click();
      });
    });
    cy.get('div[class="modal-content"]').within(() => {
      cy.get('div[class="oe_title"]').within(() => {
        cy.get('input[type="text"]').clear().type(credentials.BookingTitle10);
      });
      cy.get('button[type="button"]').contains("Save").click();
    });
    cy.get('tbody[class="fc-body"]')
      .contains(credentials.BookingTitle10)
      .should("exist");
  });

  it("verify that users can search for a specified Booking", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .eq(0)
        .within(() => {
          cy.get('button[type="button"]').eq(0).click();
        });
    });

    cy.get('div[class="o_searchview_input_container"]')
      .type("{backspace}")
      .type("New Qa Meet{enter}");
    // .within(() => {
    cy.get('input[class="o_searchview_input"]');
    // .click()
    // });
  });

  it("Verify that users can delete bookings", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .eq(0)
        .within(() => {
          cy.get('button[type="button"]').eq(0).click();
        });
    });
    cy.get('div[class="btn-group"]').within(() => {
      cy.get('button[type="button"]').eq(0).click();
    });
    cy.get('tbody[class="fc-body"]')
      .contains(credentials.BookingTitle10)
      .click();
    cy.get('div[class="o_cw_body"]').within(() => {
      cy.get('div[class="card-footer border-top"]').within(() => {
        cy.get('a[class="btn btn-secondary o_cw_popover_delete ml-2"]')
          .contains("Delete")
          .click();
      });
    });
    cy.get('div[class="modal-content"]').within(() => {
      cy.get('button[type="button"]').contains("Ok").click();
    });

    cy.get('tbody[class="fc-body"]')
      .contains(credentials.BookingTitle10)
      .should("not.exist");
  });

  it("Verify that the [Group By] filter is functional", () => {
    cy.get('div[class="o_cp_right"]').within(() => {
      cy.get('div[class="btn-group o_dropdown"]')
        .contains(" Group By ")
        .click();
    });
    cy.get('button[type="button"]').contains("Add Custom Group").click();
    cy.get('button[type="button"]').contains("Apply").click();
    cy.get('div[class="o_content"]').click();
    cy.get('tr[class="o_group_header o_group_has_content"]').should(
      "be.visible"
    );
  });
  it("Verify that Admin cannot create Meetings Room without filling the mandatory fields", () => {
    cy.createRoom("", "");
    cy.get('div[class="o_notification_manager"]').should(
      "contain.text",
      credentials.validationMessage
    );
  });
  it("Verify that Admin can create a Meetings Room sucessfully", () => {
    cy.createRoom("New Qa Room", "20");
    cy.get('nav[class="o_main_navbar"]').within(() => {
      cy.get('a[class="o_menu_brand"]').click();
    });
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('td[tabindex="-1"]').should("contain.text", "New Qa Room");
    });
  });

  it("Verify that user can delete a meeting room", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('div[class="custom-control custom-checkbox"]').eq(0).click();
    });
    cy.get('div[class="btn-group o_dropdown"]')
      .contains("Action")
      .should("exist")
      .click();
    cy.get('div[class="dropdown-menu o_dropdown_menu show"]').within(() => {
      cy.get('a[class="dropdown-item undefined"]').contains("Delete").click();
    });
    cy.get('div[class="modal-content"]').within(() => {
      cy.get('button[type="button"]').contains("Ok").click();
    });
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('td[title="QA Meeting Room"]').should("not.exist");
    });
  });

  it("Verify that user cannot delete a meeting room that is currently on progress", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .contains("New meeting room")

        .click();
    });
    cy.get('div[class="btn-group o_dropdown"]')
      .contains("Action")
      .should("exist")
      .should("be.visible")
      .click();
    cy.get('div[class="dropdown-menu o_dropdown_menu show"]').within(() => {
      cy.get('a[class="dropdown-item undefined"]').contains("Delete").click();
    });
    cy.get('div[class="modal-content"]').within(() => {
      cy.get('button[type="button"]').contains("Ok").click();
    });
    cy.get('div[class="modal-content"]').within(() => {
      cy.get('div[class="o_dialog_warning modal-body"]').should(
        "contain.text",
        credentials.RoomDeletionValidation
      );
    });
  });
  it("Verify that [Bookings] page displays all the meeting rooms", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.contains(credentials.MeetingRoom1).should("exist");
      cy.contains(credentials.MeetingRoom2).should("exist");
    });
  });

  it("Verify that [Bookings] page displays all the meeting rooms", () => {
    const mockResponse = {
      meetingRooms: [{ name: "New Qa Room" }, { seats: "10" }],
    };

    cy.intercept(
      "GET",
      "#action=233&model=b_room_booking.room&view_type=list&cids=1&menu_id=122",
      mockResponse
    ).as("getMeetingRooms");

    cy.wait("@getMeetingRooms");

    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.contains("New Qa Room").should("exist");
      cy.contains("seats").should("exist");
    });
  });

  it("should export data and download the file", () => {
    const expectedRooms = [
      {
        Name: "G Big Meeting Room",
        Seats: 10,
        Status: "Available",
        Schedule: "No Schedule",
      },
      {
        Name: "G Small Meeting Room",
        Seats: 8,
        Status: "Available",
        Schedule: "No Schedule",
      },
      {
        Name: "F2 Big Meeting Room",
        Seats: 14,
        Status: "Available",
        Schedule: "No Schedule",
      },
      {
        Name: "F1 Big Meeting Room",
        Seats: 12,
        Status: "Available",
        Schedule: "No Schedule",
      },
    ];

    cy.get('button[title="Export All"]').click();

    cy.readFile("cypress/downloads/b_room_booking.room.xlsx", "binary").then(
      (fileContent) => {
        const XLSX = require("xlsx");
        const workbook = XLSX.read(fileContent, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        expectedRooms.forEach((room, index) => {
          const row = index + 2;
          const nameCell = `B${row}`;
          const seatsCell = `C${row}`;
          const statusCell = `D${row}`;
          const scheduleCell = `E${row}`;

          expect(sheet[nameCell].v).to.equal(room.Name);
          expect(sheet[seatsCell].v).to.equal(room.Seats);
          expect(sheet[statusCell].v).to.equal(room.Status);
          expect(sheet[scheduleCell].v).to.equal(room.Schedule);
        });
      }
    );
  });
});
