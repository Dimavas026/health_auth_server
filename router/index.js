const Router = require('express').Router
const userController = require('./../controllers/user-controller')
const router = new Router()
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({
    min: 3,
    max: 32
  }),
  userController.registration)
router.post('/login', userController.login)
router.post('/product', userController.login)
router.get('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.patch('/validateAuth', authMiddleware, userController.validateAuth)
// router.get('/getUsers', authMiddleware, userController.getUsers)
router.get('/getRoles', userController.getRoles)
router.get('/getUsers', userController.getUsers)
router.delete('/user/:id', userController.deleteUser)
router.get('/user/:id', userController.getUser)
router.patch('/user/:id/:email/:roles', userController.patchUser)

module.exports = router