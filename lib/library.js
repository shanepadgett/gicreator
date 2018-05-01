"use strict"

const fetch = require("node-fetch")
const fs = require("fs-extra")

const Gicreator = {}

const getTypes = () => {
  return new Promise((resolve, reject) => {
    const props = {
      method: "GET",
      headers: { "User-Agent": "gicreator" }
    }

    const extractResponseNames = data => data.map(obj => obj.name.substr(0, obj.name.indexOf("."))).filter(elm => elm)

    let types = {}

    fetch("https://api.github.com/repos/github/gitignore/contents", props)
      .then(res => res.json())
      .then(json => {
        types.projectTypes = extractResponseNames(json)

        return fetch("https://api.github.com/repos/github/gitignore/contents/Global", props)
      })
      .then(res => res.json())
      .then(json => {
        types.globalTypes = extractResponseNames(json)
        resolve(types)
      })
  })
}

Gicreator.displayTypes = () => {
  getTypes().then(types => {
    let str = "\nPROJECT TYPES" + "\n============="

    types.projectTypes.forEach(item => {
      str += `\n${item}`
    })

    str += "\n\nGLOBAL TYPES" + "\n============"

    types.globalTypes.forEach(item => {
      str += `\n${item}`
    })

    console.log(str)
  })
}

Gicreator.writeFile = reqTypes => {
  getTypes().then(availableTypes => {
    let added = {
      proj: [],
      global: []
    }

    let missing = []

    reqTypes
      .map(item => item.toLowerCase())
      .forEach(item => {
        let lowerCaseProjectTypes = availableTypes.projectTypes.map(value => value.toLowerCase())
        let lowerCaseGlobalTypes = availableTypes.globalTypes.map(value => value.toLowerCase())

        if (lowerCaseProjectTypes.includes(item)) {
          added.proj.push(availableTypes.projectTypes[lowerCaseProjectTypes.indexOf(item)])
        } else if (lowerCaseGlobalTypes.includes(item)) {
          added.global.push(availableTypes.globalTypes[lowerCaseGlobalTypes.indexOf(item)])
        } else {
          missing.push(item)
        }
      })

    const formatName = (name) => {
      return name.charAt(0).toUpperCase() + name.slice(1)
    }

    const write = (url, name) => {
      fetch(url)
        .then(projRes => {
          if (projRes.status === 200) {
            return projRes.text()
          }
        })
        .then(body => {
          if (body) {
            fs.appendFile(
              '.gitignore',
              `\n#======================\n# ${name}\n#======================\n${body}`
            )
          }
        })
    }

    added.proj.forEach(item => {
      item = formatName(item)
      write(`https://raw.githubusercontent.com/github/gitignore/master/${item}.gitignore`, item)
    })

    added.global.forEach(item => {
      item = formatName(item)
      write(`https://raw.githubusercontent.com/github/gitignore/master/Global/${item}.gitignore`, item)
    })

    if (added.proj.length || added.global.length) {
      console.log(`Created .gitignore for [${added.proj.concat(added.global).join(', ')}]`)
    }

    if (missing.length > 0) {
      console.log(`[${missing.join(", ")}] does not exist and was not added.`)
    }
  })
}

module.exports = Gicreator
