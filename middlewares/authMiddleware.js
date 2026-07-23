const jwt = require('jsonwebtoken')
const User = require('../models/authModel')

const JWT_SECRET = process.env.JWT_SECRET

const protect = async (req, res, next) => {
    try {
        let token

        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({ message: 'not authorized, no token provided' })
        }

        const decoded = jwt.verify(token, JWT_SECRET)

        //on récupère l'utilisateur sans le mot de passe
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(401).json({ message: 'not authorized, user not found' })
        }

        req.user = user
        next()

    } catch (error) {
        return res.status(401).json({ message: 'not authorized, invalid token', error: error.message })
    }
}

module.exports = { protect }