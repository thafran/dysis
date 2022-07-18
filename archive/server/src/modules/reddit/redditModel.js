import mongoose from 'mongoose';
import count from 'count-array-values';

const redditSchema = new mongoose.Schema(
    {
      identifier: {type: String, required: true, unique: true},
      analytics: {
        perspective: {
          toxicity: {type: Number},
          severeToxicity: {type: Number},
          threat: {type: Number},
          identityAttack: {type: Number},
          profanity: {type: Number},
          insult: {type: Number},
        },
        liwc: {},
      },
      metrics: {
        totalSubmissions: {type: Number},
        totalComments: {type: Number},
        medianScoreComments: {type: Number},
        medianScoreSubmissions: {type: Number},
        averageScoreComments: {type: Number},
        averageScoreSubmissions: {type: Number},
      },
      context: {
        subredditsForSubmissions: [{subreddit: String, count: Number}],
        subredditsForComments: [{subreddit: String, count: Number}],
      },
    },
    {
      timestamps: true,
    },
);

redditSchema.virtual('metrics.totalPosts').get(function() {
  return this.metrics.totalComments + this.metrics.totalSubmissions;
});

// redditSchema.virtual('context.subreddits').get(function() {
//   let allSubreddits = [];
//   console.log(this.context.subredditsForComments);

//   const subredditsForComments = Array
//       .from(this.context.subredditsForComments);
//   const subredditsForSubmissions = Array
//       .from(this.context.subredditsForSubmissions);
//   for (const element of subredditsForComments) {
//     allSubreddits[element.subreddit] = element.count;
//   }
//   for (const element of subredditsForSubmissions) {
//     allSubreddits[element.subreddit] = element.count;
//   }
//   allSubreddits = count(allSubreddits);
//   return allSubreddits;
// });

mongoose.set('toJSON', {virtuals: true});

const redditModel = mongoose.model('reddit', redditSchema);

export default redditModel;
