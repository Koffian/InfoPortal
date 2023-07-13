const Router = require("express")
const router = new Router()
const controller = require("#server/controllers/DefaultController.js")

router.get("/", controller.SayHello)

module.exports = router