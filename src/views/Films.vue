<script setup>
import { ref, onMounted, inject } from 'vue'
import axios from 'axios'


/*********************************************************************************
 ******************************* MODELE *****************************************
**********************************************************************************/
const membre = inject('membreConnected').value

const filterSearch = ref({
    id:'',
    titre:'',
    annee:'',
    duree:'',
    synopsis:'',
    poster:'',
    realisateur: {id:'', prenom:'', nom:''},
    acteurs:[],
    genre:{id:'', titre:''},
    avis:[]
})

const listeFilms = ref([])

const listeGenres = ref([])

const listeParticipants = ref([])

/*********************************************************************************
 ******************************* FONCTIONS *****************************************
**********************************************************************************/
async function searchFilm(){
    const reponseHTTP = await axios.post('http://localhost:8080/api/films', filterSearch.value)

    listeFilms.value = reponseHTTP.data

}

async function supprimerFilm(id){
    await axios.delete('http://localhost:8080/api/films/'+id)

    recupererFilms()
}

async function recupererFilms(){
    const reponseHTTP = await axios.get('http://localhost:8080/api/films')

    listeFilms.value = reponseHTTP.data
}

async function recupererParticipants(){
    const reponseHTTP = await axios.get('http://localhost:8080/api/participants')

    listeParticipants.value = reponseHTTP.data
}

async function recupererGenres(){
    const reponseHTTP = await axios.get('http://localhost:8080/api/genres')

    listeGenres.value = reponseHTTP.data
}

onMounted(() => {
  recupererFilms()
  recupererParticipants()
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
                <h1>Les Films de l'ENI</h1>
            </div>

            <div class="mt-4">
              <form>
                  <label for="titre">Titre:</label>
                  <input id="titre" placeholder="Titre"
                         v-model="filterSearch.titre"
                         type="text">
                  <label for="genre">Genre:</label>
                  <select id="genre" v-model="filterSearch.genre">
                      <option :value="{id:'', titre:''}">
                          -------
                      </option>
                      <option v-for="g in listeGenres"
                              :value="g">{{ g.titre }}</option>
                  </select>
                  <label for="annee">Année:</label>
                  <input id="annee" placeholder="Année"
                         v-model="filterSearch.annee"
                         type="number">
                  <label for="realisateur">Réalisateur:</label>
                  <select id="realisateur"
                      v-model="filterSearch.realisateur">
                      <option :value="{id:'', prenom:'', nom:''}">
                          -------
                      </option>
                      <option v-for="r in listeParticipants"
                            :value="r">{{ r.prenom }} {{ r.nom }}</option>
                  </select>
                  <label for="acteurs">Acteurs:</label>
                  <select id="acteurs"
                      v-model="filterSearch.acteurs">
                      <option :value="[]">
                          -------
                      </option>
                      <option v-for="a in listeParticipants"
                            :value="[a]">{{ a.prenom }} {{ a.nom }}</option>
                  </select>
                  <button type="button" @click="searchFilm">Filtrer</button>
              </form>
          </div>
            
            <div class="container mt-4">
              <table class="table">
                  <thead>
                  <tr>
                      <th scope="col">Genre</th>
                      <th scope="col">Année</th>
                      <th scope="col">Titre</th>
                      <th scope="col">Réalisateur</th>
                      <th scope="col">Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="f in listeFilms" :key="f.id">
                      <td>{{ f.genre.titre }}</td>
                      <td>{{ f.annee }}</td>
                      <td>{{ f.titre }}</td>
                      <td>{{ f.realisateur.prenom }} {{ f.realisateur.nom }}</td>
                      <td>
                        <RouterLink :to="{path: '/films/'+ f.id + '/details'}" class="btn btn-primary"><i
                            class="fas fa-circle-info"></i></RouterLink>
                        <RouterLink :to="{path: '/films/'+ f.id + '/modifier'}" class="btn btn-primary" v-if="membre.admin"><i
                             class="far fa-pen-to-square"></i></RouterLink>
                          <a class="btn btn-danger"
                                v-if="membre.admin"
                              @click="supprimerFilm(f.id)">
                              <i class="far fa-trash-can"></i></a>
                        <RouterLink :to="{path: '/avis/ajouter/'+ f.id}" class="btn btn-warning" v-if="membre.id"><i class="far fa-star"></i></RouterLink>
                      </td>
                  </tr>
                  </tbody>
              </table>
          </div>
        </section>
    </main>
</template>