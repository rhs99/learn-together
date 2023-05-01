import { Schema, model, Types } from 'mongoose';
import uniqueValidator = require('mongoose-unique-validator');

interface IChapter {
  name: string;
  subject: Types.ObjectId;
  isDeleted: boolean;
}

const chapterSchema = new Schema<IChapter>({
  name: { type: String, required: true },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
  isDeleted: { type: Boolean, default: false },
});
chapterSchema.index({ name: 1, subject: 1 }, { unique: true });
chapterSchema.plugin(uniqueValidator);

const Chapter = model<IChapter>('Chapter', chapterSchema);

export default Chapter;
