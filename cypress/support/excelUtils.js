// cypress/support/excelUtils.js
import * as XLSX from "xlsx";
import { expect } from "chai";

export const assertExcelFile = (filePath, sheetName, expectedValues) => {
  cy.readFile(filePath, "binary").then((fileContent) => {
    const workbook = XLSX.read(fileContent, { type: "binary" });
    const worksheet = workbook.Sheets[sheetName];
    const actualData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    expectedValues.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        expect(actualData[rowIndex][colIndex]).to.equal(cellValue);
      });
    });
  });
};
