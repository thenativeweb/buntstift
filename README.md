# buntstift

buntstift makes the CLI colorful.

![buntstift](https://github.com/thenativeweb/buntstift/raw/master/images/logo.jpg "buntstift")

## Installation

```shell
$ npm install buntstift
```

## Quick start

First you need to integrate buntstift into your application.

```javascript
const buntstift = require('buntstift');
```

To write messages to the console use the `success` and `error` functions to show that your application has succeeded or failed. If you want to provide additional information, use the `info` and `verbose` functions. In case of any warnings, use the `warn` function.

```javascript
buntstift.info('Updating...')
buntstift.success('Done.');
```

*Please note that `error` and `warn` write messages to the standard error stream, all other functions write them to the standard output stream.*

Additionally, there is the `passThrough` function that does not do any formatting.

### Formatting messages

You can use the `options` object to change the prefix of the various message writing functions. For that, simply provide a `prefix` property and set it to the desired character.

```javascript
buntstift.error('App stopped.', { prefix: 'X' });
// => X App stopped.
```

## Printing headers

To print a header call the `header` function.

```javascript
buntstift.header('Running tests...');
```

You may change the right pointing character using the `prefix` property in the way described above.

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

If your application performs a long-running task, you may use the `wait` function to show a waiting indicator to the user.

```javascript
const stop = buntstift.wait();

// ...
stop();
```

*Please note that the loading indicator is written to the application's standard error stream.*

If you run the application using the `--quiet` command line switch, or if you run the application in non-interactive mode, no loading indicator will be shown at all.

## Getting user input

Besides the various ways to display information, buntstift is also able to get input from the user. For that, use the `ask`, `confirm` and `select` functions.

### Asking a question

If you want to ask a question to the user, use the `ask` function and provide a `question`:

```javascript
const answer = await buntstift.ask('What do you want to do today?');
```

Optionally, you may specify a regular expression to use as a mask to match the answer against:

```javascript
const answer = await buntstift.ask('What do you want to do today?', /.+/g);
```

Alternatively, you may specify a default value for the answer:

```javascript
const answer = await buntstift.ask('What do you want to do today?', 'coding');
```

If you want to provide both, i.e. a mask and a default value, provide an options object:

```javascript
const answer = await buntstift.ask('What do you want to do today?', {
  mask: /.+/g,
  default: 'coding'
});
```

### Getting a confirmation

If you want to get a conformation from the user, use the `confirm` function and provide a `question`:

```javascript
const isSure = await buntstift.confirm('Are you sure?');
```

Unless specified otherwise, the default answer is `true`. To change this, provide `false` as second parameter:

```javascript
const isSure = await buntstift.confirm('Are you sure?', false);
```

### Selecting from a list

If you want the user to select a value from a list, use the `select` function and provide a `question` as well as a selection of choices:

```javascript
const favoriteColor = await buntstift.select('What is your favorite color?', [
  'red',
  'green',
  'blue'
]);
```

## Shutting down an application

To shutdown an application, call the `exit` function. Optionally, you may specify an exit code; if you don't, `0` is used.

```javascript
buntstift.exit();
```

## Chaining functions

If you want to run a number of actions as a sequence, you can chain all of buntstift's synchronous functions.

```javascript
buntstift.
  error('App failed.').
  exit(1);
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ npx roboter
```

## License

The MIT License (MIT)
Copyright (c) 2015-2018 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
