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
    token: { type: String, default: null },
    roles: [{ type: String, ref: "role" }],
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("user", userSchema);
