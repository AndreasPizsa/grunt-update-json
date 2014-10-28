/* global describe, it */
'use strict';

var path = require('path'),
    fs = require('fs'),
    chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    noop = function(){};

function fixture(path){
  return __dirname + '/fixture/' + path;
}

// a real, fake grunt integration test
function fake_grunt(key, callback, task){
  var grunt = require(fixture('grunt/' + key + '.js'))(require('grunt')),
    error;

  grunt.task.init = function(){};
  grunt.fail.warn = grunt.fail.fatal = function(err){ throw new Error(err); };

  grunt.task.options({
    done: function(result){
      callback(error, result);
    },
    error: function(err){
      error = err;
    }
  });
  
  grunt.task.run(task || 'update_json');
  grunt.task.start({asyncDone: true});
  return grunt;
}


function compare_fixtures(grunt, actual, expected){
  actual = grunt.file.read(actual);
  expected = grunt.file.read(expected);
  actual.should.equal(expected);
}


// compare fixture <something>.dest.json to fixture <something>.exp.json
function test_fixture(key){
  return function(done){
    var grunt = fake_grunt(key, function(error){
      compare_fixtures(
        grunt,
        __dirname + '/../.tmp/' + key + '.dest.json',
        fixture('json/' + key + '.exp.json')
      );
      expect(error).to.be.an('undefined');
      done();
    });
  };
}


// expect this to fail
function will_fail(key, msg_pattern){
  return function(done){
    var grunt = fake_grunt(key, function(error){
      expect(error).to.not.be.an('undefined');
      error.message.should.match(msg_pattern);
      done();
    });
  };
}

// the test suite
describe('When configured, the grunt-update-json module SHOULD', function(){
  it('allow a basic `from/to` field copy', test_fixture('basic'));
  it('allow a basic field copy with sorting', test_fixture('sort'));
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
  it('support a basic JSON Path `to: "$.f.r[@.o>m]"`', test_fixture('path'));
  it('support mapping `package.json` to `composer.json`', 
    test_fixture('composer'));
});

describe('When NOT configured, the grunt-update-json module SHOULD', function(){
  var bower = __dirname + '/../bower.json',
    bower_exp = __dirname + '/fixture/json/bower.exp.json',
    component = __dirname + '/../component.json',
    component_exp = __dirname + '/fixture/json/component.exp.json';

  it('support sensible defaults if called WITHOUT a target', function(done){
    var grunt = fake_grunt('default', function(error){
      expect(error).to.be.an('undefined');
      compare_fixtures(grunt, bower, bower_exp);
      compare_fixtures(grunt, component, component_exp);
      grunt.file.delete(bower);
      grunt.file.delete(component);
      done();
    }, ['default']);
  });
  it('support sensible defaults if called WITH a target', function(done){
    var grunt = fake_grunt('default', function(error){
      expect(error).to.be.an('undefined');
      compare_fixtures(grunt, bower, bower_exp);
      grunt.file.delete(bower);
      done();
    }, ['update_json:bower']);
  });
});

// misuse
describe('The grunt-update-json module SHOULD NOT', function(){
  it('proceed with an empty `src`', will_fail('missing', /No data found/));
  it('proceed with a boolean field name', will_fail('bool', /Could not map/));
  it('proceed with a non-json src', will_fail('notjson', /Unable to parse/));
  it('proceed with a non-json dest', will_fail('notjson2', /Unable to parse/));
});
