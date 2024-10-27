<template>
   <div>
      <h4>Log Objects</h4>
      <ul class="list-group list-group-flush">
         <li v-if="logObjs.length === 0" class="list-group-item">No logs</li>
         <li v-else class="list-group-item" v-for="log in logObjs">
            {{ log.toString() }}
         </li>
      </ul>>
      <h4>Logs</h4>
      <ul class="list-group list-group-flush">
         <li v-if="logs.length === 0" class="list-group-item">No logs</li>
         <li v-else class="list-group-item" v-for="log in logs">
            {{ log }}
         </li>
      </ul>
   </div>
</template>

<script setup>
import LogObject from '@/components/LogObject';
import { defineProps, ref } from 'vue';

const props = defineProps({
   logs: Array
})


const logs = props.logs;
const logObjs = ref([]);

for (const log of logs) {
   if (logObjs.value.length > 20) {
      logObjs.value.pop();
   }

   let l = new LogObject(log);
   logObjs.value.unshift(l);
}


</script>

<style></style>