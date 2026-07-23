const express = require('express')
const router = express.Router()
const { createProject, getMyProjects, inviteMember } = require('../controllers/projectController')
const { protect } = require('../middlewares/authMiddleware')
 
router.use(protect)
 
router.post('/create', createProject)
router.get('/', getMyProjects)          // US5
router.post('/:id/invite', inviteMember) // US4
 
module.exports = router