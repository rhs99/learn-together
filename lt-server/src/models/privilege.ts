import { Schema, model } from 'mongoose';
import uniqueValidator = require('mongoose-unique-validator');

interface IPrivilege {
  name: string;
  isDeleted: boolean;
}

const privilegeSchema = new Schema<IPrivilege>({
  name: { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false },
});
privilegeSchema.plugin(uniqueValidator);

const Privilege = model<IPrivilege>('Privilege', privilegeSchema);

export default Privilege;
