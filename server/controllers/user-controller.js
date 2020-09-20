const CommonController = require("./common-controller.js");

class UserController extends CommonController {

  //Create a User
  setup_aggregate_routes() {
    this._router
      .route(this.aggregate_route)
      .post(this.post_aggregate_request.bind(this));
  }


  //Get and Update a User
  setup_instance_routes() {

    this._router
      .route(this.instance_route)
      .get(this.get_instance_request.bind(this))
      .patch(this.patch_instance_request.bind(this));
  }

}
module.exports = UserController;