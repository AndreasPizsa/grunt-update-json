'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  "
      },
      point: {
        src: __dirname + '/../json/point.src.json',
        dest: __dirname + '/../../../.tmp/point.dest.json',
        fields: {
          a: "a/b/c"
        }
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};