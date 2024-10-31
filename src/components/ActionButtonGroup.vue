<template>
   <div class="row action-group">
      <div class="col-md-7 user-input">
         <input type="number" :value="disableMinutes" placeholder="60"
            @input="updateDisableMinutes($event.target.value)" />
         <button class="btn btn-danger btn-md btn-block" @click="disableNowByTimer">
            {{ isDisabled ? 'Disabled' : 'Disable Blocker' }}
         </button>
         <h4 class="timer-display">{{ formattedTime }}</h4>
      </div>
      <div class="col-md-5 user-input">
         <button class="btn btn-success" @click="enableNow()">Enable Now</button>
         <button class="btn btn-danger" @click="disableNow()">Disable Now</button>
      </div>
   </div>
</template>

<script setup lang="js">
import { defineProps, defineEmits } from 'vue';

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
   emits('update:disableMinutes', Number(value));
   console.log("Formatted Time: " + props.formattedTime, "Disable Minutes: " + props.disableMinutes)
};
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.action-group {
   h4 {
      color: white;
   }

   button {
      color: $text-color;
   }

   .user-input {
      display: inline-flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px 0;
      margin-bottom: 25px;
      border-radius: 20px;

      input {
         width: 100px;
         margin-right: -50px;
         padding: 5px;
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
         margin-left: -50px;
      }
   }

   button {
      margin-left: 5px;
      margin-right: 5px;
   }
}
</style>
