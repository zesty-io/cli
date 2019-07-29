# cli
CLI for interacting with Zesty.io services

## TODO
- [ ] Evaluate tools for building CLI
  - [ ] https://oclif.io/
  - [ ] https://www.npmjs.com/package/inquirer
  - [X] https://github.com/spf13/cobra (this requires go installed)


## Specfication

The goal of the CLi is to empower developers with tooling and power tooling, like IDE extensions, to call the cli.

Node is the ideal base, as its expected that our developers will have Node and NPM installed


## Important Commands

* authenticate
* call and see instances (like kube get pods)
* instantiate a folder that creates a zesty.json by asking for instance zuid
* pull existing project with a folder that has a zesty.json
* push existing folder that has a zesty.json
