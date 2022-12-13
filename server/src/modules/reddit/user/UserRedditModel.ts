import mongoose from 'mongoose';

const redditUserSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true, unique: true },
    active_timestamps: [{ type: Date, default: null }],
  }, {
    timestamps: true,
  }
);

redditUserSchema.index({ identifier: 1, active_timestamps: 1 }, { unique: true });

mongoose.set('toJSON', { virtuals: true });

const UserRedditModel = mongoose.model('user', redditUserSchema);
export default UserRedditModel;