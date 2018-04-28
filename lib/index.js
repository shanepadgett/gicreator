'use strict'

;(function () {
  const gitignore = require('./library')
  const fs = require('fs')
  const argv = require('yargs/yargs')(process.argv.slice(2))
    .command({
      command: 'list',
      aliases: ['l'],
      desc: 'list all gitignore templates',
      handler: gitignore.getNames
    })
    .command({
      command: 'make [types..]',
      aliases: ['m'],
      desc: 'Create a gitignore file with the listed types',
      handler: (argv) => {
        console.log(argv.types)
      }
    })
    .help()
    .alias('help', 'h')
    .argv
}).call(this)