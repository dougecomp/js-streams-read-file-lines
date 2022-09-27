const process = require('node:process')
const { pipeline } = require('node:stream')
const { promisify } = require('node:util')

const { createReadlineFileStream } = require('./create-readline-file-stream')
const { createExtractUefsEmployeeDataStream } = require('./create-extract-uefs-employee-data-stream')
const { createInsertIntoLdapStream } = require('./create-insert-into-ldap-stream')

const { EntryProcessedPublisher } = require('./observer/publisher')
const { NumberOfEntriesProcessedSubscriber } = require('./observer/subscriber')

const filePath = 'file.csv';

(async () => {
  console.time('readline')

  const entryProcessedPublisher = new EntryProcessedPublisher()
  const numberOfEntriesProcessedSubscriber = new NumberOfEntriesProcessedSubscriber()
  entryProcessedPublisher.subscribe(numberOfEntriesProcessedSubscriber)

  const pipelineAsync = promisify(pipeline)
  await pipelineAsync(
    createReadlineFileStream(filePath),
    createExtractUefsEmployeeDataStream(),
    createInsertIntoLdapStream(entryProcessedPublisher)
  )

  console.timeEnd('readline')
  for (const [key,value] of Object.entries(process.memoryUsage())) {
    console.log(`Memory usage by ${key}, ${value/1000000}MB`)
  }
  console.log(`Number of entries processed: ${numberOfEntriesProcessedSubscriber.entriesProcessed}`)
  console.log('Done')
})()

/**
 * Performance:
 * readline: 424.088ms
 * Memory usage by rss, 51.331072MB 
 * Memory usage by heapTotal, 11.190272MB 
 * Memory usage by heapUsed, 6.808832MB 
 * Memory usage by external, 2.738544MB 
 * Memory usage by arrayBuffers, 0.754593MB 
 */
