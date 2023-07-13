export {};

const Router = require("express")
const router = new Router()
const controller = require("../controllers/AccountController.ts")
const registrationMiddleware = require("../middleware/RegistrationMiddleware.ts")

router.post("/registration", registrationMiddleware, controller.RegisterAccount)
router.get("/login", controller.LogIn)

module.exports = router