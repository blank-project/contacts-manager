<template>
  <main class="grey lighten-4 blue-grey-text" id="container">
      <main-nav></main-nav>
          <h3>{{ title }}</h3>
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
          <form action="/import" enctype="multipart/form-data" method="POST" >
            <div class="file-field input-field">
              <div class="btn">
                <span>File</span>
                <input id="upload" name="upload" type="file" required>
              </div>
              <div class="file-path-wrapper">
                <input class="file-path validate" type="text">
              </div>
              <div class="file-path-wrapper">
                <input id="submit" name="submit" type="submit" value="Soumettre" class="btn"/>
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
    background-color: white;
    -webkit-box-shadow: 0px 0px 2px 1px #656565;
    -moz-box-shadow: 0px 0px 2px 1px #656565;
    filter:progid:DXImageTransform.Microsoft.Glow(Color=#656565,Strength=3);
    zoom:1;
    box-shadow: 0 0 20px 0px #65656521;
    margin: 10vh 0 10vh 35vh;
    padding-bottom: 5vh;
    width: 60vw;
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
