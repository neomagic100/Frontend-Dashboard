<template>
   <div class="popup-modal" id="popup">
      <h5>Domain: {{ props.domain }}</h5>
      <button @click="doBlacklist">Blacklist</button>
      <button @click="doWhitelist">Whitelist</button>
   </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({ domain: String });

const doBlacklist = () => {
   console.log('Blacklist clicked');
}
const doWhitelist = () => {
   console.log('Whitelist clicked');
}
</script>

<style scoped lang="scss">
.Toastify {
   animation-duration: 1000ms !important;
   opacity: 0.75 !important;
}
</style>