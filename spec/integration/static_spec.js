const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

describe("route: static", () => {
  describe("GET /", () => {
    it("should return status code 200 and have 'This is a Reddit clone' in the body of the response", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body).toContain("This is a Reddit clone");
        done();
      })
    })
  })
});