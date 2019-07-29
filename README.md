# Zesty.io CLI
CLI for interacting with Zesty.io services

## Specfication

The goal of the CLi is to empower developers with tooling and power tooling, like IDE extensions, to call the cli.

Node is the ideal base, as its expected that our developers will have Node and NPM installed

Ideally, extensions on code editors like atom or VScode would call to the command line rather than having the same logic built into each extension. This same pattern would also empower CI flows.


## First Commands


`zutils auth`
Prompts user name, password, 2fa flow

`zutils get instances`
lists all instances name, status, preview and live domains, and zuid

`zutils init` 
Asks for instance zuid, Creates zesty.json in that folder, pulls down file structure

`zutils pull` 
Checks for zesty.json, pulls any new files. Updates Zesty.json. Lists our any collisions

  `zutils pull -o` 
   Overwrites all files, updates zesty.josn.

`zutils push` 
Checks for zesty.json Saves all files to zesty.io instance.

`zutils push --filename=xyz` 
Saves single file to zesty.io instance.

`zutils publish --filename=xyz` 
Saves and Publishes single file from local to zesty.io instance.


## Misc
- [ ] Evaluate tools for building CLI
  - [ ] https://oclif.io/
  - [ ] https://www.npmjs.com/package/inquirer
  - [X] https://github.com/spf13/cobra (this requires go installed)
