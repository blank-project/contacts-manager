'use strict';

var expect = require('chai').expect;

var Permissions = require('../../../app/models/Permissions');

describe('Permissions', function() {
  it('should load', function() {
    expect(Permissions.considerSubject).to.be.a('function');
    expect(Permissions.considerPermissions).to.be.a('function');
  });

  describe('Permissions.considerPermissions', function() {

    it('should work as expected', function() {
      var claim = Permissions.considerPermissions('resource1', 'resource2:action');

      expect(claim.isPermitted).to.be.a('function');
      expect(claim.isPermitted('resource1')).to.be.true;
      expect(claim.isPermitted('resource1:action')).to.be.true;
      expect(claim.isPermitted('resource2')).to.be.false;
      expect(claim.isPermitted('resource2:action')).to.be.true;
    });

  });

  describe('Permissions.considerSubject', function() {

    it('should work as expected', function() {
      var claim = Permissions.considerSubject({
        permissions : ['resource1', 'resource2:action']
      });

      expect(claim.isPermitted).to.be.a('function');
      expect(claim.isPermitted('resource1')).to.be.true;
      expect(claim.isPermitted('resource1:action')).to.be.true;
      expect(claim.isPermitted('resource2')).to.be.false;
      expect(claim.isPermitted('resource2:action')).to.be.true;
    });

  });

});
