'use strict'

;(function () {
  const gitignore = require('./library')
  const argv = require('yargs').
    command({
      command: 'list',
      aliases: ['l'],
      desc: 'list all gitignore templates',
      handler: gitignore.displayTypes,
    }).
    command({
      command: 'make [types..]',
      aliases: ['m'],
      desc: 'Create a gitignore file with the listed types',
      handler: (argv) => {
        gitignore.create(argv.types)
      },
    }).
    example('$0 make node windows jetbrains',
      'create a gitignore file based on the node, windows and jetbrains templates').
    help().
    alias('help', 'h').
    showHelpOnFail(true).
    demandCommand(1, '').argv
}).call(this)