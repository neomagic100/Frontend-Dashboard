<template>
   <div>
      <ContentHeader title="Pi-Hole Dashboard" />
      <section class="content">
         <div class="container-fluid">
            <div class="pi-status">
               <StatusBox :status="pi1Enabled" label="Proxmox Status" />
               <StatusBox :status="pi2Enabled" label="Raspberry Pi Status" />
            </div>
            <div class="status-boxes">
               <StatusColumnBox :piValues="dns_queries_today" dataType="int" useSum>DNS Queries Today</StatusColumnBox>
               <StatusColumnBox :piValues="ads_blocked_today" dataType="int" useSum>Ads Blocked Today</StatusColumnBox>
               <StatusColumnBox :piValues="ad_block_percentage" dataType="percent" useAvg>Ad Block Percentage
               </StatusColumnBox>
               <StatusColumnBox :piValues="domains_blocked" dataType="int" useAvg>Domains Blocked</StatusColumnBox>
               <StatusColumnBox :piValues="gravity_last_updated" dataType="date" useFirstValue>Gravity Last
                  Updated
               </StatusColumnBox>
            </div>
            <div class="row">
               <ActionButtonGroup :disableMinutes="disableMinutes" :formattedTime="formattedTime"
                  :isDisabled="isDisabled" @update:disableMinutes="disableMinutes = $event" @disableNow="disableNow"
                  @enableNow="enableNow" :disableNow="disableNow" :enableNow="enableNow"
                  :disableNowByTimer="disableNowByTimer" @disableNowByTimer="disableNowByTimer" />
               <LogTable :logs="logObjs" />
            </div>
         </div>
      </section>
   </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useCookies } from '@vueuse/integrations/useCookies';
import StatusBox from '@/components/StatusBox.vue';
import StatusColumnBox from '@/components/StatusColumnBox.vue';
import ActionButtonGroup from '@/components/ActionButtonGroup.vue';
import LogTable from '@/components/LogTable.vue';
import ContentHeader from '@/components/ContentHeader.vue';
import LogQueue from '@/utils/LogQueue';
import { fetchData, disablePi, enablePi, notify } from '@/utils/apiUtils.js';
import { timeStorageKey } from '@/utils/eventUtils';

const dns_queries_today = ref({ pi1: 0, pi2: 0 });
const ads_blocked_today = ref({ pi1: 0, pi2: 0 });
const ad_block_percentage = ref({ pi1: 0.0, pi2: 0.0 });
const domains_blocked = ref({ pi1: 0, pi2: 0 });
const gravity_last_updated = ref([{ pi1: { days: 0, hours: 0, minutes: 0 }, pi2: { days: 0, hours: 0, minutes: 0 } }]);
const pi1Enabled = ref(false);
const pi2Enabled = ref(false);
const disableMinutes = ref(60);
const remainingTime = ref(0);
const logObjs = ref(new LogQueue());
const globalTimer = { timerId: null };
const toastTimerId = ref({ enabled: null, disabled: null });
const toastShowing = ref({ enabled: false, disabled: false });
// Computed properties
const isDisabled = computed(() => remainingTime.value > 0);
const formattedTime = computed(() => {
   const minutes = Math.floor(remainingTime.value / 60)
      .toString()
      .padStart(2, '0');
   const seconds = (remainingTime.value % 60).toString().padStart(2, '0');
   return `${minutes}:${seconds}`;
})
const disabledSelected = ref(false);
const cookie = useCookies(['locale']);



// Lifecycle hooks
onMounted(() => {
   fetchData({
      dns_queries_today: dns_queries_today.value,
      ads_blocked_today: ads_blocked_today.value,
      ad_block_percentage: ad_block_percentage.value,
      domains_blocked: domains_blocked.value,
      gravity_last_updated: gravity_last_updated.value, pi1Enabled, pi2Enabled, logObjs
   }).then(setInterval(() => fetchData({
      dns_queries_today: dns_queries_today.value,
      ads_blocked_today: ads_blocked_today.value,
      ad_block_percentage: ad_block_percentage.value,
      domains_blocked: domains_blocked.value,
      gravity_last_updated: gravity_last_updated.value, pi1Enabled, pi2Enabled, logObjs
   }), 2000))

   if (getTimeFromLocalStorage() !== null) {
      const disableTime = getTimeFromLocalStorage();

      disableMinutes.value = disableTime.disableMinutes;
      const disableUntilTime = disableTime.disableUntilTime;

      remainingTime.value = Math.floor((disableUntilTime - Date.now()) / 1000) || 0;
      if (remainingTime.value > 0) {
         startTimer(remainingTime.value);
      }
      else {
         enableNow();
      }
   }
   if (disabledSelected.value) {
      disabledSelected.value = pi1Enabled.value == true && pi2Enabled.value == true;
   }
});
onUnmounted(() => clearInterval(startTimer));

