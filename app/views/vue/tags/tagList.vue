

<template>
  <main class="grey lighten-4 blue-grey-text">
      <main-nav></main-nav>
      <div class="padded">
        <div class="heading">
          <h3>Liste des Etiquettes</h3>
          <!-- {{#isPermitted "tag:create" }} -->
          <a class="pure-button pure-button-primary left-offset" href="edit" title="Nouveau"><i class="fa fa-plus"></i></a>
          <!-- {{/isPermitted }} -->
        </div>
        <table id="tag-list" class="tag-list pure-table">
            <thead>
              <tr>
                <th>Nom</th>
              </tr>
            </thead>
            <tbody>
            <!-- {{#tags}}
              <tr class="tag-line clickable"  data-id="{{ id }}">
                <td>
                  {{> tag }}
                </td>
              </tr>
            {{/tags}} -->

            <tr v-for="tag in tags"v-on:click="goTo('/tags/' + tag._id)" >

              <td :backgrounds= "tag.color">{{ tag.name }}</td>
              <td>{{ tag.color }}</td>
            </tbody>
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

  table{
    background-color: white;
    -webkit-box-shadow: 0px 0px 2px 1px #656565;
    -moz-box-shadow: 0px 0px 2px 1px #656565;
    filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
    zoom:1;
    box-shadow: 0 0 20px 0px #65656521;
    width: 40vw;
    margin-left: 29vw;
    margin-top: 5vh;
    margin-bottom: 5vh;
  }

  h3 {
    margin: auto;
    margin-top: 5vh;
  }

</style>
