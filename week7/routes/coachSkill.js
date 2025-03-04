const express = require("express");
const router = express.Router();
const logger = require("../utils/logger")("CoachSkill");
const { dataSource } = require("../db/data-source");
const {
  createCoachesSkillValidator,
  deleteSkillValidator,
} = require("../middlewares/coachSkill/validateCoachSkill");
const {
  hasSameSkillName
} = require("../middlewares/coachSkill/index")

const {
  isCoach,
} = require("../middlewares/admin/index");
const {
  coachSkill
} = require("../controllers/coachSkill")
const config = require("../config/index");
const { userAuth } = require("../middlewares/auth");

// userAuth init
const auth = userAuth({
  secret: config.get("secret").jwtSecret,
  repository: dataSource.getRepository("User"),
  logger,
});

router.get("/", auth ,isCoach, coachSkill.get);

router.post("/",auth, isCoach, [createCoachesSkillValidator,hasSameSkillName], coachSkill.post);

router.delete("/:id",auth, isCoach ,deleteSkillValidator, coachSkill.delete);

module.exports = router;
