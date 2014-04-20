'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  "
      },
      obj: {
        src: __dirname + '/../json/obj.src.json',
        dest: __dirname + '/../../../.tmp/obj.dest.json',
        fields: {
          "a": null
        }
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};