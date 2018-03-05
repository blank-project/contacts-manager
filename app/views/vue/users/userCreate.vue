<!-- data a def -->

<template>
  <main class="grey lighten-4 blue-grey-text">
      <main-nav></main-nav>
        <div class="row" id="container">

  <span class="fa fa-user"></span>
  <form action="/users/" method="POST" class="pure-form">
      <fieldset class="pure-group">
          <input id="firstname" name="firstname" type="text"  placeholder="Prenom" :value=" user.name.first " required />
          <input id="lastname" name="lastname" type="text"  placeholder="Nom" :value=" user.name.last " required />
            <input id="email" name="email" type="email" placeholder="Email" :value=" user.email " required />
      </fieldset>
      <fieldset class="pure-group">

            <input v-if="id" type="hidden" name="id" :value=" user.id "/>

            <input v-else id="username" name="username" type="text"  placeholder="User Name" :value=" user.username " required />

              <input v-if="id" id="passwordOld" name="passwordOld" type="password" placeholder="Old Password" required />

          <input id="password" name="password" type="password" placeholder="Password" required />
          <input id="passwordConfirm" name="passwordConfirm" type="password" placeholder="Confirm Password" required />
      </fieldset>
      <div>
        <input id="submit" name="submit" type="submit" value="Soumettre" class="pure-button pure-button-primary"/>
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

</style>
