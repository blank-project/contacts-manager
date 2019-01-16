<template>
  <div>
    <ul id="slide-out" class="sidenav collection">
      <li><a class="sidenav-close" href="#!"><i class="material-icons">arrow_back_ios</i></a></li>
      <li class="collection-header"><h4 class="center-align">Panier de contact</h4></li>
      <li class="center-align"><i class="material-icons" title="Copier dans le presse-papier" @click="copyCart">file_copy</i><i @click="$emit('removecart')" title="Vider le presse-papier" class="material-icons">delete</i></li> 
      <li class="center-align"><span><b>{{ countCart }}</b></span> contacts</li>
      <div id="cartList" class="scale-transition">
       <li class="collection-item scale-transition" v-bind:key="a" v-bind:id="'cart-'+index" v-for='(contact, index, a) in cartContent'><span>{{ contact.email }}</span><i @click="$emit('removecart', contact.id);" class="material-icons">close</i></li>
      </div>
  </ul>
  <a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">arrow_forward_ios</i></a>
  </div>
</template>

<script>
export default {
  props: ['cartContent'],
  methods:{
    copyCart: function() {
      var tempContact = [];
      for(var i=0; i < this.cartContent.length; i++) {
        tempContact.push(this.cartContent[i].email)
      }
      this.$copyText(tempContact);
    }
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
.material-icons {
  cursor: pointer;
}
.collection-item span{
  display:inline-block;
  width:90%;
  font-size:0.8em;
}

.collection-item i {
  display:inline-block;
  cursor: pointer;
  width:10%;
}

.sidenav-overlay {
  z-index:-1;
}
</style>
