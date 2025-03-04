const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("UsersController");
const { catchAsync } = require("../utils/catchAsync");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");

// bcrypt and JWT
const { hashPassword } = require("../utils/bcryptPassword");
const { generateJwtToken } = require("../utils/generateJWTtoken");

// config
const config = require("../config/index");
const { generateError } = require("../utils/generateError");

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
    successResponse(res, user);
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
      successResponse(res, result, 200);
    }
  }),
};
const password = {
  put: catchAsync(async (req, res, next) => {
    // update user table password
    // hash password
    const userId = req.user.id;
    const newPassword = req.body.new_password;
    const hashNewPassword = await hashPassword(newPassword);

    // find user table and update
    const userTable = dataSource.getRepository("User");
    try {
      await userTable.update(
        {
          id: userId,
        },
        {
          password: hashNewPassword,
        }
      );
      successResponse(res, null, 200);
    } catch {
      generateError(400, "更新密碼失敗");
    }
  }),
};

const package = {
  get: catchAsync(async (req, res, next) => {
    // get user bought packages
    const userId = req.user.id;
    const purchaseTable = dataSource.getRepository("CreditPurchase");
    const result = await purchaseTable
      .createQueryBuilder("purchase")
      .innerJoin("purchase.creditPackage", "package")
      .where("purchase.user_id = :id", { id: userId }) // user id find user
      .select([
        "purchase.purchased_credits AS purchased_credits",
        "purchase.price_paid AS price_paid ",
        "package.name AS name",
        "purchase.purchase_at",
      ])
      .getRawMany();

    successResponse(res, result, 200);
  }),
};

const course = {
  get: catchAsync(async (req, res, next) => {
    // get users booking course
    // data
    // 1. total credits and used credit
    // 2. course name and coach name
    // User/ Course join get coach name
    const userId = req.user.id;
    const purchaseTable = dataSource.getRepository("CreditPurchase");
    const bookingTable = dataSource.getRepository("CourseBooking");
    const userBookingClass = await bookingTable
      .createQueryBuilder("booking")
      .innerJoin("booking.course", "course")
      .where("booking.user_id = :id", { id: userId })
      .andWhere("booking.cancelled_at is Null")
      .innerJoin("course.user", "user")
      .select([
        "user.name AS coach_name",
        "booking.course_id AS course_id",
        "course.name AS name",
        "course.start_at AS start_at",
        "course.end_at AS end_at",
        "course.meeting_url AS meeting_url",
        "booking.status AS status",
      ])
      .getRawMany();
    // 已預約堂數
    const usedCredits = userBookingClass.length;
    // user 總購買堂數
    const userTotalCredits = await purchaseTable
      .createQueryBuilder("purchase")
      .innerJoin("purchase.user", "user")
      .where("purchase.user_id = :user_id", {user_id: userId})
      .select("SUM(purchase.purchased_credits) AS total_credits")
      .getRawOne();
    successResponse(
      res,
      {
        credit_remain: Number(userTotalCredits.total_credits) - usedCredits,
        credit_usage: usedCredits,
        course_booking: userBookingClass,
      },
      200
    );
  }),
};

module.exports = {
  signup,
  login,
  profile,
  password,
  package,
  course,
};
