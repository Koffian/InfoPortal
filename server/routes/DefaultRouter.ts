export {};

const Router = require("express")
const router = new Router()
const controller = require("../controllers/DefaultController.ts")

router.get("/", controller.SayHello)

module.exports = router