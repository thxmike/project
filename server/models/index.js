const FileModelManager = require("./managers/file-model-manager");
const UserModelManager = require("./managers/user-model-manager");

const FileSchema = require("./schemas/file");
const UserSchema = require("./schemas/user");

class Director {

  constructor(mongoose) {

    this.mongoose = mongoose;

    const schemas = this.setup_schemas();

    this._managers = this.setup_managers(schemas);
  }

  get director() {
    return {
      "file_model_manager": this._file_model_manager,
      "user_model_manager": this._user_model_manager
    };
  }

  setup_schemas() {

    const file_schema = new FileSchema(this.mongoose);
    const user_schema = new UserSchema(this.mongoose);

    return {
      file_schema,
      user_schema
    };
  }

  setup_managers (schemas) {

    this._file_model_manager = new FileModelManager(
      this.mongoose,
      this.mongoose.model("file", schemas.file_schema)
    );
    this._user_model_manager = new UserModelManager(
      this.mongoose,
      this.mongoose.model("user", schemas.user_schema)
    );
  }
}

module.exports = Director;