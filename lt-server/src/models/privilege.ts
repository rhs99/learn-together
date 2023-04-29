import { Schema, model } from 'mongoose';

interface IPrivilege {
  name: string;
}

const privilegeSchema = new Schema<IPrivilege >({
  name: { type: String, required: true },
});

const Privilege = model<IPrivilege >('Privilege', privilegeSchema);

export default Privilege;