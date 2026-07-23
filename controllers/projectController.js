const Project = require('../models/projectModel')
const User = require('../models/authModel')

//@desc Créer un projet (l'utilisateur connecté devient auteur et premier membre)
//@route POST /api/v1/projects/create
//@access Private

const createProject = async (req, res) => {
    try {
        const { name, description } = req.body

        if (!name || !description) {
            return res.status(400).json({ message: 'please provide a name and a description' })
        }

        const project = new Project({
            name,
            description,
            author: req.user.id,
            members: [req.user.id], //l'auteur est automatiquement membre
        })

        const newProject = await project.save()
        res.status(201).json(newProject)

    } catch (error) {
        res.status(400).json({ message: "erreur lors de la creation du projet", error: error.message })
    }
}


//@desc US5 - Lister les projets auxquels l'utilisateur connecté appartient
//@route GET /api/v1/projects
//@access Private

const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ members: req.user.id })
            .populate('author', 'name email')
            .populate('members', 'name email')

        res.status(200).json(projects)

    } catch (error) {
        res.status(500).json({ message: "erreur lors de la recuperation des projets", error: error.message })
    }
}


//@desc US4 - Inviter un utilisateur enregistré à rejoindre le projet via son email
//@route POST /api/v1/projects/:id/invite
//@access Private (auteur du projet uniquement)

const inviteMember = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: 'please provide the email of the user to invite' })
        }

        const project = await Project.findById(req.params.id)
        if (!project) {
            return res.status(404).json({ message: 'project not found' })
        }

        //seul l'auteur du projet peut inviter de nouveaux membres
        if (project.author.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'only the project author can invite members' })
        }

        //l'utilisateur invité doit être un utilisateur enregistré
        const userToInvite = await User.findOne({ email })
        if (!userToInvite) {
            return res.status(404).json({ message: 'no registered user found with this email' })
        }

        //vérifie que l'utilisateur n'est pas déjà membre
        const alreadyMember = project.members.some(
            (memberId) => memberId.toString() === userToInvite._id.toString()
        )
        if (alreadyMember) {
            return res.status(400).json({ message: 'user is already a member of this project' })
        }

        project.members.push(userToInvite._id)
        await project.save()

        const updatedProject = await Project.findById(project._id)
            .populate('author', 'name email')
            .populate('members', 'name email')

        res.status(200).json({
            message: 'user invited successfully',
            project: updatedProject,
        })

    } catch (error) {
        res.status(500).json({ message: "erreur lors de l'invitation", error: error.message })
    }
}

module.exports = { createProject, getMyProjects, inviteMember }