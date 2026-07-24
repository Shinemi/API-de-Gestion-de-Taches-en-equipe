const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Project description is required'],
            trim: true,
        },
        author: {
            //l'utilisateur qui a créé le projet
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                //les utilisateurs faisant partie du projet 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
)






module.exports = mongoose.model('Projects', projectSchema)