<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav></main-nav>
        <form v-if="id" action="/contacts/" method="POST" class="pure-form pure-form-aligned">
          <input type="hidden" name="id" :value="contact.id" />
          <fieldset>
            <div class="pure-control-group">
              <label for="name">Nom</label>
              <input id="name" type="text" name="name" :value="contact.fullname"/><br />
            </div>
            <div class="pure-control-group">
              <label for="email">Mail</label>
              <input id="email" type="email" name="email" :value="contact.email" /><br />
            </div>
            <div class="pure-control-group">
              <label for="phone">Téléphone</label>
              <input id="phone" type="tel" name="phone" :value="contact.phone" /><br />
            </div> <div class="pure-control-group">
              <label for="organization">Organisation</label>
              <input id="organization" type="text" name="organization" :value="contact.organization" /><br />
            </div> <div class="pure-control-group">
              <label for="title">Fonction</label>
              <input id="title" type="text" name="title" :value="contact.title" /><br />
            </div>
          </fieldset>
          <fieldset>
            <legend>Adresse</legend>
            <div class="pure-control-group">
              <label for="address.number">N°</label>
              <input id="address.number" type="text" name="address.number" :value="contact.address.number" /><br />
            </div>
            <div class="pure-control-group">
              <label for="address.street">Rue</label>
              <input id="address.street" type="text" name="address.street" :value="contact.address.street" /><br />
            </div>
            <div class="pure-control-group">
              <label for="address.code">Code Postal</label>
              <input id="address.code" type="text" name="address.code" :value="contact.address.code" /><br />
            </div>
            <div class="pure-control-group">
              <label for="address.city">N°</label>
              <input id="address.city" type="text" name="address.city" :value="contact.address.city" /><br />
            </div>
          </fieldset>

          <div class="pure-control-group">
            <label for="note">Note</label>
            <textarea id="note" name="note">{{ note }}</textarea><br />
          </div>
          <fieldset class="padded">
            <input type="submit" name="submit" value="Soumettre" class="pure-button pure-button-primary"/>

            <a v-if="id" :href="'/contacts/' + contact.id" class="pure-button">Annuler</a>

            <a href="/contacts/" class="pure-button">Annuler</a>

          </fieldset>
        </form>

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
  display: flex;
  margin: auto;
  margin-left: -5vw;
 }
 a{
   margin-left: 4vw;
 }

</style>
