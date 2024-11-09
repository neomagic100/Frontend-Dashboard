import { computed } from 'vue';
import dateHelper from '@/utils/dateHelper';
const averageDates = dateHelper.averageDates;
const findMaxDate = dateHelper.findMaxDate;


export function useTextFormat(props) {

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

   return {
      value,
      formatForDataType
   }
}
