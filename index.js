require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const db = require('./db')
const movieRoutes = require('./Routes/movieRoute')
const authRoutes = require('./Routes/authRoutes')
const listMovieRoute = require('./Routes/listMovieRoute')
const userRoutes = require('./Routes/userRoutes')


app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
db.connect()

app.use('/api/movie', movieRoutes)
app.use('/api/movie/list', listMovieRoute)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

const port = process.env.PORT || 3008
app.listen(port, () => {
    console.log(`App is running on port ${port}`)
})