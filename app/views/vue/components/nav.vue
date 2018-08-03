<template>
    <nav>
        <div class="nav-wrapper">
            <a href="/" class="brand-logo"><img id="logo" src="/images/logoBC.png" alt="logo Belleville Citoyenne"></img></a>
            <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="material-icons">menu</i></a>
            <ul id="nav-mobile" class="right hide-on-med-and-down" v-if="user">
              <!-- :v-if=""  utilisateur connecté alors tu affiche -->
                <li><a href="/contacts" class="waves-effect waves-light">Contacts</a></li>
                <li><a href="/tags" class="waves-effect waves-light">Etiquettes</a></li>
                <li><a href="/import" class="waves-effect waves-light">Import</a></li>
                <li><a href="/Users" class="waves-effect waves-light">Profil ({{ user.username }})</a></li>
                <li><a href="/logout" class="waves-effect waves-light">Se déconnecter</a></li>
            </ul>
            <ul class="right hide-on-med-and-down" id="nav-mobile" v-if="!user">
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
   }
 }
</script>

<style scoped>
 a.brand-logo {
     padding-left: 6px !important;
 }



 @media screen and (max-width: 640px){
  #logo {
     margin-top: 2vh;
      margin-left: 0;
  }
}

</style>
