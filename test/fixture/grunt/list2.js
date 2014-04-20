'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  "
      },
      list2: {
        src: __dirname + '/../json/list2.src.json',
        dest: __dirname + '/../../../.tmp/list2.dest.json',
        fields: [{a: ["a", "b"]}]
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};