'use strict';

var expect = require('chai').expect;

var Tag = require('../../../app/models/Tag');

describe('Tag', function() {
  it('should load', function() {
    expect(Tag).to.be.a('function');
  });

  it('should have a default value for color', function() {
    var sut = new Tag();
    expect(sut.color).to.be.eql('#000000');
  });

  it('should have a default text color', function() {
    var sut = new Tag();
    expect(sut.textColor).to.match(/#[fF]{6}/);
  });

  it('should have a default text color', function() {
    var sut = new Tag({
      color : '#EEEEEE'
    });
    expect(sut.textColor).to.be.eql('#000000');
  });
});
