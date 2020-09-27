const mongoose = require("mongoose");
const multer = require("multer");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require('gridfs-stream');

//Setup default with native ES6 Promise Library
mongoose.Promise = Promise;

/*
 *Initializes new instance of mongoose, sets up instance, provides reference to instance
 *Wires up the models to the instance
 *Defaults to test database using uri string
 */
class MongooseSetupService {

  constructor(
    ModelDirector, uri = "mongodb://localhost:27017",
    database = "user-file-api",
    debug = false, app_name = "Custom Application", promise = null,
    alternate_mongoose = null
  ) {

    if (alternate_mongoose) {
      this._mongoose = alternate_mongoose;
    } else {
      this._mongoose = mongoose;
    }

    if (database) {
      this.database = database;
    }
    this.debug = debug;
    
    this.uri = `${uri}/${this.database}`;

    this.database_connection = this._mongoose.connection;

    if (promise) {
      this._mongoose.Promise = promise;
    }

    this.app_name = app_name;
    this._director = new ModelDirector(this._mongoose).director;
  
    this.define_options();

    const storage = this.setup_grid_fs_storage();

    this.multi_part = multer({
      storage
    });
    //this.connect(uri, debug);
  }

  define_options() {
    this.options = {
      "keepAlive": 300000,
      "useCreateIndex": true,
      "connectTimeoutMS": 30000,
      //Never stop trying to reconnect
      "reconnectTries": Number.MAX_VALUE,
      //Reconnect every 500ms
      "reconnectInterval": 500,
      "useNewUrlParser": true,
      "appname": this.app_name,
      "dbName": this.database
    };
  }

  get multi_part_uploader() {
    return this.multi_part;
  }

  get grid_fs_bucket() {
    return this.gfs;
  }

  get connection () {
    return this.database_connection;
  }

  connect() {

    this._mongoose.set("debug", this.debug);
    return this._mongoose.connect(this.uri, this.options)
      .then(() => {
        console.log("Mongoose is Ready");
        this.gfs = new mongoose.mongo.GridFSBucket(this.database_connection.db, {
          bucketName: "uploads"
        });
        
        this.listen(this.database_connection);
        return Promise.resolve();
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  get mongoose() {
    return this._mongoose;
  }

  get director() {
    return this._director;
  }

  setup_grid_fs_storage() {
    const storage = new GridFsStorage({
      "url": this.uri,
      "file": (req, file) => {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename = `${buf.toString("hex")}${file.originalname}`;
            const fileInfo = {
              filename,
              "bucketName": "uploads"
            };

            return resolve(fileInfo);
          });
        });
      }
    });

    return storage;
  }

  listen() {

    this.database_connection.on("error", (error) => {
      console.error(`Mongoose connection error: ${error}`);
      this.database_connection.close();
      //this._mongoose.database_connection.close();
    });

    this.database_connection.on("open", () => {
      console.log("Mongoose default connection is open");
    });

    this.database_connection.on("close", () => {
      console.log("Mongoose default connection is closed");
      this.database_connection.close();
      //this._mongoose.database_connection.close();
    });

    this.database_connection.on("connected", () => {
      console.log("Mongoose default connection connected");
    });

    this.database_connection.on("connecting", () => {
      console.log("Mongoose default connection connecting");
    });

    this.database_connection.on("disconnected", () => {
      console.log("Mongoose default connection disconnected");
      this.database_connection.close();
    });

    this.database_connection.on("reconnect", () => {
      console.log("Mongoose default connection reconnected");
    });

    //If the Node process ends, close the Mongoose connection
    process.on("SIGINT", () => {
      this.database_connection.close(() => {
        console.log("Mongoose default connection disconnected through app termination");
        process.exit(0);
      });
    });
  }
}
module.exports = MongooseSetupService;