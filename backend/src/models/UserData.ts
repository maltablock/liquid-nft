import mongoose, { Schema, Document } from "mongoose";

export interface IUserData extends Document {
  account: string;
  bytesPinned: number;
  files: Document &
    {
      ipfsHash: string;
      name: string;
      size: number;
      uploadedAt: Date;
    }[];
}

const fileSchema = new Schema({
  ipfsHash: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /[a-zA-Z0-9]+/.test(v);
      },
      message: "Not a valid IPFS hash.",
    },
  },
  name: String,
  size: Number,
  uploadedAt: Date,
});

// fileSchema.pre('validate', function(next) {
//   console.log('2');
//   this.
//   next();
// });

const UserDataSchema: Schema = new Schema({
  account: { type: String, required: true, unique: true },
  bytesPinned: { type: Number, required: true },
  files: [fileSchema],
});

export default mongoose.model<IUserData>("UserData", UserDataSchema);
