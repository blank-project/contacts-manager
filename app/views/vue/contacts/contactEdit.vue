<!-- ou accede t'on aux infos sur adresse du contact ? -->
<template>

    <main class="grey lighten-4 blue-grey-text">
        <main-nav></main-nav>

        <div id="container">
          <form action="/contacts/" method="POST" class="pure-form pure-form-aligned">
<!--
            {{#if id }} -->
            <input v-if="id" type="hidden" name="id" :value="contact.id " />
            <!-- {{/if}} -->
            <fieldset>
              <div class="col s12">
                <div class="row">
              <div class="input-field col s6">
                <label for="name">Nom</label>
                <input id="name" type="text" name="name" :value="contact.name"/><br />
              </div>
              <div class="input-field col s6">
                <label for="email">Mail</label>
                <input id="email" type="email" name="email" :value="contact.email" /><br />
              </div>
              <div class="input-field col s6">
                <label for="phone">Téléphone</label>
                <input id="phone" type="tel" name="phone" :value="contact.phone" /><br />
              </div> <div class="input-field col s6">
                <label for="organization">Organisation</label>
                <input id="organization" type="text" name="organization" :value="contact.organization" /><br />
              </div> <div class="input-field col s6">
                <label for="title">Fonction</label>
                <input id="title" type="text" name="title" :value="contact.title" /><br />
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
                <input id="address.number" type="text" name="address.number" :value="contact.address.number" /><br />
              </div>
              <div class="input-field col s6">
                <label for="address.street">Rue</label>
                <input id="address.street" type="text" name="address.street" :value="contact.address.street" /><br />
              </div>
              <div class="input-field col s6">
                <label for="address.code">Code Postal</label>
                <input id="address.code" type="text" name="address.code" :value="contact.address.code" /><br />
              </div>
              <div class="input-field col s6">
                <label for="address.city">N°</label>
                <input id="address.city" type="text" name="address.city" :value="contact.address.city" /><br />
              </div>
              </div>
              </div>
            </fieldset>
<!--placement bouttons-->
            <div class="input-field col s6">
              <label for="note">Note</label>
              <textarea id="note" name="note">{{ note }}</textarea><br />
            </div>
            <fieldset class="padded">
              <input type="submit" name="submit" value="Soumettre" class="pure-button pure-button-primary"/>
              <!-- {{#if id }} -->
              <a v-if="id" :href="'/contacts/' + contact.id" class="pure-button">Annuler</a>
              <!-- {{else}} -->
              <a v-else href="input-field inline/contacts/" class="pure-button">Annuler</a>
              <!-- {{/if}} -->
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

</style>
