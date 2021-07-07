# tart

A tool to load, save and publish db snapshots

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/tart.svg)](https://npmjs.org/package/@sdelements/tart)
[![Downloads/week](https://img.shields.io/npm/dw/tart.svg)](https://npmjs.org/package/@sdelements/tart)
[![License](https://img.shields.io/npm/l/tart.svg)](https://github.com/sdelements/tart/blob/master/package.json)

<!-- toc -->

- [tart](#tart)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @sdelements/tart
$ tart COMMAND
running command...
$ tart (-v|--version|version)
@sdelements/tart/0.0.0 linux-x64 node-v14.16.0
$ tart --help [COMMAND]
USAGE
  $ tart COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`tart autocomplete [SHELL]`](#tart-autocomplete-shell)
- [`tart help [COMMAND]`](#tart-help-command)
- [`tart list`](#tart-list)
- [`tart load INPUT`](#tart-load-input)
- [`tart save OUTPUT`](#tart-save-output)

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

## `tart list`

lists available dumps

```
USAGE
  $ tart list

OPTIONS
  -c, --config=config  [default: ./tart.config.json] Path to configuration file

EXAMPLE
  $ tart list
```

_See code: [src/commands/list.ts](https://github.com/sdelements/tart/blob/v0.0.0/src/commands/list.ts)_

## `tart load INPUT`

load database from dump

```
USAGE
  $ tart load INPUT

ARGUMENTS
  INPUT  name of input file

OPTIONS
  -c, --config=config  [default: ./tart.config.json] Path to configuration file

EXAMPLE
  $ tart load myDB
```

_See code: [src/commands/load.ts](https://github.com/sdelements/tart/blob/v0.0.0/src/commands/load.ts)_

## `tart save OUTPUT`

save current database to dump

```
USAGE
  $ tart save OUTPUT

ARGUMENTS
  OUTPUT  name of output file

OPTIONS
  -c, --config=config  [default: ./tart.config.json] Path to configuration file

EXAMPLE
  $ tart save myDB
```

_See code: [src/commands/save.ts](https://github.com/sdelements/tart/blob/v0.0.0/src/commands/save.ts)_

<!-- commandsstop -->
