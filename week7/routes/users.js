const express = require("express");
const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("Users");
const {
  userSignUpValidator,
  userLoginValidator,
  userUpdateProfileValidator,
  userUpdatePasswordValidator,
} = require("../middlewares/users/validateUser");
const {
  isEmailOrNameRepeat,
  isUserExist,
  isUpdateSameName,
  isDBhasSameName,
  isUserInputPasswordMatchDb,
} = require("../middlewares/users/index");

// controller
const {
  signup,
  login,
  profile,
  password: passwordController,
  package
} = require("../controllers/usersController");

const { userAuth } = require("../middlewares/auth");
const config = require("../config/index");
const { password } = require("../config/db");
// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});
// limit update password request
const  { rateLimit } = require('express-rate-limit')
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 15 minutes
	limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

router.post("/signup", [userSignUpValidator, isEmailOrNameRepeat], signup.post);

router.post("/login", [userLoginValidator, isUserExist], login.post);

// 取得個人資料
router.get("/profile", auth, profile.get);

// 更新個人資料
router.put(
  "/profile",
  [auth, userUpdateProfileValidator, isUpdateSameName, isDBhasSameName],
  profile.put
);

// 更新個人密碼
router.put(
  "/password",
  auth,
  limiter,
  [userUpdatePasswordValidator, isUserInputPasswordMatchDb],
  passwordController.put
);

// 取得個人已購買的課程包
router.get("/credit-package",auth,package.get)

module.exports = router;
