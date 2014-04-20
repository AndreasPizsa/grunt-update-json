'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  "
      },
      list: {
        src: __dirname + '/../json/list.src.json',
        dest: __dirname + '/../../../.tmp/list.dest.json',
        fields: ['a', {b: null}]
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};