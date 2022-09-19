const express = require('express')
const router = express.Router()
const verifyToken = require('../Middleware/auth')
const listMovieController = require('../Controllers/listMovieController')

router.post('/', verifyToken, listMovieController.postMovie)
router.put('/:id', verifyToken, listMovieController.updateMovie)
router.delete('/:id', verifyToken, listMovieController.deleteMovie)
router.get('/', verifyToken, listMovieController.getMovie)

module.exports = router