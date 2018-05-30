<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav></main-nav>
          <div class="row" id="container">
            <h3>{{ title }}</h3>
            <table>
              <tr>
                <th><b>Utilisateur :<b></th><td><span>{{ username }}</span></td>
              </tr>
              <tr>
                <th><b>Email :<b></th><td><span>{{ email }}</span></td>
              </tr>
              <tr>
                <th><b>Téléphone :<b></th><td><span>{{ phone }}</span></td>
              </tr>
              <tr>
                <th><b>Oganisation :<b></th><td><span>{{ organisation }}</span></td>
              </tr>
              <tr>
                <th><b>Fonction :<b></th><td><span>{{ position }}</span></td>
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
    background-color: white;
    -webkit-box-shadow: 0px 0px 2px 1px #656565;
    -moz-box-shadow: 0px 0px 2px 1px #656565;
    filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
    zoom:1;
    box-shadow: 0 0 20px 0px #65656521;
    width: 40vw;
  }
  #container {
      flex: 1 0 auto;
  }
  h3{
    text-align: center;
    margin: 10vh 0 0 0;
  }
  .padded{
    margin: auto auto 10px auto;
  }
 b {
  margin-left: 1vw;
  }
  span{
  margin: 1vw;
  }

</style>
