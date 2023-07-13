const Router = require("express")
const router = new Router()
const accountController = require("#server/controllers/AccountController.js")
const accessCheckMiddleware = require("#server/middleware/AccessCheckMiddleware.js")
const AccessLevel = require("#server/common/AccessLevel.js")


router.get("/accounts", accessCheckMiddleware(AccessLevel.Administrator), accountController.GetAccounts)

module.exports = router