const BaseSchema = require("./base");

class UserSchema extends BaseSchema {
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

    //name - This will be used for the username


    //Not needed
    this.schema.remove("description");
    this.schema.add({
      "name": {
        "type": String,
        "required": true
      },
      "email": {
        "type": String,
        "required": true
      },
      "password": {
        "type": String,
        "required": true
      }
    });

    return this.schema;
  }
}
module.exports = UserSchema;