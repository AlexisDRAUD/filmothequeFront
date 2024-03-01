<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import router from '@/router'
import SingleInputAutocomplete from '@/components/SingleInputAutocomplete.vue'

/*********************************************************************************
 ******************************* MODELE *****************************************
**********************************************************************************/
const id = useRoute().params.id
const path = useRoute().path.split('/')
const action = path[path.length-1]

const film = ref({
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

const listeGenres = ref([])
const listeParticipants = ref([])

const searchGenre = ref('')

/*********************************************************************************
 ******************************* FONCTIONS *****************************************
**********************************************************************************/

const searchGenres = computed(() => {
    console.log(searchGenre.value)
  if (searchGenre.value === '' || (searchGenre.value != '' && searchGenre.value === film.value.genre.titre)) {
    return []
  }

  let matches = 0

  return listeGenres.value.filter(genre => {
    if (
        genre.titre.toLowerCase().includes(searchGenre.value.toLowerCase())
      && matches < 10
    ) {
      matches++
      return genre
    }
  })
});

const selectGenre = (genre) => {
  selectedGenre.value = genre
  searchGenre.value = genre.titre
  film.value.genre = genre
  console.log(genre)
  console.log(film)
}
 
const selectedGenre = ref('')

// return {
//   countries,
//   searchTerm,
//   searchCountries,
//   selectCountry,
//   selectedCountry
// }

async function ajouterFilm(){
    await axios.post('http://localhost:8080/api/films/ajouter', film.value)
    router.push({path: '/films'})
}


async function validEditFilm(){
  await axios.put('http://localhost:8080/api/films/'+film.value.id, film.value)
  router.push({path: '/films/'+film.value.id+'/details'})
}

async function recupererFilm() {
    const reponseHTTP = await axios.get('http://localhost:8080/api/films/'+id)

    film.value = reponseHTTP.data
}

async function recupererGenres() {
    const reponseHTTP = await axios.get('http://localhost:8080/api/genres')

    listeGenres.value = reponseHTTP.data

}

async function recupererParticipants() {
    const reponseHTTP = await axios.get('http://localhost:8080/api/participants')

    listeParticipants.value = reponseHTTP.data
}

onMounted(() => {
    if(action!='ajouter') {
        recupererFilm()
    } 
    recupererGenres()
    recupererParticipants()
    console.log(film)
});

</script>

<template>
<main>
    <div class="container mt-4 text-center">
        <h1 v-if="action === 'details'">Détail du Film</h1>
        <h1 v-if="action === 'modifier'">Modifier Film</h1>
        <h1 v-if="action === 'ajouter'">Ajout du Film</h1>
    </div>

    <div class="container mt-4">
        <div class="row">
            <div class="col-md-6">
                <form>
                    <div class="form-group">
                        <label for="genre">Genre:</label>
                        <input v-if="action != 'details'" class="form-control" type="text" id="genre" list="list-genre" v-model="searchGenre">

                        <ul v-if="searchGenres.length" class="list-group" style="position: absolute; z-index: 999;">
                            <li
                              v-for="genre in searchGenres"
                              @click="selectGenre(genre)"
                              class="list-group-item"
                            >
                              {{ genre.titre }}
                            </li>
                          </ul>

                        <input class="form-control" id="genre"
                                v-if="action === 'details'"
                                :readonly="action === 'details'"
                                v-model="film.genre.titre"
                               type="text">
                    </div>
                    <div class="form-group">
                        <label for="annee">Année:</label>
                        <input class="form-control" id="annee"
                                v-model="film.annee"
                                :readonly="action === 'details'" type="text">
                    </div>
                    <div class="form-group">
                        <label for="titre">Titre:</label>
                        <input class="form-control" id="titre"
                                v-model="film.titre"
                                :readonly="action === 'details'" type="text">
                    </div>
                    <div class="form-group">
                        <label for="realisateur">Réalisateur:</label>
                        <select class="form-control" id="realisateur"
                                v-model="film.realisateur.id"
                                v-if="action != 'details'"
                                :readonly="action === 'details'">
                            <option  v-if="action === 'ajouter'" value="0">
                                -------
                            </option>
                            <option v-for="p in listeParticipants"
                                    :selected="p.id === film.realisateur.id"
                                    :value="p.id">{{p.prenom}} {{p.nom}}</option>
                        </select>
                        <input class="form-control" id="realisateur"
                                v-if="action === 'details'"
                                :readonly="action === 'details'"
                               :value="film.realisateur.prenom + ' ' + film.realisateur.nom"
                               type="text">
                    </div>
                    <div class="form-group">
                        <label for="duree">Durée:</label>
                        <input class="form-control" id="duree"
                            v-model="film.duree"
                            :readonly="action === 'details'" type="text">
                    </div>
                    <div class="form-group">
                        <label for="acteurs">Acteurs:</label>
                        <select class="form-control"
                                id="acteurs" multiple="true"
                                v-if="action === 'details'"
                                :readonly="action === 'details'">
                            <option v-for="a in film.acteurs"
                            :value="a.id">{{a.prenom}} {{a.nom}}</option>
                        </select>
                        <select class="form-control"
                                id="acteurs"
                                multiple="true" v-model="film.acteurs"
                                v-if="action != 'details'">
                            <option v-for="p in listeParticipants"
                            :value="p">{{p.prenom}} {{p.nom}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="synopsis">Synopsis:</label>
                        <textarea class="form-control" id="synopsis"
                                  rows="4"
                                  v-model="film.synopsis"
                                  :readonly="action === 'details'"></textarea>
                    </div>
                    <div class="form-group" v-if="action === 'details'">
                        <label for="avis">Commentaires:</label>
                        <li id="avis" v-for="a in film.avis"> {{a.commentaire}} {{a.note}}/5 - ({{a.membre.prenom}})</li>
                    </div>
                    <div v-if="action === 'modifier'">
                        <div class="form-group">
                            <button class="btn btn-primary" @click="validEditFilm" type="button">Modifier
                            </button>
                        </div>
                    </div>
                    <div v-if="action === 'ajouter'">
                        <div class="form-group">
                            <button class="btn btn-primary" @click="ajouterFilm" type="button">Ajouter
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-md-6">
                <div class="form-group" v-if="film.poster != ''">
                    <img alt="" class="img-fluid w-100"
                         :src="film.poster">
                </div>
            </div>
        </div>
    </div>
</main>
</template>