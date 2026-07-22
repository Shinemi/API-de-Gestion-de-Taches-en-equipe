const express = require('express')
const app = express()
const port = 3020
require('dotenv').config()
require('./config/db')

//import des routes
const authRoutes = require('./routes/authRoutes')


app.use(express.json()) //parse les requetes JSON

//monte le routeur sur le chemin de base
app.use('/api/v1/auth', authRoutes)

// url
app.get('/', (req,res) => {
    res.send('API de Gestion de Tâches en Équipe')
})

app.listen(port,() => {
    //ce console log s'affiche uniquement côté serveur et non côté client
    console.log(`Serveur lancé sur http://localhost:${port}`)
})