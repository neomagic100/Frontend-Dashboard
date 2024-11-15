const DEFAULT_MAX_LOGS = 100;

export default class LogQueue extends Array {
   /**
    * Creates a new LogQueue instance.
    *
    * @param {array} [arr=[]] - Initial array of logs.
    * @param {number} [maxSize=DEFAULT_MAX_LOGS] - Maximum number of logs to keep.
    * @param {boolean} [paginate=false] - Whether to paginate the logs.
    * @param {number} [numPages=1] - Number of pages to divide the logs into.
    */
   constructor(arr = [], maxSize = DEFAULT_MAX_LOGS, paginate = false, numPages = 1) {
      super();
      if (!Array.isArray(arr)) arr = [];
      this.push(...arr);
      this.maxSize = maxSize;
      this.isPaginated = paginate;
      this.numPages = numPages;
      this.currentPage = 1;
      this.perPage = Math.ceil(this.length / this.numPages);
      if (this.isPaginated) {
         this.prepareTable();
      }
   }

   /**
    * Enqueues a log into the LogQueue.
    *
    * @param {object} log - The log to enqueue.
    *
    * If the LogQueue is empty, the log is simply added to the end.
    * If the LogQueue has reached its maximum size, the oldest log is dequeued.
    * If the LogQueue is paginated, the logs are then re-paginated after dequeuing.
    * The log is then added to the correct position in the LogQueue, based on its timestamp.
    */
   enqueue(log) {
      if (this.length === 0) {
         this.push(log);
         return;
      }
      if (this.length >= this.maxSize) {
         this.dequeue();
      }
      const logTime = new Date(log.time);
      let idx = 0;
      while (idx < this.length && new Date(this[idx].time) > logTime) {
         idx++;
      }
      this.splice(idx, 0, log);
      if (this.isPaginated) {
         this.prepareTable();
      }
   }

   /**
    * Enqueues all logs in the given array into the LogQueue.
    *
    * @param {Array<object>} logs - The array of logs to enqueue.
    *
    * This method is simply a wrapper around the `enqueue` method. It iterates
    * over the given array of logs and calls `enqueue` on each log. Useful for
    * enqueuing an array of logs at once, such as when loading data from a
    * database or file.
    */
   enqueueAll(logs) {
      for (const log of logs) {
         this.enqueue(log);
      }
   }

   /**
    * Dequeues a number of logs from the end of the LogQueue.
    *
    * @param {number} [numToRemove=1] - The number of logs to dequeue.
    *
    * If the LogQueue is empty, the method will return null.
    * If the LogQueue is paginated, the logs are then re-paginated after dequeuing.
    * The dequeued logs are returned as an array.
    */
   dequeue(numToRemove = 1) {
      if (this.length <= 0) {
         return null;
      } else {
         const removed = this.splice(this.length - numToRemove, numToRemove);
         if (this.isPaginated) {
            this.prepareTable();
         }
         return removed;
      }
   }

   /**
    * Merges the given LogQueue into this LogQueue.
    *
    * @param {LogQueue} queue - The LogQueue to merge into this LogQueue.
    *
    * This method is simply a wrapper around the `enqueueAll` method. It allows
    * for easily merging two LogQueues into one. The logs in the given queue are
    * added to the end of this LogQueue, in the order they appear in the given
    * queue. If this LogQueue is paginated, the merged logs are then re-paginated
    * after dequeuing.
    */
   mergeQueues(queue) {
      this.enqueueAll(queue);
   }

   /**
    * Returns the maximum size of the LogQueue.
    *
    * @return {number} - The maximum size of the LogQueue.
    */
   maxSize() {
      return this.maxSize;
   }

   /**
    * Prepares the LogQueue for pagination by recalculating the page count and
    * items per page based on the current length of the LogQueue.
    *
    * This method is typically called after dequeuing or merging another LogQueue.
    * It ensures that the LogQueue is in a valid paginated state after the
    * operation.
    */
   prepareTable() {
      this.currentPage = Math.min(this.currentPage, this.numPages);
      this.perPage = Math.ceil(this.length / this.numPages);
   }
}

