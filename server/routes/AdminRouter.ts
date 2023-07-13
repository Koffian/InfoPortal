export {};

const Router = require("express")
const router = new Router()
const accountController = require("../controllers/AccountController.ts")
const accessCheckMiddleware = require("../middleware/AccessCheckMiddleware.ts")
const AccessLevel = require("../common/AccessLevel.ts")


router.get("/accounts", accessCheckMiddleware(AccessLevel.Administrator), accountController.GetAccounts)

module.exports = router