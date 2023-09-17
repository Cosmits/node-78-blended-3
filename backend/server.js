const express = require('express');
const path = require("path");
const connectDB = require("../config/connectDB");
const errorHandler = require('./middlewares/errorHandler');

const configPath = path.join(__dirname, "..", "config", ".env");

require("colors");
// console.log(require("dotenv").config({ path: configPath }))
require("dotenv").config({ path: configPath })

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.use('/api/v1', require("./routes/ordersRoutes"))

app.use(errorHandler)


const { PORT } = process.env;
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`.bold.italic.green)
})