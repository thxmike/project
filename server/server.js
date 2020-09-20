/*eslint-disable new-cap */
const express = require("express");
const http = require("http");
const body_parser = require("body-parser");
const compression = require("compression");
const ExpressRouteLogger = require("./service/simple-express-logger");
const RootController = require("./controllers/root-controller");
const FileController = require("./controllers/file-controller");
const UserController = require("./controllers/user-controller");
const configuration = require("./configuration.json");
const MongooseSetupService = require("./service/mongoose-setup-service");
const Director = require("./models");


const mongoose_setup_service = new MongooseSetupService(
  Director,
  configuration.mongo.uri,
  configuration.mongo.debug,
  configuration.mongo.db
);

console.log(`Setting up: ${mongoose_setup_service.constructor.name}`);


let { port } = configuration;

let url_encoded_options = {};
//Provides enhanced features for URL encoding

url_encoded_options.extended = true;

let application_root = "/";

const app = express();
//Sets up gzip

app.use(compression());
//This allows the parsing of the URL encoded fields in the body to be parse in the
app.use(body_parser.urlencoded(url_encoded_options));
//Sets up the simple logger Middleware
app.use(ExpressRouteLogger.log);


let root_controller = new RootController(app);

console.log(`Setting up: ${root_controller.constructor.name}`);

let file_controller = new FileController(
  "file",
  app, express.Router(),
  mongoose_setup_service.director.file_model_manager, application_root
);

console.log(`Setting up: ${file_controller.constructor.name}`);

let user_controller = new UserController(
  "user",
  app, express.Router(),
  mongoose_setup_service.director.user_model_manager, application_root
);

console.log(`Setting up: ${user_controller.constructor.name}`);

const server = http.createServer(app);

server.listen(port);

console.log(`The magic happens on port(s) ${port}`);