const router = require('express').Router()

const signupValidator = require('../validator/auth/signupValidator')

const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController
} = require('../controllers/authController')



router.get('/signup', signupGetController)
router.post('/signup', signupValidator, signupPostController)

router.get('/login', loginGetController)
router.post('/login', loginPostController)

module.exports = router