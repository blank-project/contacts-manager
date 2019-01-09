<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav :user="currentUser"></main-nav>
          <alerts v-if="created" :message="message"></alerts>
          <div class="row" id="container">
            <div class="col m6">
              <span class="fa fa-user"></span>
              <form :action="'/users/' + user.id + '/'" method="POST" class="pure-form">
                <h4>Modifier le Profil</h4>
                <div class="carte">
                  <input type="hidden" name="id" :value="user.id" />
                  <fieldset>
                    <input id="firstname" name="firstname" type="text"  placeholder="Prenom" :value="user.name.first" required />
                    <input id="lastname" name="lastname" type="text"  placeholder="Nom" :value="user.name.last" required />
                    <input id="email" name="email" type="email" placeholder="Email" :value="user.email" required />
                    <input id="organization" name="organization" type="text" placeholder="Organisation" :value="user.organization" />
                    <input id="title" name="title" type="text" placeholder="Fonction" :value="user.title" />
                  </fieldset>
                </div>
                <div>
                  <input id="submit" name="submit" type="submit" value="Soumettre" class="waves-effect waves-light btn"/>
                </div>
              </form>
            </div>
            <div class="col m6">
              <form :action="'/users/' + user.id + '/password'" method="POST">
                <h4>Changer de mot de passe</h4>
                <div class="carte">
                  <input type="hidden" name="id" :value="user.id" />
                  <fieldset class="pure-group">
                    <input id="passwordOld" name="passwordOld" type="password" placeholder="Old Password" required />
                    <input id="password" name="password" type="password" placeholder="Password" required />
                    <input id="passwordConfirm" name="passwordConfirm" type="password" placeholder="Confirm Password" required />
                  </fieldset>
                </div>
                <div>
                  <input id="submit" name="submit" type="submit" value="Soumettre" class="waves-effect waves-light btn"/>
                </div>
              </form>
            </div>
          </div>
          <div class="row">
              <div v-if="checkPermissions(currentUser, 'permission:update')" class="col m6">
                  <form :action="'/users/' + user.id + '/permissions'" method="POST">
                    <h4>Mettre à jour les permissions</h4>
                      <p>Séparer par des ;</p>
                      <textarea name="permissions">
                        {{ user.permissions.join(';') }}
                      </textarea>

                    <div>
                      <input id="submit" name="submit" type="submit" value="Soumettre" class="waves-effect waves-light btn"/>
                    </div>
                  </form>
              </div>
            </div>
        <main-footer></main-footer>
    </main>
</template>

<script type="text/javascript">
 import mainNav from './components/nav.vue';
 import mainFooter from './components/footer.vue';
 import permissionMixin from './mixins/permissions.vue';
 import alerts from './components/alerts.vue';

 export default {
   data: function () {
     return {
      user: null,
      created: null
    };
   },
   mixins : [permissionMixin],
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter,
     alerts: alerts
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
  .btn{
    margin-top: 5vh;
  }
  form{
    margin: 5vh;
  }
  .carte{
    background-color: white;
    -webkit-box-shadow: 0px 0px 2px 1px #656565;
    -moz-box-shadow: 0px 0px 2px 1px #656565;
    filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
    zoom:1;
    box-shadow: 0 0 20px 0px #65656521;
  }
</style>
