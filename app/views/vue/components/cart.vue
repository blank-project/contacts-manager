<template>
  <div>
    <ul id="slide-out" class="sidenav collection">
      <li class="collection-header"><h4>Panier de contact</h4></li>
       <li><i class="material-icons" title="Copier dans le presse-papier" @click="copyClipboard()">file_copy</i><i @click="deleteInCart()" class="material-icons">delete</i></li> 
      <li><span><b>{{ countCart }}</b></span> contact</li>
      <li class="collection-item" v-for='contact in cartContent'>{{ contact.email }}</li>
  </ul>
  <a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a></div>
</template>

<script>
export default {
   data: function () {
     return {
     };
   },
   props: ['cartContent'],
   methods: {
     deleteInCart: function(id) {
       if(id==null) {
       }
     }
   },
   mounted() {
   },
   computed: {
       countCart: function() {
         if(this.cartContent) {
          return this.cartContent.length;
         }
     }
   }
}
</script>

<style scoped>
.sidenav-overlay {
  z-index:-1;
}
</style>
