<template>
   <div v-if="tooltipText"
      v-tooltip="(props.dataType !== 'date') ? tooltipText : `Proxmox: ${formatDate(props.piValues.pi1)} RP: ${formatDate(props.piValues.pi2)}` || 'Loading...'"
      class="col-lg-3 col-6">
      <!-- small box -->
      <div class="small-box bg-info">
         <div class="inner">
            <h3 :class="{ 'flash-green': flash }">
               <!-- {{ props.dataType === "percent" ? `${value.toFixed(2)}%` : value }} -->
               {{ boxDataValue }}
            </h3>
            <h4>
               <slot></slot>
            </h4>
         </div>
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
const tempValueRef = ref(null);
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
      return `${Math.floor(tempValue)}`;
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
      return `Proxmox: ${props.piValues.pi1} RP: ${props.piValues.pi2}`
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
