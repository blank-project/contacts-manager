<template>

    <main class="grey lighten-4 blue-grey-text">
        <main-nav></main-nav>
          <div id="container">
            <p>test conatct list</p>
          </div>
        <main-footer></main-footer>
    </main>

</template>


<script type="text/javascript">
 import mainNav from './components/nav.vue';
 import mainFooter from './components/footer.vue';

 export default {
   data: function () {
     return {};
   },
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter
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

</style>
