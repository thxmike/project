const CommonController = require("./common-controller.js");
const BaseController = require("./base-controller");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

class FileController extends CommonController {
  
  setup_aggregate_routes() {
    this._router
      .route(this.aggregate_route)
      .get(this.get_aggregate_request.bind(this))
      //Middleware that binds to a storage location in the mongo database and allows additional operation
      .post(
        this._data_service.upload.single("file"),
        this.post_aggregate_request.bind(this)
      );
  }

  post_aggregate_request(req, res) {
    //TODO: Need to figure out a way to make writes to file and
    // user file meta data run at the same time and if either fail,
    // fail the entire transaction
    let payload = {
      name: req.file.filename,
      description: `${req.file.originalname} uploaded on ${req.file.uploadDate} with a size of ${req.file.size}`,
      path: req.query.path || "/",

      //System User
      user_id: "000000000000000000000000",
    };

    //Attach a User to the file.
    if (this.has_parent) {
      let parts = req.baseUrl.split("/");
      payload.user_id = parts[parts.length - 1];
    }

    this._data_service.file_model_manager
      .post_operation(payload)
      .then((response) => {
        res.status(response.status).json(response.message);
      });
  }

  /* Override. TODO: Goes Directly to GridFS. For now will use Mongoose collection to get files. 
  May introduce at a later time.
  get_aggregate_request(req, res){
   
    this._data_service.gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }
  
      // Files exist
      return res.json(files);
    });
   
  }
  */

  get_aggregate_request(req, res) {
    let filter = this._check_filter(req);

    if (this.has_parent) {
      let parts = req.baseUrl.split("/");
      let parent_id = `${this.parent_controller.alternate_name}_id`;
      let objectid = `${parts[parts.length - 1]}`;
      let item = { [parent_id] :objectid };

      if(mongoose.isValidObjectId(objectid)){
        objectid = ObjectId(objectid);
        item =  { [parent_id]: objectid };
      }
      
      filter = {
        ...filter,
        ...item,
      };
    }
    let count = 0;

    req.query.filter = filter;

    let args = BaseController.parse_query_string_to_args(req);

    this._data_service.file_model_manager
      .get_count(args[2])
      .then((cnt) => {
        count = cnt;
        if ((args[0] - 1) * args[1] > count && args[0] !== 1) {
          return Promise.reject({ code: 404, error: "page not found" });
        }
        return this._data_service.file_model_manager.get_aggregate_operation(...args);
      })
      .then((response) => {
        res.header("count", count);
        this._setup_header(args, res, response);
        res.status(response.status).json(response.message);
      })
      .catch((err) => {
        return this.send_error(
          res,
          req,
          err,
          this.constructor.name,
          "get_aggregate_request"
        );
      });
  }

  get_instance_request(req, res) {

    let id = req.params[`${this.alternate_name}_id`];

    this._data_service.file_model_manager.get_instance_operation_by_id(id).then((response) => {
      res.status(response.status).json(response.message);
    }).catch((err) => {
      return this.send_error(res, req, err, this.constructor.name, "get_instance_request");
    });
  }

  patch_instance_request(req, res) {

    let id = req.params[`${this.alternate_name}_id`];

    this._data_service.file_model_manager.patch_operation(id, req.body).then((response) => {
      res.status(response.status).json(response.message);
    }).catch((err) => {
      return this.send_error(res, req, err, this.constructor.name, "patch_instance_request");
    });
  }

  delete_instance_request(req, res) {

    let id = req.params[`${this.alternate_name}_id`];

    this._data_service.gfs.deleteOne({ _id: id, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
      this._data_service.file_model_manager.delete_operation(id, req.body).then((response) => {
        res.status(response.status).json(response.message);
      }).catch((err) => {
        return this.send_error(res, req, err, this.constructor.name, "delete_instance_request");
      });
    });
  }

  //Get and Update a User
  setup_instance_routes() {
    this._router
      .route(this.instance_route)
      .get(this.get_instance_request.bind(this))
      .patch(this.patch_instance_request.bind(this))
      .delete(this.delete_instance_request.bind(this));
  }
}
module.exports = FileController;
