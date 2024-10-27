<template>
   <div class="table-responsive">
      <h4>Log Objects</h4>
      <table class="table-bordered">
         <thead>
            <tr>
               <th>Time</th>
               <th>Query Type</th>
               <th>Domain Queried</th>
               <th>Handled By</th>
               <th>Origin Client</th>
               <th>Status</th>
               <th>Action Taken</th>
            </tr>
         </thead>
         <tbody>
            <tr v-if="!logArray.length">
               <td colspan="7">No logs</td>
            </tr>
            <tr v-for="log in logArray" :key="log.id">
               <td>{{ log.time }}</td>
               <td>{{ log.queryType }}</td>
               <td
                  :style="{ color: (log.actionTaken === 'Blocked' && log.status.includes('Blocked')) ? 'red' : 'inherit' }">
                  {{ log.domainQueried }}</td>
               <a :href="(log.handledBy === 'Proxmox') ? config.url : config.url2">
                  <td>{{ log.handledBy }}</td>
               </a>
               <td>{{ log.originClient }}</td>
               <td>{{ log.status }}</td>
               <td>{{ log.actionTaken }}</td>
            </tr>
         </tbody>
      </table>
   </div>
</template>

<script setup lang="js">
import { defineProps } from 'vue';
import config from '../config/config.json';
const props = defineProps({ logs: Array });
const logArray = props.logs.toArray();
</script>

<style lang="scss">
@import '@/assets/variables.scss';

.table-responsive {
   background-color: #2e2b3d;
   padding: 15px;
   border-radius: 8px;
}

table {
   width: 100%;
   color: $text-color;
   border-collapse: collapse;

   th {
      background-color: $odd-row-bg !important;
      font-weight: bold;
      color: $text-color ;
      border-bottom: 2px solid $table-border-color;
      padding: 8px 10px;
      text-align: center;
      vertical-align: middle;
   }

   tr {
      color: $text-color;
      text-align: center;

      text- &:nth-child(odd) {
         background-color: $odd-row-bg ;
      }

      &:nth-child(even) {
         background-color: $even-row-bg ;
      }

      &:hover {
         background-color: $highlight-color ;
      }

      td {
         padding: 8px 10px;
         border-top: 1px solid $table-border-color;
         color: $text-color;
         text-align: center;
         vertical-align: middle;
         background-color: inherit;

         a {
            color: $text-color;
            text-decoration: underline;
            text-decoration-color: lighten($background-color, 100%) !important;
            vertical-align: middle !important;
            text-align: center !important;

            &:hover {
               color: inherit;
               text-decoration: none;
            }
         }
      }
   }
}
</style>