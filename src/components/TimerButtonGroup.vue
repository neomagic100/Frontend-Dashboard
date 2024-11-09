<template>
   <div class="timer-button-group col-lg-auto">
      <button v-for="time in definedTimes" :key="time" class="btn btn-info time-button"
         @click="disableFor(time)"><span class="time-btn-text"><strong>{{ time }}
               min</strong></span></button>
   </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const definedTimes = [5, 15, 30, 60, 120];
const emits = defineEmits(['disableForPreset']);

const disableFor = (time) => {
   emits('disableForPreset', Number(time));
};
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
@media (min-width: 768px) {
   .timer-button-group {
      display: inline-flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      margin: 1rem .5rem 1rem .5rem;
      width: 100%;
      .time-button {
         width: 15%;
         margin: .5rem .3rem .5rem .3rem;
         .time-btn-text {
            align-items: center;
            justify-content: center;
            display: flex;
            font-size: 1.6em;
            font-family: "roboto-condensed-bold";
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
         
         }
      }
   }
}
@media (max-width: 768px) {
   .timer-button-group {
      display: flex;
      width: 100%;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: stretch;
      align-items: center;
      margin: .5rem .5rem .5rem .5rem;
      
      .time-button {
         width: 30%;
         margin: .25rem .3rem .25rem .3rem;
         height: 3.1rem;
         border-radius: .75rem !important;

         .time-btn-text {
            font-size: 1.4em;
            font-family: "roboto-condensed-bold";
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
         }
      }
   }
}
</style>