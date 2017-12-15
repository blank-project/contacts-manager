<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav></main-nav>
        <h1>{{ title }}</h1>
        <div class="row">
            <form action="/login" method="POST" class="col s12">
                <div class="input-field col s12">
                    <i class="material-icons prefix">account_circle</i>
                    <input id="username" name="username" type="text"  placeholder="Login" required />
                    <label for="username">Nom d'utilisateur</label>
                </div>
                <div class="input-field col s12">
                    <i class="material-icons prefix">lock</i>
                    <input id="password" name="password" type="password" placeholder="Password" required />
                    <label for="password">Mot de passe</label>
                </div>
                <div class="col s1 offset-s5">
                    <input id="submit" name="submit" type="submit" value="Soumettre" class="btn center"/>
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
     return {};
   },
   components: {
     mainNav: mainNav,
     mainFooter: mainFooter
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
