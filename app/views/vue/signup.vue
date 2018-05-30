<template>
  <main class="grey lighten-4 blue-grey-text">
    <main-nav></main-nav>
    <alerts v-if="message" :message="message"></alerts>
    <div id="container" class="row">
      <div class="center-text">
        <h2>{{ title }}</h2>
      </div>
      <form action="/users/" method="POST" class="col s12">
        <div class="encadre">
          <input v-if="id" type="hidden" name="id" :value="id" />
          <div class="input-field col s12 row">
            <div class="col s12 m6">
              <input id="firstname" name="firstname" type="text"  placeholder="Prenom" :value="firstname" required />
            </div>
            <div class="col s12 m6">
              <input id="lastname" name="lastname" type="text"  placeholder="Nom" :value="lastname" required />
            </div>
          </div>
          <div class="input-field col s12 row">
            <div class="col s12 m6">
              <input id="email" name="email" type="email" placeholder="Email" :value="email" required />
            </div>
            <div class="col s12 m6">
              <input id="username" name="username" type="text"  placeholder="User Name" :value="username" required />
            </div>
          </div>
          <div class="input-fieldcol s12 row">
            <div class="col s12">
              <input v-if="id" id="passwordOld" name="passwordOld" type="password" placeholder="Old Password" required />
            </div>
          </div>
          <div class="input-fieldcol s12 row">
            <div class="col s12 m6">
              <input id="password" name="password" type="password" placeholder="Password" required />
            </div>
            <div class="col s12 m6">
              <input id="passwordConfirm" name="passwordConfirm" type="password" placeholder="Confirm Password" required />
            </div>
          </div>
            </div>
          <div class="col s1">
            <input id="submit" name="submit" type="submit" value="Soumettre" class="btn"/>
          </div>
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
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      username: '',
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
.encadre{
  padding: 5vh;
  background-color: white;
  -webkit-box-shadow: 0px 0px 2px 1px #656565;
  -moz-box-shadow: 0px 0px 2px 1px #656565;
  filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
  zoom:1;
  box-shadow: 0 0 20px 0px #65656521;
}
#submit{
  margin-top: 5vh;
}
</style>
