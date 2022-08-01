import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  agreedToTerms: { type: Boolean, required: true },
  submitted: { type: Boolean, required: true },
  installationDate: { type: String, required: true },
  dysis: {
    totalUsageTime: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

participantSchema.index({ firstName: 1, lastName: 1, installationDate: 1 }, { unique: true });

participantSchema.virtual('fullName').get(function fullName() {
  return `${this.firstName ?? ''} ${this.lastName ?? ''}`;
});
participantSchema.virtual('dysis.totalUsageTimeInMins').get(function totalUsageTimeInMins() {
  return (this.dysis.totalUsageTime / 60).toFixed(2);
});
participantSchema.virtual('dysis.totalUsageTimeInHours').get(function totalUsageTimeInHours() {
  return (this.dysis.totalUsageTime / 60 / 60).toFixed(2);
});
mongoose.set('toJSON', { virtuals: true });

const ParticipantModel = mongoose.model('participant', participantSchema);

export default ParticipantModel;
