describe("Bookings", () => {
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

  it("Verify that the [Current Status] and [Current schedules] dispalys correct informations", () => {
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
      cy.get(
        'td[class="o_data_cell o_field_cell o_list_char o_readonly_modifier"]'
      ).should("contain.text", "New Qa Meeting - Mitchell Adminnn");
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
      cy.get('div[class="oe_title"]').type("New Qa Meet");
      cy.get(
        'div[class="o_datepicker o_field_date o_field_widget o_required_modifier"]'
      )
        .clear()
        .type("08/23/2024 11:29:35");

      cy.get('span[class="o_datepicker_button"]').click({ force: true });
      cy.get(
        'input[class="o_field_float o_field_number o_field_widget o_input o_required_modifier"]'
      )
        .clear()
        .type("00:30");
      cy.get('button[type="button"]').contains("Save").click();
    });
    cy.get('div[class="btn-group"]').within(() => {
      cy.get('button[type="button"]').eq(0).click();
    });
    cy.get('div[class="fc-content"]').should("contain.text", "New Qa Meet");
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
      cy.get('div[class="oe_title"]').type("New Qa Meet 10");
      cy.get(
        'div[class="o_datepicker o_field_date o_field_widget o_required_modifier"]'
      )
        .clear()
        .type("08/23/2024 16:29:35");

      cy.get('span[class="o_datepicker_button"]').click({ force: true });
      cy.get(
        'input[class="o_field_float o_field_number o_field_widget o_input o_required_modifier"]'
      )
        .clear()
        .type("00:30");
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
        .contains("New Qa Meet 10")
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
        cy.get('input[type="text"]').clear().type("New Qa Meet 10");
      });
      cy.get('button[type="button"]').contains("Save").click();
    });
    cy.get('tbody[class="fc-body"]').contains("New Qa Meet 10").should("exist");
  });

  // it.only("verify that users can search for a specified Booking", () => {
  //   cy.get('tbody[class="ui-sortable"]').within(() => {
  //     cy.get('tr[class="o_data_row"]')
  //       .eq(0)
  //       .within(() => {
  //         cy.get('button[type="button"]').eq(0).click();
  //       });
  //   });

  //   cy.get('div[class="o_searchview_input_container"]')
  //     .type("{backspace}")
  //     .type("New Qa Meet{enter}");
  //   // .within(() => {
  //   cy.get('input[class="o_searchview_input"]');
  //   // .click()
  //   // });
  // });

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
    cy.get('tbody[class="fc-body"]').contains("New Qa Meet 10").click();
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
      .contains("New Qa Meet 10")
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
    cy.get('button[type="button"]').contains("Create").click();
    cy.get('button[type="button"]').contains("Save").click();
    cy.get('div[class="o_notification_manager"]').should(
      "contain.text",
      "The following fields are invalid:"
    );
  });
  it("Verify that Admin can create a Meetings Room sucessfully", () => {
    cy.get('button[type="button"]').contains("Create").click();
    cy.get('div[class="oe_title"]').type("QA Meeting Room");
    cy.get(
      'input[class="o_field_integer o_field_number o_field_widget o_input"]'
    ).type("10");

    cy.get('button[type="button"]').contains("Save").click();
    cy.get('nav[class="o_main_navbar"]').within(() => {
      cy.get('a[class="o_menu_brand"]').click();
    });
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.get('td[title="QA Meeting Room"]').should("exist");
    });
  });

  it("Verify that user cannot delete a meeting room", () => {
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

  it.skip("Verify that user cannot delete a meeting room that is currently on progress", () => {
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
        "The operation cannot be completed: another model requires the record being deleted. If possible, archive it instead."
      );
    });
  });
  it.only("Verify that [Bookings] page displays all the meeting rooms", () => {
    cy.get('tbody[class="ui-sortable"]').within(() => {
      cy.contains("New meeting room").should("exist");
      cy.contains("G Big Meeting Room").should("exist");
    });
  });
});
