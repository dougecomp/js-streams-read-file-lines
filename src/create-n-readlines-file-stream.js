const nReadLines = require('n-readlines')

const { Readable } = require('node:stream')

module.exports.createNReadLineFileStream = function(filePath) {
  let linesRead = 0
  const lines = new nReadLines(filePath)
  
  const readNReadlineReadableFileStream = new Readable({
    read: function () {
      let line
      while(line = lines.next()) {
        if(linesRead > 0) this.push(line.toString())
        linesRead++
      }
      this.push(null)
    }
  })
  
  return readNReadlineReadableFileStream
}