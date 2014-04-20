/* global describe, it */
'use strict';

var path = require('path'),
    fs = require('fs'),
    chai = require('chai'),
    should = chai.should(),
    expect = chai.expect;

function fixture(path){
  return __dirname + '/fixture/' + path;
}

function fake_grunt(key, callback, errback){
  var grunt = require(fixture('grunt/' + key + '.js'))(require('grunt'));

  grunt.task.init = function(){};
  grunt.fail.warn = grunt.fail.fatal = function(err){ throw new Error(err); };

  grunt.option("force", true);
  
  grunt.task.options({
    done: callback || function(){},
    error: errback || function(){}
  });
  
  grunt.task.run('update_json');
  grunt.task.start({asyncDone: true});
  return grunt;
}

function test_fixture(key){
  return function(done){
    var grunt = fake_grunt(key, function(error){
      var actual = grunt.file.read(__dirname + '/../.tmp/' + key + '.dest.json'),
        expected = grunt.file.read(fixture('json/' + key + '.exp.json'));
      actual.should.equals(expected);
      done();
    });
  };
}

describe('The grunt-update-json module', function(){
  it('allows a basic `from/to` field copy', test_fixture('basic'));
  it('supports a pipe notation `["from > to"]`', test_fixture('pipe'));
  it('supports a canonical notation `{from: null}`', test_fixture('obj'));
  it('supports a mix `["from", {from/to: null}]`', test_fixture('list'));

  it('complains when a `src` file is missing', function(done){
    var grunt = fake_grunt('missing', null, function(error){
      expect(error).to.not.be.an('undefined');
      done();
    });
  });
});
