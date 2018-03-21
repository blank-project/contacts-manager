<template>
    <main class="grey lighten-4 blue-grey-text">
        <main-nav></main-nav>
          <div id="container">
            <form method="GET" action="/contacts/" class="pure-form pure-form-aligned">
               <!-- integrer template du filter -->
              <div class="padded">
                <div class="heading">
                  <h1>Liste des contacts</h1>
                    <!-- {{#isPermitted "contact:create" }}  v if ? ou server side rendering vuejs -->
                    <a class="pure-button pure-button-primary left-offset" href="/contacts/edit" title="Nouveau"><i class="fa fa-plus"></i></a>
                    <!-- {{/isPermitted }} -->
                    </div>
                    <table id="contact-list" class="contact-list pure-table pure-table-striped">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Mail</th>
                        <th>Téléphone</th>
                        <th>Organisation</th>
                        <th>Fonction</th>
                        <th>Adresse</th>
                        <th>Etiquettes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- <tr class="contact-line clickable" data-id="{{ id }}"> -->
                      <tr v-for="contact in contacts">
                        <td>{{ contact.name.first + ' ' + contact.name.last }}</td>
                        <td v-for="email in contact.emails">{{ email.value }}</td>
                        <td v-for="phone in contact.phones">{{ phone.value }}</td>
                        <td>{{ contact.organization }}</td>
                        <td>{{ contact.title }}</td>
                        <td v-for="address in contact.addresses">{{ address.number + ' ' + address.street + ' ' + address.code + ' ' + address.city }}</td>
                        <td v-for="tag in contact.tags">{{ tag.name }}</td>
                      </tr>
                        <!-- <td>{{ formattedAddress }}</td>  -->
                        <!-- <td>
                        {{#tags}}
                            {{> tag }}
                          {{/tags}}
                        </td> -->
                      <!-- </tr> -->
                    </tbody>
                </table>
                <div class="padded">
                    <!-- <input name="previousSize" type="hidden" value="{{ size }}" />
                    <button name="first" type="submit" {{#if hasPrevious}}value="{{ previous }}"{{else}}disabled{{/if}} class="pure-button fa fa-angle-double-left"></button>
                    <button name="first" type="submit" {{#if hasNext}}value="{{ next }}"{{else}}disabled{{/if}} class="pure-button fa fa-angle-double-right"></button> -->
                    <!-- {{#if incomplete}}
                    <input name="size" type="number" value="{{ size }}" min="0" max="200" step="10" size="3" />
                    {{/if}} -->
                </div>
                <!-- {{#isPermitted "contact:export:csv" }}-->
                <div class="padded">
                    <button name="action" type="submit" value="export.csv" class="pure-button pure-button-primary">Exporter</button>
                </div>
                <!--{{/isPermitted}}-->
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
     mainFooter: mainFooter,
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
