/*
 * grunt-update-json
 * https://github.com/andreaspizsa/grunt-update-json
 *
 * Copyright (c) 2013 
 * Licensed under the MIT license.
 */


function UpdateJSON(grunt) {
  'use strict';
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var _ = require('lodash'),
    pointer = require('json-pointer'),
    // avoid the lint demons
    jsonPath = require('JSONPath')["eval".slice()],
    debug = grunt.verbose.debug,
    warn = grunt.fail.warn,
    exists = grunt.file.exists,
    json = grunt.file.readJSON,
    option = grunt.option;
    
  var re = {
    PATH_POINT: /^(\\)?((\$\.|\/)?.*)/,
    DELIM: /\s*,\s*/,
    RENAME: /^(.*?)\s*>\s*(.*?)$/
  };

  grunt.registerMultiTask(
    'update_json',
    'Update JSON files with data from other JSON files',
    function(){
      var task = this;

      option.init(grunt.config.data.update_json.options || {});

      task.files.forEach(function(file){
        var src = file.src;
        if(!src || _.isEmpty(src)){
          src = option("src");
          if(!src || _.isEmpty(src = grunt.file.expand(src))){
            warn('No data found from which to update.');
          }
        }

        var fields = task.data.fields,
          // load the current output, if it exists
          output = exists(file.dest) ? json(file.dest) : {},
          // build up a union object of src files
          input = src.reduce(function(data, src){
              debug(src);
              return _.merge(data, grunt.file.readJSON(src));
            }, {}),
          copied = {};

        // put fields in canonical (key-value object) form
        // first, break up a single string, if found
        if(_.isString(fields)){
          fields = fields.split(re.DELIM);
        }

        // then, turn an array of fieldspecs:
        //  ["field", "from>to", {"from": "to"}]
        if(_.isArray(fields)){
          fields = _.reduce(fields, mergeField, {});
        }

        copied = _.reduce(fields, expandField(input), copied);

        grunt.file.write(
          file.dest,
          JSON.stringify(_.merge(output, copied), null, option('indent')) + '\n'
        );
      });
    }
  );

  // factory for a reduce function, bound to the input, that can get
  // the value out of the input
  function expandField(input){
    var get = pointer(input);

    return function(memo, fin, fout){
      if(_.isString(fin)){
        var match = fin.match(re.PATH_POINT);
        // matched  ...with a `$.`       ...but not with a `\`
        if(match && match[3] === '$.' && !match[1]){
          // field name, starts with an unescaped `$`, treat as JSON Path
          memo[fout] = jsonPath(input, match[2]);
        }else if(match && match[3] === '/' && !match[1]){
          // field name, treat as a JSON pointer
          memo[fout] = get(match[2]);
        }else{
          memo[fout] = input[match[2]];
        }
      }else if(_.isFunction(fin)){
        // call a function
        memo[fout] = fin(input);
      }else if(_.isArray(fin)){
        // pick out the values
        memo[fout] = _.map(fin, function(value){
          return expandField(input)({}, value, "dummy")["dummy"];
        });
      }else if(_.isObject(fin)){
        // build up an object of something else
        memo[fout] = _.reduce(fin, expandField(input), {});
      }else if(_.isNull(fin)){
        // copy the value
        memo[fout] = input[fout];
      }else{
        warn('Could not map `' + JSON.stringify(fin) + '` to `' + 
          JSON.stringify(fout) + '`');
      }
      return memo;
    };
  }

  // Parse a fieldspec, like ["field", "to<from", {"to": "from"}]
  function mergeField(memo, key){
    var result = {},
      match;

    if(_.isPlainObject(key)){
      result = key;
    }else if(_.isString(key) && (match = key.match(re.RENAME))){
      result[match[2]] = match[1];
    }else{
      result[key] = null;
    }

    return _.merge(memo, result);
  }
}

exports = module.exports = UpdateJSON;