var Tag = require('../models/Tag')
, Contact = require('../models/Contact')
, ObjectID = require('mongodb').ObjectID;


module.exports = class TagManager {

  /**
  * Deletes a Tag.
  */
  delete(id) {
    if (typeof id === "string") {
      id = new ObjectID(id);
    }
    return Tag.findByIdAndRemove(id).exec()
    .then(() => {
      return Contact.update({
        // Update contacts with deleted id.
        tags : { _id : id }
      }, {
        $pull : { tags : id }
      }, {
        multi : true
      }).exec();
    });
  }

}
