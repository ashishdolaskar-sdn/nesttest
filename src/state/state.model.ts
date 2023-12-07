import * as mongoose from 'mongoose';

export interface Test extends mongoose.Document {
  name: string;
  email: string;
  password: string;

}

export const IMstatesSchema = new mongoose.Schema<Test>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
