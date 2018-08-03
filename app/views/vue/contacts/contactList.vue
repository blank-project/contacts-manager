<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav :user="user"></main-nav> <!--passer data "session" en attribut -->
          <div id="container">
            <form method="GET" action="/contacts/" class="pure-form pure-form-aligned">
               <!-- integrer template du filter -->
              <div class="padded">
                <div class="heading">
                  <h1>Liste des contacts</h1>
                  <!--Check reception data user (qui marche bien) <p>{{ user }}</p> -->

                </div>
                <div id="medium">
                  <table id="contact-list" class="contact-list pure-table pure-table-striped">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Mail</th>
                        <th>Téléphone</th>
                        <th>Organisation</th>
                        <th>Fonction</th>
                        <th>Adresse</th>
                        <th>Etiquettes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="contact in contacts" v-on:click="goTo('/contacts/' + contact._id)">
                        <td>{{ contact.name.first }}</td>
                        <td v-if="contact.name.last">{{ contact.name.last }}</td>
                        <td v-for="email in contact.emails">{{ email.value }}</td>
                        <td v-for="phone in contact.phones">{{ phone.value }}</td>
                        <td>{{ contact.organization }}</td>
                        <td>{{ contact.title }}</td>
                        <td v-for="address in contact.addresses">{{ address.number + ' ' + address.street + ' ' + address.code + ' ' + address.city }}</td>
                        <td v-for="tag in contact.tags">{{ tag.name }}</td>
                      </tr>
                    </tbody>
                </table>
                </div>
                <div id="small">
                    <div class="carte" v-for="contact in contacts"v-on:click="goTo('/contacts/' + contact._id)">
                      <p><b>Nom : </b> {{ contact.name.first }}</p>
                      <p v-if="contact.name.last"><b>Nom de famille : </b>{{ contact.name.last }}</p>
                      <p v-for="email in contact.emails"><b>Email : </b>{{ email.value }}</p>
                      <p v-for="phone in contact.phones"><b>Telephone : </b>{{ phone.value }}</p>
                      <p><b>Organisation : </b>{{ contact.organization }}</p>
                      <p><b>titre : </b>{{ contact.title }}</p>
                      <p v-for="address in contact.addresses"><b> Adresse : </b>{{ address.number + ' ' + address.street + ' ' + address.code + ' ' + address.city }}</p>
                      <p v-for="tag in contact.tags"><b>Etiquettes : </b>{{ tag.name }}</p>
                    </div>
                </div>
                <div class="padded">
                    <!-- <input name="previousSize" type="hidden" value="{{ size }}" />
                    <button name="first" type="submit" {{#if hasPrevious}}value="{{ previous }}"{{else}}disabled{{/if}} class="pure-button fa fa-angle-double-left"></button>
                    <button name="first" type="submit" {{#if hasNext}}value="{{ next }}"{{else}}disabled{{/if}} class="pure-button fa fa-angle-double-right"></button> -->
                    <!-- {{#if incomplete}}
                    <input name="size" type="number" value="{{ size }}" min="0" max="200" step="10" size="3" />
                    {{/if}} -->
                </div>
                <div class="buttons">
                <!-- {{#isPermitted "contact:export:csv" }}-->
                <div class="padded">
                    <button name="action" type="submit" value="export.csv" class="btn">Exporter</button>
                </div>
                <!--{{/isPermitted}}-->
              </div>
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
     mainFooter: mainFooter,
   },
   methods: {
     goTo: function(url) {
       location.href = url;
     }
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
 #container {
     flex: 1 0 auto;
 }

 #small {
   display: none;
 }

 #medium{
   background-color: white;
   -webkit-box-shadow: 0px 0px 2px 1px #656565;
   -moz-box-shadow: 0px 0px 2px 1px #656565;
   filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
   zoom:1;
   box-shadow: 0 0 20px 0px #65656521;
   width: 80vw;
   margin-left: 10vw;
 }

 .btn{
   margin-left: 10vw;
   margin-right: -10vw;
 }

 a{
   font-size: 1.3em;
 }

 h1{
   margin-left: 5vw;
 }
 .buttons {
  display: flex;
  }

  @media screen and (max-width: 640px){

    #medium {
      display: none;
    }
    #small {
      display: block;
    }
    .btn{
      margin: auto;
    }
    .carte{
      margin: 2vh;
      display: flex;
      flex-direction: column;
      background-color: white;
      border-radius: 2%;
      width: 85vw;
      padding: 15px;
      -webkit-box-shadow: 0px 0px 2px 1px #656565;
      -moz-box-shadow: 0px 0px 2px 1px #656565;
      filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
      zoom:1;
      box-shadow: 0 0 20px 0px #65656521;
    }
  }

</style>
