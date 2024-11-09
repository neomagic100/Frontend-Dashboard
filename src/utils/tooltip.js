import { computed } from 'vue';
import dateHelper from '@/utils/dateHelper';
const formatDate = dateHelper.formatDate;


export const tooltipText = computed(() => {
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

