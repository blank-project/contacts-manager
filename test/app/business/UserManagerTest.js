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

    it('should have a create function with arity 2', async function() {
      expect(sut.create).to.be.a('function');
      expect(sut.create).to.have.property('length', 2);
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
       await sut.create(userData, principal);
      try {
        await sut.create(userData, principal);
      } catch (e) {
        err = e;
      }
      expect(err).to.be.an.instanceof(errors.UserExistsError);
    });

  });

  describe('#update', function() {
    //mongoose.set('debug', true);
    var sut = new UserManager();

    it('should have an update function with arity 2', async function() {
      expect(sut.update).to.be.a('function');
      expect(sut.update).to.have.property('length', 2);
    });

    it('should be able to update users', async function() {
      // GIVEN An exisiting user.
      const user = await sut.create({
        username : 'test',
        password : 'test',
        firstname : 'test',
        lastname : 'test'
      });
      const id = user.id;

      // WHEN Updating it
      await sut.update(user, {
        id : 1,
        username : 'test1',
        password : 'test1',
        firstname : 'first',
        lastname : 'last',
        email : 'test@test.fr'
      });


      const result = await User.findById(id).exec();
      // THEN user is found (id was not modified)
      expect(result, "User should be found by previous id").to.exist;
      // THEN username is not modified
      expect(result.username, "Username should not be modified even if provided").to.eql('test');
      // THEN password is not modified
      expect(result.password, "Password should not be modified even if provided").to.not.eql('test1');
      // THEN email has been set
      expect(result.email, "Email should have been set").to.eql('test@test.fr');
      // THEN firsname has been set
      expect(result.name.first, "First Name should have been set").to.eql('first');
       // THEN firsname has been set
       expect(result.name.last, "Last Name should have been set").to.eql('last');
    });

  });

  describe('#updatePassword', function() {
    //mongoose.set('debug', true);
    var sut = new UserManager();

    it('should have an updatePassword function with arity 3', async function() {
      expect(sut.updatePassword).to.be.a('function');
      expect(sut.updatePassword).to.have.property('length', 3);
    });

    it('should be able to update password', async function() {
      // GIVEN An exisiting user.
      const user = await sut.create({
        username : 'test',
        password : 'password',
        firstname : 'test',
        lastname : 'test'
      });

      const oldHash = user.password;

      // WHEN Updating it
      const result = await sut.updatePassword(user, 'password', 'newPassword');

      // THEN method returns true
      expect(result).to.be.true;

      const newHash = user.password;
      // THEN password is modified
      expect(newHash, 'Password should be modified').to.be.not.equals(oldHash);
      // THEN password is not stored unencrypted
      expect(newHash, 'Password should be encrypted').to.be.not.equals('newPassword');
    });

    it('should return false when passwords do not match', async function() {
      // GIVEN An exisiting user.
      const user = await sut.create({
        username : 'test',
        password : 'test',
        firstname : 'test',
        lastname : 'test'
      });

      const oldHash = user.password;

      // WHEN Updating it
      const result = await sut.updatePassword(user, 'wrongPassword', 'newPassword');

      // THEN method returns false
      expect(result).to.be.false;

      const newHash = user.password;
      // THEN password is not modified
      expect(newHash, 'Password should not be modified').to.be.equals(oldHash);
    });

  });

});
