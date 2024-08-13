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
@zesty-io/cli/0.0.4 darwin-x64 node-v20.10.0
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
* [`zesty auth login [SERVICE]`](#zesty-auth-login-service)
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

_See code: [dist/commands/auth/index.ts](https://github.com/zesty-io/cli/blob/v0.0.4/dist/commands/auth/index.ts)_

## `zesty auth get-user-token`

Show current user session token CLI is configured to use

```
USAGE
  $ zesty auth get-user-token

DESCRIPTION
  Show current user session token CLI is configured to use
```

## `zesty auth login [SERVICE]`

Command for authenticating with a Zesty.io account using basic and SSO authentication

```
USAGE
  $ zesty auth login [SERVICE] [-h]

ARGUMENTS
  SERVICE  (zesty|microsoft|google|github|okta) The service to be used to login. Accepted values are zesty, microsoft,
           google, github and okta

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Command for authenticating with a Zesty.io account using basic and SSO authentication

EXAMPLES
  $ zesty auth:login zesty

  $ zesty auth:login google

  $ zesty auth:login zesty
```

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

## `zesty help [COMMANDS]`

Display help for zesty.

```
USAGE
  $ zesty help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

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

_See code: [dist/commands/init.ts](https://github.com/zesty-io/cli/blob/v0.0.4/dist/commands/init.ts)_

## `zesty instance`

```
USAGE
  $ zesty instance [-h]

FLAGS
  -h, --help  Show CLI help.
```

_See code: [dist/commands/instance/index.ts](https://github.com/zesty-io/cli/blob/v0.0.4/dist/commands/instance/index.ts)_

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
<!-- commandsstop -->
