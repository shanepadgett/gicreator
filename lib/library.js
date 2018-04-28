'use strict'

const rp = require('request-promise')

const Gicreator = {}

Gicreator.getTypes = () => {
  return new Promise((resolve, reject) => {
    const projectTypeReq = {
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
  
    let types = {}
  
    rp(projectTypeReq).then((projResponse) => {
      types.projectTypes = extractResponseNames(projResponse)
      rp(globalTypeReq).then((gResponse) => {
        types.globalTypes = extractResponseNames(gResponse)
        resolve(types)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

Gicreator.displayTypes = () => {
  Gicreator.getTypes().then(types => {
    let str =
    '\nPROJECT TYPES' +
    '\n============='
    types.projectTypes.forEach(item => {
      str += `\n${item}`
    })
    str += 
      '\n\nGLOBAL TYPES' + 
      '\n============'
    types.globalTypes.forEach(item => {
      str += `\n${item}`
    })
    console.log(str)
  })
}

Gicreator.writeFile = () => {
  //do stuff
}

module.exports = Gicreator