<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'


/*********************************************************************************
 ******************************* MODELE *****************************************
**********************************************************************************/

const editMode = ref(false)

const editGenre = ref({
  id : '',
  titre : ''
})

const genre = ref({
  titre : ''
})

const listeErreurs = ref([])

const listeGenres = ref([])


/*********************************************************************************
 ******************************* FONCTIONS *****************************************
**********************************************************************************/

async function creerGenre(){
  try {
    // on veut passer dans le corps de la requête HTTP le JSON correspondant à la valeur de notre modèle : genre
    await axios.post('http://localhost:8080/api/genres', genre.value)
     // si jamais on n'a pas d'erreur
    // on vide la variable listeErreurs
    listeErreurs.value = []
    recupererGenres()

    genre.value.titre = ''
  }
  catch (error){
    // si jamais j'ai une erreur
    // je mets à jour la variable listeErreurs de notre modèle afin que le template les affiche
    listeErreurs.value = error.response.data.errors
  }

}

function startEditGenre(genre){ 
  editMode.value = true
  editGenre.value.id = genre.id
  editGenre.value.titre = genre.titre
}

async function stopEditGenre(){
  editMode.value = false
}

async function validEditGenre(){
  try {
    // on veut passer dans le corps de la requête HTTP le JSON correspondant à la valeur de notre modèle : genre
    await axios.put('http://localhost:8080/api/genres/'+editGenre.value.id, editGenre.value)
     // si jamais on n'a pas d'erreur
    // on vide la variable listeErreurs
    listeErreurs.value = []
    recupererGenres()

    editMode.value = false
  }
  catch (error){
    // si jamais j'ai une erreur
    // je mets à jour la variable listeErreurs de notre modèle afin que le template les affiche
    listeErreurs.value = error.response.data.errors
  }
}

async function supprimerGenre(id){
    await axios.delete('http://localhost:8080/api/genres/'+id)

    recupererGenres()
}

async function recupererGenres() {
    const reponseHTTP = await axios.get('http://localhost:8080/api/genres')

    listeGenres.value = reponseHTTP.data

}

onMounted(() => {
    recupererGenres()
});

</script>

<template>
  <link
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
  rel="stylesheet"
/>
<!-- Google Fonts -->
<link
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
  rel="stylesheet"
/>

  <main>
    <section>
      <div class="container mt-4 text-center">
          <h1>Gestion des Genres</h1>
      </div>
    
    <form>

        <div class="form-group container mt-4 d-flex align-items-center">
            <input class="form-control" id="genre"
                    placeholder="Titre" type="text"
                    v-model="genre.titre">
            <button class="btn btn-primary" type="button" @click="creerGenre">Ajouter</button>
        </div>
        
    </form>

    <ul v-if="listeErreurs != []" class="list-group list-group-flush">
      <li v-for="e in listeErreurs">{{e.defaultMessage}}</li>
    </ul>


    <div class="container mt-4 text-center">
      <h2>Liste des Genres</h2>
    </div>

  <div class="container mt-4">
    <table class="table">
        <thead>
        <tr>
            <th scope="col">Titre</th>
            <th scope="col">Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="g in listeGenres">
          <td v-if="editMode && editGenre.id === g.id">
            <input v-model="editGenre.titre" type="text">
          </td>
          <td v-else>{{ g.titre }}</td>
          <td v-if="editMode && editGenre.id === g.id">
            <button type="button" @click="validEditGenre">Valider</button>
            <button type="button" @click="stopEditGenre">Annuler</button>
          </td>
          <td v-else><button class="link-button edit-button btn btn-primary" @click="startEditGenre(g)">
              <i class="far fa-pen-to-square"></i></button>
              <button class="link-button delete-button btn btn-danger"  @click="supprimerGenre(g.id)">
              <i class="far fa-trash-can"></i></button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    </section>
  </main>
</template>