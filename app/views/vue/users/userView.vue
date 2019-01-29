<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav :user="currentUser"></main-nav>
          <div class="card white">
              <div class="card-content grey-text text-darken-4">
                <p class="card-title">{{ user.fullName }} <i v-if="user.meta.disabled" class="material-icons">block</i></p>
                <p><b>Username</b> : {{ user.username }}</p>
                <p><b>Mail</b> : {{ user.email }}</p>
                <p><b>Téléphone</b> : {{ user.phone }}</p>
                <p><b>Organisation</b> : {{ user.organization }}</p>
                <p><b>Fonction</b> : {{ user.title }}</p>
                <p><b>Permissions</b>
                <ul>
                  <li v-for="(permission, i) in user.permissions" :key="i" >
                    {{ permission }}
                  </li>
                </ul>
                </p>
              </div>
              <div class="card-action" v-if="user">
                <a v-if="checkPermissions(currentUser, 'user:update')" :href="'edit/' + user.id" class="waves-effect waves-light btn">
                  Modifier
                </a>
                <form v-if="checkPermissions(currentUser, 'user:disable')" :action="'/users/' + user.id + '/disable'" method="POST" class="action-form">
                  <button id="submit" name="disable" type="submit" :value="user.meta.disabled ? 0 : 1" class="waves-effect waves-light btn">
                   {{ user.meta.disabled ? "Activer" : "Désactiver" }}
                  </button>
               </form>
              </div>
            </div>
        <!-- END Content -->
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
       user: null
     };
   },
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter
   },
   mixins : [permissionMixin]
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

  .action-form {
    display: inline-block;
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
