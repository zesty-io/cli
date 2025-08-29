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
@zesty-io/cli/0.0.6 darwin-x64 node-v22.16.0
$ zesty --help [COMMAND]
USAGE
  $ zesty COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`zesty auth`](#zesty-auth)
* [`zesty auth get-user-token`](#zesty-auth-get-user-token)
* [`zesty auth login [EMAIL] [PASS]`](#zesty-auth-login-email-pass)
* [`zesty auth signup [EMAIL] [PASS] [FIRSTNAME] [LASTNAME]`](#zesty-auth-signup-email-pass-firstname-lastname)
* [`zesty help [COMMANDS]`](#zesty-help-commands)
* [`zesty init`](#zesty-init)
* [`zesty instance`](#zesty-instance)
* [`zesty instance create [NAME]`](#zesty-instance-create-name)
* [`zesty instance list`](#zesty-instance-list)

## `zesty auth`

```
USAGE
  $ zesty auth [-h]

FLAGS
  -h, --help  Show CLI help.
```

_See code: [src/commands/auth/index.ts](https://github.com/zesty-io/cli/blob/v0.0.6/src/commands/auth/index.ts)_

## `zesty auth get-user-token`

Show current user session token CLI is configured to use

```
USAGE
  $ zesty auth get-user-token

DESCRIPTION
  Show current user session token CLI is configured to use
```

_See code: [src/commands/auth/get-user-token.ts](https://github.com/zesty-io/cli/blob/v0.0.6/src/commands/auth/get-user-token.ts)_

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

_See code: [src/commands/auth/login.ts](https://github.com/zesty-io/cli/blob/v0.0.6/src/commands/auth/login.ts)_

## `zesty auth signup [EMAIL] [PASS] [FIRSTNAME] [LASTNAME]`

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

_See code: [src/commands/auth/signup.ts](https://github.com/zesty-io/cli/blob/v0.0.6/src/commands/auth/signup.ts)_

## `zesty help [COMMANDS]`

Display help for zesty.

```
USAGE
  $ zesty help [COMMANDS...] [-n]

ARGUMENTS
  COMMANDS...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for zesty.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `zesty init`

Initialize a project with a Zesty.io instance

```
USAGE
  $ zesty init [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Initialize a project with a Zesty.io instance
```

_See code: [src/commands/init.ts](https://github.com/zesty-io/cli/blob/v0.0.6/src/commands/init.ts)_

## `zesty instance`

```
USAGE
  $ zesty instance [-h]

FLAGS
  -h, --help  Show CLI help.
```

_See code: [src/commands/instance/index.ts](https://github.com/zesty-io/cli/blob/v0.0.6/src/commands/instance/index.ts)_

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

_See code: [src/commands/instance/create.ts](https://github.com/zesty-io/cli/blob/v0.0.6/src/commands/instance/create.ts)_

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

_See code: [src/commands/instance/list.ts](https://github.com/zesty-io/cli/blob/v0.0.6/src/commands/instance/list.ts)_
<!-- commandsstop -->
