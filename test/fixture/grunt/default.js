'use strict';

module.exports = function (grunt) {
  grunt.initConfig({});

  grunt.loadTasks(__dirname + '/../../../tasks');
  grunt.registerTask('default', ['update_json']);

  return grunt;
};