const { Writable } = require('node:stream')

const { insertOnLdap } = require('./insert-on-ldap')
const { updateOnLdap } = require('./update-on-ldap')

module.exports.createInsertIntoLdapStream = function (entryProcessedPublisher) {
  return new Writable({
    write: async function (chunk, encoding, cb) {
      try {
        const objectData = JSON.parse(chunk.toString())
        const error = await insertOnLdap(objectData)
        if (error) updateOnLdap(objectData)
        entryProcessedPublisher.notifySubscribers()
        cb()
      } catch (error) {
        console.error(error)
        cb(error)
      }
    }
  })
}