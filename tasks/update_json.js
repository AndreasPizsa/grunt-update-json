/*
 * grunt-update-json
 * https://github.com/andreaspizsa/grunt-update-json
 *
 * Copyright (c) 2013 
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('update_json','Update JSON files with data from other JSON files',function(){
    var _=require('lodash');
    var self = this;

    this.files.forEach(function(file){
      grunt.verbose.debug(file);
      var theSourceData = {};

      file.src.filter(function(filepath) {
        grunt.verbose.debug(filepath);
        var theFileExists = grunt.file.exists(filepath);
        if(!theFileExists) grunt.fail.warn('File ' + filepath + ' not found.');
        return theFileExists;
      }).map(function(filepath){
        grunt.verbose.debug(filepath);
        var theFileData = grunt.file.readJSON(filepath);
        theSourceData = _.merge(theSourceData,theFileData);
      });

      if(!_.isPlainObject(self.data.fields)) {
        theSourceData = _.pick(theSourceData,self.data.fields);
      }
      else {
        theSourceData = _.pick(theSourceData,_.keys(self.data.fields));
        _.forEach(self.data.fields, function(value,key){
          grunt.log.debug(value,key);
          if(value && theSourceData.hasOwnProperty(key)) {
            theSourceData[value] = theSourceData[key];
            delete theSourceData[key];
          }
        });
      }

      var theDest = grunt.file.exists(file.dest) 
            ? grunt.file.readJSON(file.dest)
            : {};
      if(theDest == null) {
        grunt.fail.warn('Could not read file ' + file.dest);
      }

      theDest = _.merge(theDest,theSourceData);
      grunt.file.write(file.dest, JSON.stringify(theDest,null,'\t'));
    });
  })
};
