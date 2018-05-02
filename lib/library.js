'use strict'

const fs = require('fs')
const extfs = require('extfs')
const axios = require('axios')

axios.defaults.headers.common['User-Agent'] = 'gicreator'

const Gicreator = {}

const extractNames = data => data.map(
  obj => obj.name.substr(0, obj.name.indexOf('.'))).filter(elm => elm)

const getTypes = () => {
  return new Promise((resolve, reject) => {
    let types = {
      projectTypes: [],
      globalTypes: [],
    }

    axios.all([
      axios.get('https://api.github.com/repos/github/gitignore/contents'),
      axios.get(
        'https://api.github.com/repos/github/gitignore/contents/Global'),
    ]).then(axios.spread((projectResponse, globalResponse) => {
      types.projectTypes = extractNames(projectResponse.data)
      types.globalTypes = extractNames(globalResponse.data)
      resolve(types)
    }))
  })
}

const formatName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const writeToFile = (url, name) => {
  axios.get(url).then(response => {
    extfs.isEmpty('.gitignore', isEmpty => {
      const str = isEmpty
        ? `#======================\n# ${name}\n#======================\n${response.data}`
        : `\n#======================\n# ${name}\n#======================\n${response.data}`
      fs.appendFileSync('.gitignore', str)
    })
  })
}

Gicreator.displayTypes = () => {
  getTypes().then(types => {
    let str = '\nPROJECT TYPES' + '\n============='

    types.projectTypes.forEach(item => {
      str += `\n${item}`
    })

    str += '\n\nGLOBAL TYPES' + '\n============'

    types.globalTypes.forEach(item => {
      str += `\n${item}`
    })

    console.log(str)
  })
}

Gicreator.create = reqTypes => {
  getTypes().then(availableTypes => {
    let added = {
      project: [],
      global: [],
    }
    let missing = []

    reqTypes.map(item => item.toLowerCase()).forEach(item => {
      let lowerCaseProjectTypes = availableTypes.projectTypes.map(
        value => value.toLowerCase())
      let lowerCaseGlobalTypes = availableTypes.globalTypes.map(
        value => value.toLowerCase())

      if (lowerCaseProjectTypes.includes(item)) {
        added.project.push(
          availableTypes.projectTypes[lowerCaseProjectTypes.indexOf(item)])
      } else if (lowerCaseGlobalTypes.includes(item)) {
        added.global.push(
          availableTypes.globalTypes[lowerCaseGlobalTypes.indexOf(item)])
      } else {
        missing.push(item)
      }
    })

    added.project.forEach(item => {
      writeToFile(
        `https://raw.githubusercontent.com/github/gitignore/master/${item}.gitignore`,
        formatName(item))
    })

    added.global.forEach(item => {
      writeToFile(
        `https://raw.githubusercontent.com/github/gitignore/master/Global/${item}.gitignore`,
        formatName(item))
    })

    if (added.project.length || added.global.length) {
      console.log(`Created .gitignore for [${added.project.concat(added.global).
        join(', ')}]`)
    }

    if (missing.length > 0) {
      console.log(`[${missing.join(', ')}] does not exist and was not added.`)
    }
  })
}

module.exports = Gicreator
