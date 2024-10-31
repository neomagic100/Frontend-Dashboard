<template>
   <div>
      <ContentHeader title="Dashboard" />
      <section class="content">
         <div class="container-fluid">
            <div class="row">
               <div class="col-lg-3 col-6">
                  <StatusBox :status="pi1Enabled" label="Proxmox Status" />
               </div>
               <div class="col-lg-3 col-6">
                  <StatusBox :status="pi2Enabled" label="Raspberry Pi Status" />
               </div>
            </div>
            <div class="row">
               <StatusColumnBox :piValues="dns_queries_today">DNS Queries Today</StatusColumnBox>
               <StatusColumnBox :piValues="ads_blocked_today">Ads Blocked Today</StatusColumnBox>
               <StatusColumnBox :piValues="ad_block_percentage" :isPercent="true">Ad Block Percentage
               </StatusColumnBox>
               <StatusColumnBox :piValues="domains_blocked">Domains Blocked</StatusColumnBox>
               <StatusColumnBox :piValues="gravity_last_updated">Gravity Last Updated</StatusColumnBox>
               <ActionButtonGroup :disableMinutes="disableMinutes" :formattedTime="formattedTime"
                  :isDisabled="isDisabled" @update:disableMinutes="disableMinutes = $event" @disableNow="disableNow"
                  @enableNow="enableNow" :disableNow="disableNow" :enableNow="enableNow"
                  :disableNowByTimer="disableNowByTimer" />
               <LogTable :logs="logObjs" />
            </div>
         </div>
      </section>
   </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onUnmounted, watch, reactive } from 'vue';
import StatusBox from '@/components/StatusBox.vue';
import StatusColumnBox from '@/components/StatusColumnBox.vue';
import ActionButtonGroup from '@/components/ActionButtonGroup.vue';
import LogTable from '@/components/LogTable.vue';
import ContentHeader from '@/components/ContentHeader.vue';
import LogQueue from '@/utils/LogQueue';
import { fetchData, disablePi, enablePi, notify } from '@/utils/apiUtils.js';

// Reactive references and setup
const dns_queries_today = ref({ pi1: 0, pi2: 0 });
const ads_blocked_today = ref({ pi1: 0, pi2: 0 });
const ad_block_percentage = ref({ pi1: 0.0, pi2: 0.0 });
const domains_blocked = ref({ pi1: 0, pi2: 0 });
const gravity_last_updated = ref({
   pi1: { days: 0, hours: 0, minutes: 0 },
   pi2: { days: 0, hours: 0, minutes: 0 }
});
const pi1Enabled = ref(false);
const pi2Enabled = ref(false);
const disableMinutes = ref(60);
const remainingTime = ref(0);
const logObjs = ref(new LogQueue());
var timer = null;

// Computed properties
const isDisabled = computed(() => remainingTime.value > 0);
const formattedTime = computed(() => {
   const minutes = Math.floor(remainingTime.value / 60)
      .toString()
      .padStart(2, '0');
   const seconds = (remainingTime.value % 60).toString().padStart(2, '0');
   return `${minutes}:${seconds}`;
})

// Lifecycle hooks
onMounted(() => fetchData({
   dns_queries_today: dns_queries_today.value,
   ads_blocked_today: ads_blocked_today.value,
   ad_block_percentage: ad_block_percentage.value,
   domains_blocked: domains_blocked.value,
   gravity_last_updated: gravity_last_updated.value, pi1Enabled, pi2Enabled, logObjs
}));
onUnmounted(() => clearInterval(startTimer));

// Watch remainingTime to handle enableNow trigger
watch(remainingTime, (newValue) => { if (newValue === 0) enableNow(); console.log("remainingTime", newValue); });
watch(formattedTime, (newValue) => { console.log("formattedTime", newValue); });
watch(disableMinutes, (newValue) => { console.log("disableMinutes", newValue); });
setInterval(() => fetchData({
   dns_queries_today: dns_queries_today.value,
   ads_blocked_today: ads_blocked_today.value,
   ad_block_percentage: ad_block_percentage.value,
   domains_blocked: domains_blocked.value,
   gravity_last_updated: gravity_last_updated.value, pi1Enabled, pi2Enabled, logObjs
}), 2000);

// Action handlers
const disableNowByTimer = () => {
   remainingTime.value = disableMinutes.value * 60;
   startTimer(disableMinutes.value * 60);
   console.log("remainingTime", remainingTime.value);
   console.log("disableMinutes", disableMinutes.value);
   disableNow();
}

const startTimer = (duration) => {
   console.log("startTimer", duration);
   const timer = setInterval(() => {
      if (duration <= 0) clearInterval(timer);
      else duration -= 1;
   }, duration * 1000);

}

const disableNow = () => {
   disablePi();
   notify("disabled");
};
const enableNow = () => {
   remainingTime.value = 0;
   enablePi();
   notify("enabled");
};

</script>

<style lang="scss">
@import '@/assets/variables.scss';

body {
   background-color: $background-color !important;
}

h1.m-0 {
   color: white;
}
</style>
