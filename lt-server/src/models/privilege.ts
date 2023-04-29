import { Schema, model } from 'mongoose';
import uniqueValidator = require('mongoose-unique-validator');

interface IPrivilege {
  name: string;
}

const privilegeSchema = new Schema<IPrivilege >({
  name: { type: String, required: true, unique: true },
});
privilegeSchema.plugin(uniqueValidator);

const Privilege = model<IPrivilege>('Privilege', privilegeSchema);

export default Privilege;
