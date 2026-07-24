const express = require('express')
const router = express.Router()
const { createTask, getProjectTasks, assignTask, updateTaskStatus } = require('../controllers/taskController')
const { protect } = require('../middlewares/authMiddleware')

router.use(protect)

router.post('/:projectId', createTask)          // US6 - créer une tâche dans un projet
router.get('/:projectId', getProjectTasks)       // US9 - lister/filtrer les tâches d'un projet
router.patch('/:id/assign', assignTask)          // US7 - assigner une tâche
router.patch('/:id/status', updateTaskStatus)    // US8 - changer le statut d'une tâche

module.exports = router