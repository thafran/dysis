import mongoose from 'mongoose';

const redditSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true, unique: true },
    analytics: {
      perspective: {
        toxicity: { type: Number },
        severeToxicity: { type: Number },
        threat: { type: Number },
        identityAttack: { type: Number },
        profanity: { type: Number },
        insult: { type: Number },
      },
      perspectiveExamples: {
        examplesUpdatedAt: { type: Date, default: null },
        toxicity: {
          value: { type: Number },
          text: { type: String },
        },
        severeToxicity: {
          value: { type: Number },
          text: { type: String },
        },
        threat: {
          value: { type: Number },
          text: { type: String },
        },
        identityAttack: {
          value: { type: Number },
          text: { type: String },
        },
        profanity: {
          value: { type: Number },
          text: { type: String },
        },
        insult: {
          value: { type: Number },
          text: { type: String },
        },
      },
      liwc: {},
    },
    metrics: {
      totalSubmissions: { type: Number },
      totalComments: { type: Number },
      medianScoreComments: { type: Number },
      medianScoreSubmissions: { type: Number },
      averageScoreComments: { type: Number },
      averageScoreSubmissions: { type: Number },
    },
    context: {
      subredditsForSubmissions: [{ subreddit: String, count: Number }],
      subredditsForComments: [{ subreddit: String, count: Number }],
      subreddits: [{ subreddit: String, count: Number }],
    },
  },
  {
    timestamps: true,
  },
);

redditSchema.virtual('metrics.totalPosts').get(function totalComments() {
  return this.metrics.totalComments ?? 0 + this.metrics.totalSubmissions ?? 0;
});

mongoose.set('toJSON', { virtuals: true });

const RedditModel = mongoose.model('reddit', redditSchema);

export default RedditModel;
