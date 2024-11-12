<template>
   <div class="statusBox" :class="[{ 'statusBox--active': status }]" :style="{ backgroundColor: statusColor }">
      <h4 class="status-text">{{ label }}</h4> 
      <h4 class="status-text"><strong class="current-status-text">{{ status ? 'Up' : (status == false) ? 'Down': 'Unknown' }}</strong></h4>
   </div>
</template>

<script setup lang="js">
import { computed, defineProps } from 'vue';

const props = defineProps({ status: Boolean, label: String });
const statusColor = computed(() => {
   if (props.status == null) return 'darken(slategray, 5%)';
   else if (props.status) return 'darken(rgba(0, 200, 0, 0.75), 5%)';
   else if (props.status == false) return 'darken(rgba(200, 0, 0, 0.75), 5%)'
   else return 'darken(slategray, 5%)';
});

</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.inner.center {
   @include center-flex;
   padding: 10px 0;
   margin-bottom: 25px;
   border-radius: 20px;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.statusBox {
   background-color: darken($inactive-status-red, 20%);
   display: flex;
   flex-direction: row;
   justify-content: space-around;
   padding: .25rem;
   margin: 1.5rem;
   border-radius: 1rem;
   width: 50%;

   .status-text {
         display: inline-flex;
         align-items: center;
         font-size: 2em;
   
         strong {
            text-decoration: underline;
            text-overflow: ellipsis;
         }
      }

   &--active {
      background-color: darken($active-status-green, 20%);
   }
}

.status-text {
   font-family: 'bender-solid', sans-serif;
   font-size: 25pt;
   color: whitesmoke;
}

@media (max-width: 768px) {

   .statusBox {
      display: flex;
      flex-direction: row;
      padding: .1rem .1rem .1rem .1rem;
      margin: 0 .15rem 0 .15rem;
      border-radius: 1rem;
      width: 50%;
      .status-text {
         display: inline-flex;
         align-items: center;
         font-size: 1.3em;
         text-overflow: ellipsis;

         strong {
            font-size: 1em;
            text-decoration: underline;
            text-overflow: ellipsis;
         }
   }
}
}
</style>
