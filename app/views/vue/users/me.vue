<template>

    <main class="grey lighten-4 blue-grey-text">
        <main-nav></main-nav>
          <div class="row" id="container">
            <table class="col m5">
              <tr>
                <th><b>Username :<b></th><td>{{ username }}</td>
              </tr>
              <tr>
                <th><b>Mail :<b></th><td>{{ email }}</td>
              </tr>
              <tr>
                <th><b>Téléphone :<b></th><td>{{ phone }}</td>
              </tr>
              <tr>
                <th><b>Oganisation :<b></th><td>{{ organisation }}</td>
              </tr>
              <tr>
                <th><b>Fonction :<b></th><td>{{ title }}</td>
              </tr>
            </table>
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
  main{
    margin: 0 !important;
    min-height: 100vh;
  }
  th{
    font-size: 1.2em;
  }
  td{
    text-align: right;
  }
  .row{
    margin-left: 35vw;
  }
  table{
    margin: 20vh 0 0 0;
  }
  #container {
      flex: 1 0 auto;
  }
</style>
