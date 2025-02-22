const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("Users");
const {
  userSignUpValidator,
  userLoginValidator,
} = require("../middlewares/users/validateUser");
const {
  isEmailRepeat,
  isUserExist
} = require("../middlewares/users/index")
const {
  successResponse,
} = require("../middlewares/responseHandler");
const {
  hashPassword  
} = require("../utils/bcryptPassword")


router.post("/signup",[userSignUpValidator,isEmailRepeat] ,async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const userTable = await dataSource.getRepository("User");
    const passwordHashed = await hashPassword(password)
    const createUser = userTable.create({
      name,
      email,
      password: passwordHashed,
      role,
    });
    const result = await userTable.save(createUser);
    successResponse(
      res,
      {
        user: {
          id: result.id,
          name,
        },
      },
      201
    );
  } catch (err) {
      next(err);
  }
});

router.post("/login",[userLoginValidator, isUserExist],async (req, res, next) => {
  try {
    const { name, email } = req.body;
    successResponse(res,req.body,200)
  } catch (err) {
    next(err);
  }
});

module.exports = router;
