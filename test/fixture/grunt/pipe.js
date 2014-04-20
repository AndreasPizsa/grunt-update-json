'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  "
      },
      pipe: {
        src: __dirname + '/../json/pipe.src.json',
        dest: __dirname + '/../../../.tmp/pipe.dest.json',
        fields: ['a > b']
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};