<template>
   <div>
      <ContentHeader title="Pi-Hole Dashboard" />
      <section class="content">
         <div class="container-fluid">
            <div class="pi-status">
               <StatusBox :status="piEnabled.pi1" label="Proxmox Status" />
               <StatusBox :status="piEnabled.pi2" label="Raspberry Pi Status" />
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
                  :isDisabled="!piEnabled.pi1 && !piEnabled.pi2" @update:disableMinutes="disableMinutes = $event" @disableNow="disableNow"
                  @enableNow="enableNow" :disableNow="disableNow" :enableNow="enableNow" @disableNowByTimer="disableNowByTimer"
            />
               <LogTable :logs="logObjs" />
            </div>
         </div>
      </section>
   </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onUpdated, watch } from 'vue';
import StatusBox from '@/components/StatusBox.vue';
import StatusColumnBox from '@/components/StatusColumnBox.vue';
import ActionButtonGroup from '@/components/ActionButtonGroup.vue';
import LogTable from '@/components/LogTable.vue';
import ContentHeader from '@/components/ContentHeader.vue';
import LogQueue from '@/utils/LogQueue';
import { disablePi, disablePiTimer, enablePi, notify, openSocket, wsStateRefs } from '@/utils/apiUtils.js';

const dns_queries_today = ref({ pi1: 0, pi2: 0 });
const ads_blocked_today = ref({ pi1: 0, pi2: 0 });
const ad_block_percentage = ref({ pi1: 0.0, pi2: 0.0 });
const domains_blocked = ref({ pi1: 0, pi2: 0 });
const gravity_last_updated = ref([{ pi1: { days: 0, hours: 0, minutes: 0 }, pi2: { days: 0, hours: 0, minutes: 0 } }]);
const piEnabled=ref({pi1: null, pi2: null});
const disableMinutes = ref(60);
const remainingTime = ref(0);
const logObjs = ref(new LogQueue());
const toastTimerId = ref({ enabled: null, disabled: null });
const toastShowing = ref({ enabled: false, disabled: false });
const timeLeftReceived = ref({timeLeft: 0});
// Computed properties
const formattedTime = computed(() => {
   const minutes = Math.floor(remainingTime.value / 60)
      .toString()
      .padStart(2, '0');
   const seconds = (remainingTime.value % 60).toString().padStart(2, '0');
   return `${minutes}:${seconds}`;
})
const disabledTimer = ref(null);

// Lifecycle hooks
onMounted(() => {
   wsStateRefs.value =
   {
      dns_queries_today,
      ads_blocked_today,
      ad_block_percentage,
      domains_blocked,
      gravity_last_updated,
      piEnabled,
      disableMinutes,
      logObjs,
      timeLeftReceived
   };

   openSocket();
   checkForTimeLeft();
});

onUpdated(() => {
   checkForTimeLeft();
   checkForTimerRunningWhileEnabled();
})

const checkForTimeLeft = () => {
   if (remainingTime.value <= 0 && timeLeftReceived.value.timeLeft > 0) {
      remainingTime.value = timeLeftReceived.value.timeLeft;
      startTimer(remainingTime.value, true)
   }
}

const checkForTimerRunningWhileEnabled = () => {
   if (remainingTime.value > 0 && piEnabled.value.pi1 == true && piEnabled.value.pi2 == true) {
      remainingTime.value = 0;
   }
}

// Action handlers
const disableNowByTimer = () => {
   remainingTime.value = disableMinutes.value * 60;
   startTimer(disableMinutes.value);
   disablePiTimer(disableMinutes.value);
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

watch(remainingTime, (newValue, oldValue) => {
   if (newValue <= 0 && oldValue > 0) {
      if (disabledTimer.value) {
         clearInterval(disabledTimer.value);
         disabledTimer.value = null;
      }
      remainingTime.value = 0;
   }
})

const startTimer = (duration, isSeconds = false) => { // duration in minutes
   let timeLeft = isSeconds ? duration : duration * 60;
   if (disabledTimer.value) {
      clearInterval(disabledTimer.value);
      disabledTimer.value = null;
   }
   disabledTimer.value = setInterval(() => {
      if (remainingTime.value <= 0) {
         clearInterval(disabledTimer.value);
         remainingTime.value = 0;
         disabledTimer.value = null;
      }
      remainingTime.value = timeLeft;
      timeLeft -= 1;
   }, 1000);
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
   if (!toastShowing.disabled) {
      startDisableToastTimer();
   }
};
const enableNow = () => {
   remainingTime.value = 0;
   enablePi();
   if (!toastShowing.enabled) {
      startEnableToastTimer();
   }
};

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
