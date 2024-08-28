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

export function getRandomNumber(min, max) {
  if (min > max) {
    throw new Error("Minimum value should not be greater than maximum value.");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
import { getRandomNumber } from "../support/utils";

describe("Random Number Utility Test", () => {
  it("should generate a random number between 0 and 3", () => {
    const randomNumber = getRandomNumber(0, 3);
    cy.log(`Generated Random Number: ${randomNumber}`);

    // Example assertion (just for demonstration)
    expect(randomNumber).to.be.gte(0);
    expect(randomNumber).to.be.lte(3);
  });
});
