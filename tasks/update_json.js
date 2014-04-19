/*
 * grunt-update-json
 * https://github.com/andreaspizsa/grunt-update-json
 *
 * Copyright (c) 2013 
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {
  'use strict';
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var _ = require('lodash'),
    pointer = require('json-pointer');

  grunt.registerMultiTask(
    'update_json',
    'Update JSON files with data from other JSON files',
    function(){
      var task = this,
        debug = grunt.verbose.debug,
        warn = grunt.fail.warn,
        exists = grunt.file.exists,
        json = grunt.file.readJSON,
        option = grunt.option;
      
      option.init(grunt.config.data.update_json.options || {});
      
      task.files.forEach(function(file){
        debug(file);
        var fields = task.data.fields,
          output = exists(file.dest) ? json(file.dest) : {},
          input = file.src.filter(function(src) {
              grunt.verbose.debug(src);
              if(grunt.file.exists(src)){ return true; }
              warn('File ' + src + ' not found.');
            }).reduce(function(data, src){
              debug(src);
              return _.merge(data, grunt.file.readJSON(src));
            }, {}),
          copied = {};

        // put fields in canonical (key-value object) form
        // first, break up a single string, if found
        fields = !_.isString(fields) ? fields : fields.split(/\s*,\s*/);

        // then, turn an array of fieldspecs:
        //  ["field", "from>to", {"from": "to"}]
        fields = !_.isArray(fields) ? fields : _.reduce(fields, mergeField, {});

        copied = _.reduce(fields, expandField(input), copied);

        if(output == null) {
          warn('Could not read file ' + file.dest);
        }

        grunt.file.write(
          file.dest,
          JSON.stringify( _.merge(output, copied), null, option('indent'))
        );
      });
    }
  );
  
  // factory for a reduce function, bound to the input, that can get get
  // the value out of 
  function expandField(input){
    return function(memo, fin, fout){
      memo[fout] =
        // field name, interpret as an absolute JSON pointer
        _.isString(fin) ? pointer.get(input, "/" + fin) :
        // call a function
        _.isFunction(fin) ? fin(input) :
        // pick out the values
        _.isArray(fin) ? _.values(_.pick(input, fin)) :
        // build up an object of something else
        _.isObject(fin) ? _.reduce(fin, expandField(input), {}) :
        // copy the value
        _.isNull(fin) ? input[fout] :
        warn('Could not map ' + fin + ' to ' + fout);

      return memo;
    };
  }
  
  // Parse a fieldspec, like ["field", "to<from", {"to": "from"}]
  function mergeField(memo, key){
    var result = {},
      match;

    if(_.isPlainObject(key)){
      result = key;
    }else if(_.isString(key) && (match = key.match(/^(.*?)\s*>\s*(.*?)$/))){
      result[match[2]] = match[1];
    }else{
      result[key] = null;
    }

    return _.merge(memo, result);
  }
};
