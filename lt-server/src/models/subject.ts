import { Schema, model, Types } from 'mongoose';
import uniqueValidator = require('mongoose-unique-validator');

interface ISubject {
  name: string;
  class: Types.ObjectId;
  isDeleted: boolean;
}

const subjectSchema = new Schema<ISubject>({
  name: { type: String, required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class' },
  isDeleted: { type: Boolean, default: false },
});
subjectSchema.index({ name: 1, class: 1 }, { unique: true });
subjectSchema.plugin(uniqueValidator);

const Subject = model<ISubject>('Subject', subjectSchema);

export default Subject;
