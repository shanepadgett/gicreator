'use strict'

const rp = require('request-promise')

const Gicreator = {}

Gicreator.getNames = () => {
  const typeReq = {
    url: 'https://api.github.com/repos/github/gitignore/contents',
    headers: {
      'User-Agent': 'gicreator'
    },
    json: true
  }

  const globalTypeReq = {
    url: 'https://api.github.com/repos/github/gitignore/contents/Global',
    headers: {
      'User-Agent': 'gicreator'
    },
    json: true
  }

  const extractResponseNames = (response) => {
    return response.map(obj => {
      return obj.name.substr(0, obj.name.indexOf('.'))
    }).filter(elm => { return elm !== ''})
  }

  rp(typeReq).then((response) => {
    let projectTypes = 
    '\n=============' +
    '\nPROJECT TYPES' +
    '\n============='
    extractResponseNames(response).forEach(item => {
      projectTypes += `\n${item}`
    })
    console.log(projectTypes)
    
    rp(globalTypeReq).then((response) => {
      let globalTypes = 
      '\n============' +
      '\nGLOBAL TYPES' +
      '\n============'
      extractResponseNames(response).forEach(item => {
        globalTypes += `\n${item}`
      })
      console.log(globalTypes)
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
}

Gicreator.writeFile = () => {
  //do stuff
}

module.exports = Gicreator