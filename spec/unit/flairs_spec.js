const sequelize = require("../../src/db/models/index").sequelize;

const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;
const User = require("../../src/db/models").User;

describe("Flair", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.flair;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      }).then(user => {
        this.user = user;
        Topic.create({
          title: "r/Help",
          description: "All about helping you!"
        }).then(topic => {
          this.topic = topic;
          Post.create({
            title: "A question about basketball?",
            body: "How many players are allowed in a team?",
            topicId: topic.id,
            userId: this.user.id
          }).then(post => {
            this.post = post;
            Flair.create({
              name: "general",
              color: "green",
              topicId: this.topic.id
            })
              .then(flair => {
                this.flair = flair;
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
  });

  describe("#create()", () => {
    it("should create a flair with the given values", done => {
      Post.create({
        title: "Which is the best video game?",
        body: "For people older than 30...",
        topicId: this.topic.id,
        userId: this.user.id
      }).then(post => {
        Flair.create({
          name: "Gaming",
          color: "orange",
          topicId: this.topic.id
        })
          .then(flair => {
            expect(flair).not.toBeNull();
            expect(flair.name).toBe("Gaming");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });

    it("should not create a flair with the given values", done => {
      Flair.create({
        name: "Gaming"
      })
        .then(flair => {
          done();
        })
        .catch(err => {
          expect(err).not.toBeNull();
          expect(err.message).toContain("Flair.color cannot be null");
          done();
        });
    });
  });

  describe("#setFlair()", () => {
    it("should associate a flair and a post together", done => {
      Post.create({
        title: "Challenges of sports",
        body: "Get injured!",
        topicId: this.topic.id,
        userId: this.user.id
      }).then(newPost => {
        newPost.setFlair(this.flair).then(post => {
          expect(post.flairId).toBe(this.flair.id);
          done();
        });
      });
    });
  });

  describe("#getFlair()", () => {
    it("should return the associated flair", done => {
      this.post.setFlair(this.flair).then(post => {
        post
          .getFlair()
          .then(flair => {
            expect(flair.name).toBe("general");
            expect(flair.color).toBe("green");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("#getPosts()", () => {
    it("should return an array with all the associated posts", done => {
      Post.create({
        title: "Challenges of sports",
        body: "Get injured!",
        topicId: this.topic.id,
        userId: this.user.id
      }).then(newPost => {
        newPost.setFlair(this.flair).then(post => {
          expect(post.flairId).toBe(this.flair.id);
          this.post.setFlair(this.flair).then(post => {
            expect(post.flairId).toBe(this.flair.id);
            this.flair
              .getPosts()
              .then(posts => {
                expect(posts[0].title).toBe("Challenges of sports");
                expect(posts[1].title).toBe("A question about basketball?");
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
  });
});
