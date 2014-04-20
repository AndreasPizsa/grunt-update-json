'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  "
      },
      list3: {
        src: __dirname + '/../json/list3.src.json',
        dest: __dirname + '/../../../.tmp/list3.dest.json',
        fields: "a , b > c"
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};