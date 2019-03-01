const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/"
const Advertisement = require("../../src/db/models").Advertisement;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes: advertisements", () => {
  beforeEach(done => {
    this.advertisement;

    sequelize.sync({force: true}).then( res => {
      Advertisement.create({
        title: "Testing Ad",
        description: "You should get distracted!"
      })
      .then((advertisement) => {
        this.advertisement = advertisement;
        done();
       })
       .catch((err) => {
         console.log(err);
         done();
       });
    });
  });

  describe("GET /advertisements", () => {
    it("should return status code 200 and all advertisements", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toContain("Testing Ad");
        done();
      });
    });
  });

  describe("GET /advertisements/new", () => {
    it("should render a new advertisement form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(body).toContain("New Advertisement");
        done();
      })
    })
  })

  describe("POST /advertisements/create", () => {
    let options = {
      url: `${base}create`,
      form: {
        title: "One more Ad",
        description: "You cannot miss this one"
      }
    }

    it("should create a new advertisement and redirect", (done) => {
      request.post(options, (err, res, body) => {
        Advertisement.findOne({
          where: {
            title: "One more Ad"
          }
        })
        .then((advertisement) => {
          expect(err).toBeNull();
          expect(advertisement.title).toContain("One more Ad");
          expect(advertisement.description).toContain("You cannot miss this one");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      })
    })
  })

  describe("GET /advertisements/:id", () => {
    it("should render a page with the specific advertisements", (done) => {
      request.get(`${base}${this.advertisement.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Testing Ad");
        done();
      })
    })
  })

  describe("POST /advertisements/:id/destroy", () => {
    it("should delete the advertisement entry associated with the ID", (done) => {
      Advertisement.findAll()
      .then(advertisements => {
        const advertisementsBeforeDelete = advertisements.length;
        expect(advertisementsBeforeDelete).toBe(1);
        request.post(`${base}${this.advertisement.id}/destroy`, (err, res, body) => {
          Advertisement.findAll()
          .then(advertisements => {
            expect(err).toBeNull();
            expect(advertisements.length).toBe(advertisementsBeforeDelete - 1);
            done();
          });
        });
      });
    });
  });

  describe("GET /advertisement/:id/edit", () => {
    it("should render a advertisement update page", (done) => {
      request.get(`${base}${this.advertisement.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Advertisement");
        done();
      })
    })
  });

  describe("POST /advertisements/:id/update", () => {
    it("should updated an specific advertisement entry", (done) => {
      let options = {
        url: `${base}${this.advertisement.id}/update`,
        form: {
          title: "Super testing Ad",
          description: "You should get really distracted"
        }
      }
      request.post(options, (err, res, body) => {
        Advertisement.findByPk(this.advertisement.id)
        .then(advertisement => {
          expect(advertisement.title).toContain("Super testing Ad");
          expect(advertisement.description).toContain("You should get really distracted");
          done();
        });
      });
    });
  })
});