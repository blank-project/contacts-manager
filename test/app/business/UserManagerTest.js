'use strict';

const mongoose = require('mongoose');
const errors = require('passport-local-mongoose').errors;


var expect = require('chai').expect;
var User = require('../../../app/models/User');
var UserManager = require('../../../app/business/UserManager');
var db;

describe('UserManager', function() {

  before(async function() {
    db = await require('../../../config/db')();
  });

  after(function(done) {
    mongoose.connection.close(done);
  });

  afterEach(async function() {
    await User.deleteMany({}).exec();
  });

  it('should load', function() {
    expect(UserManager).to.be.a('function');
  });

  it('should be instantiable', function() {
    new UserManager();
  });

  describe('#create', function() {

    var sut = new UserManager();

    it('should be able to create users', async function() {
      expect(sut.create).to.be.a('function');
    });

    it('should create users', async function() {
      var principal = new User({ permissions : ['user:create']});
      var created = await sut.create({
        username : 'test',
        password : 'test',
        firstname : 'test',
        lastname : 'test'
      }, principal);

      expect(created.meta.disabled).to.be.null;
      var user = await User.findByUsername('test').exec();
      expect(user).to.be.not.null;
    });

    it('should create users disabled when not having right to do so', async function() {
      var created = await sut.create({
        username : 'test',
        password : 'test',
        firstname : 'test',
        lastname : 'test'
      });

      expect(created.meta.disabled).to.be.not.null;
      var user = await User.findByUsername('test').exec();
      expect(user).to.be.null;
    });

    it('should not create users without username', async function() {
      var err = null;
      try {
        await sut.create({});
      } catch(e) {
        err = e;
      }
      expect(err).to.be.an.instanceof(errors.MissingUsernameError);
    });

    // TODO : Current implementation allows duplicated usernames in the following cases :
    // - concurrent transaction.
    // - banned user.
    // We should ensure that it is protected by a unique index.
    it('should not create users with duplicated username', async function() {
      var principal = new User({ permissions : ['user:create']});
      var userData = {
        username : 'test',
        password : 'test',
        firstname : 'test',
        lastname : 'test'
      };
      var err;
      // await sut.create(userData, principal);
      try {
        await Promise.all([
          sut.create(userData, principal),
          sut.create(userData, principal)
        ]);
        // await sut.create(userData, principal);
      } catch (e) {
        err = e;
      }
      expect(err).to.be.an.instanceof(errors.UserExistsError);
    });

  });

});
