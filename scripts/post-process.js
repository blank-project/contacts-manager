// Post processing script of Contacts import
var source = db['contacts-import']
  , target = db.contacts
  , imports = db.imports
  , tags = {}
  , count = 0
  , currentImport = { meta : { date : new Date() }}
  , importId;

importId = imports.insertOne(currentImport).insertedId;
currentImport._id = importId;

// Builds a tag lookup map.
db.tags.find({}).forEach(tag => {
  var id = tag._id;
  tags[tag.name.toLowerCase()] = id;
});

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

  // Lookup Tags
  if (r.tags) {
    var targetTags = [];
    const maxTags = 5;
    for (var i = 0; i < maxTags; i++) {
      if (!r.tags[i]) {
        continue;
      }
      var tagName = r.tags[i];
      tagName = tagName.toLowerCase();
      if (tags[tagName]) {
        targetTags.push(tags[tagName])
      }
    }
    r.tags = targetTags;
  }
  // Set meta fields.
  r.meta = {};
  r.meta.creationDate = new Date();
  r.meta.modificationDate = new Date();
  r.meta.importId = importId;

  // Removes the id from the contacts-import table.
  delete r._id;
  target.save(r);
  count++;
});

currentImport.meta.count = count;
imports.save(currentImport);
