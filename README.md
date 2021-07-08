# tart

A tool to load, save and publish db snapshots

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/tart.svg)](https://npmjs.org/package/@sdelements/tart)
[![Downloads/week](https://img.shields.io/npm/dw/tart.svg)](https://npmjs.org/package/@sdelements/tart)
[![License](https://img.shields.io/npm/l/tart.svg)](https://github.com/sdelements/tart/blob/master/package.json)

<!-- toc -->
* [tart](#tart)
* [Usage](#usage)
* [Commands](#commands)
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
* [`tart autocomplete [SHELL]`](#tart-autocomplete-shell)
* [`tart delete DELETEFILE`](#tart-delete-deletefile)
* [`tart fetch FILE`](#tart-fetch-file)
* [`tart hello [FILE]`](#tart-hello-file)
* [`tart help [COMMAND]`](#tart-help-command)
* [`tart init`](#tart-init)
* [`tart list`](#tart-list)
* [`tart load INPUT`](#tart-load-input)
* [`tart publish FILE`](#tart-publish-file)
* [`tart save OUTPUT`](#tart-save-output)
* [`tart unpublish FILE`](#tart-unpublish-file)

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

## `tart delete DELETEFILE`

delete a local database dump

```
USAGE
  $ tart delete DELETEFILE

ARGUMENTS
  DELETEFILE  name of file to delete

OPTIONS
  -c, --config=config  [default: ./tart.config.json] Path to configuration file

EXAMPLES
  $ tart delete myDB
  $ tart delete myDB@1.0.0
```

_See code: [src/commands/delete.ts](https://github.com/sdelements/tart/blob/v0.0.0/src/commands/delete.ts)_

## `tart fetch FILE`

fetch specified dump file from a remote repository

```
USAGE
  $ tart fetch FILE

ARGUMENTS
  FILE  name of the file

OPTIONS
  -c, --config=config  [default: ./tart.config.json] Path to configuration file

EXAMPLE
  $ tart fetch filename
```

_See code: [src/commands/fetch.ts](https://github.com/sdelements/tart/blob/v0.0.0/src/commands/fetch.ts)_

## `tart hello [FILE]`

describe the command here

```
USAGE
  $ tart hello [FILE]

OPTIONS
  -c, --config=config  [default: ./tart.config.json] Path to configuration file
  -f, --force
  -h, --help           show CLI help
  -n, --name=name      name to print

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

## `tart init`

Initializes tart for this project

```
USAGE
  $ tart init

OPTIONS
  -c, --config=config  [default: ./tart.config.json] Path to configuration file

EXAMPLES
  $ tart init
  Config file found at home/tart.config.js

  $ tart init
  A config file will be created, continue? [y/n]

  $ tart init -c /some-folder/tart.config.json
  Config file found at home/tart/some-folder/tart.config.json
```

_See code: [src/commands/init.ts](https://github.com/sdelements/tart/blob/v0.0.0/src/commands/init.ts)_

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

## `tart publish FILE`

publish specified dump file to a remote repository

```
USAGE
  $ tart publish FILE

ARGUMENTS
  FILE  name of the file

OPTIONS
  -c, --config=config  [default: ./tart.config.json] Path to configuration file

EXAMPLE
  $ tart publish filename
```

_See code: [src/commands/publish.ts](https://github.com/sdelements/tart/blob/v0.0.0/src/commands/publish.ts)_

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

## `tart unpublish FILE`

unpublish specified database dump from a remote repository

```
USAGE
  $ tart unpublish FILE

ARGUMENTS
  FILE  name of the file

OPTIONS
  -c, --config=config  [default: ./tart.config.json] Path to configuration file

EXAMPLE
  $ tart unpublish myDB@1.0.0
```

_See code: [src/commands/unpublish.ts](https://github.com/sdelements/tart/blob/v0.0.0/src/commands/unpublish.ts)_
<!-- commandsstop -->
