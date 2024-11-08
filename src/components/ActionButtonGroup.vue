<template>
   <div class="action-group">
      <div class=" user-input inline-timer">
         <div class="input-group">
            <input type="number" :value="disableMinutes" placeholder="60"
               @input="updateDisableMinutes($event.target.value)" />
            <button class="btn btn-danger btn-md btn-block" @click="emitDisabledNowByTimer()">
               {{ isDisabled ? 'Disabled' : 'Disable Blocker' }}
            </button>
            <h4 class="timer-display">{{ formattedTime }}</h4>
         </div>
         <!-- <div class="input-group"> -->
         <TimerButtonGroup @disableForPreset="disableNowByTimerPreset" />
         <!-- </div> -->
      </div>
      <div class=" user-input">
         <div class="input-group">
            <button class="btn btn-success status-set-btn" @click="doEnableNow()">Enable Now</button>
            <button class="btn btn-danger status-set-btn" @click="doDisableNow()">Disable Now</button>
         </div>
         <div class="input-group">
         </div>
      </div>
   </div>
</template>

<script setup lang="js">
import { defineProps, defineEmits, watch } from 'vue';
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

const doEnableNow = () => {
   emits('enableNow');
}

const doDisableNow = () => {
   emits('disableNow');
}

const emitDisabledNowByTimer = () => {
   emits('disableNowByTimer');
}

const disableNowByTimerPreset = (time) => {
   console.log(time);
   updateDisableMinutes(Number(time));
   emits('disableNowByTimer');
}

// Emit an update event when disableMinutes changes
const updateDisableMinutes = (value) => {
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
      display: flex;
      flex-direction: co;
      justify-content: space-between;
      align-items: center;



      .user-input {
         display: flex;
         justify-content: space-around;
         flex-direction: column;

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

@media (max-width: 768px) {
   .action-group {
      margin: .75rem;
      padding: .25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .inline-timer {
         text-align: center;
         padding: 0;
         margin: 0;
         box-shadow: none;
         border-style: none;
      }

      .input-group {
         margin-bottom: 0.25rem;
         border-radius: 0.25rem;
         text-align: center;
         box-shadow: none;
         border-style: none;


         input {
            width: 8rem;
            padding: .25rem;
            margin: .25rem;
            height: 2.5rem;
            font-size: 1.5rem;
            text-align: center;
         }

         .timer-display {
            font-size: 2rem;
            margin: .25rem;

         }

         button {
            margin: .25rem;
            padding: .5rem;
            font-size: 1.2rem;
            border-radius: 1rem !important;
         }

         .status-set-btn {
            justify-content: space-around;
            flex-wrap: nowrap;
            text-wrap: nowrap;
            font-size: 1.5em !important;
            padding: .5rem !important;
            margin: .5rem;
            margin-right: 1.5rem;
            margin-left: 1.5rem;
         }
      }
   }
}
</style>
