const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("AdminCoachController");
const { catchAsync } = require("../utils/catchAsync");
const {
  successResponse,
  customErrorResponse,
} = require("../middlewares/responseHandler");
const CourseBooking = require("../entities/CourseBooking");

const adminCoachCourses = {
  postCourse: catchAsync(async (req, res, next) => {
    const {
      user_id,
      skill_id,
      name,
      description,
      start_at,
      end_at,
      max_participants,
      meeting_url,
    } = req.body;

    const courseTable = await dataSource.getRepository("Course");
    const createCourse = await courseTable.create({
      user_id,
      skill_id,
      name,
      description,
      start_at,
      end_at,
      max_participants,
      meeting_url,
    });
    const saveResult = await courseTable.save(createCourse);
    successResponse(
      res,
      {
        course: {
          id: saveResult.id,
          user_id,
          skill_id,
          name,
          description,
          start_at,
          end_at,
          max_participants,
          meeting_url,
          created_at: saveResult.created_at,
          updated_at: saveResult.updated_at,
        },
      },
      201
    );
  }),
  putCourse: catchAsync(async (req, res, next) => {
    try {
      const courseTable = await dataSource.getRepository("Course");

      const updateResult = await courseTable.update(
        { id: req.params.courseId },
        { ...req.body }
      );
      if (updateResult.affected > 0) {
        successResponse(
          res,
          {
            course: {
              ...req.body,
            },
          },
          200
        );
      } else {
        throw new Error("update-failed");
      }
    } catch (err) {
      if (err.message === "update-failed") {
        customErrorResponse(res, 400, "更新失敗");
        return;
      } else {
        next(err);
      }
    }
  }),
  getCoachCourse: catchAsync(async (req, res, next) => {
    // data need participants from booking table
    const userId = req.user.id; // 教練本身的userId

    const courseTable = dataSource.getRepository("Course");
    const courseLists = await courseTable
      .createQueryBuilder("course")
      .innerJoin("course.user", "user")
      .where("user.id = :id", { id: userId }) // join 教練開的課程
      .leftJoinAndSelect(
        "CourseBooking",
        "booking",
        "course.id = booking.course_id AND booking.cancelled_at IS NULL"
      ) // course id -> booking table
      .select([
        "course.id AS id",
        "course.name AS name",
        "course.max_participants AS max_participants",
        "course.start_at AS start_at",
        "course.end_at AS end_at",
        "COUNT(booking.id) AS participants", // 已註冊所有人數
        `CASE 
        WHEN course.start_at > NOW() THEN '已開放報名'
        WHEN course.start_at <= NOW() AND course.end_at > NOW() THEN '開課中'
        ELSE '已結束'
        END AS status`, // 自行和現在時間計算 判斷是否開課
      ])
      .groupBy("course.id") // 同一課程
      .getRawMany();
    successResponse(res, courseLists, 200);
  }),
  getCoachCourseById: catchAsync(async(req,res,next) => {
    // 教練個人所有課程資料 + 課程id
    const userId = req.user.id; // 教練本身的userId
    const courseId = req.params.courseId

    const courseTable = dataSource.getRepository("Course");
    const courseLists = await courseTable
      .createQueryBuilder("course")
      .innerJoin("course.user", "user")
      .innerJoin("course.coachSkill","skill")
      .where("user.id = :id", { id: userId })
      .andWhere("course.id = :course_id", {course_id: courseId})
      .select([
        "course.id AS id",
        "skill.name AS skill_name",
        "course.name AS name",
        "course.description AS description",
        "course.start_at AS start_at",
        "course.end_at AS end_at",
        "course.max_participants AS max_participants",
      ])
      .getRawMany();
    successResponse(res, courseLists, 200);

  })
};

module.exports = {
  adminCoachCourses,
};
