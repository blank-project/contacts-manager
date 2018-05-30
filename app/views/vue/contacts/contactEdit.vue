<template>
    <main class="grey lighten-4 blue-grey-text">
      <main-nav></main-nav>
        <h3>Editer un contact</h3>
  <!--remettre vif apres design-->
        <form  action="/contacts/" method="POST" class="row">
          <div class="test">
            <input type="hidden" name="id" :value="contact.id" />
            <div class="col s12 formedit">
              <legend>Informations</legend>
              <fieldset  class="col s12">
                <div class="col s6">
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
                  </div>
                    <input id="phone" type="tel" name="phone" :value="contact.phone" /><br />
                </div>
                <div class="col s6">
                  <div class="pure-control-group">
                    <label for="organization">Organisation</label>
                    <input id="organization" type="text" name="organization" :value="contact.organization" /><br />
                  </div>
                  <div class="pure-control-group">
                    <label for="title">Fonction</label>
                    <input id="title" type="text" name="title" :value="contact.title" /><br />
                  </div>
                </div>
              </fieldset>
              <fieldset class="col s12">
                <legend>Adresse</legend>
                <div class="row">
                  <div class="col s6">
                    <div class="pure-control-group">
                      <label for="address.number">N°</label>
                      <input id="address.number" type="text" name="address.number" :value="contact.address.number" /><br />
                    </div>
                    <div class="pure-control-group">
                      <label for="address.street">Rue</label>
                      <input id="address.street" type="text" name="address.street" :value="contact.address.street" /><br />
                    </div>
                  </div>
                  <div class="col s6">
                    <div class="pure-control-group">
                      <label for="address.code">Code Postal</label>
                      <input id="address.code" type="text" name="address.code" :value="contact.address.code" /><br />
                    </div>
                    <div class="pure-control-group">
                      <label for="address.city">N°</label>
                      <input id="address.city" type="text" name="address.city" :value="contact.address.city" /><br />
                    </div>
                  </div>
                  <div class="pure-control-group" >
                    <label for="note">Note</label>
                    <textarea id="note" name="note">{{ contact.note }}</textarea><br />
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <fieldset class="padded">
            <input type="submit" name="submit" value="Soumettre" class="btn pure-button pure-button-primary"/>
            <a v-if="id" :href="'/contacts/' + contact.id" class="btn pure-button ">Annuler</a>
            <a href="/contacts/" class="pure-button btn">Annuler</a>
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

 main >.row{
     margin: 5vh 20vw 5vh 10vw;

 }

 #container {
     flex: 1 0 auto;
 }

 .formedit{ 
   background-color: white;
   width: 80vw;
   -webkit-box-shadow: 0px 0px 2px 1px #656565;
   -moz-box-shadow: 0px 0px 2px 1px #656565;
   filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
   zoom:1;
   box-shadow: 0 0 20px 0px #65656521;
   height: 95%;
   margin-left: 5vw !important;
 }

 legend{
   margin-left: 21vw;
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

 legend{
   margin: 5vh 0 10Vh 0;
   font-size: 1.2em;
 }
 #note{
   height: 15vh;
   margin-top: 5vh;
   border-style: solid;
   border-color: #9e9e9e !important;
   padding: 1vh;
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
