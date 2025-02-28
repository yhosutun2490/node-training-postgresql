const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("Users");
const {
  userSignUpValidator,
  userLoginValidator,
  userUpdateProfileValidator,
} = require("../middlewares/users/validateUser");
const {
  isEmailOrNameRepeat,
  isUserExist,
  isUpdateSameName,
  isDBhasSameName,
} = require("../middlewares/users/index");

// controller
const { signup, login, profile } = require("../controllers/usersController");

const { userAuth } = require("../middlewares/auth");
const config = require("../config/index");
// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});

router.post("/signup", [userSignUpValidator, isEmailOrNameRepeat], signup.post);

router.post("/login", [userLoginValidator, isUserExist], login.post);

// 取得個人資料
router.get("/profile", auth, profile.get);

router.put(
  "/profile",
  [auth, userUpdateProfileValidator, isUpdateSameName, isDBhasSameName],
  profile.put
);

module.exports = router;
