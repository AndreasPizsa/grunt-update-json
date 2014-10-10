'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    update_json: {
      options: {
        indent: "  ",
        src: __dirname + '/../json/composer.src.json'
      },
      composer: {
        dest: __dirname + '/../../../.tmp/composer.dest.json',
        fields: [
          {
            name: function(src){
              return src.repository.url.match(/([^\/]+\/[^\/]+).git/)[1];
            }
          },
          'description',
          'keywords',
          'homepage',
          {
            license: '/licenses/0/type',
            authors: [{
              name: '/author/name',
              homepage: '/author/url'
            }]
          }
        ]
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../../tasks');
  return grunt;
};