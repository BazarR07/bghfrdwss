const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  const validPuzzleString =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const invalidCharPuzzleString =
    "2.6..1.97..54.23.8.3..9.....1..4....7.3.9821.4.9.1..8.56...3..2..49....817235.6x.";
  const shortPuzzleString =
    "2.6..1.97..54.23.8.3..9.....1..4....7.3.9821.4.9.1..8.56...3..2..49....817235.6";

  // Validation tests
  test("Validates a well-formed puzzle string of 81 characters", () => {
    assert.isNull(solver.validate(validPuzzleString));
  });

  test("Detects invalid characters in a puzzle string", () => {
    assert.isNotNull(solver.validate(invalidCharPuzzleString));
  });

  test("Checks for puzzle strings with incorrect length", () => {
    assert.isNotNull(solver.validate(shortPuzzleString));
  });

  // Row placement tests
  test("Verifies a valid row placement", () => {
    assert.isTrue(solver.checkRowPlacement(validPuzzleString, 0, 0, "7"));
  });

  test("Identifies an invalid row placement", () => {
    assert.isFalse(solver.checkRowPlacement(validPuzzleString, 0, 0, "5"));
  });

  // Column placement tests
  test("Confirms a valid column placement", () => {
    assert.isTrue(solver.checkColPlacement(validPuzzleString, 0, 0, "7"));
  });

  test("Recognizes an invalid column placement", () => {
    assert.isTrue(solver.checkColPlacement(validPuzzleString, 0, 0, "9"));
  });

  // Region placement tests
  test("Validates a valid region (3x3 grid) placement", () => {
    assert.isTrue(solver.checkRegionPlacement(validPuzzleString, 0, 0, "7"));
  });

  test("Detects an invalid region (3x3 grid) placement", () => {
    assert.isFalse(solver.checkRegionPlacement(validPuzzleString, 0, 0, "9"));
  });

  // Solver function tests
  test("Solves a valid puzzle string", () => {
    assert.isNotNull(solver.solve(validPuzzleString));
  });

  test("Handles invalid puzzle strings", () => {
    assert.isNotNull(solver.solve(invalidCharPuzzleString));
    assert.isNotNull(solver.solve(shortPuzzleString));
  });

  test("Completes an incomplete puzzle with the expected solution", () => {
    assert.isNotNull(solver.solve(validPuzzleString));
  });
});
