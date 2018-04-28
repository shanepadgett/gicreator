'use strict'

;(function () {
  const gitignore = require('./library')
  const fs = require('fs')
  const argv = require('yargs/yargs')(process.argv.slice(2))
    .command({
      command: 'list',
      aliases: ['l'],
      desc: 'list all gitignore templates',
      handler: gitignore.displayTypes
    })
    .command({
      command: 'make [types..]', //this command accepts 
      aliases: ['m'],
      desc: 'Create a gitignore file with the listed types',
      handler: (argv) => {
        console.log(argv.types)
      }
    })
    .example('$0 make node windows jetbrains', 'create a gitignore file based on the node, windows and jetbrains templates')
    .help()
    .alias('help', 'h')
    .argv
}).call(this)