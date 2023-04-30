import { Schema, model, Types } from 'mongoose';
import uniqueValidator = require('mongoose-unique-validator');

interface ISubject {
  name: string;
  className: Types.ObjectId
}

const subjectSchema = new Schema<ISubject>({
  name: { type: String, required: true, unique: true },
  className : { type: Schema.Types.ObjectId, ref: 'Class' }
});
subjectSchema.plugin(uniqueValidator);

const Subject = model<ISubject>('Subject', subjectSchema);

export default Subject;
