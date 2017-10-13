'use strict';

var expect = require('chai').expect;

var Contact = require('../../../app/models/Contact');

describe('article', function() {
  it('should load', function() {
    expect(Contact).to.be.a('function');
  });
});
