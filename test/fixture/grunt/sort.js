'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  ",
        sort: true
      },
      basic: {
        src: __dirname + '/../json/sort.src.json',
        dest: __dirname + '/../../../.tmp/sort.dest.json',
        fields: ['a', 'c']
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};
