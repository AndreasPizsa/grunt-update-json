/*
 * grunt-update-json
 * https://github.com/apizsa/grunt-update-json
 *
 * Copyright (c) 2013 
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    watch: {
      default: {
        files: [
          "Gruntfile.js",
          "test/*.js",
          "test/fixture/**/*.*",
          "tasks/**"
        ],
        tasks: ["default"]
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= mochacov.options.files.all %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['<%= copy.tests.files.0.dest %>']
    },

    // Copy the 
    copy: {
      tests: {
        files: [{
          expand: true,
          cwd: 'test/fixture/json',
          src: ['*.dest.json'],
          dest: '.tmp'
        }]
      }
    },

    // Unit tests with coverage.
    mochacov: {
      unit: {
        options: {
          reporter: 'spec'
        }
      },
      coverage: {
        options: {
          reporter: 'mocha-term-cov-reporter',
          coverage: true
        }
      },
      options: {
        files: 'test/*_test.js',
        ui: 'bdd',
        colors: true
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt);

  // Whenever the 'test' task is run, first clean the 'tmp' dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy', 'mochacov']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
};
