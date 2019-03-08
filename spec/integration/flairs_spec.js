const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("routes : flairs", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({ force: true }).then(res => {
      Topic.create({
        title: "The beauty of a rainy day",
        description: "Get the most out of the day"
      }).then(topic => {
        this.topic = topic;
        Post.create({
          title: "Riding bicycle with open mouth",
          body: "Enjoy the feeling!",
          topicId: this.topic.id
        })
          .then(post => {
            this.post = post;
            Flair.create({
              name: "inspiration",
              color: "blue",
              topicId: this.topic.id
            }).then(flair => {
              this.flair = flair;
              post.setFlair(flair).then(flair => {
                done();
              });
            });
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /topics/:topicId/posts/:postId/flair/new", () => {
    it("should render a new post form with flair options", done => {
      request.get(
        `${base}${this.topic.id}/posts/${this.post.id}/flair/new`,
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
      Post.create({
        title: "Tagging all things",
        body: "This is the hobby of many people",
        topicId: this.topic.id
      }).then(post => {
        let options = {
          url: `${base}${this.topic.id}/posts/${post.id}/flair/create`,
          form: {
            name: "technology",
            color: "green",
            topicId: this.topic.id
          }
        };
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Post.findOne({
            where: {
              title: "Tagging all things"
            }
          }).then(post => {
            expect(post.title).toBe("Tagging all things");
            Flair.findOne({ where: { name: "technology" } })
              .then(flair => {
                expect(flair.name).toBe("technology");
                expect(flair.color).toBe("green");
                request.post(
                  `${base}${this.topic.id}/posts/${post.id}/flair/${
                    flair.id
                  }/setFlair`,
                  (err, res, body) => {
                    expect(flair.id).toBe(post.id);
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
    });
  });

  describe("GET /topics/:topicId/posts/:postId", () => {
    it("should render a post view with the associated flair", (done) => {
      request.get(`${base}${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
        expect(body).toContain("Riding bicycle with open mouth");
        expect(body).toContain("inspiration");
        done();
      })
    })
  })

  describe("GET /topics/:topicId/posts/:postId/flair/:flairId/edit", () => {
    it("should render flair edit form", done => {
      request.get(
        `${base}${this.topic.id}/posts/${this.post.id}/flair/${this.flair.id}/edit`,
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
        url: `${base}${this.topic.id}/posts/${this.post.id}/flair/${this.flair.id}/update`,
        form: {
          name: "tech",
          color: "black"
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Flair.findByPk(this.flair.id)
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
    });
  });
});
