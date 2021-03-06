const BaseSchema = require("./base");

class FileSchema extends BaseSchema {
  constructor(mongoose) {
    super(mongoose);

    /*
     * Comes with the following by default can be removed if desired:
     * name - A name set to the record.
     * description - A description set to the record.
     * timestamp.created - A record created timestamp. Is auto populated if not provided
     * timestamp.updated - A record updated timestamp. Is auto populated if not provided
     * timestamp.deleted - A record deleted timestamp. Used for delete routes for soft deletes
     */

    //name - This will be used for the file name

    this.schema.add({

      //Used for defining folders
      "path": {
        "type": String,
        "required": true
      },
      "original_file_name": {
        "type": String,
        "required": true
      },
      "user_id": {
        "type": mongoose.Schema.Types.ObjectId,
        "required": true,
        "ref": "users"
      },
      "original_file_id":{
        "type": mongoose.Schema.Types.ObjectId,
      },
      "shared_user_ids": {
        "type": [mongoose.Schema.Types.ObjectId],
        "ref": "users"
      }
    });

    return this.schema;
  }
}
module.exports = FileSchema;