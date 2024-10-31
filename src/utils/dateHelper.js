export default {
   formatDate(date) {
      let days = date.days;
      let hours = date.hours;
      let minutes = date.minutes;
      return `${days}d ${hours}h ${minutes}m`;
   },

   averageDates(date1, date2) {
      let days = Math.floor((date1.days + date2.days) / 2.0) || 0;
      let hours = Math.round((date1.hours + date2.hours) / 2.0) || 0;
      let minutes = Math.round((date1.minutes + date2.minutes) / 2.0) || 0;

      return { days, hours, minutes };
   },
};
