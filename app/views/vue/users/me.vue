<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav></main-nav>
          <div class="row" id="container">
            <h3>{{ title }}</h3>
            <table>
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
                <th><b>Fonction :<b></th><td>{{ position }}</td>
              </tr>
            </table>
          </div>
          <div class="padded">
              <a :href="'edit/' + myId" class="waves-effect waves-light btn" >Modifier</a>
          </div>
        <main-footer></main-footer>
    </main>
</template>

<script type="text/javascript">
 import mainNav from './components/nav.vue';
 import mainFooter from './components/footer.vue';
 export default {
   data: function () {
     return {
     };
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
    display: flex;
    flex-direction: column;
  }
  th{
    font-size: 1.2em;
  }
  td{
    text-align: right;
  }
  .row{
    margin: auto;
  }
  table{
    margin-top: 10vh;
  }
  #container {
      flex: 1 0 auto;
  }
  h5{
    text-align: center;
    margin: 10vh 0 0 0;
    font-weight: bold;
  }
  .padded{
    margin: auto auto 10px auto;
  }
</style>
