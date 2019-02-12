<template>
    <main class="grey lighten-4 blue-grey-text">
    <main-nav :user="user"></main-nav>
    <div id="container" class="container">
      <div class="heading">
          <h1>Suppression des doublons</h1>
      </div>
      <p>Il y a {{ contacts.length }} comptes avec le meme prénom et nom de famille : </p>
      <contact v-for="(uniqueContact, a) in contacts" :key="a" :contact="cleanedData(uniqueContact)" :user="user" :tags="uniqueContact.tags"></contact>
    </div>
    <main-footer></main-footer>
  </main>
</template>

<script type="text/javascript">
 import mainNav from './components/nav.vue';
 import mainFooter from './components/footer.vue';
 import Contact from './components/contact.vue';
 import tag from './components/tag.vue'
 export default {
   data: function () {
     return {};
   },
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter,
     contact: Contact,
     tag:tag
    },
    methods: {
      cleanedData(uniqueContact) {
        let contactSorted = [];
        contactSorted.id = uniqueContact.contact._id;
        contactSorted.formattedAdress = uniqueContact.contact.formattedAdress ? uniqueContact.contact.formattedAdress : "";
        contactSorted.organization = uniqueContact.contact.organization ? uniqueContact.contact.organization : "";
        contactSorted.title = uniqueContact.contact.title ? uniqueContact.contact.title : "";
        contactSorted.fullName = uniqueContact.contact.name ? uniqueContact.contact.name.last : "";
        contactSorted.email = uniqueContact.contact.emails[0] ? uniqueContact.contact.emails[0].value : "";
        contactSorted.phone = uniqueContact.contact.phones[0] ? uniqueContact.contact.phones[0].value : "";
        contactSorted.tags = uniqueContact.contact.tags ? uniqueContact.contact.tags : "";
        contactSorted.hideAddTag = true;
        contactSorted.hideEdit = true;
        return contactSorted;
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

 #container > div {
   height: 100%;
 }

 .tag-remove {
   display:none;
 }

</style>
