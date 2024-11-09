export default {
   formatDate(date) {
      let days = date.relative.days;
      let hours = date.relative.hours;
      let minutes = date.relative.minutes;
      return `${days}d ${hours}h ${minutes}m`;
   },

   averageDates(date1, date2) {
      let days = Math.floor((date1.relative.days + date2.relative.days) / 2.0) || 0;
      let hours = Math.round((date1.relative.hours + date2.relative.hours) / 2.0) || 0;
      let minutes = Math.round((date1.relative.minutes + date2.relative.minutes) / 2.0) || 0;

      return { days, hours, minutes };
   },

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
