'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

var User = require('../../../app/models/User');
var Profile = require('../../../app/models/Profile');

describe('User', function() {
  it('should load', function() {
    expect(User).to.be.a('function');
  });

  describe('isPermitted', function() {

    it('should have an isPermitted method', function() {
      expect(User.prototype.isPermitted).to.be.a('function');
    });

    it('should allow wildcards', function() {
      var sut = new User({ permissions : [ '*' ]});
      expect(sut.isPermitted('action')).to.be.true;
    });

    it('should not allow no permission', function() {
      var sut = new User({ permissions : []});
      expect(sut.isPermitted('action')).to.be.false;
    });

    it('should allow a specific pemission', function() {
      var sut = new User({ permissions : ['user:create']});
      expect(sut.isPermitted('user:create')).to.be.true;
    });

    it('should allow generalization of permission', function() {
      var sut = new User({ permissions : ['user']});
      expect(sut.isPermitted('user:create')).to.be.true;
    });

  });

  describe('ban', function() {
    it('should have a ban method', function() {
      expect(User.prototype.ban).to.be.a('function');
    });

    it('should allow a form without parameter', function() {
      var sut = new User({ });
      sut.ban();
      expect(sut.meta.disabled).to.be.not.null;
    });

    it('should allow to ban', function() {
      var sut = new User({ });
      sut.ban(true);
      expect(sut.meta.disabled).to.be.not.null;
    });

    it('should allow to unban', function() {
      var sut = new User({ });
      sut.ban(true);
      sut.ban(false);
      expect(sut.meta.disabled).to.be.null;
    });

  });

});
