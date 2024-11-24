import { ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import config from "../config/config.json" with { type: "json" };
import Log from "./LogObject.js";

export const wsData = ref({});
export const wsStateRefs = ref({});
const socket = new WebSocket(config.ws);
const API_FETCH_DATA = "fetchData";
const API_SEND_DISABLE = "disable";
const API_SEND_ENABLE = "enable";
const API_SEND_DISABLE_MINUTES = "disableMinutes";
const API_GET_LOGS = "getLogs"; 
const API_ADD_TO_LIST = "addToList";
const RETRY_INTERVAL = 5000; // ms
const RETRY_LIMIT = 6;
let retryCount = 1;

/**
 * Establishes a connection to the websocket server. If the connection is
 * lost, it will automatically reconnect up to RETRY_LIMIT times with a
 * delay of RETRY_INTERVAL between each attempt.
 */
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

/**
 * Handles incoming messages from the WebSocket server.
 * Parses the event data and updates the wsData reactive reference 
 * with the parsed JSON data, then processes it with parseWSData.
 * 
 * @param {MessageEvent} event - The message event containing data from the WebSocket server.
 */
socket.onmessage = (event) => {
   wsData.value = JSON.parse(event.data);
   parseWSData();
}

/**
 * Pauses the execution for a specified duration.
 *
 * @param {number} ms - The duration in milliseconds for which the execution should be paused.
 * @returns {Promise<void>} A promise that resolves after the specified duration.
 */
const sleep = async (ms) => {
   return await new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Parses WebSocket data based on the event type.
 *
 * If the event type is API_FETCH_DATA, calls parseFetchedData to process the data.
 * If the event type is API_GET_LOGS, calls parseFetchedLogs to process the data.
 *
 * Logs a message if no data is received.
 */
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

/**
 * Parses the data received from the WebSocket server when the event type is API_FETCH_DATA.
 *
 * Updates the reactive references in wsStateRefs with the parsed data.
 *
 * The updated reactive references are:
 * - dns_queries_today
 * - ads_blocked_today
 * - ad_block_percentage
 * - domains_blocked
 * - gravity_last_updated
 * - piEnabled
 * 
 * @private
 */
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

/**
 * Parses the data received from the WebSocket server when the event type is API_GET_LOGS.
 *
 * Enqueues each log item from the received data into the logObjs reactive reference.
 *
 * If there is no data, the function exits early.
 *
 * @private
 */
const parseFetchedLogs = () => {
   if (!wsData.value || !wsData.value.data) {
      return;
   }
   
   const { logObjs } = wsStateRefs.value;
   const currentLog = logObjs;

   if (wsData.value.data) {
      for (const item of wsData.value.data) {
         const log = new Log(item);
         currentLog.enqueue(log);
      }
   }
}


/**
 * Enables ad blocking on the Pi-hole.
 *
 * Sends a command to the WebSocket server to enable ad blocking.
 *
 * @function enablePi
 * @memberof module:apiUtils
 */
export function enablePi() {
   togglePi("enable");
}

/**
 * Disables ad blocking on the Pi-hole.
 *
 * Sends a command to the WebSocket server to disable ad blocking.
 *
 * @function disablePi
 * @memberof module:apiUtils
 */
export function disablePi() {
   togglePi("disable");
}

/**
 * Sends a command to disable ad blocking on the Pi-hole for a specified number of minutes.
 *
 * @param {number} minutes - The duration in minutes for which ad blocking should be disabled.
 */
export function disablePiTimer(minutes) {
   socket.send(JSON.stringify({ command: API_SEND_DISABLE_MINUTES, data: minutes }));
}

/**
 * Toggles the ad blocking status on the Pi-hole.
 *
 * Sends a command to the WebSocket server to either enable or disable
 * ad blocking based on the specified action.
 *
 * @param {string} action - The action to perform, either "enable" or "disable".
 */
function togglePi(action) {
   socket.send(JSON.stringify({ command: action === "enable" ? API_SEND_ENABLE : API_SEND_DISABLE }));
}

export function addToList(domain, listType) {
   socket.send(JSON.stringify({ command: API_ADD_TO_LIST, data: { domain, listType } }));
}

/**
 * Displays a toast notification with a message based on the status change.
 *
 * @param {string} statusChange - The status change, either "enabled" or "disabled".
 */
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

export function notifyAddedToList(domain, listType) {
   const message = `Added ${domain} to ${listType.charAt(0).toUpperCase() + listType.slice(1)}list`;
   toast(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      type: "success",
      pauseOnFocusLoss: false,
      closeOnClick: true,
      closeButton: false,
   });
}