// Watch remainingTime to handle enableNow trigger
watch(remainingTime, (newValue, oldValue) => {
   if (newValue === 0 && oldValue > 0) {
      enableNow()
   }

});
// Action handlers
const disableNowByTimer = () => {
   console.log("disableNowByTimer", disableMinutes.value);
   addTimeToLocalStorage(disableMinutes.value);
   remainingTime.value = disableMinutes.value * 60;
   startTimer(disableMinutes.value * 60);
   disableNow();
}

watch(toastShowing, (newValue, oldValue) => {
   if (!newValue.enabled && oldValue.enabled) {
      clearInterval(toastTimerId.enableToast);
      toastTimerId.enableToast = null;
   }
   if (!newValue.disabled && oldValue.disabled) {
      clearInterval(toastTimerId.disableToast);
      toastTimerId.disableToast = null;
   }

});

const startTimer = (duration, inSeconds = false) => {
   const timer = setInterval(() => {
      if (duration <= 0) {
         enableNow();
      } else {
         if (inSeconds) {
            duration /= 1000
         }
         remainingTime.value = duration;
         duration -= 1;
      }
   }, 1000); // 1000ms = 1s
   globalTimer.timerId = timer;
};

const startEnableToastTimer = (duration = 5) => {
   notify("enabled");
   toastTimerId.enableToast = setInterval(() => {
      if (duration <= 0) {
         toastShowing.enabled = false;
      } else {
         toastShowing.enabled = true;
         duration -= 1;
      }
   }, 1000);
};

const startDisableToastTimer = (duration = 5) => {
   notify("disabled");
   toastTimerId.disableToast = setInterval(() => {
      if (duration <= 0) {
         toastShowing.disabled = false;
      } else {
         toastShowing.disabled = true;
         duration -= 1;
      }
   }, 1000);
};

const disableNow = () => {
   disablePi();
   disabledSelected.value = true;
   if (!toastShowing.disabled) {
      startDisableToastTimer();
   }
};
const enableNow = () => {
   removeTimeFromLocalStorage();
   disabledSelected.value = false;
   remainingTime.value = 0;
   clearInterval(globalTimer.timerId);
   enablePi();
   if (!toastShowing.enabled) {
      startEnableToastTimer();

   }
};

function addTimeToLocalStorage(minutes) {
   removeTimeFromLocalStorage();
   console.log("store ", minutes);
   const time = Date.now() + minutes * 60 * 1000;
   const value = { disableUntilTime: time, disableMinutes: minutes };
   cookie.set(timeStorageKey, JSON.stringify(value));
   localStorage.setItem(timeStorageKey, JSON.stringify(value));
}

function removeTimeFromLocalStorage() {
   const value = getTimeFromLocalStorage();
   localStorage.removeItem(timeStorageKey);
   cookie.remove(timeStorageKey);
   if (!value) {
      return null;
   }

   return value;
}

function getTimeFromLocalStorage(raw = true) {
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
         addTimeToLocalStorage(value.disableMinutes);
      }

      return value;
   }
}

</script>

<style lang="scss">
@import '@/assets/variables.scss';

.pi-status {
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   margin: auto 5% .5rem 5%;
}

body {
   background-color: $background-color !important;
}

.Toastify {
   animation-duration: 1000ms !important;
   opacity: 0.75 !important;
}

@media (min-width: 768px) {
   .status-boxes {
      display: flex;
      flex-direction: row row-reverse;
      flex-wrap: wrap;
      justify-content: space-between;
      margin: auto 5% .5rem 5%;
      
   }
}

@media (max-width: 768px) {
   .status-boxes {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin: auto .25rem 0 .25rem !important;
   }
}

</style>
