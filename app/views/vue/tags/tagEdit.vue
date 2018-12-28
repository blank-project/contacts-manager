<template>
  <main class="grey lighten-4 blue-grey-text">
      <main-nav :user="user"></main-nav>
      <div id="container">
        <h3>{{ title }}</h3>
        <div class="row" id="container">
          <form action="/tags/" method="POST">
            <input v-if="tag.id" type="hidden" name="id" :value="tag.id" />
            <div class="pure-control-group">
              <label for="name">Nom :</label>
              <input id="name" type="text" name="name" :value="tag.name"/>
            </div>
            <div class="pure-control-group">
              <label for="color">Couleur :</label>
              <input id="color" type="color" name="color" :value="tag.color"/>
            </div>
            <fieldset class="padded">
              <input type="submit" name="submit" value="Soumettre" class="waves-effect waves-light btn"/>
              <a v-if="tag.id" :href="'/tags/' + tag.id" class="waves-effect waves-light btn">Annuler</a>
              <a v-else :href="/tags/" class="waves-effect waves-light btn">Annuler</a>
            </fieldset>
          </form>
        </div>
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
  #container {
      flex: 1 0 auto;
  }
  #color{
    margin: 5vh;
    height: 5vh;
  }
  label{
    font-size: 1.1em;
  }
  form{
    margin-top: 10vh;
  }
  a{
    margin-left: 4vw;
  }
  form{
    background-color: white;
    padding: 2vh;
    -webkit-box-shadow: 0px 0px 2px 1px #656565;
    -moz-box-shadow: 0px 0px 2px 1px #656565;
    filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
    zoom:1;
    box-shadow: 0 0 20px 0px #65656521;
  }
  h3{
    margin: auto;
    margin-top: 5vh;
  }
</style>
