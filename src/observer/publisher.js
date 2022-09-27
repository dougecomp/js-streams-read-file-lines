/* interface Publisher */

class EntryProcessedPublisher {
  subscribers = []

  subscribe(subscriber) {
    this.subscribers.push(subscriber)
  }

  unsubscribe(informedSubscriber) {
    this.subscribers = this.subscribers.filter((subscriber) => subscriber !== informedSubscriber)
  }

  notifySubscribers() {
    for(const subscriber of this.subscribers) 
      subscriber.update(this)
  }

  processEntry () {
    this.notifySubscribers()
  }
}

module.exports = { EntryProcessedPublisher }