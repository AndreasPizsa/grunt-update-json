'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  "
      },
      bool: {
        src: __dirname + '/../json/bool.src.json',
        dest: __dirname + '/../../../.tmp/bool.dest.json',
        fields: {a: false}
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};