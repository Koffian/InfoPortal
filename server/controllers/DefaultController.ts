class DefaultController {
     async SayHello(req : any, res : any){
          try {
               res.send("Info portal working as intended!")
          } 
          catch (e) {
               console.log(e)
          }
     }
}

var controller = new DefaultController()
export { controller }