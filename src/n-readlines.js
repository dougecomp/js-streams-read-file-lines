const process = require('node:process')
const { pipeline } = require('node:stream')
const { promisify } = require('node:util')

const { createNReadLineFileStream } = require('./create-n-readlines-file-stream')
const { createExtractUefsEmployeeDataStream } = require('./create-extract-uefs-employee-data-stream')
const { createInsertIntoLdapStream } = require('./create-insert-into-ldap-stream')

const { EntryProcessedPublisher } = require('./observer/publisher')
const { NumberOfEntriesProcessedSubscriber } = require('./observer/subscriber')

const filePath = 'file.csv';

(async () => {
  console.time('n-readlines')

  const entryProcessedPublisher = new EntryProcessedPublisher()
  const numberOfEntriesProcessedSubscriber = new NumberOfEntriesProcessedSubscriber()
  entryProcessedPublisher.subscribe(numberOfEntriesProcessedSubscriber)

  const pipelineAsync = promisify(pipeline)
  await pipelineAsync(
    createNReadLineFileStream(filePath),
    createExtractUefsEmployeeDataStream(),
    createInsertIntoLdapStream(entryProcessedPublisher)
  )

  console.timeEnd('n-readlines')
  for (const [key,value] of Object.entries(process.memoryUsage())) {
    console.log(`Memory usage by ${key}, ${value/1000000}MB`)
  }
  console.log(`Number of entries processed: ${numberOfEntriesProcessedSubscriber.entriesProcessed}`)
  console.log('Done')
})()

/**
 * Performance:
 * n-readlines: 289.081ms
 * Memory usage by rss, 52.826112MB
 * Memory usage by heapTotal, 11.71456MB
 * Memory usage by heapUsed, 8.622936MB
 * Memory usage by external, 3.01501MB
 * Memory usage by arrayBuffers, 1.680282MB
 */