const CommonController = require("./common-controller.js");


//This would never occur in real life it is a fake login service.
class LoginController extends CommonController {

  get aggregate_route() {
    return `/${this._name}`;
  }

  //Create a User
  setup_aggregate_routes() {
    this._router
      .route(this.aggregate_route)
      .post(this.post_aggregate_request.bind(this));
  }

  //Get and Update a User
  setup_instance_routes() {
    //NOOP
  }


  post_aggregate_request(req, res){

    let { body } = req; 
    let query = { "email": body.email };
    this._data_service.get_instance_operation_by_query(query).then((response) => {
      if(body.pw === response.message.password){
        res.status(200).send("OK");
      } else {
        res.status(401).send("Access Denied");
      }
    });
  }

}
module.exports = LoginController;