import mongoose, { Schema, Document } from "mongoose";

export interface IUserData extends Document {
  account: string;
  bytesPinned: number;
}

const UserDataSchema: Schema = new Schema({
  account: { type: String, required: true, unique: true },
  bytesPinned: { type: Number, required: true },
});

export default mongoose.model<IUserData>("UserData", UserDataSchema);
