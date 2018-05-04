<template>
    <nav>
        <div class="nav-wrapper">
            <a href="/" class="brand-logo"><img id="logo" src="/images/logoBC.png" alt="logo Belleville Citoyenne"></img></a>
            <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="material-icons">menu</i></a>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li><a href="/login" class="waves-effect waves-light">Se connecter</a></li>
                <li><a href="/signup" class="waves-effect waves-light">S'inscrire</a></li>
            </ul>

            <ul class="side-nav" id="nav-mobile">
                <li><a href="/login" class="waves-effect waves-light">Se connecter</a></li>
                <li><a href="/signup" class="waves-effect waves-light">S'inscrire</a></li>
            </ul>
        </div>
    </nav>
</template>

<script type="text/javascript">
 export default {
   props: ['navElements']
 }
</script>

<style scoped>
 a.brand-logo {
     padding-left: 6px !important;
 }
 nav {
   background-color: #00d2ff;
 }

 #logo{
   height: 7vh;
   margin-top: 1vh;
   margin-left: 1vh;
 }
 @media screen and (max-width: 640px){
  #logo {
     margin-top: 2vh;
      margin-left: 0;
  }
}

</style>
