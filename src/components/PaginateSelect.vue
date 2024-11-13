<template>
   <nav aria-label="Page navigation example">
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
