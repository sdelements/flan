# tart

A tool to load, save and publish db snapshots

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/tart.svg)](https://npmjs.org/package/tart)
[![Downloads/week](https://img.shields.io/npm/dw/tart.svg)](https://npmjs.org/package/tart)
[![License](https://img.shields.io/npm/l/tart.svg)](https://github.com/sdelements/tart/blob/master/package.json)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g tart
$ tart COMMAND
running command...
$ tart (-v|--version|version)
tart/0.0.0 linux-x64 node-v14.16.0
$ tart --help [COMMAND]
USAGE
  $ tart COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`tart autocomplete [SHELL]`](#tart-autocomplete-shell)
- [`tart hello [FILE]`](#tart-hello-file)
- [`tart help [COMMAND]`](#tart-help-command)

## `tart autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ tart autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ tart autocomplete
  $ tart autocomplete bash
  $ tart autocomplete zsh
  $ tart autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.3.0/src/commands/autocomplete/index.ts)_

## `tart hello [FILE]`

describe the command here

```
USAGE
  $ tart hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ tart hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/sdelements/tart/blob/v0.0.0/src/commands/hello.ts)_

## `tart help [COMMAND]`

display help for tart

```
USAGE
  $ tart help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

<!-- commandsstop -->
