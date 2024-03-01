<script setup>
import axios from '@/axios/instance'
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref, provide } from 'vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import * as mdb from 'mdb-ui-kit';


// membre : va être utilisé referencé le membre connecté
const membre = ref({})

provide('membreConnected', membre)

const search = ref('')

/**
 * On se déconnexte de l'application
 * =
 - on supprime le jwt du localstorage
 - on réinitialise la variable du modèle membre
 */
function logout(){
  // on supprime le jwt du localstorage
  localStorage.removeItem('jwt')
  // on réinitialise la variable du modèle membre
  membre.value = {}
}

/**
 * A l'initialisation de l'application
 * On va chercher les infos de l'utilisateur connecté
 */
async function init(){
  try {
    // va chercher les informations de l'utilisateur courant connexté (à partir de l'API)
    const result = await axios.get('/user')
    // si tout se passe bien, 
    // on met à jour le modèle "membre"
    membre.value = result.data
  } catch (error) {
    console.log('erreur lors de la récupération du membre', error);
  }
}

async function searchFilm() {
  await axios.post({url: '/films'}, null, { params: {
    search
  }})
}

   // on définit ici que quand le composant se charge (onMounted), on appelle la méthode init()
  onMounted(() => {
    init()
})


</script>

<!-- 
  Ce template correspond à notre layout principal qui sera partagé par toutes les vues de l'application
  Les différentes pages vont être chargées à la place du composant  <RouterView /> (bas de page) 
-->
<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="/">Filmothèque</a>
        <button aria-controls="navbarNav" aria-expanded="false"
                aria-label="Toggle navigation"
                class="navbar-toggler"
                data-target="#navbarNav" data-toggle="collapse"
                type="button">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end"
             id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                  <RouterLink to="/films" class="nav-link">Films</RouterLink>
                </li>
                <li v-if="membre.admin">
                  <RouterLink to="/films/ajouter" class="nav-link">Créer Film</RouterLink>
                </li>
                <li v-if="membre.admin">
                  <RouterLink to="/genres" class="nav-link">Genres</RouterLink>
                </li>
                <li v-if="membre.admin">
                  <RouterLink to="/participants" class="nav-link">Participants</RouterLink>
                </li>
                <li v-if="membre.admin">
                  <RouterLink to="/membres" class="nav-link">Membres</RouterLink>
                </li>
                <form class="d-flex">
                    <input aria-describedby="search-addon" aria-label="Search"
                           class="form-control rounded"
                           placeholder="Rechercher un film..."
                           v-model="search"
                           name="search"
                           type="search"/>
                    <button class="input-group-text border-0" @click="searchFilm" id="search-addon"
                            type="button">
                        <i class="fas fa-search"></i>
                    </button>
                </form>
                <section v-if="membre.id">
                  membre connecté : {{ membre.pseudo }}  
                <button  @click="logout">Se deconnecter</button>
                </section>
                <section v-else>
                  <RouterLink to="/login">Login</RouterLink>
                </section>
            </ul>
        </div>
    </nav>
</header>

  <!-- Je vais charger à cet endroit le composant Vue qui correspond à la route courante (en fonction de l'url sur laquelle on est) -->
  <RouterView @login="init" />

</template>
