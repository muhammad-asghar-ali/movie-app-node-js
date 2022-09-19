const List = require('../Models/MovieListModel')

module.exports.postMovie = async(req, res) => {
    try {
        const data = req.body
        const { isAdmin } = res.locals.userInfo
        if (!data.title) {
            return res.status(400).json({ message: "list title is requried" })
        }
        if (isAdmin) {
            const lists = await List.create(data)
            res.status(201).json(lists)
        } else {
            res.status(403).json({ message: "You are not allowed" })
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
            const lists = await List.findByIdAndUpdate(id, { $set: data }, { new: true })
            res.status(200).json(lists)
        } else {
            res.status(403).json({ message: "You are not allowed" })
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
            await List.findByIdAndDelete(id)
            res.status(200).json({ message: "list deleted" })
        } else {
            res.status(403).json({ message: "You are not allowed" })
        }
    } catch (err) {
        res.status(500).json(err.message)
    }
}

module.exports.getMovie = async(req, res) => {
    try {
        const typeQuery = req.query.type
        const genreQuery = req.query.genre
        let list = []

        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    { $match: { type: typeQuery, genre: genreQuery } },
                    { $sample: { size: 10 } },
                ])
            } else {
                list = await List.aggregate([
                    { $match: { type: typeQuery } },
                    { $sample: { size: 10 } },
                ])
            }
        } else {
            list = await List.aggregate([{ $sample: { size: 10 } }])
        }
        res.status(200).json(list)
    } catch (err) {
        res.status(500).json(err.message)
    }
}