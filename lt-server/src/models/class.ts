import { Schema, model } from 'mongoose';
import uniqueValidator = require('mongoose-unique-validator');

interface IClass {
  name: string;
}

const classSchema = new Schema<IClass>({
  name: { type: String, required: true, unique: true },
});
classSchema.plugin(uniqueValidator);

const Class = model<IClass>('Class', classSchema);

export default Class;
