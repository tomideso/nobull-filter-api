import { AccountDto } from "@/Dto/AccountDto";
import { Schema, model, Document } from "mongoose";

let AccountSchema = new Schema<AccountDto>(
  {
    created: { type: Date, default: Date.now },
    accessToken: String,
    email: String,
    userId: String,
    firstName: String,
    lastName: String,
  },
  { timestamps: true }
);

export default model<AccountDto & Document>("Account", AccountSchema);
