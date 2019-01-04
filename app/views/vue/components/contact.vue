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
              {{ contact.formattedAddress }}
            </p>
            <div>
              <b>Etiquettes :</b>
              <div>
                <tag v-for="tag in contact.tags" :key="tag.id" :tag="tag" :removable="checkPermissions(user, 'contact:update')" @remove="removeTag(contact.id, $event)"></tag>
              </div>
            </div>
            <div>
              <b>Ajouter une etiquette :</b>
              <div>
                <tag class="clickable" v-for="tag in tags" :key="tag.id" :tag="tag" @click.native="addTag(contact.id, tag._id)"></tag>
              </div>
            </div>
          </div>
          <div class="card-action" v-if="user">
            <a :href="'edit/' + contact.id" v-if="checkPermissions(user, 'contact:update')">
              <i class="material-icons">create</i> Modifier
            </a>
            <a href="" v-if="checkPermissions(user, 'contact:delete')" @click.prevent="deleteOne(contact.id)">
              <i class="material-icons">delete</i> Supprimer
            </a>
          </div>
          <div class="card-action">
            <a href="/contacts/"><i class="material-icons">arrow_back</i> Retour à la liste</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import permissionMixin from './mixins/permissions.vue';
  import tag from './components/tag.vue'

  export default {
    components: {
      tag : tag
    },
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
      },
      'tags' : {
        type : Array
      }
    },
    methods : {
      deleteOne : function(id) {
        deleteContact(id).then(function (response) {
          location.assign("/contacts/");
        });
      },
      removeTag(contactId, tagId) {
        removeTagFromContact(tagId, contactId).then(function (response) {
          window.location.reload(true);
        });
      },
      addTag(contactId, tagId) {
        console.log('add ' + tagId)
        addTagToContact(tagId, contactId).then(function (response) {
          window.location.reload(true);
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
