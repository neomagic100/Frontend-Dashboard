<template>
   <div :class="['inner', 'center', 'statusBox', { 'statusBox--active': status }]"
      :style="{ backgroundColor: statusColor }">
      <h4 class="status-text">{{ label }}: {{ status ? 'Up' : 'Down' }}</h4>
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

.status-text {
   font-family: 'bender-solid', sans-serif;
   font-size: 25pt;
   // padding-left: 5rem;
   // padding-right: 5rem;
}

@media (max-width: 768px) {

   .inner.center {
      padding: 0;
      margin-bottom: 0.25rem;
      border-radius: 0.25rem;
      box-shadow: none;
   }

   .statusBox {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      padding: 0;
      margin-bottom: 0.25rem;
      border-radius: 0.25rem;
      text-align: center;
      width: 100%;
      padding: .25rem .25rem;
      margin: .25rem, .25rem, 0, .25rem;
      box-shadow: none;
      border-style: none;
   }

   .status-text {
      font-size: 18pt;
      text-wrap: ellipsis;
      text-overflow: ellipsis;
      padding-left: none;
      padding-right: none;
   }
}
</style>
