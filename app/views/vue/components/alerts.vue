<template>
  <div></div>
</template>

<script>
export default {
  props: ['message'],
   data: function () {
     return {};
   },
   methods: {
     showAlert: function(text) {
       M.toast({html:text, displayLength: 4000, classes:'red darken-2'});
     },

     showInfo: function(text) {
       M.toast({html:text, displayLength: 4000, classes:'orange lighten-1'});
     },
   },
   mounted() {
     if(!this.message) {
       return;
     }
     if (typeof this.message === 'string') {
       this.showInfo(this.message);
       return;
     }
     // Else expect an object.
     if (this.message.level === 'error') {
        this.showAlert(this.message.message);
     } else {
       this.showInfo(this.message.message);
     }
   }
 };
</script>

<style scoped>
</style>
