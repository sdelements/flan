<p align="center">
  <img width="360" height="166" src="https://user-images.githubusercontent.com/1066160/126935125-b1f14451-4bdd-4dad-a283-9b20c4f668d3.png" alt="flan">
</p>

<p align="center">
  <b >A tasty tool that lets you save, load and share postgres snapshots with ease.</b>
</p>

<p align="center">
  <a href="https://oclif.io"><img src="https://img.shields.io/badge/cli-oclif-brightgreen.svg" alt="oclif"></a>
  <a href="https://npmjs.org/package/@sdelements/flan"><img src="https://img.shields.io/npm/v/@sdelements/flan.svg" alt="Version"></a>
  <a href="https://npmjs.org/package/@sdelements/flan"><img src="https://img.shields.io/npm/dw/@sdelements/flan.svg" alt="Downloads/week"></a>
  <a href="https://github.com/sdelements/flan/blob/master/package.json"><img src="https://img.shields.io/npm/l/@sdelements/flan.svg" alt="License"></a>
</p>

# Usage

```sh-session
$ npm install -g @sdelements/flan

$ flan init
running setup...

$ flan save mydb@1.0.0
saving...

$ flan load mydb@1.0.0
loading...

$ flan publish mydb@1.0.0
publishing...

$ flan available
available snapshots...

$ flan (-v|--version|version)
@sdelements/flan/0.1.0-alpha.0 darwin-x64 node-v14.16.1

$ flan --help [COMMAND]
USAGE
  $ flan COMMAND
...
```

# How it works

Under the hood flan is a convenient wrapper for `pgdump` and `pgrestore`. It uses parallel jobs by default to ensure dumping/restoring your database is quick.

Sharing database dumps is achieved by leveraging `git`. Essentially you push a tag to a repository of your choosing (defined in `flan.config.js`) and others can then pull it with `flan fetch`. We chose to use git because it fits well with our internal tooling and process but we understand it may not be the best solution for you. Pull requests are welcome if you're interested in using S3/Azure/etc as a store 🙂

> :warning: **WARNING**: Please don't use flan in situations where you can't afford data loss.

# Commands

<!-- commands -->

