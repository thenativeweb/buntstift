# buntstift

buntstift makes the CLI colorful.

![buntstift](https://github.com/thenativeweb/buntstift/raw/master/images/logo.jpg "buntstift")

## Installation

    $ npm install buntstift

## Quick start

First you need to integrate buntstift into your application.

```javascript
var buntstift = require('buntstift');
```

To write messages to the console use the `success` and `error` functions to show that your application has succeeded or failed. If you want to provide additional information, use the `info` and `verbose` functions. In case of any warnings, use the `warn` function.

```javascript
buntstift.info('Updating...')
buntstift.success('Done.');
```

*Please note that `error` and `warn` write messages to the standard error stream, all other functions write them to the standard output stream.*

### Formatting messages

If you want to use placeholders in the message, embrace them in double curly braces. This way you can access any property of an additional `options` object.

```javascript
buntstift.info('App {{name}} started.', {
  name: 'foo'
});
```

Please note that you can use as many placeholders as you like.

Besides, you can use the `options` object to change the prefix of the various message writing functions. For that, simply provide a `prefix` property and set it to the desired character.

```javascript
buntstift.error('App stopped.', { prefix: 'X' });
// => X App stopped.
```

## Printing blank lines

To print a blank line call the `newLine` function.

```javascript
buntstift.newLine();
```

## Printing lines

To print a line call the `line` function.

```javascript
buntstift.line();
```

## Using lists

To write a list to the console use the `list` function. Optionally, you may specify an indentation level. Setting the indentation level to `0` is equal to omitting it.

```javascript
buntstift.list('foo');
buntstift.list('bar');
buntstift.list('baz', { indent: 1 });

// => ∙ foo
//    ∙ bar
//      ∙ baz
```

You may change the bullet character using the `prefix` property in the way described above.

## Using tables

To write data formatted as a table use the `table` function. Provide the data as an array of arrays. If you want to insert a separator line, provide an empty array.

```javascript
buntstift.table([
  [ 'Key', 'Value' ],
  [],
  [ 'foo', 23 ],
  [ 'bar', 7 ]
]);

// => Key  Value
//    ───  ─────
//    foo     23
//    bar      7
```

The individual cells become padded automatically: Numbers are aligned to the right, anything else is aligned to the left.

## Enabling verbose and quiet mode

By default, only messages written by `success`, `error`, `info` and `warn` are shown on the console. To enable `verbose` as well, provide the `--verbose` command line switch when running the application. Alternatively, you may use its short form, `-v`.

If you want to disable any output except `error` and `warn`, provide the `--quiet` command line switch. Again, you may use its short form, `-q`.

## Enabling and disabling colors

If you run a cli application in non-interactive mode, i.e. scripted, using colors is automatically being disabled. If you want to force usage of colors, provide the `--color` command line switch.

In turn, if you want to force disable colors even when in interactive mode, provide the `--no-color` command line switch.

Alternatively, you may use the `forceColor` and `noColor` functions.

## Disabling UTF characters

If your system does not support UTF characters, disable them using the `--no-utf` command line switch.

Alternatively, you may use the `forceUtf` and `noUtf` functions.

## Waiting for long-running tasks

If your application performs a long-running task, you may use the `waitFor` function to show a waiting indicator to the user.

```javascript
buntstift.waitFor(function (done) {
  // ...
  done();
});
```

*Please note that the loading indicator is written to the application's standard error stream.*

If you run the application using the `--quiet` command line switch, no loading indicator will be shown at all.

## Shutting down an application

To shutdown an application, call the `exit` function. Optionally, you may specify an exit code; if you don't, `0` is used.

```javascript
buntstift.exit();
```

## Chaining functions

If you want to run a number of actions as a sequence, you can chain all of buntstift's synchronous functions.

```javascript
buntstift
  .error('App failed.')
  .exit(1);
```

## Running the build

This module can be built using [Grunt](http://gruntjs.com/). Besides running the tests, this also analyses the code. To run Grunt, go to the folder where you have installed buntstift and run `grunt`. You need to have [grunt-cli](https://github.com/gruntjs/grunt-cli) installed.

    $ grunt

## License

The MIT License (MIT)
Copyright (c) 2015 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
