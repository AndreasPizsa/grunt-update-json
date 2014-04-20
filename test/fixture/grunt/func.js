'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  "
      },
      func: {
        src: __dirname + '/../json/func.src.json',
        dest: __dirname + '/../../../.tmp/func.dest.json',
        fields: {
          a: function(src){ return src.a + src.b; }
        }
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};