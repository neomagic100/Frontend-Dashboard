<template>
   <div class="col-lg-3 col-6">
      <!-- small box -->
      <div class="small-box bg-info">
         <div class="inner">
            <h3 :class="{ 'flash-green': flash }">
               {{ typeof value === 'number' && !Number.isInteger(value) ? `${value.toFixed(2)}%` : value }}
            </h3>
            <h4>
               <slot></slot>
            </h4>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      value: {
         type: [Number, String],
         required: true
      },
   },
   data() {
      return {
         flash: false,
         flashTimeout: null,
      }
   },
   watch: {
      value(newValue, oldValue) {
         if (newValue !== oldValue) {
            this.flash = true;
            clearTimeout(this.flashTimeout);
            this.flashTimeout = setTimeout(() => {
               this.flash = false;
            }, 500);
         }
      }
   },
}
</script>

<style scoped>
.inner {
   text-align: center;
}

.flash-green {
   animation: flash-green 1s ease-in-out;
}

@keyframes flash-green {
   0% {
      color: white;
   }

   20% {
      color: rgb(32, 241, 49);
   }

   100% {
      color: white;
   }
}
</style>
