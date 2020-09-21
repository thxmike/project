const CommonModelManager = require("./common-model-manager");

class UserModelManager extends CommonModelManager {
  set_data(ent, data) {

    super.set_data(ent, data);

    const keys = Object.keys(data);

    for (const key of keys) {
      if (key in ent) {
        ent[key] = data[key];
      }
    }
  }
}
module.exports = UserModelManager;