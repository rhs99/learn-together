import { Schema, model, Types } from 'mongoose';

interface ISubject {
  name: string;
  className: Types.ObjectId
}

const subjectSchema = new Schema<ISubject>({
  name: { type: String, required: true },
  className : { type: Schema.Types.ObjectId, ref: 'Class' }
});

const Subject = model<ISubject>('Subject', subjectSchema);

export default Subject;
