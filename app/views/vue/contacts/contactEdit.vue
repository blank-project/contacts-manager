
<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav></main-nav>
        <div id="container">
          <form action="/contacts/" method="POST">
            <input v-if="id" type="hidden" name="id" :value="contact.id" />
            <fieldset>
              <div class="col s12">
                <div class="row">
                  <div class="input-field col s6">
                    <label for="name">Nom</label>
                    <input id="name" type="text" name="name" :value="contact.name"/>
                  </div>
                  <div class="input-field col s6">
                    <label for="email">Mail</label>
                    <input id="email" type="email" name="email" :value="contact.email" />
                  </div>
                  <div class="input-field col s6">
                    <label for="phone">Téléphone</label>
                    <input id="phone" type="tel" name="phone" :value="contact.phone" />
                  </div>
                  <div class="input-field col s6">
                    <label for="organization">Organisation</label>
                    <input id="organization" type="text" name="organization" :value="contact.organization" />
                  </div>
                  <div class="input-field col s6">
                    <label for="title">Fonction</label>
                    <input id="title" type="text" name="title" :value="contact.title" />
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend>Adresse</legend>
              </br>
              <div class="col s12">
                <div class="row">
                  <div class="input-field col s6">
                    <label for="address.number">N°</label>
                    <input id="address.number" type="text" name="address.number" :value="contact.address.number" />
                  </div>
                  <div class="input-field col s6">
                    <label for="address.street">Rue</label>
                    <input id="address.street" type="text" name="address.street" :value="contact.address.street" />
                  </div>
                  <div class="input-field col s6">
                    <label for="address.code">Code Postal</label>
                    <input id="address.code" type="text" name="address.code" :value="contact.address.code" />
                  </div>
                  <div class="input-field col s6">
                    <label for="address.city">N°</label>
                    <input id="address.city" type="text" name="address.city" :value="contact.address.city" />
                  </div>
                </div>
              </div>
            </fieldset>
<!--placement bouttons a faire-->
            <div class="col s12">
              <div class="row">
                <div class="input-field col s6">
                  <label for="note">Note</label>
                  <textarea class="materialize-textarea" id="note" name="note">{{ note }}</textarea>
                </div>
              </div>
            </div>
            <fieldset class="padded buttons">
              <input type="submit" name="submit" value="Soumettre" class="waves-effect waves-light btn"/>
              <a v-if="id" :href="'/contacts/' + contact.id" class="waves-effect waves-light btn">Annuler</a> <!--pb ici -->
              <a v-else href="input-field inline/contacts/" class="waves-effect waves-light btn">Annuler</a>
            </fieldset>
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
     return {};
   },
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter
   },
 }
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

.row{
    margin: 5vh 20vw 5vh 20vw;
}

 legend{
   margin-left: 21vw;

 }
 .buttons{
   margin: 10vh 20vw;
 }
 a{
   margin-left: 4vw;
 }
</style>
