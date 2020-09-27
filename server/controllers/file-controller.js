const CommonController = require("./common-controller.js");
const BaseController = require("./base-controller");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

class FileController extends CommonController {
  
  setup_aggregate_routes() {
    this._router
      .route(this.aggregate_route)
      .get(this.get_aggregate_request.bind(this))
      //Middleware that uploads to the bound to a storage location in the mongo database and allows additional operation
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
      original_file_id: req.file.id,
      original_file_name: req.file.originalname,
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
  // @Override
  get_aggregate_request(req, res) {

    let filter = this._check_filter(req);

    let path = '/';

    if(filter.path){
      path = filter.path;
      delete filter.path;
    }

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
      //Filter and seperate Folders and Files
      .then((response) => {
        let updated_messages = [];
        if(path){
          const files = response.message.filter((file) => file.path.startsWith(path));
          files.forEach((fileorfold) => {
            //fileorfold.toJSON
            let type = null;
            if(fileorfold.path === path){
              type = "file";
            } else {
              type = "folder";

              delete fileorfold.name;
              delete fileorfold.original_file_name;
              delete fileorfold.description;
            }
          
            if(updated_messages.find((item) => item.type === 'folder' && type === 'folder' && item.path === fileorfold.path )){
              //skip: I already have this folder in the collection
              
            } else {
              let merged_data = {...fileorfold, ...{type: type}};
              updated_messages.push(merged_data);
            }
          });
          response.message = updated_messages;
        } 
        return response;
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

  // @Override
  get_instance_request(req, res) {

    let id = req.params[`${this.alternate_name}_id`];

    this._data_service.file_model_manager.get_instance_operation_by_id(id).then((response) => {
      res.status(response.status).json(response.message);
    }).catch((err) => {
      return this.send_error(res, req, err, this.constructor.name, "get_instance_request");
    });
  }

  // @Override
  patch_instance_request(req, res) {

    let id = req.params[`${this.alternate_name}_id`];

    this._data_service.file_model_manager.patch_operation(id, req.body).then((response) => {
      res.status(response.status).json(response.message);
    }).catch((err) => {
      return this.send_error(res, req, err, this.constructor.name, "patch_instance_request");
    });
  }


  //@Override
  delete_instance_request(req, res) {

    let id = req.params[`${this.alternate_name}_id`];
    
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
    req.query.filter = filter;

    let args = BaseController.parse_query_string_to_args(req);

    if(id !== "0"){
      this.delete_item(id, filter.file_id, req, res);
    } else {
      return this._data_service.file_model_manager.get_aggregate_operation(...args).then((response) => {
        response.message.forEach((record) => {
          this.delete_item(record.original_file_id, record._id, req, res);
        })
      }).then(() => {
        res.status(200).json("completed");
      }).catch(() => {
        res.status(400).send("deletion did not succeed");
      })
    }
  }

  delete_item(original_file_id, file_id, req, res){
    this._data_service.gfs.delete(new mongoose.Types.ObjectId(original_file_id), (err) => {
      if (err) {
        //return res.status(404).json({ err: err });
        //continue to delete the db
      }
      return this._data_service.file_model_manager.delete_operation(new mongoose.Types.ObjectId(file_id), req.body, false).then((response) => {
        res.status(200).send(response);
      }).catch((err) => {
        return this.send_error(res, req, err, this.constructor.name, "delete_instance_request");
      });
    });
  }

  post_instance_request(req, res){
    this._data_service.gfs.files.findOne({ filename: req.params.file_id }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      
      const readstream = this._data_service.gfs.createReadStream(file.filename);
      readstream.pipe(res);
     
    });
  }

  // @Override
  _check_filter(req) {
    let filter = {};

    if (req.query.filter) {
      filter = req.query.filter;
    }

    if (typeof filter === "string") {
      filter = JSON.parse(filter);
    }
    return filter;
  }

  //Get and Update a User
  // @Override
  setup_instance_routes() {
    this._router
      .route(this.instance_route)
      .get(this.get_instance_request.bind(this))
      .patch(this.patch_instance_request.bind(this))
      .post(this.post_instance_request.bind(this))
      .delete(this.delete_instance_request.bind(this));
  }
}
module.exports = FileController;
