const { dataSource } = require("../../db/data-source");
const { generateError } = require("../../utils/generateError");
const { IsNull } = require("typeorm");

/**
 * 檢查課程id是有對應到課程
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isCourseIdExist(req, res, next) {
  const courseId = req.params.courseId;
  const existingCourse = await dataSource.getRepository("COURSE").findOne({
    where: [{ id: courseId }],
  });
  if (!existingCourse) {
    next(generateError(400, "課程ID錯誤,無對應課程"));
    return;
  } else {
    next();
  }
}

/**
 * 檢查user是否已經註冊該課程
 * course_booking Table find course_id and user_id
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */

async function isUserAlreadyBooked(req, res, next) {
  const courseId = req.params.courseId;
  const userId = req.user.id; // token parse
  const isExistBookingCourse = await dataSource
    .getRepository("COURSE_BOOKING")
    .findOne({
      where: [{ user_id: userId, course_id: courseId, cancelledAt: IsNull() }],
    });
  if (isExistBookingCourse) {
    next(generateError(400, "用戶已經註冊該課程"));
    return;
  } else {
    next();
  }
}

/**
 * 檢查user是否有剩餘課程堂數可註冊
 * course_purchase表、course_booking表，比較購買數量是否大於註冊數量
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */

async function isUserRemainBookingCredits(req, res, next) {
  // 用戶所有儲值的課程堂數
  const id = req.user.id;
  const userCredits = await dataSource
    .getRepository("CREDIT_PURCHASE")
    .sum("purchased_credits", {
      user_id: id,
    });
  const bookingCourseTable = dataSource.getRepository("COURSE_BOOKING");
  // 用戶已經註冊的堂數
  const userUsedCredits = await bookingCourseTable.count({
    where: {
      user_id: id,
      cancelledAt: IsNull(), // 排除有取消紀錄者(等待上課的)
    },
  });
  if (userCredits < userUsedCredits) {
    next(generateError(400, "已無可使用堂數"));
    return;
  } else {
    next();
  }
}

/**
 * 檢查課程所有註冊量 使否大於課程規定人數
 * course table vs course booking 比較
 * @param {import("express").Request} req - Express Request 物件
 * @param {import("express").Response} res - Express Response 物件
 * @param {import("express").NextFunction} next - Express Next 函式
 * @returns {Promise<void>} - 無回傳值，驗證成功則調用 `next()`，否則傳遞錯誤
 */
async function isOverCourseMaxParticipants(req, res, next) {
  const bookingCourseTable = dataSource.getRepository("COURSE_BOOKING");
  const courseTable = dataSource.getRepository("Course");
  const userId = req.user.id;
  const courseId = req.params.courseId;
  // 該課程所有已登記註冊堂數 course_id
  const courseBookedCounts = await bookingCourseTable.count({
    where: {
      course_id: courseId,
      cancelledAt: IsNull(), // 排除有取消紀錄者(等待上課的)
    },
  });
  const { max_participants } = await courseTable.findOne({
    where: { id: courseId },
    select: ["max_participants"],
  });
  if (courseBookedCounts >= max_participants) {
    next(generateError(400, "課程已達最大上限人數"));
    return;
  } else {
    next();
  }
}

module.exports = {
  isCourseIdExist,
  isUserAlreadyBooked,
  isUserRemainBookingCredits,
  isOverCourseMaxParticipants,
};
