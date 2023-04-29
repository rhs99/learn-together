import { Schema, model } from 'mongoose';

interface IClass {
  name: string;
}

const classSchema = new Schema<IClass>({
  name: { type: String, required: true },
});

const Class = model<IClass>('Class', classSchema);

export default Class;
