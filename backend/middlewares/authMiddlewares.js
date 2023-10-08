const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    // 1. Отримуємо токен
    // 2. Розшифровуємо токен
    // 3. Передаємо інформацію від токена далі
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmllbmRzIjpbIlNlcmhpaSIsIklyYSIsIkhlbmEiXSwiaWQiOiI2NTE5MjNiNDNiMTI1ZTI2YmNiMGYwZTIiLCJpYXQiOjE2OTYxNDk5MzEsImV4cCI6MTY5NjE5MzEzMX0.GS1Ale8vveAlwhAlERluOluvCWWhSIlzLd0Wp9VHodw";

    const [type, token] = req.headers.authorization.split(" ");
    if (type === "Bearer" && token) {
      const decoded = jwt.verify(token, "cat");
      // req.user = decoded;

      const currentUser = await userModel.findById(decoded.id);
      req.user = currentUser;

      next();
    }
  } catch (error) {
    res.status(401).json({ code: 401, message: error.message });
  }
};

// decodet:  {
//   friends: [ 'Serhii', 'Ira', 'Hena' ],
//   id: '651923b43b125e26bcb0f0e2',
//   iat: 1696149931,
//   exp: 1696193131
// }
