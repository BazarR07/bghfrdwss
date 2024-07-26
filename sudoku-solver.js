class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString || puzzleString.length !== 81)
      return {
        error: puzzleString
          ? "Expected puzzle to be 81 characters long"
          : "Required field missing",
      };
    if (/[^1-9.]/.test(puzzleString))
      return { error: "Invalid characters in puzzle" }; // Corrected error message
    return null;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    return !puzzleString.slice(row * 9, row * 9 + 9).includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = column; i < 81; i += 9) {
      if (puzzleString[i] === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(column / 3) * 3;
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++)
        if (puzzleString[(regionRow + r) * 9 + regionCol + c] === value)
          return false;
    return true;
  }

  solve(puzzleString) {
    const error = this.validate(puzzleString);
    if (error) return error;

    const solve = (board) => {
      const emptyIndex = board.indexOf(".");
      if (emptyIndex === -1) return board;

      const row = Math.floor(emptyIndex / 9);
      const col = emptyIndex % 9;

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (
          this.checkRowPlacement(board, row, col, value) &&
          this.checkColPlacement(board, row, col, value) &&
          this.checkRegionPlacement(board, row, col, value)
        ) {
          const newBoard =
            board.slice(0, emptyIndex) + value + board.slice(emptyIndex + 1);
          const result = solve(newBoard);
          if (result) return result;
        }
      }
      return null;
    };

    const solvedBoard = solve(puzzleString);
    return solvedBoard
      ? { solution: solvedBoard }
      : { error: "Puzzle cannot be solved" };
  }
}

module.exports = SudokuSolver;