- [`flan autocomplete [SHELL]`](#flan-autocomplete-shell)
- [`flan available`](#flan-available)
- [`flan delete DELETEFILE`](#flan-delete-deletefile)
- [`flan fetch FILE`](#flan-fetch-file)
- [`flan help [COMMAND]`](#flan-help-command)
- [`flan init`](#flan-init)
- [`flan list`](#flan-list)
- [`flan load INPUT`](#flan-load-input)
- [`flan publish FILE`](#flan-publish-file)
- [`flan save OUTPUT`](#flan-save-output)
- [`flan unpublish FILE`](#flan-unpublish-file)

## `flan autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ flan autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ flan autocomplete
  $ flan autocomplete bash
  $ flan autocomplete zsh
  $ flan autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.3.0/src/commands/autocomplete/index.ts)_

## `flan available`

lists available dumps

```
USAGE
  $ flan available

OPTIONS
  -c, --config=config     [default: ./flan.config.json] Path to configuration file
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             [default: tag] property to sort by (prepend '-' for descending)

EXAMPLE
  $ flan available
```

_See code: [src/commands/available.ts](https://github.com/sdelements/flan/blob/v0.1.0-alpha.6/src/commands/available.ts)_

## `flan delete DELETEFILE`

delete a local database dump

```
USAGE
  $ flan delete DELETEFILE

ARGUMENTS
  DELETEFILE  name of file to delete

OPTIONS
  -c, --config=config  [default: ./flan.config.json] Path to configuration file

EXAMPLES
  $ flan delete myDB
  $ flan delete myDB@1.0.0
```

_See code: [src/commands/delete.ts](https://github.com/sdelements/flan/blob/v0.1.0-alpha.6/src/commands/delete.ts)_

## `flan fetch FILE`

fetch specified dump file from a remote repository

```
USAGE
  $ flan fetch FILE

ARGUMENTS
  FILE  name of the file

OPTIONS
  -c, --config=config  [default: ./flan.config.json] Path to configuration file

EXAMPLE
  $ flan fetch filename
```

_See code: [src/commands/fetch.ts](https://github.com/sdelements/flan/blob/v0.1.0-alpha.6/src/commands/fetch.ts)_

## `flan help [COMMAND]`

display help for flan

```
USAGE
  $ flan help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `flan init`

Initializes flan for this project

```
USAGE
  $ flan init

OPTIONS
  -c, --config=config  [default: ./flan.config.json] Path to configuration file
  -y, --yes            Auto confirm directory creating questions

EXAMPLES
  $ flan init
  Config file found at home/flan.config.js

  $ flan init
  A config file will be created, continue? [y/n]

  $ flan init -c /some-folder/flan.config.json
  Config file found at home/flan/some-folder/flan.config.json

  $ flan init -y -c /some-folder/flan.config.json
  Config file found at /home/flan/some-folder/flan.config.json
  The base directory has been created successfully at /home/flan/some-folder/.flan
  The save directory has been created successfully at /home/flan/some-folder/.flan/local
  Git repository initialized at /home/flan/some-folder/.flan/repo
```

_See code: [src/commands/init.ts](https://github.com/sdelements/flan/blob/v0.1.0-alpha.6/src/commands/init.ts)_

## `flan list`

lists available dumps

```
USAGE
  $ flan list

OPTIONS
  -c, --config=config  [default: ./flan.config.json] Path to configuration file

EXAMPLE
  $ flan list
```

_See code: [src/commands/list.ts](https://github.com/sdelements/flan/blob/v0.1.0-alpha.6/src/commands/list.ts)_

## `flan load INPUT`

load database from dump

```
USAGE
  $ flan load INPUT

ARGUMENTS
  INPUT  name of input file

OPTIONS
  -c, --config=config  [default: ./flan.config.json] Path to configuration file

EXAMPLE
  $ flan load myDB
```

_See code: [src/commands/load.ts](https://github.com/sdelements/flan/blob/v0.1.0-alpha.6/src/commands/load.ts)_

## `flan publish FILE`

publish specified dump file to a remote repository

```
USAGE
  $ flan publish FILE

ARGUMENTS
  FILE  name of the file

OPTIONS
  -c, --config=config  [default: ./flan.config.json] Path to configuration file

EXAMPLE
  $ flan publish filename
```

_See code: [src/commands/publish.ts](https://github.com/sdelements/flan/blob/v0.1.0-alpha.6/src/commands/publish.ts)_

## `flan save OUTPUT`

save current database to dump

```
USAGE
  $ flan save OUTPUT

ARGUMENTS
  OUTPUT  name of output file

OPTIONS
  -c, --config=config  [default: ./flan.config.json] Path to configuration file

EXAMPLE
  $ flan save myDB
```

_See code: [src/commands/save.ts](https://github.com/sdelements/flan/blob/v0.1.0-alpha.6/src/commands/save.ts)_

## `flan unpublish FILE`

unpublish specified database dump from a remote repository

```
USAGE
  $ flan unpublish FILE

ARGUMENTS
  FILE  name of the file

OPTIONS
  -c, --config=config  [default: ./flan.config.json] Path to configuration file

EXAMPLE
  $ flan unpublish myDB@1.0.0
```

_See code: [src/commands/unpublish.ts](https://github.com/sdelements/flan/blob/v0.1.0-alpha.6/src/commands/unpublish.ts)_

<!-- commandsstop -->

<hr />

<p align="center">
  From Toronto with love ❤️
</p>

<p align="center">
  👩‍🍳 :pie: 👨‍🍳 :pie: 👩‍🍳 :pie: 👨‍🍳 :pie: 👨‍🍳
  <br />
  <sub>Built by Team Pie</sub>
  <br />
  <sub>Special thanks to <a href="https://github.com/revangel">@revangel</a> for the logo</sub>
</p>
