'use strict';

const expect = require('chai').expect
 , Contact = require('../../../app/models/Contact')
 , Tag = require('../../../app/models/Tag')
 , ContactManager = require('../../../app/business/ContactManager')
 , ObjectID = require('mongodb').ObjectID;

var db;

describe('ContactManagerTest', function() {

  /**
   * Set up DB Connection before running the suite.
   */
  before(async function() {
    db = await require('../../../config/db')();
  });

  describe('ContactManager', function() {

    /**
     * Clean test DB after each test.
     */
    afterEach(async function() {
      await Promise.all([
        Contact.deleteMany({}).exec(),
        Tag.deleteMany({}).exec()
      ]);
    });

    it('should load', function() {
      expect(ContactManager).to.be.a('function');
    });

    it('should be instantiable', function() {
      var sut = new ContactManager();
    });

    describe("#buildQuery(query)", function() {

      beforeEach(function() {
        this.sut = new ContactManager();
      });

      it('should exist', function() {
        expect(this.sut.buildQuery).to.be.a('function');
      });

      it('should return an empty object when given an empty object', function() {
          var result = this.sut.buildQuery({});
          expect(result).to.deep.equal({});
      });

      describe("#buildQuery(query.tags)", function() {

        it('should build a proper $all query for the tag property when given one tag as a String', function() {
            var tag = ObjectID().valueOf().toString();
            var result = this.sut.buildQuery({
              tags : tag
            });

            expect(result).to.have.property('tags');
            var tags = result['tags'];
            expect(tags).to.have.property('$all');
            expect(tags['$all']).to.have.lengthOf(1);
            expect(tags['$all'][0].valueOf().toString()).to.be.equal(tag);
        });

        it('should build a proper $all query when given one tag', function() {
          var tag = ObjectID().valueOf().toString();
          var result = this.sut.buildQuery({
            tags : [tag]
          });

          expect(result).to.have.property('tags');
          var tags = result['tags'];
          expect(tags).to.have.property('$all');
          expect(tags['$all']).to.have.lengthOf(1);
          expect(tags['$all'][0].valueOf().toString()).to.be.equal(tag);
        });

        it('should build a proper $all query when given 2 tags', function() {
          var tag1 = ObjectID().valueOf().toString();
          var tag2 = ObjectID().valueOf().toString();

          var result = this.sut.buildQuery({
            tags : [tag1, tag2]
          });

          expect(result).to.have.property('tags');
          var tags = result['tags'];
          expect(tags).to.have.property('$all');
          expect(tags['$all']).to.have.lengthOf(2);
          expect(tags['$all'][0].valueOf().toString()).to.be.equal(tag1);
          expect(tags['$all'][1].valueOf().toString()).to.be.equal(tag2);
        });

      });

    });

    describe("#find(query)", function() {

      beforeEach(function() {
        this.sut = new ContactManager();
      });

      it('should find all objects', async function() {
          var contact = await new Contact({ fullName : "Test 1"}).save();
          var result = this.sut.find({});
          expect(result).to.be.a("Promise");
          result = await result;
          expect(result).to.be.an('array');
          expect(result).to.have.lengthOf(1);
      });

      context('when finding by tags', function() {

        var tags, contacts;

        beforeEach(async function() {
          // GIVEN 2 tags
          tags = await Promise.all([
            new Tag({ name : 'Test1'}).save(),
            new Tag({ name : 'Test2'}).save()
          ]);

          contacts = await Promise.all([
            // GIVEN 1 contact with no tag
            new Contact({ fullName : "No Tags"}).save(),

            // GIVEN 1 contact with one tag
            new Contact({
              fullName : "1 Tag",
              tags : [ tags[0]._id ]
            }).save(),

            // GIVEN 1 contact with two tag
            new Contact({
              fullName : "2 Tag",
              tags : [ tags[0]._id, tags[1]._id]
            }).save()
          ]);

        });

        it('should find objects by tag', async function() {
          var result = this.sut.find({
             tags : tags[0]._id
          });

          expect(result).to.be.a("Promise");
          result = await result;
          expect(result).to.be.an('array');
          expect(result).to.have.lengthOf(2);
        });

        it('should find objects by tags intersection', async function() {
          var result = this.sut.find({
             tags : [ tags[0]._id, tags[1]._id]
          });

          expect(result).to.be.a("Promise");
          result = await result;
          expect(result).to.be.an('array');
          expect(result).to.have.lengthOf(1);
        });

        it('should find objects without tags', async function() {
          var result = this.sut.find({
             tags : []
          });

          expect(result).to.be.a("Promise");
          result = await result;
          expect(result).to.be.an('array');
          expect(result).to.have.lengthOf(1);
        });

      });

    });

  });

});
