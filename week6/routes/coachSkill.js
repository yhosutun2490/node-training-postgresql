const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("CoachSkill");
const {
  createCoachesSkillValidator,
  deleteSkillValidator,
} = require("../middlewares/coachSkill/validateCoachSkill");
const {

  successResponse,
  customErrorResponse
} = require("../middlewares/responseHandler");

router.get("/", async (req, res, next) => {
  try {
    const data = await dataSource.getRepository("Coach_Skill").find({
      select: ["id", "name"],
    });
    successResponse(res, data);
  } catch (err) {
    next(err);
  }
});

router.post("/", createCoachesSkillValidator,async (req, res, next) => {
  try {
    // get datasource insert
    const { name } = req.body;
    const skillTable = await dataSource.getRepository("Coach_Skill");

    // 檢核package 名稱
    const hasSameSkillName = await skillTable.findOne({
      where: { name },
    });

    if (!hasSameSkillName) {
      const result = await skillTable.insert({
        name: name,
      });
      const createId = result.identifiers[0]?.id;
      successResponse(res, {
        id: createId,
        name,
      },201);
    } else {
      throw new Error("repeat_name");
    }
  } catch (err) {
     if (err.message == "repeat_name") {
      customErrorResponse(res, 409, "資料重複");
    } else {
      next(err);
    }
  }
});

router.delete("/:id",deleteSkillValidator ,async (req, res, next) => {
  try {
    const targetId = req.params?.id;
    const skillTable = await dataSource.getRepository("Coach_Skill");
    const result = await skillTable.delete({
      id: targetId,
    });

    if (result.affected) {
      successResponse(res, result);
    } else {
      throw new Error("id_not_found");
    }
  } catch (err) {
    if (err.message === "id_not_found") {
      customErrorResponse(res, 400, "ID錯誤");
    }  else {
      next(err);
    }
  }
});

module.exports = router;
