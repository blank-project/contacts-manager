// Post processing script of Contacts import
var source = db['contacts-import']
  , target = db.contacts
  , imports = db.imports
  , count = 0
  , currentImport = { meta : { date : new Date() }}
  , importId;

importId = imports.insertOne(currentImport).insertedId;
currentImport._id = importId;

source.find({}).forEach(r => {
  // Transforms imported objects into arrays.
  if (r.emails && r.emails['0']) {
  	r.emails = [r.emails['0']];
  }
  if (r.phones) {
    phones = [];
    if (r.phones[0]) {
      phones.push(r.phones[0]);
    }
    if (r.phones[1]) {
      phones.push(r.phones[1]);
    }
    r.phones = phones;
  }
  if (r.addresses && r.addresses['0']) {
    r.addresses = [r.addresses['0']];
  }
  // Set meta fields.
  r.meta = {};
  r.meta.creationDate = new Date();
  r.meta.modificationDate = new Date();
  r.meta.importId = importId;
  delete r._id;
  target.save(r);
  count++;
});

currentImport.meta.count = count;
imports.save(currentImport);
