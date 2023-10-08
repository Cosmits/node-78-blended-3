const bcrypt = require("bcryptjs");

const { model, Schema } = require("mongoose");
const userSchema = new Schema(
  {
    name: {
      type: String,
      default: "Bruss Li",
    },

    email: {
      type: String,
      required: [true, "db: email is required"],
    },

    password: {
      type: String,
      required: [true, "db: password is required"],
    },

    avatar: {
      type: String,
    },

    token: { type: String, default: null },
    roles: [{ type: String, ref: "role" }],
  },
  { timestamps: true, versionKey: false }
);

userSchema.methods.hashPassword = async function(password) {
  this.password = await bcrypt.hash(password, 5);
}
 
userSchema.methods.comparePassword = async function (password) { 
  return await bcrypt.compare(password, this.password);
}

module.exports = model("user", userSchema);
