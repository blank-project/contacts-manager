<template>
    <main class="grey lighten-4 blue-grey-text mainMe">
        <main-nav></main-nav>
        <table class="user pure-table">
          <table class="user pure-table">
            <table class="user pure-table">
              <tr>
                <td>Username</td><td>{{ username }}</td>
              </tr>
              <tr>
                <td>Mail</td><td>{{ email }}</td>
              </tr>
              <tr>
                <td>Téléphone</td><td>{{ phone }}</td>
              </tr>
              <tr>
                <td>Organisation</td><td>{{ organisation }}</td>
              </tr>
              <tr>
                <td>Fonction</td><td>{{ title }}</td>
              </tr>
            </table>


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
  main{
    margin: 0 !important;
  }
</style>
