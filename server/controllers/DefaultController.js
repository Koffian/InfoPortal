class DefaultController {
     async SayHello(req, res){
          try {
               res.send("Info portal working as intended!")
          } 
          catch (e) {
               console.log(e)
          }
     }
}

module.exports = new DefaultController()