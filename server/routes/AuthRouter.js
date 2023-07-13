const Router = require("express")
const router = new Router()
const controller = require("#server/controllers/AccountController.js")
const registrationMiddleware = require("#server/middleware/RegistrationMiddleware.js")

router.post("/registration", registrationMiddleware, controller.RegisterAccount)
router.get("/login", controller.LogIn)

module.exports = router