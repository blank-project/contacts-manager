<template>
  <main class="grey lighten-4 blue-grey-text" id="container">
      <main-nav></main-nav>
          <h5>{{title}}</h5>
          <span class="instructions">
            <p><b>Uploader un fichier CSV, encodé en UTF-8, sans ligne d'en-tête, séparateur ",".</b></p><br/></br>
            <b>Les colonnes sont :</b>
            <ul>
            <li>Prénom</li>
            <li>Nom</li>
            <li>E-mail</li>
            <li>Téléphone 1</li>
            <li>Téléphone 2</li>
            <li>Organisation</li>
            <li>Fonction</li>
            <li>N° de Rue</li>
            <li>Rue</li>
            <li>Code Postal</li>
            <li>Ville</li>
            <li>Note</li>
            </ul>
          </span>

    <!-- v-if -->
          <!-- <div class="messages error">{{message}}</div> -->


          <form action="/import" enctype="multipart/form-data" method="POST" class="pure-form " >
            <div class="file-field input-field">
              <div class="btn">
                <span>File</span>
                <input id="upload" name="upload" type="file" required>
              </div>
              <div class="file-path-wrapper">
                <input class="file-path validate" type="text">
              </div>
              <div class="file-path-wrapper">
                <input  id="submit" name="submit" type="submit" value="Soumettre" class="waves-effect waves-light btn"/>
              </div>
            </div>
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
  main{
    margin: 0 !important;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  #container {
      flex: 1 0 auto;
  }

  span{
    margin: auto;
  }
  p{
    font-size: 1.2em;
  }
  form{
    margin: auto;
  }
  h5{
    text-align: center;
    margin: 10vh 0 0 0;
    font-weight: bold;
  }
  .file-field{
    display: flex;
    margin: auto;
  }

</style>
