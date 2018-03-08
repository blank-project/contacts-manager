<!--pb quand passe par user/EDIT , Quelles data envoyer ?-->
<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav></main-nav>
          <div class="row" id="container">
            <span class="fa fa-user"></span>
            <form action="/users/" method="POST" class="pure-form">
                <h3>{{ title }}</h3>
                <input type="hidden" name="id" :value="user.id" />
                <fieldset>
                    <input id="firstname" name="firstname" type="text"  placeholder="Prenom" :value="user.name.first" required />
                    <input id="lastname" name="lastname" type="text"  placeholder="Nom" :value="user.name.last" required />
                    <input id="email" name="email" type="email" placeholder="Email" :value="user.email" required />
                </fieldset>
                <div>
                  <input id="submit" name="submit" type="submit" value="Soumettre" class="waves-effect waves-light btn"/>
                </div>
            </form>
            <br />
            <form action="/users/edit/password" method="POST">
                <h4>Changer de mot de passe</h4>
                <input type="hidden" name="id" :value="user.id" />
                <fieldset class="pure-group">
                  <input id="passwordOld" name="passwordOld" type="password" placeholder="Old Password" required />
                  <input id="password" name="password" type="password" placeholder="Password" required />
                  <input id="passwordConfirm" name="passwordConfirm" type="password" placeholder="Confirm Password" required />
                </fieldset>
                <div>
                  <input id="submit" name="submit" type="submit" value="Soumettre" class="waves-effect waves-light btn"/>
                </div>
            </form>
          </div>
        <main-footer></main-footer>
    </main>
</template>

<script type="text/javascript">
 import mainNav from './components/nav.vue';
 import mainFooter from './components/footer.vue';
 export default {
   data: function () {
     return {
     };
   },
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter
   },
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
    margin: 10vh;
  }
</style>
