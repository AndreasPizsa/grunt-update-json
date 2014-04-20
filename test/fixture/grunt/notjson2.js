'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  "
      },
      notjson2: {
        src: __dirname + '/../json/notjson.src.json',
        dest: __dirname + '/../../../.tmp/notjson.dest.json',
        fields: ["a"]
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};