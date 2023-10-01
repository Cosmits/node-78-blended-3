const express = require("express");
const path = require("path");
const connectDB = require("../config/connectDB");
const errorHandler = require("./middlewares/errorHandler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("./models/userModel");
const roleModel = require("./models/roleModel");
const authmiddlewares = require("./middlewares/authmiddlewares");

const configPath = path.join(__dirname, "..", "config", ".env");

require("colors");
// console.log(require("dotenv").config({ path: configPath }))
require("dotenv").config({ path: configPath });
const asyncHandler = require("express-async-handler");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1", require("./routes/ordersRoutes"));
// Реєстрація це збереження користувача в базу
// Аутентифікація - перевірка співпадіння введених користувачем даних із тими що є базі
// Ауторизація - перевірка прав доступу
// Logout (розлогіненя) - скасування прав доступу (вихід із системи)

app.post(
  "/register",
  asyncHandler(async (req, res) => {
    // 1. Отримуємо і валідуємо дані від користувача
    // 2. Шукаємо користувача в базі
    // 3. Якщо знайшли - викидаємо помилку
    // 4. Якщо не знайшли - хешуємо пароль
    // 5. Зберігаємо користувача в базу із захешованим паролем

    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Provide all fields");
    }

    const candidate = await userModel.findOne({ email });
    if (candidate) {
      res.status(400);
      throw new Error("User already exists");
    }
    const hashPasswort = bcrypt.hashSync(password, 5);
    const roles = await roleModel.findOne({ value: "USER" });

    console.log("hashPasswort: ", hashPasswort);

    const user = await userModel.create({
      ...req.body,
      password: hashPasswort,
      roles: [roles.value],
    });
    res.status(201).json({
      code: 201,
      data: {
        email: user.email,
      },
    });
  })
);

app.post(
  "/login",
  asyncHandler(async (req, res) => {
    // 1. Отримуємо і валідуємо дані від користувача
    // 2. Шукаємо користувача в базі і розшифровуємо пароль
    // 3. Якщо не знайшли або не розшифрували пароль - викидаємо помилку (Невірний логін або пароль)
    // 4. Генеруємо токен користувачу
    // 5. Зберігаємо користувача з токеном в базу

    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Provide all fields");
    }

    const candidate = await userModel.findOne({ email });
    if (!candidate) {
      res.status(400);
      throw new Error("Невірний логін або пароль");
    }

    const isValidPasswort = bcrypt.compareSync(password, candidate.password);
    if (!isValidPasswort) {
      res.status(400);
      throw new Error("Невірний логін або пароль");
    }

    const token = generateToken({
      friends: ["Serhii", "Ira", "Hena"],
      id: candidate._id,
      roles: candidate.roles,
    });

    candidate.token = token;

    await candidate.save();

    res.status(200).json({
      code: 200,
      data: {
        email: candidate.email,
        token: candidate.token,
      },
    });
  })
);

app.patch(
  "/logout",
  authmiddlewares,
  asyncHandler(async (req, res) => {
    const { id } = req.user;
    const user = await userModel.findById(id);
    user.token = null;
    await user.save();
    res.status(200).json({
      code: 200,
      message: "logout success",
    });
  })
);

function generateToken(data) {
  const payload = { ...data };
  return jwt.sign(payload, "cat", { expiresIn: "12h" });
}

app.use(errorHandler);

const { PORT } = process.env;
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`.bold.italic.green);
});
