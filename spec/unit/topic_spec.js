const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {
  beforeEach(done => {
    this.topic;
    sequelize.sync({ force: true }).then(res => {
      Topic.create({
        title: "Plaza Sesame",
        description: "Discussions about the neighborhood"
      })
        .then(topic => {
          this.topic = topic;
          Post.create({
            title: "Was Rene a horse?",
            body: "No, it was rather a frog!",
            topicId: this.topic.id
          }).then(post => {
            this.post = post.id;
            done();
          });
        })
        .catch(err => {
          console.log(err);
          done();
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
        topicId: this.topic.id
      })
        .then(post => {
          this.topic.getPosts().then(posts => {
            expect(posts[0].title).toBe("Was Rene a horse?");
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
