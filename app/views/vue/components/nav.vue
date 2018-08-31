<template>
    <nav>
        <div class="nav-wrapper">
            <a href="/" class="brand-logo"><img id="logo" src="/images/logoBC.png" alt="logo Belleville Citoyenne"></img></a>
            <a href="#" data-target="nav-mobile" class="sidenav-trigger"><i class="material-icons">menu</i></a>
            <ul class="right hide-on-med-and-down" v-if="user">
              <!-- :v-if=""  utilisateur connecté alors tu affiche -->
                <li><a href="/contacts" class="waves-effect waves-light">Contacts</a></li>
                <li><a href="/tags" class="waves-effect waves-light">Etiquettes</a></li>
                <li><a href="/import" class="waves-effect waves-light">Import</a></li>
                <li><a href="/users/me" class="waves-effect waves-light">Profil ({{ user.username }})</a></li>
                <li><a href="/logout" class="waves-effect waves-light">Se déconnecter</a></li>
            </ul>
            <ul class="right hide-on-med-and-down sidenav" v-if="!user">
                <li><a href="/login" class="waves-effect waves-light">Se connecter</a></li>
                <li><a href="/signup" class="waves-effect waves-light">S'inscrire</a></li>
            </ul>

            <!-- mobile navs -->
            <ul id="nav-mobile" class="sidenav" v-if="user">
                <!-- :v-if=""  utilisateur connecté alors tu affiche -->
                <div class="user-view">
                  <div class="background">
                    <img src="/images/testfond2.png">
                  </div>
                  <a href="/Users"><img class="circle" src="/images/logoBC.png"></a>
                  <a href="/Users" class=""><span class="black-text name">Profil ({{ user.username }})</span></a>
                  <a href="/logout" class=""><span class="black-text">Se déconnecter</span></a>
                </div>
                <li><a href="/contacts" class="waves-effect waves-light">Contacts</a></li>
                <li><a href="/tags" class="waves-effect waves-light">Etiquettes</a></li>
                <li><a href="/import" class="waves-effect waves-light">Import</a></li>
            </ul>
            <ul class="sidenav" id="nav-mobile" v-if="!user">
                <li><a href="/login" class="waves-effect waves-light">Se connecter</a></li>
                <li><a href="/signup" class="waves-effect waves-light">S'inscrire</a></li>
            </ul>
        </div>
    </nav>
</template>

<script type="text/javascript">
 export default {
   data: function() {
     return {}
   },
   props: {
     'user': {
       default: undefined,
     }
   },
   mounted() {
     console.log(this);
     var elems = this.$el.querySelectorAll('.sidenav');
     console.log(elems);
     var instances = M.Sidenav.init(elems, {});
   }
 }
</script>

<style scoped>
  a.brand-logo {
    height: 100%;
    box-sizing: border-box;
    padding: 1vh;
  }

  #logo {
    height: 100%;
    margin: 0;
  }
</style>
