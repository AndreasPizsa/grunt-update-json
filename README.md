# grunt-update-json ![Travis Build Status](http://img.shields.io/travis/AndreasPizsa/grunt-update-json.svg?style=flat-square "Travis Build Status") ![npm Release](http://img.shields.io/npm/v/grunt-update-json.svg?style=flat-square "npm Release") ![npm License](http://img.shields.io/npm/l/grunt-update-json.svg?style=flat-square "npm License")

Merge parts from one or more JSON files together. I use `grunt-update-json` to keep my `bower.json` and `component.json` in sync with `package.json`.


[![Endorse on Coderwall](http://api.coderwall.com/andreaspizsa/endorsecount.png)](http://coderwall.com/andreaspizsa)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Upgrading from 1.x
The semantics of [Object Groupings](#object-grouping) have been reversed:

- was `{from: "to"}`
- now``{to: "from"}`


## Getting Started

```shell
npm install grunt-update-json --save-dev
```


I highly favor using the fabulous [`load-grunt-tasks`](https://github.com/sindresorhus/load-grunt-tasks) over the tiring and cumbersome `grunt.loadNpmTasks`. Your grunt tasks are all in your `package.json`, so let's embrace [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself):

```shell
npm install load-grunt-tasks --save-dev
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
      // the fields to update, as a String Grouping
      fields: 'name version description repository'
    },
    // update component.json with data from package.json
    // component.json fields are a named a bit differently from
    // package.json, so let's tell update_json how to map names
    component: {
      // reuse the task-level `src`
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
      // again, reuse the task-level `src`
      dest: 'composer.json',
      // the fields in an Array Grouping with some embedded Object Groupings
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
and/or at the `update_json:<target>` level. Target-level `options` override task-level `options`.

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
>
> An input JSON file. May be a list, which will be [`_.merge`d][_merge] together.
[_merge]: http://lodash.com/docs#merge
### Destination Data
> `dest`
>
> An output JSON file.

### Field Groupings
> `fields`
>
> an ordered collection of [_field specifications_](#field-specifications), which
> can optionally contain additional lists of fields.


#### Object Grouping
> `{fields: {field: null, another: "yetanother"}}`
>
> A list of field specs, pointing at any other kind of field specification.


#### Array Grouping
> `{fields: ["field", "another", "still another > yet another"]}`
>
> Create [field copies](#field-copy), or [field renames](#field-rename), of
> each of the listed fields.


#### String Grouping
> `{fields: "field, another, still another > yetanother"}`
>
> Create [field copies](#field-copy), or [field renames](#field-rename), of
> each of the listed fields.

The most concise way to copy/rename a number of fields of simple JSON documents

##### Limitations
- Can't handle fields with `,` or `>` in their names.
- Can't handle most complex [field paths](#field-path).


### Field Specifications
The canonical Object Grouping format is used here: some specifications are not
compatible with some Groupings.

#### Field Copy
> `{field: null}`
>
> Create or replace `field` in `dest` from the value of `field` in `src`.


#### Field Rename
> `{renamed: "original"}` or
> `"original > renamed"` _[String Grouping](#string-grouping) only_
>
> Create or replace `renamed` in `dest` with the value of `original` from `src`.


#### Field Pointer
> `{field: "/some/deep/field"}`
>
> Create or replace `field` in `dest` from `some/deep/field` in `src`.

A field spec destination which starts with `/` will be interepreted as a
[json-pointer](https://github.com/manuelstofer/json-pointer).

To select a field that begins with a literal `/`, escape with a single `\`
(written `\\`):

`{field: "\\/a"}`


### Field Path
> `{field: "$.some.path[(@.with='filters')]"}`
>
>  Create or replace `field` in `dest` with the value of nodes found with a
> JSONPath query

A field spec destination which starts with `$.` will be interpreted as a
[JSONPath](https://github.com/s3u/JSONPath) selector.

To select a field that begins with a literal `$.`, escape with a single `\`
(written `\\`):

`{field: "\\$.a"}`


#### Field Collapse
> `{field: ["first", "second"]}`
>
> Create or replace an array named `field` in `dest` with the values of `first`
> and `second` from `src`.


#### Field Construct
> `{field: {first: "first", second: "second"}}`
>
> Create or merge an object `field` in `dest` with labeled `first` and
> `second` with their respective values from `src`


#### Field Function
> `{field: function(src){ return src.field; }}`
>
> Create a field named `field` that is the output of running a function against
> `src`.

If all else fails, you can supply a function which will called with a copy of
the combined source object.
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
