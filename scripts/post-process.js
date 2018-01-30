// Post processing script of Contacts import
var source = db['contacts-import']
  , target = db.contacts
  , imports = db.imports
  , tags = {}
  , tagsId = {}
  , count = 0
  , currentImport = { meta : { date : new Date() }}
  , importId
  , phones
  , emails;

const OBJECTID_REGEX = /ObjectId\(([a-f\d]{24})\)/;

importId = imports.insertOne(currentImport).insertedId;
currentImport._id = importId;

// Builds a tag name lookup map and tags id lookup map.
db.tags.find({}).forEach(tag => {
  var id = tag._id;
  tags[tag.name.toLowerCase()] = id;
  tagsId[id.str] = id;
});

source.find({}).forEach(r => {
  // Transforms imported objects into arrays.
  if (r.emails) {
    emails = [];
    if(r.emails['0']) {
      emails.push(r.emails['0']);
    }
    if(r.emails['1']) {
      emails.push(r.emails['1']);
    }
  	r.emails = emails;
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
      // Try and lookup by id.
      var tagId = OBJECTID_REGEX.exec(r.tags[i]);
      if (tagId) {
        // Fetch first matching group.
        tagId = tagId[1];
        if (tagsId[tagId]) {
          targetTags.push(tagsId[tagId]);
          continue;
        }
      }

      // Lookup by name.
      var tagName = r.tags[i].toLowerCase();
      if (tags[tagName]) {
        targetTags.push(tags[tagName]);
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
