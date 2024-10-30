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
               <StatusColumnBox :value="dns_queries_today">DNS Queries Today</StatusColumnBox>
               <StatusColumnBox :value="ads_blocked_today">Ads Blocked Today</StatusColumnBox>
               <StatusColumnBox :value="ad_block_percentage">Ad Block Percentage</StatusColumnBox>
               <ActionButtonGroup :disableMinutes="disableMinutes" :formattedTime="formattedTime"
                  :isDisabled="isDisabled" @update:disableMinutes="disableMinutes = $event" @disableNow="disableNow"
                  @enableNow="enableNow" :disableNow="disableNow" :enableNow="enableNow" />
               <LogTable :logs="logObjs" />
            </div>
         </div>
      </section>
   </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import StatusBox from '@/components/StatusBox.vue';
import StatusColumnBox from '@/components/StatusColumnBox.vue';
import ActionButtonGroup from '@/components/ActionButtonGroup.vue';
import LogTable from '@/components/LogTable.vue';
import ContentHeader from '@/components/ContentHeader.vue';
import LogQueue from '@/utils/LogQueue';
import { fetchData, disablePi, enablePi, startTimer, notify } from '@/utils/apiUtils.js';

// Reactive references and setup
const dns_queries_today = ref(0);
const ads_blocked_today = ref(0);
const ad_block_percentage = ref(0);
const pi1Enabled = ref(false);
const pi2Enabled = ref(false);
const disableMinutes = ref(60);
const remainingTime = ref(0);
const logObjs = ref(new LogQueue());

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
onMounted(() => fetchData({ dns_queries_today, ads_blocked_today, ad_block_percentage, pi1Enabled, pi2Enabled, logObjs }));
onUnmounted(() => clearInterval(startTimer));

// Watch remainingTime to handle enableNow trigger
watch(remainingTime, (newValue) => { if (newValue === 0) enableNow(); });

setInterval(() => fetchData({ dns_queries_today, ads_blocked_today, ad_block_percentage, pi1Enabled, pi2Enabled, logObjs }), 2000);

// Action handlers
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
