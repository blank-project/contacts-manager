<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav :user="currentUser"></main-nav>
        <div id="container" class="container">
              <div id="medium">
                <table id="user-list" class="user-list pure-table pure-table-striped">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Mail</th>
                      <th>Téléphone</th>
                      <th>Organisation</th>
                      <th>Fonction</th>
                      <th>Actif</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="clickable" v-on:click="goTo('/users/' + user._id)" v-for="user in users" @click="goTo('/users/' + user._id)">
                      <td>{{ user.name.first }}</td>
                      <td>{{ user.name.last }}</td>
                      <td><p v-for="email in user.emails">{{ email.value }}</p></td>
                      <td><p v-for="phone in user.phones">{{ phone.value }}</p></td>
                      <td>{{ user.organization }}</td>
                      <td>{{ user.title }}</td>
                      <td><i v-if="user.meta.disabled" class="material-icons">block</i></td>
                    </tr>
                  </tbody>
              </table>
              </div>
              <div class="padded">
                <form action="/users">
                  <input name="previousSize" type="hidden" :value="size" />
                  <button name="first" type="submit" :value="previous" :disabled="!previous" class="btn"><i class="material-icons">keyboard_arrow_left</i></button>
                  <button name="first" type="submit" :value="next" :disabled="!next" class="btn"><i class="material-icons">keyboard_arrow_right</i></button>
                  <!-- <input v-if="incomplete" name="size" type="number" :value="size" min="0" max="200" step="10" size="3" /> -->
                </form>
              </div>
              <div class="buttons">
                <div class="padded">
                  <a v-if="checkPermissions(currentUser, 'user:create')" class="btn" href="/users/edit" title="Nouveau"><i class="material-icons">add</i></a>
                </div>
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
 import permissionMixin from './mixins/permissions.vue';

 export default {
   data: function () {
     return {
       users: null,
       first : 0,
       size : 15,
       previous : null,
       next : null
     };
   },
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter,
   },
   mixins : [permissionMixin],
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

 #medium, #filters {
   background-color: white;
   -webkit-box-shadow: 0px 0px 2px 1px #656565;
   -moz-box-shadow: 0px 0px 2px 1px #656565;
   filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
   zoom:1;
   box-shadow: 0 0 20px 0px #65656521;
 }

 a{
   font-size: 1.3em;
 }

 .buttons {
  display: flex;
  }

  .clickable {
    cursor: pointer;
  }

  .clickable td {
    transition: all 0.5s;
    background-color: rgba(0,0,0,0);
  }

  .clickable:hover td {
    background-color: rgba(0,0,0,.3);
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
