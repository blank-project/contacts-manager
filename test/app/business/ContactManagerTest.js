'use strict';

const expect = require('chai').expect
 , Helper = require('./Helper')
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



      describe("#buildQuery(query.organization)", function() {

        it('should not add query term when query.organization is blank', function() {
            var result = this.sut.buildQuery({
              organization : '  '
            });
            expect(result).to.not.have.property('organization');
        });

        it('should add a RegExp query term when query.organization is provided', function() {
          var result = this.sut.buildQuery({
            organization : 'test'
          });
          expect(result).to.have.property('organization').that.is.a('RegExp');
          expect(result.organization).to.satisfy(sut => sut.test('test'));
          expect(result.organization).to.satisfy(sut => sut.test('TEST'));
          expect(result.organization).to.satisfy(sut => sut.test('testaaa'))
          expect(result.organization).to.not.satisfy(sut => sut.test('tes'));
        });

        it('should add an escaped RegExp query term when query.organization is provided', function() {
          var result = this.sut.buildQuery({
            organization : '.*'
          });
          expect(result).to.have.property('organization').that.is.a('RegExp');
          // Should match as it is escaped
          expect(result.organization).to.satisfy(sut => sut.test('.*'));
          // Would match if not escaped.
          expect(result.organization).to.not.satisfy(sut => sut.test('test'));
        });

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

      /**
       * Clean test DB after each test.
       */
      afterEach(Helper.clear);

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
           var data = await Helper.defaultData();
           tags = data.tags;
           contacts = data.contacts;
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
