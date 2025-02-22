// 總路由器
const express = require('express')
const router = express.Router()

// router module
const creditPackageRoute = require('./creditPackage')
const coachSkillRoute = require('./coachSkill')
const usersRoute = require('./users')
const userAdminCoachRoute = require('./adminCoach')
const coachesRoute = require('./coaches')

// 總路由器 
router.use('/api/credit-package',creditPackageRoute)
router.use('/api/coaches/skill',coachSkillRoute)
router.use('/api/users',usersRoute)
router.use('/api/admin/coaches',userAdminCoachRoute)
router.use('/api/coaches',coachesRoute)

module.exports = router