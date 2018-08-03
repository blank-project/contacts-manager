'use strict';

var expect = require('chai').expect;

var Contact = require('../../../app/models/Contact');

describe('Contact', function() {
  it('should load', function() {
    expect(Contact).to.be.a('function');
  });
});
