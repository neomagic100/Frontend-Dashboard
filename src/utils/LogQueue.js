import Log from "./LogObject";

export default class LogQueue extends Array {
   /**
    * Initialize a new instance of LogQueue.
    *
    * @param {Array} arr - An initial array to populate the queue. Defaults to an empty array.
    * @param {number} maxSize - The maximum size of the queue. Defaults to 30.
    */
   constructor(arr = [], maxSize = 30) {
      super();
      if (arr === null) {
         throw new Error("arr cannot be null");
      }
      if (maxSize < 1) {
         throw new Error("maxSize must be a positive number");
      }

      this.queue = arr;
      this.queueSize = this.queue.length;
      this.maxSize = maxSize;
   }

   /**
    * Add an item to the front of the queue.
    *
    * If the queue is at its maximum size, this will remove the last item
    * before adding the new one at the front.
    *
    * @param {Log} item - The item to add to the queue.
    */
   enqueue(log) {
      if (this.queue.length >= 30) {
         this.dequeue();
      }
      let logTime = new Date(log.time);
      let idx = 0;
      while (idx < this.queue.length && this.queue[idx].time > logTime) {
         idx++;
      }
      this.queue.splice(idx, 0, log);
      this.queueSize++;
   }
   /**
    * Remove the item at the front of the queue and return it.
    *
    * If the queue is empty, this will return null.
    *
    * @return {any|null} The item at the front of the queue, or null if the
    *  queue is empty.
    */
   dequeue() {
      if (this.queue.length === 0) {
         return null;
      }
      this.queueSize--;
      return this.queue.pop();
   }

   sortQueue() {
      this.queue.sort((a, b) => {
         let time1 = new Date(a.time);
         let time2 = new Date(b.time);
         return time2 - time1;
      });
   }

   /**
    * Merges the current queue with another queue, maintaining sorted order.
    *
    * The resulting merged queue will replace the current queue, and any 
    * excess elements beyond the maximum size will be removed.
    *
    * @param {LogQueue} queue - The queue to merge with the current queue.
    */
   mergeQueues(queue) {
      let idx1 = 0, idx2 = 0;
      let queueSize1 = this.queue.length, queueSize2 = queue.queue.length;
      let mergedQueue = new LogQueue();
      while (idx1 < queueSize1 && idx2 < queueSize2) {
         let item1 = new Log(this.queue[idx1]);
         let item2 = new Log(queue.queue[idx2]);
         let time1 = new Date(item1.time);
         let time2 = new Date(item2.time);
         if (time1 < time2) {
            mergedQueue.enqueue(this.queue[idx1]);
            idx1++;
         } else {
            mergedQueue.enqueue(queue.queue[idx2]);
            idx2++;
         }
      }
      while (idx1 < queueSize1) {
         mergedQueue.enqueue(this.queue[idx1]);
         idx1++;
      }
      while (idx2 < queueSize2) {
         mergedQueue.enqueue(queue.queue[idx2]);
         idx2++;
      }

      while (mergedQueue.queue.length > 30) {
            let item = mergedQueue.dequeue();
         }
      
      this.queue = mergedQueue.queue;
      this.queueSize = mergedQueue.queue.length;
   }

      /**
       * Return the item at the front of the queue without removing it.
       *
       * If the queue is empty, this will return null.
       *
       * @return {any|null} The item at the front of the queue, or null if the
       *  queue is empty.
       */
      peek() {
         if (this.queueSize === 0) {
            return null;
         }
         return this.queue[0];
      }

      /**
       * Return the number of items in the queue.
       *
       * @return {number} The number of items in the queue.
       */
      size() {
         return this.queueSize;
      }

      /**
       * Return the maximum size of the queue.
       *
       * @return {number} The maximum size of the queue.
       */
      maxSize() {
         return this.maxSize;
      }

      /**
       * Clear the queue.
       */
      clear() {
         this.queue = [];
         this.queueSize = 0;
      }

      /**
       * Return the queue as an array.
       *
       * @return {Array} The queue as an array.
       */
      toArray() {
         return this.queue;
      }

      /**
       * Return the queue as a string.
       *
       * @return {string} The queue as a string.
       */
      toString() {
         return this.queue.toString();
      }

      /**
       * Return the queue as a JSON string.
       *
       * @return {string} The queue as a JSON string.
       */
      toJSON() {
         return this.queue;
      }

   }
