/* interface Subscriber */

class NumberOfEntriesProcessedSubscriber {
  entriesProcessed = 0

  update(publisher) {
    this.entriesProcessed++
  }
}

module.exports = { NumberOfEntriesProcessedSubscriber }