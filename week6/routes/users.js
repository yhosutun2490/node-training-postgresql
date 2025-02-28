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
const { userAuth } = require("../middlewares/auth");

const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");
const { hashPassword } = require("../utils/bcryptPassword");
const { generateJwtToken } = require("../utils/generateJWTtoken");
const config = require("../config/index");

// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});

router.post(
  "/signup",
  [userSignUpValidator, isEmailOrNameRepeat],
  async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;
      const userTable = await dataSource.getRepository("User");
      const passwordHashed = await hashPassword(password);
      const createUser = userTable.create({
        name,
        email,
        password: passwordHashed,
        role,
      });
      const result = await userTable.save(createUser);
      logger.info("新建立的使用者ID:", result.id);
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
      logger.error("創建user錯誤:", err);
      next(err);
    }
  }
);

router.post(
  "/login",
  [userLoginValidator, isUserExist],
  async (req, res, next) => {
    try {
      const token = await generateJwtToken(
        {
          id: req.id,
          role: req.role,
        },
        config.get("secret.jwtSecret"),
        {
          expiresIn: `${config.get("secret.jwtExpiresDay")}`,
        }
      );
      successResponse(
        res,
        {
          token,
          user: {
            name: req.name,
          },
        },
        200
      );
    } catch (err) {
      logger.error("登入錯誤:", err);
      next(err);
    }
  }
);

// 取得個人資料
router.get("/profile", auth, async (req, res, next) => {
  try {
    const { id } = req.user;
    const userTable = dataSource.getRepository("User");
    const user = await userTable.findOne({
      select: ["name", "email"],
      where: { id },
    });
    successResponse(res, {
      user,
    });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/profile",
  [auth, userUpdateProfileValidator, isUpdateSameName, isDBhasSameName],
  async (req, res, next) => {
    try {
      const userTable = dataSource.getRepository("User");

      const updateResult = await userTable.update(
        { id: req.user.id },
        { name: req.body.name }
      );
      if (updateResult.affected === 0) {
        customErrorResponse(req, 400, "更新使用者資料失敗");
        return;
      } else {
        const result = await userTable.findOne({
          select: ["name"],
          where: {
            id: req.user.id,
          },
        });
        successResponse(res, result, 200);
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
