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
- [`flan help [COMMAND]`](#flan-help-command)

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
