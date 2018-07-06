'use strict';

const expect = require('chai').expect
    , path = require('path')
    , fs = require('fs-extra')
    , ObjectID = require('mongodb').ObjectID
    , CWD = require('../../../config/config').root
    , TEST_DIR = path.join(__dirname, 'FILES/')
    , Helper = require('./Helper')
    , parse = require('csv-parse/lib/sync')
    , mongoose = require('mongoose');


const ExportManager = require('../../../app/business/ExportManager');


describe('ExportManager', function() {

  after(function(done) {
    fs.remove(TEST_DIR, done);
  })

  after(function(done) {
    mongoose.connection.close(done);
  });

  it('should load', function() {
    expect(ExportManager).to.be.a('function');
  });

  it('should be instantiable', function() {
    var sut = new ExportManager();
  });

  it('should have a default _directory property when constructed with no argument', function() {
    var sut = new ExportManager();
    expect(sut._directory).to.exist;
    expect(sut._directory).to.be.equal(path.join(CWD, 'data', 'downloads/'));
  });

  it('should handle setting the _directory property to an absolute path', function() {
    var sut = new ExportManager(path.join(__dirname, 'test'));
    expect(sut._directory).to.exist;
    expect(sut._directory).to.be.equal(path.join(__dirname, 'test/'));
  });

  it('should handle resolve the _directory property when set to a relative path', function() {
    var sut = new ExportManager('test');
    expect(sut._directory).to.exist;
    expect(sut._directory).to.be.equal(path.join(CWD, 'test/'));
  });

  describe("#generateFileName()", function() {

    beforeEach(function() {
      this.sut = new ExportManager(TEST_DIR);
    });

    it('should generate unique file names', function() {
        // GIVEN

        // WHEN Generating 2 file name
        const filename = this.sut.generateFileName();
        const filename2 = this.sut.generateFileName();

        // THEN They are different.
        expect(path.basename(filename)).to.not.be.equal(path.basename(filename2));
    });

  });

  describe("#generateExport(query)", function() {

    beforeEach(function() {
      this.sut = new ExportManager(TEST_DIR);
    });

    it('should generate an Export', async function() {
        // GIVEN
        var result = this.sut.generateExport({});

        expect(result).to.be.a('Promise');
        result = await result;
        expect(result.path).to.be.a('string');
        await fs.access(result.path, fs.constants.R_OK);

        expect(result.remove).to.be.a('Function');

        await result.remove();
        try {
          await fs.access(result.path, fs.constants.R_OK);
          fail('Should have thrown');
        } catch(e) {
          expect(e.message).to.have.string('ENOENT');
        }
    });
  });

  describe("#generateExport(query) content", function() {

      var data;

      /**
       * Set up DB Connection before running the suite.
       */
      before(async function() {
        await require('../../../config/db')();
        data = await Helper.defaultData();
      });

      beforeEach(function() {
        this.sut = new ExportManager(TEST_DIR);
      });

      /**
       * Clean test DB after each test.
       */
      afterEach(Helper.clear);

      it('should generate an Export', async function() {
          // GIVEN
          var contacts = data.contacts;

          // WHEN Generating export.
          var result = await this.sut.generateExport({});
          var content = fs.readFileSync(result.path, 'UTF-8');

          // THEN 3 Lines
          content = parse(content, {});
          expect(content).to.have.lengthOf(contacts.length);
          // THEN
          for (var i = 0; i < contacts.length; i++) {
            let line = content[i];
            let contact = contacts[i];

            // Number of lines in scripts/fieldsExports.txt
            expect(line).to.have.lengthOf(18);
            expect(line[0]).to.be.equal(contact.name.first);
            expect(line[1]).to.be.equal(contact.name.last);
            expect(line[2]).to.be.equal(contact.emails[0].value);
            expect(line[3]).to.be.equal('');
            expect(line[4]).to.be.equal(contact.phones[0].value);
            expect(line[5]).to.be.equal('');
            expect(line[6]).to.be.equal(contact.organization);
            expect(line[7]).to.be.equal(contact.title);
            expect(line[8]).to.be.equal(contact.addresses[0].number);
            expect(line[9]).to.be.equal(contact.addresses[0].street);
            expect(line[10]).to.be.equal(contact.addresses[0].code);
            expect(line[11]).to.be.equal(contact.addresses[0].city);
            expect(line[12]).to.be.equal(contact.note);
            expect(line[13]).to.be.equal(contact.tags[0] ? 'ObjectId(' + contact.tags[0] + ')' : '');
            expect(line[14]).to.be.equal(contact.tags[1] ? 'ObjectId(' + contact.tags[1] + ')' : '');
            expect(line[15]).to.be.equal(contact.tags[2] ? 'ObjectId(' + contact.tags[2] + ')' : '');
            expect(line[16]).to.be.equal(contact.tags[3] ? 'ObjectId(' + contact.tags[3] + ')' : '');
            expect(line[17]).to.be.equal(contact.tags[4] ? 'ObjectId(' + contact.tags[4] + ')' : '');
          }
      });

  });

});
