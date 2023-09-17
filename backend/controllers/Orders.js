const orderModel = require("../models/orderModel");
const asyncHandler = require('express-async-handler')

class Orders {

  add = asyncHandler(async (req, res) => {
    const { title, price } = req.body;
    if (!title || !price) {
      res.status(400)
      throw new Error('Provide all fields')
    }

    const order = await orderModel.create({ ...req.body })
    res.status(201).json({
      code: 201,
      data: {
        title: order.title,
        amount: order.amount,
        price: order.price,
      },
    })
  })

  getAll = asyncHandler(async (req, res) => {
    const data = await orderModel.find({})
    if (!data) {
      res.status(400)
      throw new Error('Unable to fetch orders')
    }

    res.status(200).json({
      code: 200,
      data,
      qty: data.length,
    })
  })

  getOne = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await orderModel.findById(id)

    if (!data) {
      res.status(400)
      throw new Error(`Unable to fetch order with ID: ${id}`)
    }

    res.status(200).json({
      code: 200,
      data,
    })
  })

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await orderModel.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true }).select('-_id -createdAt -updatedAt')

    if (!data) {
      res.status(400)
      throw new Error(`Unable to fetch order with ID: ${id}`)
    }

    res.status(200).json({
      code: 200,
      data,
    })
  })

  remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await orderModel.findByIdAndRemove(id).select('_id')

    if (!data) {
      res.status(400)
      throw new Error(`Unable to fetch order with ID: ${id}`)
    }

    res.status(200).json({
      code: 200,
      data,
    })
  })
}

module.exports = new Orders();