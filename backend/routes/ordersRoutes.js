// Cannot GET / api / v1 / orders
// 1. add order
// 2. get all orders
// 3. get one order
// 4. update order
// 5. remove order



const ordersRoutes = require("express").Router();
const ordersController = require('../controllers/Orders');
const isValidID = require("../middlewares/isValidID");

ordersRoutes.post("/orders", (req, res, next) => {
  console.log('JOI');
  next();
}  ,ordersController.add);
ordersRoutes.get("/orders", ordersController.getAll);
ordersRoutes.get("/orders/:id", isValidID, ordersController.getOne);
ordersRoutes.put("/orders/:id", isValidID, ordersController.update);
ordersRoutes.delete("/orders/:id", isValidID, ordersController.remove);

module.exports = ordersRoutes;
