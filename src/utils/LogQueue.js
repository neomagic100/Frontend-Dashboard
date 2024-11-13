const DEFAULT_MAX_LOGS = 100;

export default class LogQueue extends Array {
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

   enqueueAll(logs) {
      for (const log of logs) {
         this.enqueue(log);
      }
   }

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

   mergeQueues(queue) {
      this.enqueueAll(queue);
   }

   maxSize() {
      return this.maxSize;
   }

   prepareTable() {
      this.currentPage = Math.min(this.currentPage, this.numPages);
      this.perPage = Math.ceil(this.length / this.numPages);
   }
}

