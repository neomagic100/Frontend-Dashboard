import { computed } from 'vue';
import dateHelper from './dateHelper.js';
const averageDates = dateHelper.averageDates;
const findMaxDate = dateHelper.findMaxDate;

/**
 * useTextFormat is a function that takes props and returns an object with two properties: value and formatForDataType.
 * The value property is a computed property that returns the value of either pi1 or pi2 depending on the value of props.piValues.pi1 and props.piValues.pi2.
 * The formatForDataType property is a function that takes a value and formats it according to the dataType property in props.
 * If dataType is "int", it returns the value as a string with commas.
 * If dataType is "percent", it returns the value as a string with a percent sign.
 * If dataType is "float", it returns the value as a string with two decimal places.
 * If dataType is "date", it returns the value as a string in the format "YYYY-MM-DD HH:mm:ss".
 * If dataType is not recognized, it returns the value as is.
 * @param {Object} props An object with the following properties:
 * - piValues: An object with two properties, pi1 and pi2, each of which is a number.
 * - dataType: A string that specifies the data type of the value, either "int", "percent", "float", or "date".
 * - useMax: A boolean that specifies whether to return the maximum of pi1 and pi2.
 * - useFirstValue: A boolean that specifies whether to return the first value of pi1 and pi2.
 * - useAvg: A boolean that specifies whether to return the average of pi1 and pi2.
 * @return {Object} An object with two properties, value and formatForDataType.
 */
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

   /**
    * Formats the value based on the dataType specified in the props.
    * @param {any} [val=value] - The value to be formatted. If not provided, the value from the computed property is used.
    * @returns {string} The formatted value.
    */
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
