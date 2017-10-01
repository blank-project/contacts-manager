// Post processing script of Contacts import
var collection = db['contacts-import'];
collection.find({}).forEach(r => { 
  if (r.emails && r.emails['0']) {
  	r.emails = [r.emails[0]];
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
  r.meta = {};
  r.meta.creationDate = new Date();
  r.meta.modificationDate = new Date();
  collection.save(r);
});

