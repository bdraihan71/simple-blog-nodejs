const router = require('express').Router()

const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController
} = require('../controllers/authController')

router.get('/signup', signupGetController)
router.post('/signup', signupPostController)

router.get('/login', loginGetController)
router.post('/login', loginPostController)

module.exports = router