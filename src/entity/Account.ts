import * as mongoose from "mongoose";

let Schema = mongoose.Schema;

let AccountSchema = new Schema({
  created: { type: Date, default: Date.now },
  accessToken: String,
  name: String,
});

export default mongoose.model("Account", AccountSchema);
