'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  "
      },
      obj2: {
        src: __dirname + '/../json/obj2.src.json',
        dest: __dirname + '/../../../.tmp/obj2.dest.json',
        fields: {
          "a": {b: null, c: null}
        }
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};