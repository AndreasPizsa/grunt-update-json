'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  "
      },
      path: {
        src: __dirname + '/../json/path.src.json',
        dest: __dirname + '/../../../.tmp/path.dest.json',
        fields: {
          a: "$.a.b[?(@.c>1)]",
          b: "\\$.a"
        }
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};