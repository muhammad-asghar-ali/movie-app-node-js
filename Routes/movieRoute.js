const express = require('express')
const router = express.Router()
const verifyToken = require('../Middleware/auth')
const movieController = require('../Controllers/movieController')

router.post('/', verifyToken, movieController.createMovie)
router.put('/:id', verifyToken, movieController.updateMovie)
router.delete('/:id', verifyToken, movieController.deleteMovie)
router.get('/find/:id', verifyToken, movieController.findbyIdMovie)
router.get('/', verifyToken, movieController.getAllMovie)
router.get('/random', verifyToken, movieController.getRandom)

module.exports = router