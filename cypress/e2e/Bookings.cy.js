describe("My Test Suite", () => {
  const validEmail = Cypress.env("validEmail");
  const validPassword = Cypress.env("validPassword");

  beforeEach(() => {
    cy.loginThroughApi(validEmail, validPassword);

    cy.visit("#action=104&active_id=mailbox_inbox&cids=1&menu_id=83");
    cy.get(".full > .fa").click();
    cy.get('div[class="dropdown-menu pb-25 pt-50 show"]')
      .find("a")
      .contains("Bookings")
      .click();
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
      "The following fields are invalid:"
    );
  });

  //   it.only("Verify that user can book an available room sucessfully", () => {
  //     cy.get('tbody[class="ui-sortable"]').within(() => {
  //       cy.get('tr[class="o_data_row"]').eq(0).within(()=>{
  // cy.get('td[class="o_data_cell o_field_cell o_readonly_modifier status"]')

  // });
  //     });
  //   });

  it("Verify that a validation message is displayed while booking a room that is already booked", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .eq(1)
        .within(() => {
          cy.get('button[type="button"]').eq(1).click();
        });
    });
    cy.get('div[class="oe_title').type("New QA meet 2");
    cy.get(
      'div[class="o_datepicker o_field_date o_field_widget o_required_modifier"]'
    )
      .clear()
      .type("08/22/2024 14:36:35");

    cy.get('span[class="fa fa-check primary"]').click();
    cy.get(
      'input[class="o_field_float o_field_number o_field_widget o_input o_required_modifier"]'
    )
      .clear()
      .type("00:30");
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('div[class="modal-content"]').should(
      "contain.text",
      "G Big Meeting Room is already booked."
    );
  });

  it("verfiy if [booked] status is displayed at [Current Status] when a room is booked at that time stamp", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .eq(1)
        .within(() => {
          cy.get('button[type="button"]').eq(1).click();
        });
    });
    cy.get('div[class="oe_title"]').type("New QA meet 3");
    cy.get(
      'div[class="o_datepicker o_field_date o_field_widget o_required_modifier"]'
    )
      .clear()
      .type("08/22/2024 16:29:35");

    cy.get('span[class="fa fa-check primary"]').click();
    cy.get(
      'input[class="o_field_float o_field_number o_field_widget o_input o_required_modifier"]'
    )
      .clear()
      .type("00:30");
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('[accesskey="b"] > a').click();
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('td[class="o_data_cell o_field_cell o_readonly_modifier status"]')
        .eq(1)
        .should("contain.text", "Booked");
    });
  });

  it.only("Verify that user can book an available room successfully on filling mandatory fields", () => {
let cellText;
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('tr[class="o_data_row"]')
        .eq(1)
        .within(() => {
          cy.get(
            'td[class="o_data_cell o_field_cell o_readonly_modifier status"]'
          )
            .should("exist")
            .then(($cell) => {
              const cellText = $cell.text().trim(); // Get and trim the text
              if (cellText === "Available") {
                cy.get('button[type="button"]').contains("Book Room").click();
}
            })
        })
    })
  })    


  //               cy.get('div[class="oe_title"]')
  //                 .should("be.visible")
  //                 .type("New QA meet 3");
  //               cy.get(
  //                 'div[class="o_datepicker o_field_date o_field_widget o_required_modifier"]'
  //               )
  //                 .clear()
  //                 .type("08/22/2024 16:29:35");

  //               cy.get('span[class="fa fa-check primary"]').click();
  //               cy.get(
  //                 'input[class="o_field_float o_field_number o_field_widget o_input o_required_modifier"]'
  //               )
  //                 .clear()
  //                 .type("00:30");
  //               cy.get('button[type="button"]').contains("Save").click();
  //             } else {
  //               // cy.log("The room is ");
  //             }
  //           });
  //       });
  //   });
  // });
});
