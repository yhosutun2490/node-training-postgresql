const express = require("express");
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("UsersController");
const catchAsync = require("../utils/catchAsync");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

// bcrycript and JWT
const { hashPassword } = require("../utils/bcryptPassword");
const { generateJwtToken } = require("../utils/generateJWTtoken");

// config
const config = require("../config/index");

const signup = {
  post: catchAsync(async (req, res, next) => {
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
  }),
};

const login = {
  post: catchAsync(async (req, res, next) => {
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
      logger.info("用戶登入成功:", req.name);
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
  }),
};

const profile = {
  get: catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const userTable = dataSource.getRepository("User");
    const user = await userTable.findOne({
      select: ["name", "email"],
      where: { id },
    });
    logger.info("取得個人profile資料成功:", user);
    successResponse(res, { data: user });
  }),
  put: catchAsync(async (req, res, next) => {
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
      logger.info("更新個人profile資料成功:", result);
      successResponse(
        res,
        {
          data: result,
        },
        200
      );
    }
  }),
};

module.exports = {
  signup,
  login,
  profile,
};
