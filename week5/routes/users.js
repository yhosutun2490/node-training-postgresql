const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("CoachSkill");
const { userSignUpValidator } = require("../validation/user");
const {
  successResponse,
  customErrorResponse,
  serverErrorResponse,
} = require("../middlewares/responseHandler");

router.post("/signup", async (req, res, next) => {
  try {
    const bodyData = req.body;
    userSignUpValidator(bodyData);
    const { name, email, password, role } = bodyData;
    const userTable = await dataSource.getRepository("User");
    const hasSameEmail = await userTable.findOne({
      where: { email },
    });
    if (hasSameEmail) {
      throw new Error("repeat_email");
    }
    const createUser = userTable.create({
      name,
      email,
      password,
      role,
    });
    const result = await userTable.save(createUser);
    successResponse(
      res,
      {
        user: {
          id: result.id,
          name
        },
      },
      201
    );
  } catch (err) {
    if (err.name === "ZodError") {
      const zodErr = err.issues.map((item) => item.message);
      customErrorResponse(res, 400, zodErr);
    } else if (err.message === "repeat_email") {
      customErrorResponse(res, 409, "Email已被使用");
    } else {
      console.log("err錯誤", err);
      serverErrorResponse(res);
    }
  }
});

module.exports = router;
