<template>
   <div :class="['inner', 'center', 'statusBox', { 'statusBox--active': status }]"
      :style="{ backgroundColor: statusColor }">
      <h4>{{ label }}: {{ status ? 'Up' : 'Down' }}</h4>
   </div>
</template>

<script setup lang="js">
import { computed, defineProps } from 'vue';
const props = defineProps({ status: Boolean, label: String });
const statusColor = computed(() => (props.status ? 'rgba(0, 200, 0, 0.75)' : 'rgba(200, 0, 0, 0.75)'));
</script>

<style lang="scss">
@import '@/assets/variables.scss';

.inner.center {
   @include center-flex;
   padding: 10px 0;
   margin-bottom: 25px;
   border-radius: 20px;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.statusBox {
   background-color: $inactive-status-red;

   &--active {
      background-color: $active-status-green;
   }
}
</style>
