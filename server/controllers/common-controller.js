const pluralize = require("pluralize");

class CommonController {

  constructor(name, app, router, data_service, application_root = "/") {
    this._router = router;
    this._app = app;
    this._data_service = data_service;
    if (application_root) {
      this._application_root = application_root;
    }

    this._name = name;
    //To deal with names that have dashes
    this._alternate_name = name.replace(/-/g, "_");

    this.setup_aggregate_routes();
    this.setup_instance_routes();
    this.bind_route_to_application();
  }

  bind_route_to_application() {
    this._app.use(this._application_root, this._router);
  }

  get alternate_name() {
    return this._alternate_name;
  }

  get aggregate_route() {
    return `/${pluralize(this._name)}`;
  }

  get instance_route() {
    return `/${this.aggregate_route.substr(1)}/:${this._alternate_name}_id`;
  }

  setup_aggregate_routes() {

    //default aggregate routes
    this._router
      .route(this.aggregate_route)
      .get(this.get_aggregate_request.bind(this))
      .post(this.post_aggregate_request.bind(this));
  }

  setup_instance_routes() {

    //default instance routes
    this._router
      .route(this.instance_route)
      .get(this.get_instance_request.bind(this))
      .post(this.execute_instance_request.bind(this))
      .patch(this.patch_instance_request.bind(this))
      .put(this.put_instance_request.bind(this))
      .delete(this.delete_instance_request.bind(this));
  }

  default_request(req, res) {

    let message = "Not Implemented";

    if (this._message_service) {
      message = this._message_service.not_implemented;
    }

    res.status(400).json({
      message
    });
  }


  //Get All
  get_aggregate_request(req, res) {
    return this.default_request(req, res);
  }

  //Create New
  post_aggregate_request(req, res) {
    return this.default_request(req, res);
  }

  //Get Single Instance
  get_instance_request(req, res) {
    return this.default_request(req, res);
  }

  //Update Instamce
  patch_instance_request(req, res) {
    return this.default_request(req, res);
  }

  //Delete Instance
  delete_instance_request(req, res) {
    return this.default_request(req, res);
  }

  //Replace Instance. Hardly used.
  put_instance_request(req, res) {
    this.default_request(req, res);
  }

  //Execute Instance
  execute_instance_request(req, res) {
    this.default_request(req, res);
  }

}
module.exports = CommonController;