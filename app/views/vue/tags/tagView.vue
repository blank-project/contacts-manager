<template>
  <main class="grey lighten-4 blue-grey-text">
      <main-nav :user="user"></main-nav>
      <div class="row" id="container">
        <div class="col s12 m6 offset-m3">
          <div class="card white">
            <div class="card-content grey-text text-darken-4">
              <p :style="{ backgroundColor: tag.color, color: tag.textColor}" class="card-title">
                {{ tag.name }}
              </p>
              <div class="card-action">
                <a :href="'edit/' + tag.id" v-if="checkPermissions(user, 'tag:update')">
                  <i class="material-icons">edit</i> Modifier
                </a>
                <a @click.prevent.stop="deleteTag" v-if="checkPermissions(user, 'tag:delete')">
                  <i class="material-icons">delete</i> Supprimer
                </a>
              </div>
            </div>
          </div>
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
       tag : null
     };
   },
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter
   },
   mixins : [permissionMixin],
   methods : {
     deleteTag : function() {
       var id = this.tag.id;
       fetch("/tags/" + id, { method : 'DELETE'})
       .then(function() { location.assign("/tags/"); });
     }
   }
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
