const Project = require('../models/projectModel')


const createProject = async (req , res) => {
    try {
        const project = new Project({
            name : req.body.name,
            description : req.body.description,
        })
        const newProduct = await project.save()
        res.status(201).json(newProduct)
    } catch (error) {
        res.status(400).json({message: "erreur lors de la creation du projet",  error: error.message})
    }
}


module.exports = {createProject}