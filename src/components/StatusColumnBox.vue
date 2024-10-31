<template>
   <div v-if="tooltipText" v-tooltip="tooltipText || ''" class="col-lg-3 col-6">
      <!-- small box -->
      <div class="small-box bg-info">
         <div class="inner">
            <h3 :class="{ 'flash-green': flash }">
               {{ props.isPercent ? `${value.toFixed(2)}%` : value }}
            </h3>
            <h4>
               <slot></slot>
            </h4>
         </div>
      </div>
   </div>
</template>

<script setup>
import { defineProps, watch, ref, defineOptions, computed } from 'vue';
import dateHelper from '@/utils/dateHelper';
const formatDate = dateHelper.formatDate;
const averageDates = dateHelper.averageDates;

const props = defineProps({
   piValues: {
      type: Object,
      required: true,
   },
   isPercent: {
      type: Boolean,
      default: false,
      required: false,
   },
});

const value = computed(() => {
   if (!props.piValues.pi1 || !props.piValues.pi2) {
      return props.piValues.pi1 ?? props.piValues.pi2 ?? 0;
   }

   if (typeof props.piValues.pi1 === "object" && typeof props.piValues.pi2 === "object" && !props.piValues.pi1.days && !props.piValues.pi2.days) {
      return props.piValues.pi1 ?? props.piValues.pi2 ?? 0;
   }
   if (props.isPercent) {
      return (props.piValues.pi1 + props.piValues.pi2) / 2;
   } else if (typeof props.piValues.pi1 === "number" && typeof props.piValues.pi2 === "number") {
      return props.piValues.pi1 + props.piValues.pi2;
   } else if (typeof props.piValues.pi1 === "object" && typeof props.piValues.pi2 === "object") {
      return formatDate(averageDates(props.piValues.pi1, props.piValues.pi2));
   }
});

watch(() => props.piValues, (newVal, oldVal) => {
   console.log('piValues updated:', newVal);
});
const tooltipText = computed(() => {
   if (!props.piValues.pi1 || !props.piValues.pi2) {
      return null;
   }
   if (typeof props.piValues.pi1 === "object" && typeof props.piValues.pi2 === "object" && !props.piValues.pi1.days && !props.piValues.pi2.days) {
      return null;
   }
   if (props.isPercent && typeof props.piValues.pi1 === "number" && typeof props.piValues.pi2 === "number") {
      return `Proxmox: ${props.piValues.pi1.toFixed(2)}%, RP: ${props.piValues.pi2.toFixed(2)}%`;
   } else if (typeof props.piValues.pi1 === "object" && typeof props.piValues.pi2 === "object") {
      return `Proxmox: ${formatDate(props.piValues.pi1)}, RP: ${formatDate(props.piValues.pi2)}`;
   } else if (typeof props.piValues.pi1 === "number" && typeof props.piValues.pi2 === "number") {
      return `Proxmox: ${props.piValues.pi1}, RP: ${props.piValues.pi2}`;
   }
});

const flash = ref(false);
const flashTimeout = ref(null);

watch(() => props.value, (newValue, oldValue) => {
   if (newValue !== oldValue) {
      flash.value = true;
      clearTimeout(flashTimeout.value);
      flashTimeout.value = setTimeout(() => {
         flash.value = false;
      }, 500);
   }
});
</script>

<style scoped>
.inner {
   text-align: center;
}

.flash-green {
   animation: flash-green 1s ease-in-out;
}

@keyframes flash-green {
   0% {
      color: white;
   }

   20% {
      color: rgb(32, 241, 49);
   }

   100% {
      color: white;
   }
}
</style>
