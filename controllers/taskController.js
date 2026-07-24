const Task = require('../models/taskModel')
const Project = require('../models/projectModel')

const VALID_STATUSES = ['À faire', 'En cours', 'Terminé']

//vérifie que l'utilisateur fait bien partie du projet, retourne le projet ou null
const getProjectIfMember = async (projectId, userId) => {
    const project = await Project.findById(projectId)
    if (!project) return null

    const isMember = project.members.some((m) => m.toString() === userId.toString())
    if (!isMember) return undefined //undefined = projet trouvé mais accès refusé

    return project
}


//@desc US6 - Créer une tâche associée à un projet
//@route POST /api/v1/tasks/:projectId
//@access Private (membres du projet)

const createTask = async (req, res) => {
    try {
        const { title, dueDate, status } = req.body

        if (!title) {
            return res.status(400).json({ message: 'please provide a title for the task' })
        }

        const project = await getProjectIfMember(req.params.projectId, req.user.id)
        if (project === null) {
            return res.status(404).json({ message: 'project not found' })
        }
        if (project === undefined) {
            return res.status(403).json({ message: 'you must be a member of this project to create a task' })
        }

        if (status && !VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` })
        }

        const task = await Task.create({
            title,
            dueDate,
            status: status || 'À faire',
            project: project._id,
            createdBy: req.user.id,
        })

        res.status(201).json(task)

    } catch (error) {
        res.status(400).json({ message: "erreur lors de la creation de la tache", error: error.message })
    }
}


//@desc US9 - Lister les tâches d'un projet, filtrables par statut et/ou par membre assigné
//@route GET /api/v1/tasks/:projectId?status=...&assignedTo=...
//@access Private (membres du projet)


module.exports = { createTask, getProjectTasks, assignTask, updateTaskStatus }