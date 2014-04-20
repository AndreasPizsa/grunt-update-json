'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  "
      },
      basic: {
        src: __dirname + '/../json/missing.src.json',
        dest: __dirname + '/../../../.tmp/missing.dest.json',
        fields: {
          "a": null
        }
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};