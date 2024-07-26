"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  const solver = new SudokuSolver();

  // Validate and extract puzzle, coordinate, and value from request body
  const validateRequestBody = (req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }
    return { puzzle, coordinate, value };
  };

  // Validate coordinate
  const validateCoordinate = (coordinate) => {
    const row = coordinate[0].toUpperCase();
    const column = coordinate[1];
    if (
      !/[A-I]/.test(row) ||
      !/[1-9]/.test(column) ||
      coordinate.length !== 2
    ) {
      return false;
    }
    return { row, column };
  };

  // Validate value
  const validateValue = (value) => {
    return /^[1-9]$/.test(value);
  };

  // Validate puzzle
  const validatePuzzle = (puzzle) => {
    return !solver.validate(puzzle);
  };

  // Check placement
  const checkPlacement = (puzzle, rowIndex, colIndex, value) => {
    return (
      solver.checkRowPlacement(puzzle, rowIndex, colIndex, value) &&
      solver.checkColPlacement(puzzle, rowIndex, colIndex, value) &&
      solver.checkRegionPlacement(puzzle, rowIndex, colIndex, value)
    );
  };

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = validateRequestBody(req, res);
    if (!puzzle || !coordinate || !value) return;

    const coordinateValid = validateCoordinate(coordinate);
    if (!coordinateValid) return res.json({ error: "Invalid coordinate" });

    const valueValid = validateValue(value);
    if (!valueValid) return res.json({ error: "Invalid value" });

    const puzzleValid = validatePuzzle(puzzle);
    if (!puzzleValid) return res.json(solver.validate(puzzle));

    const rowIndex = coordinateValid.row.charCodeAt(0) - "A".charCodeAt(0);
    const colIndex = parseInt(coordinateValid.column, 10) - 1;

    if (puzzle[rowIndex * 9 + colIndex] === value) {
      return res.json({ valid: true });
    }

    const valid = checkPlacement(puzzle, rowIndex, colIndex, value);
    if (valid) {
      return res.json({ valid: true });
    } else {
      const conflicts = [];
      if (!solver.checkRowPlacement(puzzle, rowIndex, colIndex, value))
        conflicts.push("row");
      if (!solver.checkColPlacement(puzzle, rowIndex, colIndex, value))
        conflicts.push("column");
      if (!solver.checkRegionPlacement(puzzle, rowIndex, colIndex, value))
        conflicts.push("region");
      return res.json({ valid: false, conflict: conflicts });
    }
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    if (!puzzle) return res.json({ error: "Required field missing" });
    const result = solver.solve(puzzle);
    res.json(result);
  });
};
