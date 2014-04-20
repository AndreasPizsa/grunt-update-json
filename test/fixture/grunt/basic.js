'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  "
      },
      basic: {
        src: __dirname + '/../json/basic.src.json',
        dest: __dirname + '/../../../.tmp/basic.dest.json',
        fields: ['a']
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};