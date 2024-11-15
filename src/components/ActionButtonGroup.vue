<template>
   <div class="action-group">
      <div class="user-input inline-timer">
         <div class="input-group">
            <input type="number" :value="disableMinutes" placeholder="60"
               @input="updateDisableMinutes($event.target.value)" />
            <button class="btn btn-danger disable-button" @click="emitDisabledNowByTimer()">
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

});

const emits = defineEmits(['update:disableMinutes', 'disableNow', 'enableNow', 'disableNowByTimer']);

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
   updateDisableMinutes(Number(time));
   emits('disableNowByTimer');
}

const updateDisableMinutes = (value) => {
   emits('update:disableMinutes', Number(value));
};
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
@import '@/assets/fonts.scss';

@media (min-width: 768px) {
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
         flex-direction: column;
      }

      .input-group {
         display: flex;
         flex-direction: row;
         justify-content: space-evenly;
         align-items: center;

         .user-input {
            display: flex;
            justify-content: space-evenly;
            flex-direction: column;
            align-items: center;
         }
         input {
            width: 8rem;
            height: 3.5rem;
            margin: .5rem;
            font-size: 2em;
            font-family: 'roboto-bold';
            text-align: center;
            border-radius: 2px;
            background-color: lighten($background-color, 10%);
            border-bottom: 2px solid white;
            border-left: none;
            border-right: none;
            border-top: none;
            color: $text-color;
      }

      .timer-display {
         color: $text-color;
         padding: .5rem;
         margin: .5rem;
         font-size: 2em;
         font-family: 'roboto-bold';
         text-align: center;
      }
      }

      button {
         margin: .5rem;
         padding: .5rem;
         font-size: 1.5em;
         border-radius: 2px;
         height: 3.5rem;
         text-align: center;
         font-family: 'roboto-bold';
         color: $text-color;
         border-radius: 1rem !important;
      }
   }
}
@media (max-width: 768px) {
   .action-group {
      display: flex;
      flex-direction: column;
      justify-content: center !important;
      align-items: center !important;
      width: 100% !important;
      margin: .15rem .25rem .25rem .25rem;

      .input-group {
         display: flex;
         flex-direction: row;
         flex-wrap: nowrap;
         align-items: center;
      
      input {
         width: 22%;
         margin: .25rem;
         padding: .25rem;
         height: 2.5rem;
         font-size: 1.7rem;
         text-align: center;
         font-family: 'roboto-bold';
         background-color: lighten($background-color, 20%) !important; //$background-color;
         border-top: none;
         border-left: none;
         border-right: none;
         border-bottom: 2px solid white;
         border-top-left-radius: .75rem !important;
         border-top-right-radius: .75rem !important;
         border-bottom-left-radius: .25rem !important;
         border-bottom-right-radius: .25rem !important;
         color: whitesmoke;
      }
   
      .disable-button {
         margin: .25rem;
         padding: .35rem;
         font-size: 1.25rem;
         border-radius: 1rem !important;
         width: 45%;
         height: 2.9rem;
         text-justify: center;
         text-align: center;
         text-wrap: nowrap;
         font-family: "roboto-condensed";
      }
      .timer-display {
         font-size: 2em;
         margin: .25rem;
         padding: .5rem;
         width: 25%;
         text-align: center;
         text-wrap: nowrap;
         font-family: "roboto-condensed-bold";
         color: whitesmoke;

      }
   }
      .status-set-btn {
         justify-content: space-around;
         flex-wrap: nowrap;
         text-wrap: nowrap;
         font-size: 1.2em !important;
         padding: .5rem;
         margin: 0 1.5rem .25rem 1.5rem;
         border-radius: 1rem !important;
         height: 2.9rem;
         text-align: center;
         text-wrap: nowrap;
         font-family: "roboto-condensed-bold";
       
      }
   }
}

</style>
