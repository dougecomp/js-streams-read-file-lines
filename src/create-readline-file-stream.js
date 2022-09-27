const readline = require('node:readline')
const { Readable } = require('node:stream')
const fs = require('node:fs')

module.exports.createReadlineFileStream = function(filePath) {
  let linesRead = 0
  const readlineInterface = readline.createInterface({
    input: fs.createReadStream(filePath),
    terminal: false
  })

  const readlineReadableFileStream = new Readable({
    read: async function () {
  
      for await (const line of readlineInterface) {
        if (linesRead > 0) this.push(line)  
        linesRead++
      }
      this.push(null)
  
    }
  })

  return readlineReadableFileStream
}