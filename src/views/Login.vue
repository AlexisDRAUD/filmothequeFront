<script setup>
import axios from '@/axios/instance'
import router from '@/router'
import { ref, onMounted } from 'vue'

const emit = defineEmits(['login'])

/********************************
 *  Initialisation du modèle ****
 *********************************/

// membre : va être utilisé pour remplir notre formulaire
const membre = ref({
  pseudo : '',
  motDePasse : '',
})

// errors : va être utilisé pour lister nos erreurs
const errors = ref()


/********************************
 ****** FONCTIONS ****************
 *********************************/


/**
 * creermembre() : est appelée lorsque j'appuie sur le bouton Valider du formulaire
 */

 async function login(){
  /*
  * utilisation d'axios : nécessite de faire un "npm install axios" pour installer la librairie et de faire dans le script : import axios from 'axios'
  * axios.post(URL, data) va envoyer les données data au format json à l'api d'url : URL
  * 
  * membre.value correspond à la valeur de l'objet membre de notre modèle (mis à jour par le formulaire)
  * 
  * await : permet d'attendre que la requête ait recuperé la réponse avant de passer à l'instruction suivante
  */
  try {
    const result = await axios.post('/login', membre.value)

    console.log(result.data)
    // si tout se passe bien, 
    // 1 - on met le token recuperé dans localstorage
    localStorage.setItem('jwt', result.data);
    // 2 - on emet un événement 'login' pour que le composant APP recharge la barre de navigation
    emit('login')
    // 3 - on redirige sur la page d'accueil
    router.push('/')
  } catch (error) {
    // si jamais il y a une erreur => on met à jour le modèle  
    errors.value = 'erreur de connexion'
  }
 }

</script>
<template>
    <main>
      <h1>Login</h1>
  
       <!-- j'affiche la liste des erreurs potentielles renvoyées par la dernière requête http -->
     <ul class="error" v-if="errors">
      <li class="error">{{errors}}</li>
     </ul>
  
      <!-- 
        on garde la balise form pour des raisons sémantiques (meilleure accessibilité, référencement internet)
        car on va envoyer une requête HTTP via Javascript
      -->
    <form>
          <!-- Pseudo -->
          <div class="form-element">
              <label>Pseudo</label>
              <!-- v-model : équivalent de th:field en vuejs -->
              <input type="text" v-model="membre.pseudo">
          </div>
  
          <!-- Mot de passe -->
          <div class="form-element">
              <label>Mot de passe</label>
              <!-- v-model : équivalent de th:field en vuejs -->
              <input type="text" v-model="membre.password">
          </div>
  
          <!-- Validation (on utilise un type button pour ne pas valider le formulaire)-->
          <button type="button" @click="login">Valider</button>
      </form>
  
    </main>
  </template>
