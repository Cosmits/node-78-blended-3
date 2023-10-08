const express = require("express");
const path = require("path");
const connectDB = require("../config/connectDB");
const errorHandler = require("./middlewares/errorHandler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("./models/userModel");
const roleModel = require("./models/roleModel");
const authmiddlewares = require("./middlewares/authmiddlewares");

const gravatar = require("gravatar");

const configPath = path.join(__dirname, "..", "config", ".env");

require("colors");
// console.log(require("dotenv").config({ path: configPath }))
require("dotenv").config({ path: configPath });
const asyncHandler = require("express-async-handler");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use("/users", require("./routes/ordersRoutes"));
// Реєстрація це збереження користувача в базу
// Аутентифікація - перевірка співпадіння введених користувачем даних із тими що є базі
// Ауторизація - перевірка прав доступу
// Logout (розлогіненя) - скасування прав доступу (вихід із системи)

app.post(
  "/users/signup",
  asyncHandler(async (req, res) => {
    // 1. Отримуємо і валідуємо дані від користувача
    // 2. Шукаємо користувача в базі
    // 3. Якщо знайшли - викидаємо помилку
    // 4. Якщо не знайшли - хешуємо пароль
    // 5. Зберігаємо користувача в базу із захешованим паролем

    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      res.status(400);
      throw new Error("Provide all fields");
    }

    const candidate = await userModel.findOne({ email });
    if (candidate) {
      res.status(400);
      throw new Error("User already exists");
    }

    const avatar = gravatar.url(name);
    const newUser = new userModel({ name, email, avatar });

    await newUser.hashPassword(password);
    await newUser.save();


    const payload = { id: newUser._id }
    const token = jwt.sign(payload, "cat", { expiresIn: "12h" });

    await userModel.findByIdAndUpdate(newUser._id, { token });
    res.status(201).json({
      user: { name, email, avatar },
      token,
    })

    // const hashPassword = bcrypt.hashSync(password, 5);
    // const roles = await roleModel.findOne({ value: "USER" });

    // console.log("hashPassword: ", hashPassword);

    // const user = await userModel.create({
    //   ...req.body,
    //   password: hashPassword,
    //   roles: [roles.value],
    // });
    // res.status(201).json({
    //   code: 201,
    //   data: {
    //     email: user.email,
    //   },
    // });
  })
);

app.post(
  "/users/login",
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

    // const isValidPasswort = bcrypt.compareSync(password, candidate.password);
    const isValidPassword = candidate.comparePassword(password);
    if (!isValidPassword) {
      res.status(400);
      throw new Error("Невірний логін або пароль");
    }

    // const token = generateToken({
    //   friends: ["Serhii", "Ira", "Hena"],
    //   id: candidate._id,
    //   roles: candidate.roles,
    // });

    const payload = { id: candidate._id }
    const token = jwt.sign(payload, "cat", { expiresIn: "12h" });

    await userModel.findByIdAndUpdate(candidate._id, { token });
    res.json({
      user: { name: candidate.name, email, avatar: candidate.avatar },
      token,
    })


    // await candidate.save();
    // res.status(200).json({
    //   code: 200,
    //   data: {
    //     email: candidate.email,
    //     token: candidate.token,
    //   },
    // });
  })
);

app.post(
  "/users/logout",
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

app.get("/users/current",
  authmiddlewares,
  (req, res) => {
    const { name, email, avatar } = req.user
    console.log("🚀 ~ file: server.js:161 ~ req.user:", req)
    res.json({
      name,
      email,
      avatar,
    })
  }
)

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
