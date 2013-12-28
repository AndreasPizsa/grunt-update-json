# grunt-update-json

Merge parts from one or more JSON files together. I use `grunt-update-json` to keep my `bower.json` and `component.json` in sync with `package.json`.


[![Endorse on Coderwall](http://api.coderwall.com/andreaspizsa/endorsecount.png)](http://coderwall.com/andreaspizsa)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Getting Started

```shell
npm install --save-dev grunt-update-json --save-dev
```


I highly favor using the fabulous [`load-grunt-tasks`](https://github.com/sindresorhus/load-grunt-tasks) over the tiring and cumbersome `grunt.loadNpmTasks`. Your grunt tasks are all in your `package.json`, so let's embrace [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself):

```shell
npm install --save-dev load-grunt-tasks
```

```js
// Gruntfile.js
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt); // load all grunt tasks. Done!
```

## Using the `update_json` task

In your awesome project's Gruntfile, add a section named `update_json`:

```js
// Gruntfile.js
grunt.initConfig({
  update_json: {
  // update bower.json with data from package.json
    bower: {
      src: 'package.json',    // where to read from
      dest: 'bower.json',     // where to write to
      fields: [               // the fields to update
        'name',
        'version',
        'description'     
        'repository'
      ]
    },
    // update component.json with data from package.json
    // component.json fields are a named a bit differently from
    // package.json, so let's tell update_json how to map names
	component: {
      src:  'package.json',        // where to read from
      dest: 'component.json',      // where to write to
      fields: {                    // the fields to update
        // notice how this time we're passing a hash instead
        // of an array; this allows us to map the field names.
        // We still specify all the names we want, and additionally
        // we also specify the target name in the detination file. 
        // from          to
        // -----------   -------------------
        'name'            : null,         // null means 'leave as is'
        'description'     : 'description',// but feel free to type the field name twice
        'repository'      : 'repo',       // rename 'repository' to 'repo'
        'version'         : null,
        'keywords'        : null,
        'main'            : null,
        'dependencies'    : null,
        'devDependencies' : 'development',
        'license'         : null,
      }
    }
  }
});
```

## Ideas for improvement
- allow `fields` to be a simple string such as `'name'` or `'name,version,description'`
- allow strings and hashes in `fields`, eg `['name','version',{'repository':'repo'}]`
- allow smarter strings `['name','version','repository > repo']`
- ...and then make a compact version of that: `'name,version,repository > repo'`
```js
// Gruntfile.js
grunt.initConfig({
  update_json: {
    bower: {
      src   : 'package.json',
      dest  : 'bower.json',
      fields: 'name,version,description,repository'
    },
    component: {
      src   : 'package.json',
      dest  : 'component.json',
      fields: 'name,version,description,repository > repo,devDependencies > development'
    }
  }
});
```
- see [enhancements](https://github.com/AndreasPizsa/grunt-update-json/issues?labels=enhancement&page=1&state=open)

## License

MIT

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/AndreasPizsa/grunt-update-json/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
