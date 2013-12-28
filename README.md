# grunt-update-json

Merge parts from one or more JSON files together. I use `grunt-update-json` to keep my `Bower.json` and `component.json` in sync with `package.json`.


## Getting Started
This plugin requires Grunt `~0.4.2`

### Installing grunt-update-json

```shell
npm install --save-dev grunt-update-json --save-dev
```

> #### Use load-grunt-tasks
> 
I recommend using [load-grunt-tasks](https://github.com/sindresorhus/load-grunt-tasks) to get rid of the cumbersome `grunt.loadNpmTasks` once and forever.

> ```shell
npm install --save-dev load-grunt-tasks
```

>```js
// Gruntfile.js
module.exports = function (grunt) {
    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);
```

## The "update_json" task

### Overview
In your project's Gruntfile, add a section named `update_json` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
update_json: {
	bower: {
		src: 'package.json',
		dest: 'bower.json',
		fields: [
			'name',
			'version',
            'description'     
			'repository'
		]
	},
	component: {
		src: 'package.json',
		dest: 'component.json',
		fields: {
			'name'			: null,
			'repository'	: 'repo',
			'description'	: null,
			'version'		: null,
			'keywords'		: null,
			'main'			: null,
			'dependencies'	: null,
			'development'	: 'devDependencies',
			'license'		: null,
		}
	}
}
});
```


## License

MIT License

Copyright (c) 2013 Andreas Pizsa

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.