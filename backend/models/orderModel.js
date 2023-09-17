// {
//   "title": "Coca-Cola",
//     "amount": "1",
//       "price": "10"
// }

const { model, Schema } = require('mongoose')
const orderSchema = new Schema(
  {
    "title": {
      type: String,
      required: [true, "db: title is required"],
    },

    "amount": {
      type: Number,
      default: 1,
    },

    "price": {
      type: Number,
      required: [true, "db: price is required"],
    },

  }, { timestamps: true, versionKey: false })

module.exports = model("order", orderSchema);