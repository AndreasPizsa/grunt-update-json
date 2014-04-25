/*
 * grunt-update-json
 * https://github.com/andreaspizsa/grunt-update-json
 *
 * Copyright (c) 2013 
 * Licensed under the MIT license.
 */
'use strict';

module.exports = {
  bower: {
    files: [{
      src: ['package.json'],
      dest: 'bower.json'
    }],
    fields: [
      'name', 'version', 'description', 'keywords', 'homepage', 'dependencies',
      {license: '/licenses/0/type'}
    ]
  },
  component: {
    files: [{
      src: ['package.json'],
      dest: 'component.json'
    }],
    fields:[
      'name', 'version', 'description', 'keywords', 'repository > repo',
      {license: '/licenses/0/type'}
    ]
  }
};
