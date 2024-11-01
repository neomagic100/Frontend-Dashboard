<template>
   <div class="row action-group">
      <div class="col-md-7 user-input inline-timer">
         <div class="input-group">
            <input type="number" :value="disableMinutes" placeholder="60"
               @input="updateDisableMinutes($event.target.value)" />
            <button class="btn btn-danger btn-md btn-block" @click="disableNowByTimer">
               {{ isDisabled ? 'Disabled' : 'Disable Blocker' }}
            </button>
            <h4 class="timer-display">{{ formattedTime }}</h4>
         </div>
         <!-- <div class="input-group"> -->
         <TimerButtonGroup :disableMinutes="disableMinutes" @disableFor="updateDisableMinutes($event.target.value)" />
         <!-- </div> -->
      </div>
      <div class="col-md-5 user-input">
         <div class="input-group">
            <button class="btn btn-success" @click="enableNow()">Enable Now</button>
            <button class="btn btn-danger" @click="disableNow()">Disable Now</button>
         </div>
         <div class="input-group">
         </div>
      </div>
   </div>
</template>

<script setup lang="js">
import { defineProps, defineEmits, ref } from 'vue';
import TimerButtonGroup from './TimerButtonGroup.vue';

const props = defineProps({
   disableMinutes: Number,
   formattedTime: String,
   isDisabled: Boolean,
   disableNow: Function,
   enableNow: Function,
   disableNowByTimer: Function
});

const emits = defineEmits(['update:disableMinutes', 'disableNow', 'enableNow']);

// Emit an update event when disableMinutes changes
const updateDisableMinutes = (value) => {
   console.log("value", value);
   emits('update:disableMinutes', Number(value));
};
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.action-group {
   margin-top: 10px;
   margin-bottom: 25px;
   padding-top: 10px;
   padding-bottom: 10px;
   padding-left: 30px;
   padding-right: 30px;

   h4 {
      color: white;
      width: fit-content;
   }

   button {
      color: $text-color;
   }

   .inline-timer {
      // display: flex;
      flex-direction: column;
      // justify-content: space-between;
      // align-items: center;
      // padding: 10px 0;
      // margin-bottom: 25px;
      // border-radius: 20px;


   }

   .input-group {
      display: inline-flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;


      .user-input {
         display: inline-flex;
         justify-content: space-around;
         align-items: center;
         // padding: 10px 0;
         // margin-bottom: 25px;
         border-radius: 20px;

         input {
            width: 75px;
            // margin-right: -50px;
            // padding: 5px;
            font-size: larger;
            border-radius: 2px;
            // border: 1px  $import;
            background-color: lighten($background-color, 10%);
            border-bottom: 2px solid white;
            border-left: none;
            border-right: none;
            border-top: none;
            color: $text-color;

         }

         .timer-display {
            color: $text-color;
            // margin-left: -50px;
         }

      }
   }

   button {
      margin-left: 5px;
      margin-right: 5px;
   }
}
</style>
