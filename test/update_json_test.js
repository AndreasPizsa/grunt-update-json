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

function will_fail(key){
  return function(done){
    var grunt = fake_grunt(key, null, function(error){
      expect(error).to.not.be.an('undefined');
      console.log("\t", error.message);
      done();
    });
  };
}

describe('The grunt-update-json module SHOULD', function(){
  it('allow a basic `from/to` field copy', test_fixture('basic'));
  it('support a basic `"from, from > to"` field', test_fixture('list3'));
  it('support a pipe notation `["from > to"]`', test_fixture('pipe'));
  it('support a canonical notation `{from/to: null}`', test_fixture('obj'));
  it('support a mix `["from", {from/to: null}]`', test_fixture('list'));
  it('support a list of froms: `[{to: ["from", "from"]}]`', 
    test_fixture('list2'));
  it('support an obj of froms: `{to: {from: null, from: null}`', 
    test_fixture('obj2'));
  it('support a function `to: (src) -> src.from`', test_fixture('func'));
  it('support a basic JSON Pointer `to: "f/r/o/m"`', test_fixture('point'));
  it('support mapping `package.json` to `composer.json`', 
    test_fixture('composer'));
});

describe('The grunt-update-json module SHOULD NOT', function(){
  it('proceed with an empty `src`', will_fail('missing'));
  it('proceed with a boolean field name', will_fail('bool'));
  it('proceed with a non-json src', will_fail('notjson'));
  it('proceed with a non-json dest', will_fail('notjson2'));
});
