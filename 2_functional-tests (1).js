const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

describe("Functional Tests", () => {
  const validPuzzleString =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

  describe("Solve a puzzle", () => {
    it("with valid puzzle string: POST request to /api/solve", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: validPuzzleString })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "solution");
          done();
        });
    });

    it("with missing puzzle string: POST request to /api/solve", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    it("with invalid characters: POST request to /api/solve", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "..9.d5.1.85.4....2432.f....1...69.83.9.....6.62.71...9......1d45....4.37.4.3..6..",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    it("with incorrect length: POST request to /api/solve", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long",
          );
          done();
        });
    });

    it("that cannot be solved: POST request to /api/solve", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "1.1..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37. ",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
  });

  describe("Check a puzzle placement", () => {
    it("with all fields: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzleString, coordinate: "A2", value: "1" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.isFalse(res.body.valid);
          done();
        });
    });

    it("with single placement conflict: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzleString, coordinate: "A2", value: "9" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
          done();
        });
    });

    it("with multiple placement conflicts: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzleString, coordinate: "A1", value: "9" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ["row", "region"]);
          done();
        });
    });

    it("with all placement conflicts: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzleString, coordinate: "A1", value: "1" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ["row", "column"]);
          done();
        });
    });

    it("with missing required fields: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    it("with invalid characters: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3x.",
          coordinate: "A2",
          value: "1",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    it("with incorrect length: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3",
          coordinate: "A2",
          value: "1",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long",
          );
          done();
        });
    });

    it("with invalid placement coordinate: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzleString, coordinate: "J1", value: "1" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    it("with invalid placement value: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzleString, coordinate: "A1", value: "0" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
