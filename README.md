CLI
=================

CLI for interacting with Zesty.io services

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @zesty-io/cli
$ zesty COMMAND
running command...
$ zesty (--version)
@zesty-io/cli/0.0.0 linux-x64 node-v16.13.1
$ zesty --help [COMMAND]
USAGE
  $ zesty COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`zesty auth`](#zesty-auth)
* [`zesty auth login [EMAIL] [PASS]`](#zesty-auth-login-email-pass)
* [`zesty auth signup EMAIL PASS FIRSTNAME LASTNAME`](#zesty-auth-signup-email-pass-firstname-lastname)
* [`zesty authenticated-command`](#zesty-authenticated-command)
* [`zesty autocomplete [SHELL]`](#zesty-autocomplete-shell)
* [`zesty help [COMMAND]`](#zesty-help-command)
* [`zesty init`](#zesty-init)
* [`zesty instance create [NAME]`](#zesty-instance-create-name)
* [`zesty instance list`](#zesty-instance-list)
* [`zesty plugins`](#zesty-plugins)
* [`zesty plugins:inspect PLUGIN...`](#zesty-pluginsinspect-plugin)
* [`zesty plugins:install PLUGIN...`](#zesty-pluginsinstall-plugin)
* [`zesty plugins:link PLUGIN`](#zesty-pluginslink-plugin)
* [`zesty plugins:uninstall PLUGIN...`](#zesty-pluginsuninstall-plugin)
* [`zesty plugins update`](#zesty-plugins-update)

## `zesty auth`

```
USAGE
  $ zesty auth [-h]

FLAGS
  -h, --help  Show CLI help.
```

_See code: [dist/commands/auth/index.ts](https://github.com/zesty-io/cli/blob/v0.0.0/dist/commands/auth/index.ts)_

## `zesty auth login [EMAIL] [PASS]`

Command for authenticating with a Zesty.io account

```
USAGE
  $ zesty auth login [EMAIL] [PASS] [-h]

ARGUMENTS
  EMAIL  Your user account email
  PASS   Your user account password

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Command for authenticating with a Zesty.io account

EXAMPLES
  $ zesty auth:login user@example.com strong-password-for-security
```

## `zesty auth signup EMAIL PASS FIRSTNAME LASTNAME`

Command for creating a Zesty.io account

```
USAGE
  $ zesty auth signup [EMAIL] [PASS] [FIRSTNAME] [LASTNAME] [-h]

ARGUMENTS
  EMAIL      Your user account email
  PASS       Your user account password
  FIRSTNAME  Your first name
  LASTNAME   Your last name

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Command for creating a Zesty.io account

EXAMPLES
  $ zesty auth:signup jane+doe@example.com strong-password-for-security Jane Doe
```

## `zesty authenticated-command`

```
USAGE
  $ zesty authenticated-command
```

_See code: [dist/commands/authenticated-command.ts](https://github.com/zesty-io/cli/blob/v0.0.0/dist/commands/authenticated-command.ts)_

## `zesty autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ zesty autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ zesty autocomplete

  $ zesty autocomplete bash

  $ zesty autocomplete zsh

  $ zesty autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.2.0/src/commands/autocomplete/index.ts)_

## `zesty help [COMMAND]`

Display help for zesty.

```
USAGE
  $ zesty help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for zesty.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `zesty init`

describe the command here

```
USAGE
  $ zesty init [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  describe the command here
```

_See code: [dist/commands/init.ts](https://github.com/zesty-io/cli/blob/v0.0.0/dist/commands/init.ts)_

## `zesty instance create [NAME]`

Create a new instance

```
USAGE
  $ zesty instance create [NAME] [-h]

ARGUMENTS
  NAME  name for your instance

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Create a new instance
```

## `zesty instance list`

List your instances

```
USAGE
  $ zesty instance list [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  List your instances
```

## `zesty plugins`

List installed plugins.

```
USAGE
  $ zesty plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ zesty plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.0/src/commands/plugins/index.ts)_

## `zesty plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ zesty plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ zesty plugins:inspect myplugin
```

## `zesty plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ zesty plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ zesty plugins add

EXAMPLES
  $ zesty plugins:install myplugin 

  $ zesty plugins:install https://github.com/someuser/someplugin

  $ zesty plugins:install someuser/someplugin
```

## `zesty plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ zesty plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ zesty plugins:link myplugin
```

## `zesty plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ zesty plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ zesty plugins unlink
  $ zesty plugins remove
```

## `zesty plugins update`

Update installed plugins.

```
USAGE
  $ zesty plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
