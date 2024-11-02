<template>
   <div class="content-header">
      <h1>{{ title }}</h1>
   </div>
</template>

<script setup lang="js">
import { defineProps } from 'vue';
const props = defineProps({ title: String });
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.content-header {
   color: white;
   display: flex;
   justify-content: center;
   align-items: center;
   padding: 10px 0;
   margin-bottom: 25px;
   border-radius: 20px;
   background-color: adjust-color($color: $background-color, $saturation: 10%, $lightness: 10%, $alpha: 1.0, $hue: 0) !important;
   box-shadow: 0 2px 4px adjust-color($color: $background-color, $saturation: 10%, $lightness: 30%, $alpha: 1.0, $hue: 0);
   font-family: "orbitron-bold";
}
</style>