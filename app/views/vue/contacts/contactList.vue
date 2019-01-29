<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav :user="user"></main-nav> <!--passer data "session" en attribut -->
        <alerts v-if="message" :message="message"></alerts>
        <cart :cart-content="cartContent" @removecart="removeCart"></cart>
        <div id="container" class="container">
          <form method="GET" action="/contacts/" class="pure-form pure-form-aligned">
             <!-- integrer template du filter -->
             <div class="padded">
               <div class="heading">
                 <h1>Liste des contacts</h1>
               </div>
               <div class="filters padded">
                  <input type="checkbox" id="filters-toggle-state" class="toggle-state" name="active" value="true" :checked="query.active">
                  <label for="filters-toggle-state" id="toggle-filter" class="btn" title="Filtrer"><i class="material-icons">filter_list</i></label>
                  <div id="filters" class="padded toggle-state-visible">
                    <div>
                      <label for="search">Recherche</label>
                      <input type="text" name="search" id="search" class="pure-input-rounded" :value="query.search" placeholder="Rechercher"/>
                    </div>
                    <div>
                      <label for="tags">Etiquettes</label>
                      <select multiple name="tags" id="tags">
                          <option v-for="tag in tags" :key="tag._id" :value="tag._id" :selected="query && query.tags && query.tags.indexOf(tag._id) != -1">{{ tag.name }}</option>
                      </select>
                    </div>
                    <div>
                      <label for="name">Nom</label>
                      <input type="text" name="name" id="name" class="pure-input-rounded" :value="query.name" placeholder="Nom" />
                    </div>
                    <div>
                      <label for="address.code">Code Postal</label>
                      <input type="text" name="address.code" id="address.code" class="pure-input-rounded" :value="query['address.code'] ? query['address.code'] : ''" placeholder="Code Postal"/>
                    </div>
                    <div>
                      <label for="organization">Organisation</label>
                      <input type="text" name="organization" id="organization" class="pure-input-rounded" :value="query.organization" placeholder="Organisation"/>
                    </div>
                    <input type="submit" value="Filtrer" class="btn" />
                  </div>
                </div>
              </div>
              <div id="medium">
                <table id="contact-list" class="contact-list pure-table pure-table-striped">
                  <thead>
                    <tr>
                      <th>Panier</th>
                      <th>Nom</th>
                      <th>Mail</th>
                      <th>Téléphone</th>
                      <th>Organisation</th>
                      <th>Fonction</th>
                      <th>Adresse</th>
                      <th>Etiquettes</th>
                    </tr>
                  </thead>
                  <tbody v-if="contacts.length">
                    <tr class="clickable" v-for="contact in contacts" :key="contact.id" @click="contactClicked(contact._id, $event);">
                      <td @click.stop="addCart(contact);"><i class="material-icons">shopping_cart</i></td>
                      <td>{{ contact.fullName }}</td>
                      <td><div v-for="(email, a) in contact.emails" :key="a">{{ email.value }}</div></td>
                      <td><div v-for="(phone, b) in contact.phones" :key="b">{{ phone.value }}</div></td>
                      <td>{{ contact.organization }}</td>
                      <td>{{ contact.title }}</td>
                      <td><div v-for="(address, b) in contact.addresses" :key="b"> {{ contact.formattedAddress }}</div></td>
                      <td><tag v-for="tag in contact.tags" :key="tag.id" :tag="tag"></tag></td>
                    </tr>
                  </tbody>
              </table>
              </div>
              <div class="input-field col s12">
                <select name="size" v-model="size">
                  <option value="" disabled selected>Nombre de contacts par pages</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="500">500</option>
                </select>
              </div>
              <div v-if="contacts.length" class="padded">
                  <input name="previousSize" type="hidden" :value="size" />
                  <button name="first" type="submit" :value="previous" :disabled="!hasPrevious" class="btn"><i class="material-icons">keyboard_arrow_left</i></button>
                  <button name="first" type="submit" :value="next" :disabled="!hasNext" class="btn"><i class="material-icons">keyboard_arrow_right</i></button>
              </div>
              <div class="buttons">
                <div class="padded">
                    <button v-if="checkPermissions(user, 'contact:export:csv')" name="action" type="submit" value="export.csv" class="btn"><i class="material-icons">save_alt</i></button>
                    <a v-if="checkPermissions(user, 'contact:create')" class="btn" href="/contacts/edit" title="Nouveau"><i class="material-icons">add</i></a>
                </div>
              </div>
          </form>
          </div>
      <main-footer></main-footer>
    </main>
</template>


<script type="text/javascript">
 import mainNav from './components/nav.vue';
 import tag from './components/tag.vue';
 import mainFooter from './components/footer.vue';
 import permissionMixin from './mixins/permissions.vue';
 import cart from './components/cart.vue';
 import alerts from './components/alerts.vue';

 export default {
   data: function () {
     return {
       cartContent:[],
       message:''
     };
   },
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter,
     tag: tag,
     cart: cart,
     alerts: alerts
   },
   mixins : [permissionMixin],
   methods: {
     goTo: function(url) {
       location.href = url;
     },
     contactClicked : function(id, e) {
      if (window.getSelection().toString()) {
        // Selection is not empty, prevent click.
        return;
      }
      this.goTo('/contacts/' + id);
     },
     addCart: function(contact) {
       if(!this.cartContent.some(function(el) {return el._id ==contact._id})) {
         this.cartContent.push(contact);
         M.toast({html: 'Le contact a été ajouté au panier', classes: 'green lighten-1', displayLength: 2000});
       } else {
         M.toast({html: 'Le contact est déjà dans le panier', classes: 'red darken-2', displayLength: 2000});
       }
    },
    removeCart: function(payload) {
      if(payload) {
       for(var i=0;i<this.cartContent.length;i++) {
         if(this.cartContent[i].id === payload) {
           document.getElementById('cart-'+i).classList.remove('scale-in');
           document.getElementById('cart-'+i).classList.add('scale-out');
           var that = this;
           setTimeout((function(index) {
             return function() {
               that.cartContent.splice(index, 1);
               document.getElementById('cart-'+index).classList.add('scale-in');
               document.getElementById('cart-'+index).classList.remove('scale-out');
             }
           })(i), 100);
         }
       }
      } else {
        document.getElementById('cartList').classList.add('scale-out')
        setTimeout(function() {
          this.cartContent = [];
          localStorage.removeItem('cart');
          document.getElementById('cartList').classList.remove('scale-out')
        }.bind(this), 100)

      }

    },
    saveCartLocal: function() {
      let parsed = JSON.stringify(this.cartContent);
 
      if(parsed !=[] || parsed != null) {
        localStorage.setItem('cart', parsed);
      }
    },
    removeFilters: function() {
      localStorage.removeItem('backLink');
    }
   },
   mounted() {
    localStorage.setItem('backLink', window.location.href)
    window.addEventListener('beforeunload', this.saveCartLocal);
    //window.addEventListener('beforeunload', this.removeFilters);

    if(localStorage.getItem('cart')) {
       this.cartContent = JSON.parse(localStorage.getItem('cart'));
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
