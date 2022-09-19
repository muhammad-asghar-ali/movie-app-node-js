const express = require('express')
const router = express.Router()
const verifyToken = require('../Middleware/auth')
const userController = require('../Controllers/userController')

router.put('/:id', verifyToken, userController.UpdateUser)
router.delete('/:id', verifyToken, userController.DeleteUser)
router.get('/find/:id', verifyToken, userController.GetUser)
router.get('/', verifyToken, userController.getAllahUsers)
router.get('/stats', userController.getStat)

module.exports = router