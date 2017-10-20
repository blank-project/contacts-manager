'use strict';

var expect = require('chai').expect;

var Profile = require('../../../app/models/Profile');

describe('Profile', function() {
  it('should load', function() {
    expect(Profile).to.be.a('function');
  });

  it('should have an ALL constant with value "*"', function() {
    expect(Profile.ALL).to.be.eql('*');
  });

});
