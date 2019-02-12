<template>
    <main class="grey lighten-4 blue-grey-text">
    <main-nav :user="user"></main-nav>
    <div id="container" class="container">
        <div class="heading">
            <h1>Gestion des doublons</h1>
        </div>
        <div id="medium">
            <table id="contact-list" class="contact-list pure-table pure-table-striped">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th class="text-center">Nombre de doublons</th>
                        <th class="text-center">Nettoyer</th>
                    </tr>
                </thead>
                <tbody v-if="contacts">
                    <tr v-for="(contact, a) in contacts" :key="a">
                        <td v-for="(uniqueContact, b) in contact._id" :key="b">{{ uniqueContact ? uniqueContact[0].value : 'Pas d\'adresse mail'}}</td>
                        <td class="text-center">{{ contact.count }}</td>
                        <td class="clickable text-center" @click="goTo('/contacts/duplicates/'+contact.ids)"><i class="material-icons">clear</i></td>
                    </tr>
                </tbody>
            </table>
        </div>
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
    methods: {
        goTo: function(url) {
            window.location.href = url;
        }
    },
    mounted() {
        localStorage.setItem('backLink', window.location.href)
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

 #container > div {
   height: 100%;
 }

  #medium, #filters {
   background-color: white;
   -webkit-box-shadow: 0px 0px 2px 1px #656565;
   -moz-box-shadow: 0px 0px 2px 1px #656565;
   filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
   zoom:1;
   box-shadow: 0 0 20px 0px #65656521;
 }

.text-center {
    text-align: center;
}


</style>
