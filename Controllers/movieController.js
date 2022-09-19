const Movie = require('../Models/MovieModel')

module.exports.createMovie = async(req, res) => {
    try {
        const data = req.body
        const { isAdmin } = res.locals.userInfo
        if (data.title) {
            return res.status(400).json({ message: "movie title is missing" })
        }
        if (isAdmin) {
            const moive = await Movie.create(data)
            res.status(201).json(moive)

        } else {
            res.status(403).json({ message: "you are not allowed to create movie." })
        }
    } catch (err) {
        res.status(500).json(err.message)
    }
}

module.exports.updateMovie = async(req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const { isAdmin } = res.locals.userInfo
        if (isAdmin) {
            const moive = await Movie.findByIdAndUpdate(id, { $set: data }, { new: true })
            res.status(200).json(moive)

        } else {
            res.status(403).json({ message: "you are not allowed." })
        }
    } catch (err) {
        res.status(500).json(err.message)
    }
}

module.exports.deleteMovie = async(req, res) => {
    try {
        const { id } = req.params
        const { isAdmin } = res.locals.userInfo
        if (isAdmin) {
            await Movie.findByIdAndDelete(id)
            res.status(200).json({ message: "moive deleted" })

        } else {
            res.status(403).json({ message: "you are not allowed." })
        }
    } catch (err) {
        res.status(500).json(err.message)
    }
}

module.exports.findbyIdMovie = async(req, res) => {
    try {
        const { id } = req.params
        const movie = await Movie.findById(id)
        res.status(200).json(movie)
    } catch (err) {
        res.status(500).json(err.message)
    }
}

module.exports.getAllMovie = async(req, res) => {
    try {
        const { isAdmin } = res.locals.userInfo
        if (isAdmin) {
            const movies = await Movie.find()
            res.status(200).json(movies.reverse())

        } else {
            res.status(403).json("you are not allowed.")
        }
    } catch (err) {
        res.status(500).json(err.message)
    }
}

module.exports.getRandom = async(req, res) => {
    try {
        const type = req.query.type
        let movie
        if (type === 'series') {
            movie = await Movie.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } }
            ])
        } else {
            movie = await Movie.aggregate([
                { $match: { isSeries: false } },
                { $sample: { size: 1 } }
            ])
        }
        res.status(200).json(movie)
    } catch (err) {
        res.status(500).json(err.message)
    }
}