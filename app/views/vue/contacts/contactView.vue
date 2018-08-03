
<template>
    <main>
        <main-nav :user="user"></main-nav>
        <h3>{{contact.fullName}}</h3>
        <table class="contact pure-table">
          <tr>
            <td class="title">Nom</td><td>{{ contact.fullName }}</td>
          </tr>
          <tr>
            <td>Mail</td><td>{{ contact.email }}</td>
          </tr>
          <tr>
            <td>Téléphone</td><td>{{ contact.phone }}</td>
          </tr>
          <tr>
            <td>Organisation</td><td>{{ contact.organization }}</td>
          </tr>
          <tr>
            <td>Fonction</td><td>{{ contact.title }}</td>
          </tr>
      <!--    <tr>
            <td>Adresse</td>
              <td>
              <address>
               <span>{{ contact.adress.number }}</span> <span>{{ contact.adress.street }}</span><br />
               <span>{{ contact.adress.code }}</span> <span>{{ contact.adress.city }}</span><br />
             </address>
            </td>
          </tr> -->
<!--
          <tr>
            <td>Etiquettes</td>
            <td>
              <div id="tag-list" class="padded">
                {{#each tags}}
                  {{#isPermitted "contact:update" }}
                    {{! TODO Find a way to factor tag and tagEdit}}
                    {{>tagEdit}}
                  {{else}}
                    {{>tag}}
                  {{/isPermitted}}
                {{else}}
                  Aucune étiquette
                {{/each}}
              </div>
              {{#isPermitted "contact:update" }}
              <div class="padded">
                <form method="POST" action="/contacts/{{ id }}/tags/" class="pure-form">
                  <select name="tagId" id="tagId">
                    {{#each ../tags}}
                    <option value="{{ id }}">{{ name }}</option>
                    {{/each}}
                  </select>
                  <button type="submit" class="pure-button pure-input-rounded" {{#isEmpty ../tags }}disabled{{/isEmpty}}>
                    <i class="fa fa-plus"></i>
                  </button>
                </form>
              </div>
              {{/isPermitted}}
            </td>
          </tr>
          <tr>
            <td>Note</td><td>{{ note }}</td>
          </tr>
      -->  </table> <!--
        {{/with}}
        {{#with contact}}
        <div class="padded">
          {{#isPermitted "contact:update" }}
          <a href="edit/{{ id }}" class="pure-button pure-button-primary">Modifier</a>
          {{/isPermitted}}
          {{#isPermitted "contact:delete" }}
          <button id="delete" class="pure-button button-error">Supprimer</button>
          {{/isPermitted}}
        <div>
        {{/with}}
        <div class="padded">
        <a href="/contacts/" class="pure-button">Retour à la liste</a>
        </div>

        <script>
            var tags = document.getElementById('tag-list');
            delegate(tags, 'click', '.tag-remove', function(e) {
              var id = e.actualTarget.getAttribute("data-id");
              removeTagFromContact(id, '{{ contact.id }}').then(function (response) {
                window.location.reload(true);
              }).catch(console.log);
            });
        </script>
        {{#isPermitted "contact:delete" }}
        <script>
            var deleteButton = document.getElementById("delete");
            deleteButton.addEventListener('click', function(ev) {
              deleteContact('{{ contact.id }}').then(function (response) {
                location.assign("/contacts/");
              })
              .catch(console.log);
            });
        </script>
        {{/isPermitted}}-->
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

table{
  background-color: white;
  width: 30vw;
  margin: auto;
  margin-top: 5vh;
  -webkit-box-shadow: 0px 0px 2px 1px #656565;
  -moz-box-shadow: 0px 0px 2px 1px #656565;
  filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
  zoom:1;
  box-shadow: 0 0 20px 0px #65656521;
  padding-left: 10vw;
}

h3{
  margin: auto;
  margin-bottom: 5vh;
  margin-top: 5vh;
}

.title{
  width: 10vw;
}

@media screen and (max-width: 640px){
 table {
   margin-bottom: 10vh;
 }
}
</style>
