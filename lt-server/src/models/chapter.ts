import { Schema, model, Types } from 'mongoose';

interface IChapter {
  name: string;
  subject: Types.ObjectId;
}

const chapterSchema = new Schema<IChapter>({
  name: { type: String, required: true },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
});

const Chapter = model<IChapter>('Chapter', chapterSchema);

export default Chapter;
