import { ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import config from "../config/config.json";
import Log from "../utils/LogObject";

export const wsData = ref({});
export const wsStateRefs = ref({});
let socket = new WebSocket(config.ws);
const API_FETCH_DATA = "fetchData";
const API_SEND_DISABLE = "disable";
const API_SEND_ENABLE = "enable";
const API_GET_LOGS = "getLogs"; 
const RETRY_INTERVAL = 5000; // ms
const RETRY_LIMIT = 6;
let retryCount = 1;

export const openSocket = () => {
   socket.onopen = () => {
      console.log("websocket connected");
   };

   socket.onclose = () => {
      console.error("websocket disconnected");
      console.log(`reconnecting... (attempt ${retryCount})`);

      if (retryCount < RETRY_LIMIT) {
         sleep(RETRY_INTERVAL).then(() => {
            openSocket();
            retryCount++;
         });
      }
   }
}

socket.onmessage = (event) => {
   wsData.value = JSON.parse(event.data);
   parseWSData();
}

const sleep = async (ms) => await new Promise(resolve => setTimeout(resolve, ms));

const parseWSData = () => {
   if (wsData.value) {
      if (wsData.value.type === API_FETCH_DATA) {
         parseFetchedData();
      } else if (wsData.value.type === API_GET_LOGS) {
         parseFetchedLogs();
      }
   }
   else {
      console.log("no data");
      return;
   }
}

const parseFetchedData = () => {
   const {
      dns_queries_today,
      ads_blocked_today,
      ad_block_percentage,
      domains_blocked,
      gravity_last_updated,
      piEnabled
   } = wsStateRefs.value;
   dns_queries_today.pi1 = wsData.value.data.pi1.dns_queries_today || 0;
   dns_queries_today.pi2 = wsData.value.data.pi2.dns_queries_today || 0;
   ads_blocked_today.pi1 = wsData.value.data.pi1.ads_blocked_today || 0;
   ads_blocked_today.pi2 = wsData.value.data.pi2.ads_blocked_today || 0;
   ad_block_percentage.pi1 = wsData.value.data.pi1.ads_percentage_today || 0;
   ad_block_percentage.pi2 = wsData.value.data.pi2.ads_percentage_today || 0;
   domains_blocked.pi1 = wsData.value.data.pi1.domains_being_blocked || 0;
   domains_blocked.pi2 = wsData.value.data.pi2.domains_being_blocked || 0;
   gravity_last_updated.pi1 = wsData.value.data.pi1.gravity_last_updated || null;
   gravity_last_updated.pi2 = wsData.value.data.pi2.gravity_last_updated || null;
   piEnabled.pi1 = (wsData.value.data.pi1.status === "enabled");
   piEnabled.pi2 = (wsData.value.data.pi2.status === "enabled");
}

const parseFetchedLogs = () => {
   if (!wsData.value || !wsData.value.data) {
      return;
   }
   
   const { logObjs } = wsStateRefs.value;

   if (wsData.value.data) {
      for (const item of wsData.value.data) {
         const log = new Log(item);
         logObjs.enqueue(log);
      }
   }

   if (logObjs.queue.length > 0) {
      logObjs.sortQueue();
   }
}

// Enable and disable functions
export function enablePi() {
   togglePi("enable");
}
export function disablePi() {
   togglePi("disable");
}
function togglePi(action) {
   socket.send(JSON.stringify({ command: action === "enable" ? API_SEND_ENABLE : API_SEND_DISABLE }));
}

// Notification function
export function notify(statusChange) {
   const message =
      statusChange === "enabled"
         ? "Ad Blocking Enabled"
         : "Ad Blocking Disabled";
   toast(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      type:
         statusChange === "enabled"
            ? "success"
            : statusChange === "disabled"
            ? "warning"
            : "error",
      pauseOnFocusLoss: false,
      closeOnClick: true,
      closeButton: false,
   });
}
