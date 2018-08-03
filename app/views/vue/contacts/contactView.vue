<template>
  <main>
    <main-nav :user="user"></main-nav>
    <contact :contact="contact"></contact>
    <main-footer></main-footer>
  </main>
</template>

<script type="text/javascript">
 import mainNav from './components/nav.vue';
 import mainFooter from './components/footer.vue';
 import Contact from './components/contact.vue';
 export default {
   data: function () {
     return {};
   },
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter,
     contact: Contact
   },
 }
</script>

<style scoped>
 main {
     margin: 0;
     display: flex;
     min-height: 100vh;
     flex-direction: column;
 }

 #container {
     flex: 1 0 auto;
 }

table{
  background-color: white;
  width: 30vw;
  margin: auto;
  margin-top: 5vh;
  -webkit-box-shadow: 0px 0px 2px 1px #656565;
  -moz-box-shadow: 0px 0px 2px 1px #656565;
  filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
  zoom:1;
  box-shadow: 0 0 20px 0px #65656521;
  padding-left: 10vw;
}

h3{
  margin: auto;
  margin-bottom: 5vh;
  margin-top: 5vh;
}

.title{
  width: 10vw;
}

@media screen and (max-width: 640px){
 table {
   margin-bottom: 10vh;
 }
}
</style>
