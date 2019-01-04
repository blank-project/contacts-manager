<template>
  <main class="grey lighten-4 blue-grey-text">
    <main-nav :user="user"></main-nav>
    <div id="container" class="container">
      <div class="title">
        <h3>{{ title }}</h3>
      </div>
      <form action="/contacts/" method="POST">
        <fieldset>
          <div class="input-field">
            <i class="material-icons prefix">person</i>
            <label for="name">Nom</label>
            <input id="name" type="text" name="name" v-model="contact.fullName" required /><br />
          </div>
          <div class="input-field">
            <i class="material-icons prefix">alternate_email</i>
            <label for="email">eMail</label>
            <input id="email" type="email" name="email" v-model="contact.email" /><br />
          </div>
          <div class="input-field">
            <i class="material-icons prefix">phone</i>
            <label for="phone">Téléphone</label>
            <input id="phone" type="tel" name="phone" v-model="contact.phone" /><br />
          </div>
          <div class="input-field">
            <i class="material-icons prefix">business</i>
            <label for="organization">Organisation</label>
            <input id="organization" type="text" name="organization" v-model="contact.organization" /><br />
          </div>
          <div class="input-field">
            <i class="material-icons prefix">list_alt</i>
            <label for="title">Fonction</label>
            <input id="title" type="text" name="title" v-model="contact.title" /><br />
          </div>
        </fieldset>
        <fieldset v-for="address, i in contact.addresses" :key="i">
          <legend>Adresse {{ i + 1}}</legend>
          <div class="input-field">
            <label for="address.number">N°</label>
            <input id="address.number" type="text" name="address.number" v-model="contact.addresses[i].number" /><br />
          </div>
          <div class="input-field">
            <label for="address.street">Rue</label>
            <input id="address.street" type="text" name="address.street" v-model="contact.addresses[i].street" /><br />
          </div>
          <div class="input-field">
            <label for="address.code">Code Postal</label>
            <input id="address.code" type="text" name="address.code" v-model="contact.addresses[i].code" /><br />
          </div>
          <div class="input-field">
            <i class="material-icons prefix">location_on</i>
            <label for="address.city">Ville</label>
            <input id="address.city" type="text" name="address.city" v-model="contact.addresses[i].city" /><br />
          </div>
        </fieldset>

        <div class="input-field">
          <i class="material-icons prefix">comment</i>
          <label for="note">Note</label>
          <textarea id="note" name="note" class="materialize-textarea">{{ contact.note }}</textarea><br />
        </div>
        <fieldset class="padded">
          <input type="submit" name="submit" value="Soumettre" class="btn"/>
          <a :href="'/contacts/' + contact.id" class="btn">
            Annuler
          </a>
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
     return { 
       contact : null
     };
   },
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter
   }
 }
</script>

<style scoped>
 main {
     margin: 0;
     display: flex;
     min-height: 100vh;
     flex-direction: column;
 }

 main >.row{
     margin: 5vh 20vw 5vh 10vw;

 }

 #container {
     flex: 1 0 auto;
 }

 form {
   background-color: white;
   -webkit-box-shadow: 0px 0px 2px 1px #656565;
   -moz-box-shadow: 0px 0px 2px 1px #656565;
   filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
   zoom:1;
   box-shadow: 0 0 20px 0px #65656521;
 }

 .buttons{
  display: flex;
  margin: auto;
  margin-left: -5vw;
 }

 .btn{
   margin-top: 5vh;
 }

footer {
  margin-top: 10vh;
}

 h3{
   margin: auto;
   margin-top: 10vh
 }


 @media screen and (max-width: 640px){

   h3{
     margin-left: 12vh;
   }

   .padded{
     display: flex;
     flex-direction: column;
   }
 }
</style>
