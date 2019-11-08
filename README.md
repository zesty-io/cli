cli
===

CLI for interacting with Zesty.io services

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli.svg)](https://npmjs.org/package/cli)
[![Downloads/week](https://img.shields.io/npm/dw/cli.svg)](https://npmjs.org/package/cli)
[![License](https://img.shields.io/npm/l/cli.svg)](https://github.com/[object Object]/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Zesty.io CLI](#zestyio-cli)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @zesty-io/cli
$ zesty COMMAND
running command...
$ zesty (-v|--version|version)
@zesty-io/cli/1.0.0 linux-x64 node-v10.16.3
$ zesty --help [COMMAND]
USAGE
  $ zesty COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
- [cli](#cli)
- [Usage](#usage)
- [Commands](#commands)
  - [`zesty auth [ZUID] [EMAIL] [PASS]`](#zesty-auth-zuid-email-pass)
  - [`zesty autocomplete [SHELL]`](#zesty-autocomplete-shell)
  - [`zesty help [COMMAND]`](#zesty-help-command)
  - [`zesty init [FILE]`](#zesty-init-file)
- [Zesty.io CLI](#zestyio-cli)
  - [Specfication](#specfication)
  - [List of Commands](#list-of-commands)
  - [Misc](#misc)

## `zesty auth [ZUID] [EMAIL] [PASS]`

Command for authenticating with a Zesty.io instance

```
USAGE
  $ zesty auth [ZUID] [EMAIL] [PASS]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ zesty auth 8-000-0000 user@example.com strong-password-for-security
```

_See code: [src/commands/auth.ts](https://github.com/zesty-io/cli/blob/v1.0.0/src/commands/auth.ts)_

## `zesty autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ zesty autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ zesty autocomplete
  $ zesty autocomplete bash
  $ zesty autocomplete zsh
  $ zesty autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.1.4/src/commands/autocomplete/index.ts)_


_See code: [src/commands/hello.ts](https://github.com/zesty-io/cli/blob/v1.0.0/src/commands/hello.ts)_

## `zesty help [COMMAND]`

display help for zesty

```
USAGE
  $ zesty help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `zesty init [FILE]`

describe the command here

```
USAGE
  $ zesty init [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/init.ts](https://github.com/zesty-io/cli/blob/v1.0.0/src/commands/init.ts)_
<!-- commandsstop -->




# Zesty.io CLI
CLI for interacting with Zesty.io services

## Specfication

The goal of the CLi is to empower developers with tooling and to power tooling like IDE extensions to call the cli.

Node is the ideal base, as its expected that our developers will have Node and NPM installed

IDE/code editor extensions like Atom or VScode would ideally call to the command line rather than having the same logic built into each extension. This same pattern would also empower CI flows.


## List of Commands
Please contributes command ideas here:

`zesty init` 
Asks for instance zuid, Creates zesty.json in that folder, pulls down file structure

`zesty auth`
Prompts user name, password, 2fa flow

`zesty get instances`
lists all instances name, status, preview and live domains, and zuid

`zesty pull` 
Checks for zesty.json, pulls any new files. Updates Zesty.json. Lists our any collisions

  `zesty pull -o` 
   Overwrites all files, updates zesty.josn.

`zesty push` 
Checks for zesty.json Saves all files to zesty.io instance.

`zesty push --filename=xyz` 
Saves single file to zesty.io instance.

`zesty publish --filename=xyz` 
Saves and Publishes single file from local to zesty.io instance.


## Misc
- [ ] Evaluate tools for building CLI
  - [ ] https://oclif.io/
  - [ ] https://www.npmjs.com/package/inquirer
  - [X] https://github.com/spf13/cobra (this requires go installed)
