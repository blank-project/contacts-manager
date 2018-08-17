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

  it('should have an isPermitted method', function() {
    expect(User.prototype.isPermitted).to.be.a('function');

    var sut = new User({ permissions : [ '*' ]});
    expect(sut.isPermitted('action')).to.be.true;

    var sut = new User({ permissions : []});
    expect(sut.isPermitted('action')).to.be.false;
  });

});
