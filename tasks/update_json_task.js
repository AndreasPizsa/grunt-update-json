/*
 * grunt-update-json
 * https://github.com/andreaspizsa/grunt-update-json
 *
 * Copyright (c) 2013 
 * Licensed under the MIT license.
 */
'use strict';

var _ = require('lodash'),
  updateJSON = require('./lib/update_json'),
  defaultOptions = require('./lib/default_options');

module.exports = function(grunt){
  var register = grunt.registerMultiTask,
    task = function(){
      updateJSON(grunt, this.files, this.data.fields, this.options());
    };

  // handle the degenerate case
  if(!grunt.config.data[updateJSON.taskName]){
    register = grunt.registerTask;
    task = function(target){
      // use default options
      var targets = target ? _.pick(defaultOptions, target) : defaultOptions;
      _.each(targets, function(obj, key){
        updateJSON(grunt, obj.files, obj.fields);
      });
    };
  }
  register(updateJSON.taskName, updateJSON.taskDescription, task);
};
