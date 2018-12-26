<template>
  <main class="grey lighten-4 blue-grey-text" id="container">
    <main-nav :user="user"></main-nav>
    <div id="container">
      <h3>{{ title }}</h3>
      <div class="instructions">
        <p>Uploader un fichier <a href="https://fr.wikipedia.org/wiki/Comma-separated_values">CSV</a> :
        <ul>
          <li>encodé en UTF-8</li>
          <li>sans ligne d'en-tête</li>
          <li>séparateur ","</li>
        </ul>
        </p>
        <p>
        <b>Les colonnes sont :</b>
        <ul>
        <li>Prénom</li>
        <li>Nom</li>
        <li>E-mail 1</li>
        <li>E-mail 2</li>
        <li>Téléphone 1</li>
        <li>Téléphone 2</li>
        <li>Organisation</li>
        <li>Fonction</li>
        <li>N° de Rue</li>
        <li>Rue</li>
        <li>Code Postal</li>
        <li>Ville</li>
        <li>Note</li>
        <li>Tag 1</li>
        <li>Tag 2</li>
        <li>Tag 3</li>
        <li>Tag 4</li>
        <li>Tag 5</li>
        </ul>
        </p>
      </div>
      <form action="/import" enctype="multipart/form-data" method="POST" >
          <input id="upload" name="upload" type="file" required>
          <input id="submit" name="submit" type="submit" value="Soumettre" class="btn"/>
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
    margin-left: 3vw;
    margin-top: 1vw;
  }
  form{
    margin: auto;
  }
  h3{
    text-align: center;
    margin: 5vh 0 0 0;
  }

  .file-field{
    display: flex;
    margin: auto;
  }
  .instructions {
    margin: 0px 30px;
  }

span  ul, span li {
    margin-left: 13vw;
    margin-bottom: 1vh;
  }

  span>b{
    margin-left: 13vw;
  }
  p>b{
    margin: 2vw;
  }

  @media screen and (max-width: 640px){
    .instructions {
      width: 80vw;
      margin:5vw 0 5vw 10vw;
    }
    .file-field{
      display: flex;
      flex-direction: column;
      margin: auto;
    }
    btn{
      margin: auto;
    }
  #submit{
      margin-left: 3vw;
      margin-bottom: 5vw;
    }
   }
</style>
