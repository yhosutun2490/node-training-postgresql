// 總路由器
const express = require('express')
const router = express.Router()

// router module
const creditPackageRoute = require('./creditPackage')
const coachSkillRoute = require('./coachSkill')
const usersRoute = require('./users')
const userAdminRouter = require('./admin')

router.use('/api/credit-package',creditPackageRoute)
router.use('/api/coaches/skill',coachSkillRoute)
router.use('/api/users',usersRoute)
router.use('/api/admin',userAdminRouter)

module.exports = router