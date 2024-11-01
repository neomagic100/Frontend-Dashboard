<template>
   <div class="row mt-3">
      <div class="timer-button-group">
         <button v-for="time in definedTimes" :key="time" class="btn btn-info time-button"
            @click="disableFor(time)"><span class="time-btn-text"><strong>{{ time }}
                  min</strong></span></button>
      </div>
   </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';
import { ref } from 'vue';

const definedTimes = [5, 15, 30, 60, 120];
const props = defineProps({
   disableMinutes: Number
})
const emits = defineEmits({
   disableFor: Number,
   'update:disableMinutes': Number
})

const disableFor = (time) => {
   emits('disableFor', time);
};

</script>

<style lang="scss" scoped>
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

   // padding: 10px 0;
   // margin-bottom: 25px;
   .time-button {
      width: 17%;
      text-wrap-mode: nowrap;


      .time-btn-text {
         align-items: center;
         justify-content: center;
         display: flex;
      }
   }
}
</style>