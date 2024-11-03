export const timeStorageKey = "disableUntilTime";

export function addTimeToLocalStorage(minutes, cookie) {
   removeTimeFromLocalStorage(cookie);
   console.log("store ", minutes);
   const time = Date.now() + minutes * 60 * 1000;
   const value = { disableUntilTime: time, disableMinutes: minutes };
   cookie.set(timeStorageKey, JSON.stringify(value));
   localStorage.setItem(timeStorageKey, JSON.stringify(value));
}

export function removeTimeFromLocalStorage(cookie) {
   const value = getTimeFromLocalStorage();
   localStorage.removeItem(timeStorageKey);
   cookie.remove(timeStorageKey);
   if (!value) {
      return null;
   }

   return value;
}

export function getTimeFromLocalStorage(cookie, raw = true) {
   const cookieValue = cookie.get(timeStorageKey);
   if (!raw) {
      const value = localStorage.getItem(timeStorageKey);

      if (!value) {
         return null;
      }

      return {
         disableUntilTime: JSON.parse(value).disableUntilTime,
         disableMinutes: JSON.parse(value).disableMinutes,
      };
   } else {
      const value = JSON.parse(localStorage.getItem(timeStorageKey));

      if (!value && cookieValue) {
         addTimeToLocalStorage(value.disableMinutes, cookie);
      }

      return value;
   }
}
