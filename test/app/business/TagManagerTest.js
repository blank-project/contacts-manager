'use strict';

const mongoose = require('mongoose');

var expect = require('chai').expect;
var Tag = require('../../../app/models/Tag');
var Contact = require('../../../app/models/Contact');
var TagManager = require('../../../app/business/TagManager');
var db;

describe('TagManager', function() {

  before(async function() {
    db = await require('../../../config/db')();
  });

  after(function(done) {
    mongoose.connection.close(done);
  });

  afterEach(async function() {
    await Contact.deleteMany({}).exec();
    await Tag.deleteMany({}).exec();
  });

  it('should load', function() {
    expect(TagManager).to.be.a('function');
  });

  it('should be instantiable', function() {
    var sut = new TagManager();
  });

  it('should delete tags AND tags associated with contact', async function() {
    var sut = new TagManager();
    var tag = await new Tag({
      name : 'name',
      color : '#FFFFFF'
    }).save();
    var id = tag._id;
    var data = {
      name : {
        first : 'test',
      },
      tags : [tag._id]
    };
    var contact = await new Contact(data).save();
    var contact2 = await new Contact(data).save();

      await sut.delete(id);

      tag = await Tag.findById(id);
      expect(tag).to.be.null;
      contact = await Contact.findById(contact._id);
      expect(contact.tags).to.not.contain(id);
      contact2 = await Contact.findById(contact2._id);
      expect(contact2.tags).to.not.contain(id);
  });
});
