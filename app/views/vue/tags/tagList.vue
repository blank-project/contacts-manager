<template>
  <main class="grey lighten-4 blue-grey-text">
      <main-nav :user="user"></main-nav>
      <div id="container" class="padded container">
        <div class="heading">
          <h3>Liste des Etiquettes</h3>
        </div>
        <div class="row">
          <table id="tag-list" class="tag-list col s12 m6 offset-m3">
              <thead>
                <tr>
                  <th>Nom</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tag in tags" class="clickable" v-on:click="goTo('/tags/' + tag._id)" >
                <td :style="{ backgroundColor: tag.color, color: tag.textColor}">{{ tag.name }}</td>
              </tbody>
          </table>
        </div>
        <div v-if="checkPermissions(user, 'tag:create')" class="row">
          <a href="/tags/edit" title="Nouveau" class="btn col offset-m3"><i class="material-icons">add</i></a>
        </div>
      </div>
      <main-footer></main-footer>
    </main>
</template>
<script type="text/javascript">
 import mainNav from './components/nav.vue';
 import mainFooter from './components/footer.vue';
 import permissionMixin from './mixins/permissions.vue';
 export default {
   data: function () {
     return {
     };
   },
   mixins : [permissionMixin],
   methods: {
     goTo: function(url) {
       location.href = url;
     }
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

  table{
    background-color: white;
    -webkit-box-shadow: 0px 0px 2px 1px #656565;
    -moz-box-shadow: 0px 0px 2px 1px #656565;
    filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
    zoom:1;
    box-shadow: 0 0 20px 0px #65656521;
    border-style: solid;
    border-color: white;
    border-width: 16px;
  }

  h3 {
    margin: auto;
    margin-top: 5vh;
  }

  tbody{
    width: 5vw;
  }

</style>
