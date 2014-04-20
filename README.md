# grunt-update-json

Merge parts from one or more JSON files together. I use `grunt-update-json` to keep my `bower.json` and `component.json` in sync with `package.json`.


[![Endorse on Coderwall](http://api.coderwall.com/andreaspizsa/endorsecount.png)](http://coderwall.com/andreaspizsa)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Build Status](https://travis-ci.org/andreaspizsa/grunt-update-json.svg)](https://travis-ci.org/andreaspizsa/grunt-update-json)

## Upgrading from 1.x
The semantics of [Object Groupings](#object-grouping) have been reversed.


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
    // set some task-level options
    options: {
      src: 'package.json',
      indent: '\t'
    },
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
        // to            from
        // -----------   -------------------
        'name'            : null,         // null means 'leave as is'
        'description'     : 'description',// but feel free to type the field name twice
        'repository'      : 'repo',       // rename 'repository' to 'repo'
        'version'         : null,
        'keywords'        : null,
        'main'            : null,
        'dependencies'    : null,
        'development'     : 'devDependencies',
        'license'         : null,
      }
    },
    // `composer` has the same data as `package`, but has some tricky
    // semantics
    composer: {
      src: 'package.json',
      dest: 'composer.json',
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
          license: 'licenses/0/type',
          authors: [{
            name: 'author/name',
            homepage: 'author/url'
          }]
        }
      ]
    }
  }
});
```

## API
### `options`
Like most Grunt tasks, options can be specified at the `update_json` level
and/or at the `update_json:<target>` level, with target-level options being
preferred.

#### `options.indent`
By default, output will not be pretty-printed. Specify a value here to have
indentation applied:
```js
update_json: {options: {indent: "\t"}}
```
or for spaces:
```js
update_json: {options: {indent: "  "}}
```

### Source Data
> `src`
An input JSON file. May be a list.

### Destination Data
> `dest`
An output JSON file. 

### Field Groupings
> `fields`
an ordered collection of [_field specifications_](#field-specifications), which
can optionally contain additional lists of fields.

#### Object Grouping
> `{fields: {field: null, another: "yetanother"}}` 
> A list of field specs, pointing at any other kind of field specification.

#### Array Grouping
> `{fields: ["field", "another", "still another > yet another"]}`
> Create [field copies](#field-copy), or [field renames](#field-rename), of
> each of the listed fields.

#### String Grouping
> `{fields: "field, another, still another > yetanother"}`
> Create [field copies](#field-copy), or [field renames](#field-rename), of
> each of the listed fields.


### Field Specifications

#### Field Copy
> `{field: null}`
> Create or replace `field` in `dest` from the value of `field` in `src`.

#### Field Rename
> `{renamed: "original"}` or `"original > renamed"`
> Create or replace `renamed` in `dest` with the value of `original` from `src`.

#### Field Pointer
> `{field: "some/deep/field"}`
> Create or replace `field` in `dest` from `some.deep.field` in `src`.

Secretly, all non-null specs are eventually passed through 
[json-pointer](https://github.com/manuelstofer/json-pointer), with a `/`
appended (i.e. the root). You can use more complex constructions to build 
complex declarative structures of other fields.

#### Field Collapse
> `{field: ["first", "second"]}`
> Create or replace an array named `field` in `dest` with the values of `first`
> and `second` from `src`.

#### Field Construct
> `{field: {first: "first", second: "second"}}`
> Create or replace an object `field` in `dest` with labeled `first` and
> `second` with their respective values from `src`

#### Function
> `{field: function(src){ return src.field; }}`
> Create a field named `field` that is the output of running a function against
> `src`.

If all else fails, you can supply a function which will get a copy of the
combined source object.
```js
update_json: {
  composer: {
    src: "package.json",
    dest: "composer.json",
    fields: {
      name: function(src){
        // pull username/repo off a github url
        return src.repository.url.match(/([^\/]+\/[^\/]+).git/)[1];
      }
    }
  }
}
```

## Ideas for improvement
- see [enhancements](https://github.com/AndreasPizsa/grunt-update-json/issues?labels=enhancement&page=1&state=open)

## License

MIT

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/AndreasPizsa/grunt-update-json/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
