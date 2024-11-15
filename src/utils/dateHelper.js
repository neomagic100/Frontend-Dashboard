export default {
   /**
    * Returns a human readable string from a date object.
    * @param {object} date - Date object with relative days, hours and minutes.
    * @returns {string} A human readable string in the format of "X days Y hours Z minutes".
    */
   formatDate(date) {
      const days = date.relative.days;
      const hours = date.relative.hours;
      const minutes = date.relative.minutes;
      return `${days}d ${hours}h ${minutes}m`;
   },

   /**
    * Calculates the average between two given dates.
    * @param {object} date1 - Date object with relative days, hours and minutes.
    * @param {object} date2 - Date object with relative days, hours and minutes.
    * @returns {object} A date object with the average of the given dates in the format of "X days Y hours Z minutes".
    */
   averageDates(date1, date2) {
      const days = Math.floor((date1.relative.days + date2.relative.days) / 2.0) || 0;
      const hours = Math.round((date1.relative.hours + date2.relative.hours) / 2.0) || 0;
      const minutes = Math.round((date1.relative.minutes + date2.relative.minutes) / 2.0) || 0;

      return { days, hours, minutes };
   },

   /**
    * Compares two given dates and returns the one which is closer to now.
    * @param {object} date1 - Date object with relative days, hours and minutes.
    * @param {object} date2 - Date object with relative days, hours and minutes.
    * @returns {object} The date object which is closer to now.
    */
   findMaxDate(date1, date2) {
      if (date1.relative.days > date2.relative.days) {
         return date1;
      } else if (date2.relative.days > date1.relative.days) {
         return date2;
      } else if (date1.relative.hours > date2.relative.hours) {
         return date1;
      } else if (date2.relative.hours > date1.relative.hours) {
         return date2;
      } else if (date1.relative.minutes > date2.relative.minutes) {
         return date1;
      } else {
         return date2;
      }
   },
};
