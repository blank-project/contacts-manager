<template>
    <nav class="blue lighten-2">
        <div class="nav-wrapper">
            <a href="/" class="brand-logo"><i class="material-icons">home</i></a>
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
</style>
