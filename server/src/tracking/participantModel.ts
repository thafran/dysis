import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
    {
      firstName: {type: String, required: true},
      lastName: {type: String, required: true},
      agreedToTerms: {type: Boolean, required: true},
      submitted: {type: Boolean, required: true},
      installationDate: {type: Number, required: true},
      dysis: {
        totalUsageTime: {type: Number, default: 0}
      }
    }, {
      timestamps: true,
    },
);

participantSchema.index({ firstName: 1, lastName: 1, installationDate: 1}, { unique: true });

mongoose.set('toJSON', {virtuals: true});

const participantModel = mongoose.model('participant', participantSchema);

export default participantModel;
