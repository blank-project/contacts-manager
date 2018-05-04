

<template>
  <main class="grey lighten-4 blue-grey-text">
      <main-nav></main-nav>
      <div class="padded">
        <div class="heading">
          <h1>Liste des Etiquettes</h1>
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

</style>
