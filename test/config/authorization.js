'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);;

var authorization = require('../../config/authorization');
var User = require('../../app/models/User');


describe('authorization', function() {

  it('should load', function() {
    expect(authorization).to.be.a('object');
  });

  describe('isPermitted', function() {

    var sut = authorization.ensureRequest.isPermitted;

    it('should load', function() {
      expect(sut).to.be.a('function');
    });

  /*  it('should send an HTTP 403 error on non exisiting user, skipping next middlewares.', function() {
      var spy = sinon.spy();
      var roles = [], req = {}, res = {
        sendStatus : spy
      }, next = sinon.spy();

      checkAuthorization(roles, req, res, next)

      expect(res.sendStatus).to.have.been.calledWith(403);
      expect(next).to.not.have.been.called;
    });

    it('should call next middlewares', function() {
        var spy = sinon.spy();
        var roles = ["role1", "role2"];
        var req = {
          // user : user
          user : {
            can : sinon.stub().returns(true)
          }
        }, res = {}
        , next = sinon.spy();

        checkAuthorization(roles, req, res, next);

        expect(req.user.can).to.have.been.calledWith(...roles);
        expect(next).to.have.been.called;
      });*/

  });

  describe('options', function() {

    var sut = authorization.ensureRequest.options;

    it('should load', function() {
      expect(sut).to.be.a('object');
    });

  });

  describe('helpers', function() {

    var sut = authorization.helpers.isPermitted;

    it('should work', function() {
      // sut("role1", "role2", { data : {}});
    });

  });

});



/*
describe('Profile.can', function() {

  var sut;

  beforeEach(() => {
    sut = new Profile();
    sut.roles = ["role1", "role2"];
  })

  it('should be present', function() {
    expect(Profile.prototype.can).to.be.a('function');
  });

  it('should not fail when roles array does not exist', function() {
    sut.roles = null;
    expect(sut.can("role1")).to.be.false;
  });

  it('should return true for a present role', function() {
    expect(sut.can("role1")).to.be.true;
  });

  it('should return true for several present role', function() {
    expect(sut.can("role1", "role2")).to.be.true;
  });

  it('should return true for several present role and one absent role, if the profile has * role', function() {
    sut.roles.push(Profile.ALL);
    expect(sut.can("role1", "role2", "roleA")).to.be.true;
  });

  it('should return false for several present role and one absent role', function() {
    expect(sut.can("role1", "role2", "roleA")).to.be.false;
  });

  it('should return false for an asbent role', function() {
    expect(sut.can("roleA")).to.be.false;
  });

});

*/

/**
* An authorization middleware.

var checkAuthorization = function(roles, req, res, next) {
  var profile = req.user.profile;
  if (profile.can.apply(profile, roles)) {
    next();
    return;
  }
  res.sendStatus(403);
}

module.exports = {
  isAuthorized : function() {
    // Return a middleware by binding the authorization check to the roles passed.
    return checkAuthorization.bind.apply(checkAuthorization, [checkAuthorization].concat(arguments));
  },
  checkAuthorization : checkAuthorization
};

*/
