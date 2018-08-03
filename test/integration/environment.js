'use strict';

const expect = require('chai').expect;
const exec = require('child_process').exec;

 function buildErrorMessage(error, stdout, stderr) {
   var errorMessage = 'No error expected';
   if (error) {
      errorMessage += error.toString();
   }
   errorMessage += '. stdout :\n';
   errorMessage += stdout;
   errorMessage += '. stderr :\n';
   errorMessage += stderr;
   return errorMessage;
}

describe('Environment', function() {

  describe('mongoexport', function() {

    it('should be present', function(done) {
      exec('mongoexport --version', function(error, stdout, stderr) {
          var errorMessage = buildErrorMessage(error, stdout, stderr);
          expect(error, errorMessage).to.be.null;
          done();
      });
    });

  });

  describe('mongoimport', function() {

    it('should be present', function(done) {
      exec('mongoimport --version', function(error, stdout, stderr) {
        var errorMessage = buildErrorMessage(error, stdout, stderr);
        expect(error, errorMessage).to.be.null;
        done();
      });
    });

  });



});
