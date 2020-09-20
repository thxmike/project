class BaseSchema {
  constructor(mongoose) {
    this.schema = new mongoose.Schema({
      "name": {
        "type": String,
        "required": true
      },
      "description": {
        "type": String,
        "required": true
      },
      "timestamps": {
        "created": {
          "type": Date,
          "required": true,
          "default": Date.now
        },
        "updated": {
          "type": Date,
          "required": true,
          "default": Date.now
        },
        "deleted": {
          "type": Date,
          "default": null
        }
      },
      "__v": {
        "type": Number,
        "select": false
      }
    });
  }
}
module.exports = BaseSchema;