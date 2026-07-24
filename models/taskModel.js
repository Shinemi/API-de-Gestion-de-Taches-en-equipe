const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        limitDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['À faire', 'En cours', 'Terminé'],
            default: 'À faire',
        },
        project: {
            //le projet auquel appartient la tache
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Projects',
            required: true,
        },
        assignedTo: {
            //le membre du projet à qui la tache est assignée
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Task', taskSchema)