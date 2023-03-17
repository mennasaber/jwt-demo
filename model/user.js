const mongoose = require("mongoose");
const AccountType = {
  Default: "Default",
  Google: "Google",
};
const userSchema = new mongoose.Schema({
  accountType: {
    type: String,
    enum: AccountType,
    default: AccountType.Default,
  },
  name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
});
module.exports = mongoose.model("user", userSchema);
