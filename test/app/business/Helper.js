const Contact = require('../../../app/models/Contact')
    , Tag = require('../../../app/models/Tag')

function buildContactData(number, tags) {
  return {
    name : {
      first : 'Contact_' +number,
      last : tags.length + ' Tags'
    },
    organization : 'organization_' + number,
    title : 'title_' + number,
    email : 'email_' + number + '@test.com',
    phone : 'phone_' + number,
    address : {
      street : 'street_' + number,
      city : 'city_' + number,
      code : 'code_' + number,
      country : 'country_' + number,
      number : number,
    },
    tags : tags,
    note : 'note_' + number
  };
};

module.exports = {

  defaultData : async function() {
    // GIVEN 2 tags
    var tags = await Promise.all([
      new Tag({ name : 'Test1', color : '#000000'}).save(),
      new Tag({ name : 'Test2', color : '#FFFFFF'}).save()
    ]);


    var contacts = await Promise.all([
      // GIVEN 1 contact with no tag
      new Contact(buildContactData(0, [])).save(),

      // GIVEN 1 contact with one tag
      new Contact(buildContactData(1, [ tags[0]._id ])).save(),

      // GIVEN 1 contact with two tag
      new Contact(buildContactData(2, [ tags[0]._id, tags[1]._id])).save()
    ]);

    return {
      tags: tags,
      contacts : contacts
    };

  },

  clear : async function() {
    await Promise.all([
      Contact.deleteMany({}).exec(),
      Tag.deleteMany({}).exec()
    ]);
  }

};
