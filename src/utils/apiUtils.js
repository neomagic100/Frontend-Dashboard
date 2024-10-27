import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import config from '../config/config.json';
import Log from '../utils/LogObject';

// Fetch data function
export async function fetchData(stateRefs) {
   const { dns_queries_today, ads_blocked_today, ad_block_percentage, pi1Enabled, pi2Enabled, logObjs } = stateRefs;
   try {
      const response1 = await fetch(config.url + "api.php?summaryRaw&auth=" + config.key);
      const data1 = await response1.json();
      pi1Enabled.value = data1.status === "enabled";

      const response2 = await fetch(config.url2 + "api.php?summaryRaw&auth=" + config.key2);
      const data2 = await response2.json();
      pi2Enabled.value = data2.status === "enabled";

      dns_queries_today.value = data1.dns_queries_today + data2.dns_queries_today;
      ads_blocked_today.value = data1.ads_blocked_today + data2.ads_blocked_today;
      ad_block_percentage.value = (data1.ads_percentage_today + data2.ads_percentage_today) / 2;
      
      await fetchLogs(stateRefs);
   } catch (error) {
      console.error(error);
   }
}

export async function fetchLogs(stateRefs, numberQueries = 10) {
   const queryUrl1 = config.url + "api.php?getAllQueries=" + numberQueries + "&auth=" + config.key;
   const queryUrl2 = config.url2 + "api.php?getAllQueries=" + numberQueries + "&auth=" + config.key2;
   try {
      const { logObjs } = stateRefs;
      const response = await fetch(queryUrl1);
      const data = await response.json();
      const response2 = await fetch(queryUrl2);
      const data2 = await response2.json();
      // let tempQueue = new LogQueue();
      for (let item of data.data) {
         item.push("Proxmox");
         let log = new Log(item);
         logObjs.value.enqueue(log);
      }
      
      for (let item of data2.data) {
         item.push("RP");
         let log = new Log(item);
         logObjs.value.enqueue(log);
      }
      logObjs.value.sortQueue();
 
   } catch (error) {
      console.log(error);
   }
}

// Enable and disable functions
export async function enablePi() {
   await togglePi('enable');
}
export async function disablePi() {
   await togglePi('disable');
}
async function togglePi(action) {
   const urls = [config.url + `api.php?${action}&auth=` + config.key, config.url2 + `api.php?${action}&auth=` + config.key2];
   try {
      await Promise.all(urls.map(url => fetch(url, { method: 'GET' })));
   } catch (error) {
      console.error(`Failed to ${action} ad blocker`, error);
   }
}

// Timer
export function startTimer(duration, callback) {
   const timer = ref(null);
   timer.value = setInterval(() => {
      if (duration.value <= 0) clearInterval(timer.value);
      else duration.value -= 1;
   }, 1000);
   return timer.value;
}

// Notification function
export function notify(statusChange) {
   console.log(statusChange);
   const message = (statusChange === "enabled") ? "Ad Blocking Enabled" : "Ad Blocking Disabled";
   toast(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      type: statusChange === "enabled" ? "success" : statusChange === "disabled" ? "warning" : "error",
      pauseOnFocusLoss: false,
      closeOnClick: true,
      closeButton: false,
   })
}

