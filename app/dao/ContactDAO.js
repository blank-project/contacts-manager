var MongoClient = global.db,
  co = require('co'),
  ObjectID = require('mongodb').ObjectID;


module.exports = {
  list : co.wrap(function*() {
    // Retrieve all contacts.
    return yield db.collection('contacts').find().toArray();
  }),
  load : co.wrap(function*(pId) {
    // Retrieve all contacts.
    return yield db.collection('contacts').findOne({_id : new ObjectID(pId)});
  }),
  save : co.wrap(function*(pItem) {
    // Retrieve all contacts.
    var result = yield db.collection('contacts').insertOne(pItem);

    return result.insertedId;
  })
};
