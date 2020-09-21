const pluralize = require("pluralize");

class BaseController {

  constructor(name, app, router, data_service, application_root = "/", parent_controller = null, multer_middle_ware = null) {
    this._router = router;
    this._app = app;
    this._data_service = data_service;
    if (application_root) {
      this._application_root = application_root;
    }
    if (parent_controller) {
      this.parent_controller = parent_controller;
    }
    if(multer_middle_ware){
      this.multer = multer_middle_ware;
    }

    this._name = name;
    //To deal with names that have dashes
    this._alternate_name = name.replace(/-/g, "_");

    this.setup_aggregate_routes();
    this.setup_instance_routes();
    if (parent_controller) {
      this.nest_route();
    } else {
      this.bind_route_to_application();
    }
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

  get has_parent() {
    return Boolean(this.parent_controller);
  }

  get router() {
    return this._router;
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

  nest_route() {
    //you can nest routers by attaching them as middleware:
    if (this.parent_controller) {
      let parent_controller_route = `${this.parent_controller.aggregate_route}/:${
        this.parent_controller.alternate_name
      }_id`;

      this.parent_controller.router.use(parent_controller_route, this.router);
    }
  }

  /*
   * Parses the args in a query string from a request
   * Used in a rest argument (i.e. ...arg)
   * Takes in a request object
   */
  static parse_query_string_to_args(req) {
    let args = [];
    let max = 100;

    if (req.query) {
      if (req.query.page) {
        args[0] = parseInt(req.query.page, 10);
      } else {
        args[0] = 1;
      }
      if (req.query.per_page){// && parseInt(req.query.per_page, 10) <= max) {
        args[1] = parseInt(req.query.per_page, 10);
      } else {
        args[1] = 50;
      }
      if (req.query.filter) {
        let filter = req.query.filter;

        args[2] = filter;
      } else {
        args[2] = {};
      }
      if (req.query.sort) {
        let sort = req.query.sort;

        args[3] = sort;
      } if (req.query.last) {
        let last = req.query.last;

        args[4] = last;
      } else {
        args[3] = {};
      }
    } else {
      args[0] = 0; //page
      args[1] = 50; //per_page
      args[2] = {}; //filter
      args[3] = {}; //sort
      args[4] = false; //last
    }

    return args;
  }

}
module.exports = BaseController;