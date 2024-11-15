<template>
   <nav aria-label="Pagination Select">
      <ul class="pagination justify-content-center">
         <li class="page-item" v-for="page in pages" :key="page">
            <a class="page-link" href="#log-table" @click="changePage(page)" :class="{ active: page === currentPage }">{{ page
               }}</a>
         </li>
      </ul>
   </nav>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
   itemsPerPage: {
      type: Number,
      default: 20,
   },
   totalItems: {
      type: Number,
      required: true,
   },
   currentPage: {
      type: Number,
      default: 1,
   },
});

const emits = defineEmits(['change-page']);

const changePage = (page) => {
   emits('change-page', page);
};

const pages = computed(() => {
   const totalPages = Math.ceil(props.totalItems / props.itemsPerPage);
   return Array.from({ length: totalPages }, (_, i) => i + 1);
});
</script>

<style scoped>
   .page-item {
      display: inline-flex;
      width: 35px;
      align-items: center;
      justify-content: space-evenly;
   }

   .page-link {
      cursor: pointer;
      color: white;
      font-family: 'orbitron-bold';
      font-size: 1em;
      background-color: darkslategray;

      &:hover {
         border: 2px groove dodgerblue;
         &:not(.active) {
            background-color: darken(darkslategray, 30%);
            color: aliceblue;  
         }
      }
      

      &.active {
         background-color: dodgerblue;
         color: white;
         border: 1px solid white;
      }
   }
</style>
