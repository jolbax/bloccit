const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const User = require("../../src/db/models").User;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      }).then(user => {
        this.user = user;

        Topic.create(
          {
            title: "Expeditions to Alpha Centauri",
            description:
              "A compilation of reports from recent visits to star system.",
            posts: [
              {
                title: "My first visit to Proxima Centauri b",
                body: "I saw some rocks",
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
          this.post = topic.posts[0];
          done();
        });
      });
    });
  });

  describe("#create()", () => {
    it("should create a new topic with a title and a description", done => {
      Topic.create({
        title: "How many Thundercats are there?",
        description: "Remaining the TV-childhood"
      })
        .then(topic => {
          expect(topic.title).toBe("How many Thundercats are there?");
          expect(topic.description).toBe("Remaining the TV-childhood");
          Topic.findOne({
            where: {
              title: "How many Thundercats are there?"
            }
          }).then(topic => {
            expect(topic.title).toBe("How many Thundercats are there?");
            expect(topic.description).toBe("Remaining the TV-childhood");
            done();
          });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });

    it("should not create a new topic with a title nor a description", done => {
      Topic.create({
        title: "What about Maya?"
      })
        .then(topic => {
          done();
        })
        .catch(err => {
          expect(err.message).toBe("Topic.description cannot be null");
          done();
        });
    });
  });

  describe("#getPosts()", () => {
    it("should return an array with the associated posts", done => {
      Post.create({
        title: "What was the name of the two buddies?",
        body: "Romario and Rivaldo?",
        topicId: this.topic.id,
        userId: this.user.id
      })
        .then(post => {
          this.topic.getPosts().then(posts => {
            expect(posts[0].title).toBe(
              "My first visit to Proxima Centauri b"
            );
            expect(posts[1].title).toBe(
              "What was the name of the two buddies?"
            );
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
