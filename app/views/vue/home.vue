<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav :user="user"></main-nav>
        <alerts v-if="message" :message="message"></alerts>
        <div id="container" class="row">
            <div class="col s12 m12 center-text">
                <h2>{{ title }}</h2>
            </div>
            <div class="col s12 m12 center-text">
              <a href="/login" class="btn">Se connecter</a>
              <a href="/signup" class="btn">S'inscrire</a>
            </div>
        </div>
        <main-footer></main-footer>
    </main>
</template>

<script type="text/javascript">
 import mainNav from './components/nav.vue';
 import mainFooter from './components/footer.vue';
 import alerts from './components/alerts.vue';

 export default {
   data: function () {
     return {
       message: '',
       user: null
     };
   },
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter,
     alerts: alerts
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

 #container {
     flex: 1 0 auto;
 }

</style>
