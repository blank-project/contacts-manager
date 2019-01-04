<template>
  <div v-if="contact" :id="contact.fullName" class="contact-container">
    <div class="row">
      <div class="col s12 m6 offset-m3">
        <div class="card white">
          <div class="card-content grey-text text-darken-4">
            <p class="card-title">{{ contact.fullName }}</p>
            <p><b>Mail</b> : {{ contact.email }}</p>
            <p><b>Téléphone</b> : {{ contact.phone }}</p>
            <p><b>Organisation</b> : {{ contact.organization }}</p>
            <p><b>Fonction</b> : {{ contact.title }}</p>
            <p><b>Adresse</b> :
              {{ contact.address.number }}
              {{ contact.address.street}}
              {{ contact.address.code }}
              {{ contact.address.city }}
            </p>
          </div>
          <div class="card-action" v-if="user">
            <a :href="'edit/' + contact.id" v-if="checkPermissions(user, 'contact:update')">
              <i class="material-icons">create</i> Modifier
            </a>
            <a href="" v-if="checkPermissions(user, 'contact:delete')" @click.prevent="deleteOne(contact.id)">
              <i class="material-icons">delete</i> Supprimer
            </a>
          </div>
        </div>
      </div>
    </div>
    <table class="contact pure-table">
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
  </div>
</template>

<script>
  import permissionMixin from './mixins/permissions.vue';

  export default {
    data() {
      return { }
    },
    mixins : [permissionMixin],
    props : {
      'contact': {
        default: undefined
      },
      'user': {
        type: Object
      }
    },
    methods : {
      deleteOne : function(id) {
        deleteContact(id).then(function (response) {
          location.assign("/contacts/");
        });
      }
    }
  }
</script>

<style scoped>
.contact-container {
  height: 100%;
}

.contact-container > div.row {
  margin: auto;
}
</style>
