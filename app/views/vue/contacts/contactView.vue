<template>
  <main>
    <main-nav :user="user"></main-nav>
    <div id="container">
      <contact  :contact="contact" :user="user" :tags="tags" :back="back" ></contact>
    </div>
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

 #container > div {
   height: 100%;
 }

</style>
