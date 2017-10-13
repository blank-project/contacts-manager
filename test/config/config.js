'use strict';

var expect = require('chai').expect;

var config = require('../../config/config');

describe('config', function() {
  it('should load TEST env', function() {
    expect(process.env.NODE_ENV).to.eql('test');

    expect(config).to.have.property('db');
  });
});
