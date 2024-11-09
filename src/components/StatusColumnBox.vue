<template>
   <div v-if="tooltipText"
      v-tooltip="(props.dataType !== 'date') ? tooltipText : `Proxmox: ${formatDate(props.piValues.pi1)} RP: ${formatDate(props.piValues.pi2)}` || 'Loading...'"
      class="status-column-box bg-info">
      <div class = "column column-right">
         <span class="status-box-data" :class="{ 'flash-green': flash }">
            {{ boxDataValue }}
         </span>
      </div>
      <div class = "column column-left">
         <span class="status-box-title">
            <slot></slot>
         </span>
      </div>
   </div>
</template>

<script setup>
import { defineProps, watch, ref, computed } from 'vue';
import dateHelper from '@/utils/dateHelper';
const formatDate = dateHelper.formatDate;
const averageDates = dateHelper.averageDates;
const findMaxDate = dateHelper.findMaxDate;

const props = defineProps({
   piValues: {
      type: Object,
      required: true,
   },
   dataType: {
      type: String,
      validator: (value) => {
         return ['int', 'percent', 'float', 'date'].includes(value);
      },
      default: 'int',
      required: true,
   },
   useSum: {
      type: Boolean,
      default: true,
      required: false,
   },
   useMax: {
      type: Boolean,
      default: false,
      required: false,
   },
   useAvg: {
      type: Boolean,
      default: false,
      required: false,
   },
   useFirstValue: {
      type: Boolean,
      default: false,
      required: false,
   }
});

const tooltipTextFormatted = ref(null);

const value = computed(() => {
   if (!props.piValues.pi1 || !props.piValues.pi2) {
      return props.piValues.pi1 ?? props.piValues.pi2 ?? 0;
   }

   if (props.dataType === "int" || props.dataType === "float" || props.dataType === "percent") {
      if (props.useMax) {
         return Math.max(props.piValues.pi1, props.piValues.pi2);
      }
      else if (props.useFirstValue) {
         return props.piValues.pi1;
      }
      else if (props.useAvg) {
         return (props.piValues.pi1 + props.piValues.pi2) / 2;
      }
      else {
         return props.piValues.pi1 + props.piValues.pi2;
      }
   } else if (props.dataType === "date") {
      if (props.useMax) {
         return findMaxDate(props.piValues.pi1, props.piValues.pi2);
      }
      else if (props.useFirstValue) {
         return props.piValues.pi1;
      }
      else if (props.useAvg) {
         return averageDates(props.piValues.pi1, props.piValues.pi2);
      }
      else {
         return props.piValues.pi1 + props.piValues.pi2;
      }
   }
});

const formatForDataType = (val = value) => {
   let tempValue;
   if (typeof val === "string" || val.value === undefined) {
      tempValue = val;
   }
   else if (value.value === null || value.value === undefined) {
      tempValue = 0;
   }
   else {
      tempValue = val.value;
   }

   if (props.dataType === "int" && typeof tempValue === "number") {
      return `${Math.floor(tempValue).toLocaleString()}`;
   } else if (props.dataType === "percent" && typeof tempValue === "number") {
      return `${tempValue.toFixed(2)}%`;
   } else if (props.dataType === "float" && typeof tempValue === "number") {
      return `${tempValue.toFixed(2)}`;
   } else if (props.dataType === "date" && typeof tempValue === "object") {
      return formatDate(tempValue);
   }
   else {
      return tempValue;
   }
}

const boxDataValue = computed(() => {
   return formatForDataType();
})

watch(() => props.piValues, (newVal, oldVal) => {
   console.log('piValues updated:', newVal.pi1, newVal.pi2, (props.dataType === "percent") ? "percentage" : "");
});

const tooltipText = computed(() => {
   if (!props.piValues.pi1 && !props.piValues.pi2) {
      return null;
   }
   if (props.dataType === "date") {
      return `Proxmox: ${formatDate(props.piValues.pi1)} RP: ${formatDate(props.piValues.pi2)}`
   }
   else {
      return `Proxmox: ${(props.piValues.pi1).toLocaleString()} RP: ${(props.piValues.pi2).toLocaleString()}`
   }
});

tooltipTextFormatted.value = tooltipText.value;
setInterval(() => {
   tooltipTextFormatted.value = tooltipText.value;
}, 2000);

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

<style lang="scss" scoped>
@import '@/assets/variables.scss';
@import '@/assets/fonts.scss';

@media (min-width: 768px) {
   .status-column-box {
      display: flex;
      width: 40%;
      min-width: 500px;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.5rem;
      margin: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      border-style: none;
      border-radius: 10px;
      text-wrap: nowrap;
   }
   .status-box-title {
      text-align: center;
      font-size: 20pt;
      font-weight: bold;
      font-family: "bender-solid";
      padding: 0.5rem;
   }

   .status-box-data {
      text-align: center;
      font-size: 30pt;
      font-weight: bold;
      font-family: "roboto-condensed-bold";
      padding: 0.5rem;
   }
}
@media (max-width: 768px) {
   .status-column-box {
      display: flex;
      flex-direction: row-reverse;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 0rem;
      padding-left: .5rem;
      padding-right: .5rem;
      margin: .1rem .25rem;
      border-style: none;
      border-radius: .5rem;
      text-wrap: nowrap;
      
      .column {
         display: flex;
         margin: .1rem;
         flex-direction: column;
      }

      .status-box-title {
         text-align: center;
         font-size: 1.2em;
         font-family: "bender-solid";
         font-weight: 100;
      }

      .status-box-data {
         text-align: center;
         font-size: 1.3em;
         font-family: "roboto-condensed-bold";
         font-weight: 900;
      }
   }
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
