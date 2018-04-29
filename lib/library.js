"use strict"

const fetch = require("node-fetch")

const Gicreator = {}

Gicreator.getTypes = () => {
  return new Promise((resolve, reject) => {
    const projectProps = {
      method: "GET",
      headers: { "User-Agent": "gicreator" }
    }

    const globalProps = {
      method: "GET",
      headers: { "User-Agent": "gicreator" }
    }

    const extractResponseNames = data => {
      return data
        .map(obj => {
          return obj.name.substr(0, obj.name.indexOf("."))
        })
        .filter(elm => {
          return elm !== ""
        })
    }

    let types = {}

    fetch(
      "https://api.github.com/repos/github/gitignore/contents",
      projectProps
    )
      .then(res => res.json())
      .then(json => {
        types.projectTypes = extractResponseNames(json)
        fetch(
          "https://api.github.com/repos/github/gitignore/contents/Global",
          globalProps
        )
          .then(res => res.json())
          .then(json => {
            types.globalTypes = extractResponseNames(json)
            resolve(types)
          })
      })
  })
}

Gicreator.displayTypes = () => {
  Gicreator.getTypes().then(types => {
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

Gicreator.writeFile = () => {
  //do stuff
}

module.exports = Gicreator
