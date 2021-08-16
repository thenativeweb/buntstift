# buntstift

buntstift makes the CLI colorful.

![buntstift](https://github.com/thenativeweb/buntstift/raw/main/images/logo.jpg "buntstift")

## Status

| Category         | Status                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| Version          | [![npm](https://img.shields.io/npm/v/buntstift)](https://www.npmjs.com/package/buntstift)              |
| Dependencies     | ![David](https://img.shields.io/david/thenativeweb/buntstift)                                          |
| Dev dependencies | ![David](https://img.shields.io/david/dev/thenativeweb/buntstift)                                      |
| Build            | ![GitHub Actions](https://github.com/thenativeweb/buntstift/workflows/Release/badge.svg?branch=main) |
| License          | ![GitHub](https://img.shields.io/github/license/thenativeweb/buntstift)                                |

## Installation

```shell
$ npm install buntstift
```

## Quick start

First you need to integrate buntstift into your application:

```javascript
const { buntstift } = require('buntstift');
```

If you use TypeScript, use the following code instead:

```typescript
import { buntstift } from 'buntstift';
```

To show messages in the terminal, use the `info` function:

```javascript
buntstift.info('Server started on port 3000.');
```

If you need to highlight messages, use `success`, `error`, and `warn` instead of `info`:

```javascript
buntstift.success('Server started on port 3000.');
buntstift.error('Failed to start server.');
buntstift.warn('Server started, but without IPv6 support.');
```

Finally, there is also `verbose` to show messages meant for debugging or analysing application flow. Please note that by default, these messages are not shown in the terminal, unless you explicitly enable verbose mode:

```javascript
buntstift.verbose('Verifying whether port 3000 is available...');
```

To show messages on the terminal without any support from buntstift, e.g. to pass through some already preformatted output, use the `raw` function:

```javascript
const preformattedOutput = // ...

buntstift.raw(preformattedOutput);
```

By default, `raw` writes to the application's standard output stream. Sometimes you want the message to go to the standard error stream instead. For that, provide an options object and specify `stderr` as the target:

```javascript
buntstift.raw(preformattedOutput, { target: 'stderr' });
```

### Prefixing messages

Except `raw`, all the aforementioned functions are able to show a prefix before the actual message, and some of them do so by default. To explicitly set a prefix, provide an options object and set its `prefix` property to the desired value:

```javascript
buntstift.success('Server started on port 3000.', { prefix: 'OK' });
// => OK Server started on port 3000.
```

### Configuring buntstift

Without any manual configuration, buntstift tries to use reasonable defaults. However, sometimes you may need to change its configuration. For that, first use the `getConfiguration` function to get the current configuration:

```javascript
const configuration = buntstift.getConfiguration();
```

The configuration object now has a number of functions (see section below) to adjust the configuration. E.g., to disable colors, call the `withColorLevel` function and hand over `ColorLevel.Disabled` as parameter:

```javascript
const updatedConfiguration = configuration.withColorLevel(ColorLevel.Disabled);
```

*Please note that all of the functions on the configuration object do not mutate the configuration, but return a new instance instead!*

Finally, set the new configuration using the `configure` function. Typically, because of the configuration object's immutability, you may want to do all of this in a single statement:

```javascript
buntstift.configure(
  buntstift.getConfiguration().
    withColorLevel(ColorLevel.Disabled).
    withUtf8(false)
);
```

#### Setting the colors level

By default, buntstift uses colors to show its messages. To explicitly disable colors or set a specific color level, use the `withColorLevel` function:

```javascript
const updatedConfiguration = configuration.withColorLevel(ColorLevel.Disabled);
const updatedConfiguration = configuration.withColorLevel(ColorLevel.Ansi);
```

See the [`ColorLevel`](./lib/ColorLevel.ts) enum for all possible values.

#### Enabling or disabling interactive sessions

In interactive sessions the spinner is shown in the terminal, while in non-interactive sessions it is hidden. By default, buntstift tries to detect whether a session is interative or not. To explicitly enable or disable interactive sessions, use the `withInteractiveSession` function:

```javascript
const updatedConfiguration = configuration.withInteractiveSession(true);
```

#### Enabling or disabling quiet mode

In quiet mode no messages are written to the terminal any more, except messages written using `error`, `warn`, and `raw`. By default, the quiet mode is disabled. To enable or disable quiet mode, use the `withQuietMode` function:

```javascript
const updatedConfiguration = configuration.withQuietMode(true);
```

#### Enabling or disabling UTF8

By default, buntstift uses some UTF8 instead of simple ASCII characters. To enable or disable UTF8, use the `withUtf8` function:

```javascript
const updatedConfiguration = configuration.withUtf8(true);
```

#### Enabling or disabling verbose mode

In verbose mode, messages written using `verbose` are shown in the terminal, while in non-verbose mode, they are silently skipped. To enable or disable verbose mode, use the `withVerboseMode` function:

```javascript
const updatedConfiguration = configuration.withVerboseMode(true);
```

### Configuring individual messages

From time to time, you may want to change the configuration, but limit the effect of these changes to individual messages. For that, you can pass configuration options when calling buntstift functions. E.g., to disable UTF8 for a single message, use the following code:

```javascript
buntstift.success('Server started on port 3000.', { isUtf8Enabled: false });
```

You may also pass the properties `isColorEnabled`, `isInteractiveSession`, `isQuietModeEnabled`, and `isVerboseModeEnabled`.

### Using lines

To show a line, e.g. to separate two sections, use the `line` function:

```javascript
buntstift.line();
```

### Using headers

To show a header, e.g. to denote the start of a new section, use the `header` function:

```javascript
buntstift.header('Running tests...');
```

You may change the header's prefix using the `prefix` property mentioned above.

### Using empty lines

To show an empty line, use the `newLine` function:

```javascript
buntstift.newLine();
```

## Using lists

To show a list in the terminal use `list` and provide a list item. Optionally, you may specify an indentation level. Setting the indentation level to `0` is equal to omitting it:

```javascript
buntstift.list('foo');
buntstift.list('bar');
buntstift.list('baz', { level: 1 });

// => ∙ foo
//    ∙ bar
//      ∙ baz
```

You may change the list item's bullet using the `prefix` property mentioned above.

### Using tables

From time to time you need to show tabular data in the terminal. For that, use `table` and provide an array of objects to use as rows. The objects all must have the very same properties, i.e. they must match the same interface.

The keys of the row objects are rendered as table header in a human-readable way. The individual cells become padded automatically. Numbers are aligned to the right, anything else is aligned to the left:

```javascript
buntstift.table([
  [{ protocol: 'http', port: 80 }],
  [{ protocol: 'https', port: 443 }]
]);

// => Protocol  Port
//    ────────  ────
//    http        80
//    https      443
```

If you don't want to show the header, additionally provide an options object and set its `showHeader` property to `false`:

```javascript
buntstift.table([
  [{ protocol: 'http', port: 80 }],
  [{ protocol: 'https', port: 443 }]
], { showHeader: false });

// => http    80
//    https  443
```

### Waiting for long-running tasks

If your application performs a long-running task, you may want to show a spinner in the terminal. For that, call the `wait` function, which returns another function to stop the spinner at a later point in time. If you use any buntstift function while the spinner is active, buntstift will take care of disabling and re-enabling the spinner as needed, to avoid flickering:

```javascript
const stop = buntstift.wait();

// ...

stop();
```

*Please note that the spinner is written to the application's standard error stream, not to the standard output stream.*

### Getting user input

Besides the various ways to display information, buntstift is also able to get input from the user. For that, use the `ask`, `confirm` and `select` functions.

#### Asking a question

If you want to ask the user a question, use `ask` and provide a `question`:

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

To ask for a password, provide an options object and set the `echo` property to `false`:

```javascript
const password = await buntstift.ask('Please enter your password:', {
  echo: false
});
```

#### Getting a confirmation

If you want to get a conformation from the user, use `confirm` and provide a `question`:

```javascript
const isSure = await buntstift.confirm('Are you sure?');
```

Unless specified otherwise, the default answer is `true`. To change this, provide `false` as second parameter:

```javascript
const isSure = await buntstift.confirm('Are you sure?', false);
```

#### Selecting from a list

If you want the user to select a value from a list, use `select` and provide a `question` as well as a selection of choices:

```javascript
const favoriteColor = await buntstift.select('What is your favorite color?', [
  'red',
  'green',
  'blue'
]);
```

### Chaining functions

If you want to run a number of buntstift functions as a sequence, you can chain them into a single call (as long as you limit yourself to the synchronous functions):

```javascript
try {
  // ...
} catch (ex) {
  buntstift.
    error('An unexpected error occured.').
    info(ex.message).
    verbose(ex.stack);
}
```

## Running quality assurance

To run quality assurance for this module use [roboter](https://www.npmjs.com/package/roboter):

```shell
$ npx roboter
```
