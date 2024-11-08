<template>
   <div class="row">
      <div class="timer-button-group col-lg-auto">
         <button v-for="time in definedTimes" :key="time" class="btn btn-info time-button"
            @click="disableFor(time)"><span class="time-btn-text"><strong>{{ time }}
                  min</strong></span></button>
      </div>
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

<style lang="scss">
@import '@/assets/variables.scss';

.timer-button-group {
   display: inline-flex;
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
   // border-radius: 20px;
   // background-color: adjust-color($color: $background-color, $saturation: 10%, $lightness: 10%, $alpha: 1.0, $hue: 0) !important;
   // box-shadow: 0 2px 4px adjust-color($color: $background-color, $saturation: 10%, $lightness: 30%, $alpha: 1.0, $hue: 0);
   // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

   padding: 10px 0;
   margin-bottom: 25px;

   .time-button {


      .time-btn-text {
         align-items: center;
         justify-content: center;
         display: flex;
      }
   }
}

@media (max-width: 768px) {
   .timer-button-group {
      display: flex;

      flex-wrap: wrap;
      justify-content: space-around;
      margin-left: .5rem;
      margin-right: .5rem;



      .time-button {
         width: 30%;
         margin-top: .5rem;
         margin-bottom: .5rem;
         height: 3.5rem;

         .time-btn-text {
            font-size: 1.5em;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;

         }
      }
   }
}
</style>