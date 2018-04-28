'use strict'

const https = require('https')

const Gicreator = {}

Gicreator.getNames = () => {
  https.get({
    host: 'api.github.com',
    path: '/repos/github/gitignore/contents',
    headers: {'User-Agent': 'gitignore node app'}
  }, function pullFromGithub (res) {
    let body = ''
    res.on('data', (chunk) => {
      body += chunk
    })
    res.on('end', () => {
      const json = JSON.parse(body)
        .map(obj => {
          return obj.name.substr(0, obj.name.indexOf('.'))
        })
      console.log(json)
    })
  })
}

Gicreator.writeFile = () => {
  //do stuff
}

module.exports = Gicreator