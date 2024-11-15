<template>
   <div class="table-responsive">
      <div class="d-flex justify-content-between">
         <h4 class="text-center table-title">Query Log</h4>
         <button class="btn btn-secondary pause-button" @click="togglePause" :disabled="!logArray.length">
            {{ isPaused ? 'Resume' : 'Pause' }}
         </button>
      </div>
      <section id="log-table">
         <table class="table-bordered">
            <thead>
               <tr>
                  <th class="fixed-width-12percent time-column">Time</th>
                  <th class="fixed-width-12percent query-type-column">Query Type</th>
                  <th class="fixed-width-25percent domain-queried-column">Domain Queried</th>
                  <th class="fixed-width-12percent handled-by-column">Handled By</th>
                  <th class="hide-small fixed-width-10percent origin-client-column">Origin Client</th>
                  <th class="fixed-width-10percent status-column">Status</th>
                  <th class="hide-small fixed-width-10percent action-taken-column">Action Taken</th>
               </tr>
            </thead>
            <tbody>
               <tr v-if="!logArray.length">
                  <td colspan="7">No logs</td>
               </tr>
               <tr v-for="log in paginatedLogs()" :key="log.id">
                  <td class="time-column">{{ log.time }}</td>
                  <td class="query-type-column">{{ log.queryType }}</td>
                  <td class="domain-queried-column"
                     :style=" { color: (log.actionTaken==='Blocked' && log.status.includes('Blocked')) ? 'red' : 'inherit'}">
                     {{ log.domainQueried }}</td>
                  <a :href="(log.handledBy === 'Proxmox') ? config.url : config.url2">
                     <td class="handled-by-column">{{ log.handledBy }}</td>
                  </a>
                  <td class="origin-client-column hide-small">{{ log.originClient }}</td>
                  <td class="status-column">{{ log.status }}</td>
                  <td class="action-taken-column hide-small">{{ log.actionTaken }}</td>
               </tr>
            </tbody>
         </table>
      </section>
      <PaginateSelect class="paginate-select" :key="currentPage" :items-per-page="perPage" :total-items="logArray.length"
         :currentPage="currentPage" @change-page="updateChangePage" />

   </div>
</template>

<script setup lang="js">
import { defineProps, ref, computed, watch } from 'vue';
import config from '../config/config.json';
import PaginateSelect from '@/components/PaginateSelect.vue';

const props = defineProps({ logs: Array });
const logArray = props.logs;
const pausedLogs = ref([]);
const perPage = 20;
const currentPage = ref(1);
const logCount = ref(0);
const pages = computed(() => {
   return Math.ceil(logArray.length / perPage);
});

const paginatedLogs = () => {
   if (isPaused.value) {
      return pausedLogs.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage);
   } else {
      return logArray.slice((currentPage.value - 1) * perPage, currentPage.value * perPage);
   }
};

function updateChangePage(page) {
   currentPage.value = page;
   // updatePaginatedLogs(page);
}
function updatePaginatedLogs(page) {
   paginatedLogs.value = logArray.slice((page - 1) * perPage, page * perPage);
}

function getPaginatedLogs() {
   return logArray.slice((currentPage.value - 1) * perPage, currentPage.value * perPage);
}

function togglePause() {
   isPaused.value = !isPaused.value;
   if (isPaused.value) {
      pausedLogs.value = logArray.slice();
   } else {
      pausedLogs.value = logArray.slice((currentPage.value - 1) * perPage, currentPage.value * perPage);
   }
}

const isPaused = ref(false);

watch(logArray, (newLogs) => {
   if (!isPaused.value && newLogs.length >= 100 && logCount.value < 100) {
      togglePause();
   }
   logCount.value = newLogs.length;
});
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.table-responsive {
   background-color: #2e2b3d;
   padding: 15px;
   border-radius: 8px;
}

h4 {
   font-family: "Bender-Solid", sans-serif;
   color: $text-color ;
   width: fit-content;
   align-self: center;
   justify-self: center;
   margin-bottom: 1rem;
   font-size: xx-large;
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

      &:nth-child(odd) {
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
         overflow: hidden;
         text-overflow: ellipsis;

         &.hide-small {
            @media (max-width: 768px) {
               display: none;
            }
         }

         a {
            color: $text-color ;
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

      .time-column {
         width: 12%;
      }

      .query-type-column {
         width: 12%;
         min-width: 100px;
      }

      .domain-queried-column {
         width: 25%;
         max-width: 25%;
      }

      .handled-by-column {
         width: 12%;
         min-width: 100px;
      }

      .origin-client-column {
         width: 10%;
      }

      .status-column {
         width: 10%;
      }

      .action-taken-column {
         width: 10%;
      }
   }
}

.paginate-select {
   margin-top: 1rem;
}

.pause-button {
   background-color: darkslategray;
   color: white;
   border: none;
   border-radius: 4px;
   padding: 10px 20px;
   cursor: pointer;
   font-size: 16px;
   font-family: 'orbitron-bold';
   margin: auto .5rem 1rem .5rem;

   &:hover {
      background-color: darken(darkslategray, 10%);
   }
}
@media (max-width: 768px) {
   .table-title {
      position: sticky !important;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1;
   }

   .pause-button {
      position: sticky !important;
      top: 0;
      right: 0;
      z-index: 1;
      
   }

   .table-responsive {
      padding: 0;
   }

   .hide-small {
      display: none;
   }
}
</style>

