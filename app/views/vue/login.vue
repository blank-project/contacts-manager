<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav :user="user"></main-nav>
        <div id="container" class="row">
          <div class="center-text">
            <h1>{{ title }}</h1>
          </div>
          <form action="/login" method="POST" class="col s12">
              <div class="input-field col s12">
                  <i class="material-icons prefix">account_circle</i>
                  <input id="username" name="username" type="text"  placeholder="Login" required />
                  <label for="username">Nom d'utilisateur</label>
              </div>
              <div class="input-field col s12">
                  <i class="material-icons prefix">lock</i>
                  <input id="password" name="password" type="password" placeholder="Password" required />
                  <label for="password">Mot de passe</label>
              </div>
              <div class="col s1">
                  <input id="submit" name="submit" type="submit" value="Soumettre" class="btn"/>
              </div>
              <alerts v-if="message" :message="message"></alerts>
          </form>
        </div>
        <main-footer></main-footer>
    </main>
</template>

<script type="text/javascript">
 import mainNav from './components/nav.vue';
 import mainFooter from './components/footer.vue';
 import alerts from './components/alerts.vue';

 export default {
   data: function () {
     return {
       message: '',
       user: null
     };
   },
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter,
     alerts: alerts
   },
 };
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

</style>
