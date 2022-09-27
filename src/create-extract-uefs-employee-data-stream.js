const { Transform } = require('node:stream')
const { extractUefsEmployeeData } = require('./extract-uefs-employee-data')

module.exports.createExtractUefsEmployeeDataStream = function () {
  return new Transform({
    transform: function(chunk, encoding, cb) {
      const dataArray = chunk.toString().split(',')
      const objectData = extractUefsEmployeeData(dataArray)
      return cb(null, JSON.stringify(objectData))
    }
  })
}