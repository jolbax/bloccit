const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;
const User = require("../../src/db/models").User;

describe("routes : flairs", () => {
  beforeEach(done => {
    this.topic;
    this.post1;
    this.post2;
    this.flair;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        email: "user@example.com",
        password: "123123123",
        role: "member"
      }).then(user => {
        this.user = user;
        Topic.create(
          {
            title: "The beauty of a rainy day",
            description: "Get the most out of the day",
            posts: [
              {
                title: "Riding bicycle with open mouth",
                body: "Enjoy the feeling!",
                userId: this.user.id
              },
              {
                title: "Skating is cooler",
                body: "Really!",
                userId: this.user.id
              }
            ]
          },
          {
            include: {
              model: Post,
              as: "posts"
            }
          }
        ).then(topic => {
          this.topic = topic;
          this.post1 = topic.posts[0];
          this.post2 = topic.posts[1];
          Flair.create({
            name: "inspiration",
            color: "blue",
            topicId: this.topic.id
          })
            .then(flair => {
              this.flair = flair;
              this.topic.posts[0].setFlair(flair).then(flair => {
                done();
              });
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });
  });

  // Guest context
  describe("guest performing CRUD operation for Flair", () => {
    beforeEach(done => {
      request.get(
        {
          url: "http://localhost:3000/auth/fake",
          form: {
            userId: 0
          }
        },
        (err, res, body) => {
          done();
        }
      );
    });
    describe("GET /topics/:topicId/posts/:postId/flair/new", () => {
      it("should not render a new post form with flair options", done => {
        request.get(
          `${base}${this.topic.id}/posts/${this.post2.id}/flair/new`,
          (err, res, body) => {
            expect(body).toContain("Skating is cooler");
            done();
          }
        );
      });
    });

    describe("POST /topics/:topicId/posts/:postId/flair/create", () => {
      it("should create a new flair, and not associate it to a specific post", done => {
        let options = {
          url: `${base}${this.topic.id}/posts/${this.post2.id}/flair/create`,
          form: {
            name: "technology",
            color: "green",
            topicId: this.topic.id
          }
        };
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Flair.findOne({ where: { name: "technology" } })
            .then(flair => {
              expect(flair.name).toBe("technology");
              expect(flair.color).toBe("green");
              request.post(
                `${base}${this.topic.id}/posts/${this.post2.id}/flair/${
                  flair.id
                }/setFlair`,
                (err, res, body) => {
                  expect(res.statusCode).toBe(401);
                  expect(this.post2.flairId).toBeNull();
                  done();
                }
              );
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });

    describe("GET /topics/:topicId/posts/:postId", () => {
      it("should render a post view with the associated flair", done => {
        request.get(
          `${base}${this.topic.id}/posts/${this.post1.id}`,
          (err, res, body) => {
            expect(body).toContain("Riding bicycle with open mouth");
            expect(body).toContain("inspiration");
            done();
          }
        );
      });
    });

    describe("GET /topics/:topicId/posts/:postId/flair/:flairId/edit", () => {
      it("should not render flair edit form", done => {
        request.get(
          `${base}${this.topic.id}/posts/${this.post1.id}/flair/${
            this.flair.id
          }/edit`,
          (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Riding bicycle with open mouth");
            done();
          }
        );
      });
    });

      describe("POST /topics/:topicId/posts/:postId/flair/:flairId/update", () => {
        it("should not update a flair and redirect", done => {
          let options = {
            url: `${base}${this.topic.id}/posts/${this.post1.id}/flair/${
              this.flair.id
            }/update`,
            form: {
              name: "tech",
              color: "black"
            }
          };
          request.post(options, (err, res, body) => {
            Flair.findOne({ where: options.form }).then(flair => {
              request.post(
                `${base}${this.topic.id}/posts/${this.post1.id}/flair/${
                  flair.id
                }/setFlair`,
                (err, res, body) => {
                  expect(res.statusCode).toBe(401);
                  Post.findByPk(this.post1.id).then(post => {
                    expect(post.flairId).not.toBe(flair.id);
                    Flair.findByPk(post.flairId)
                      .then(flair => {
                        expect(flair.name).toBe("inspiration");
                        expect(flair.color).toBe("blue");
                        done();
                      })
                      .catch(err => {
                        console.log(err);
                        done();
                      });
                  });
                }
              );
            });
          });
        });
      });
  });

  // Member context
  describe("guest performing CRUD operation for Flair", () =>{
    beforeEach((done) => {
      request.get(
        {
          url: "http://localhost:3000/auth/fake",
          form: {
            email: this.user.email,
            userId: this.user.id,
            role: this.user.role
          }
        },
        (err, res, body) => {
          done();
        }
      );
    })
    describe("GET /topics/:topicId/posts/:postId/flair/new", () => {
      it("should render a new post form with flair options", done => {
        request.get(
          `${base}${this.topic.id}/posts/${this.post1.id}/flair/new`,
          (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Flair");
            expect(body).toContain("Name");
            expect(body).toContain("Color");
            done();
          }
        );
      });
    });

  describe("POST /topics/:topicId/posts/:postId/flair/create", () => {
    it("should create a new flair, and associate it to the specific post", done => {
      let options = {
        url: `${base}${this.topic.id}/posts/${this.post2.id}/flair/create`,
        form: {
          name: "technology",
          color: "green",
          topicId: this.topic.id
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Flair.findOne({ where: { name: "technology" } })
          .then(flair => {
            expect(flair.name).toBe("technology");
            expect(flair.color).toBe("green");
            request.post(
              `${base}${this.topic.id}/posts/${this.post2.id}/flair/${
              flair.id
              }/setFlair`,
              (err, res, body) => {
                expect(res.statusCode).toBe(303);
                done();
              }
            );
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

    describe("GET /topics/:topicId/posts/:postId", () => {
      it("should render a post view with the associated flair", done => {
        request.get(
          `${base}${this.topic.id}/posts/${this.post1.id}`,
          (err, res, body) => {
            expect(body).toContain("Riding bicycle with open mouth");
            expect(body).toContain("inspiration");
            done();
          }
        );
      });
    });

    describe("GET /topics/:topicId/posts/:postId/flair/:flairId/edit", () => {
      it("should render flair edit form", done => {
        request.get(
          `${base}${this.topic.id}/posts/${this.post1.id}/flair/${
            this.flair.id
          }/edit`,
          (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Flair");
            expect(body).toContain("Name");
            expect(body).toContain("Color");
            expect(body).toContain("inspiration");
            done();
          }
        );
      });
    });

    describe("POST /topics/:topicId/posts/:postId/flair/:flairId/update", () => {
      it("should update a flair and redirect", done => {
        let options = {
          url: `${base}${this.topic.id}/posts/${this.post1.id}/flair/${
            this.flair.id
          }/update`,
          form: {
            name: "tech",
            color: "black"
          }
        };
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Flair.findOne({ where: options.form }).then(flair => {
            request.post(
              `${base}${this.topic.id}/posts/${this.post1.id}/flair/${
                flair.id
              }/setFlair`,
              (err, res, body) => {
                Post.findByPk(this.post1.id).then(post => {
                  expect(post.flairId).toBe(flair.id);
                  Flair.findByPk(post.flairId)
                    .then(flair => {
                      expect(flair.name).toBe("tech");
                      expect(flair.color).toBe("black");
                      done();
                    })
                    .catch(err => {
                      console.log(err);
                      done();
                    });
                });
              }
            );
          });
        });
      });
    });
  });
});
