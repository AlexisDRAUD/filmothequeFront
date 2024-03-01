<script setup>
import { ref, onMounted, inject} from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import router from '@/router'

const id = useRoute().params.id

/*********************************************************************************
 ******************************* MODELE *****************************************
**********************************************************************************/
const membre = inject('membreConnected').value

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

const avis = ref({
  id: '',
  note: 0,
  commentaire: '',
  membre: membre
})

/*********************************************************************************
 ******************************* FONCTIONS *****************************************
**********************************************************************************/
async function ajouterAvis(){
  await axios.post('http://localhost:8080/api/avis/'+id, avis.value)

  router.push({path: '/films/'+id+'/details'})
}

async function recupererFilm() {
    const reponseHTTP = await axios.get('http://localhost:8080/api/films/'+id)

    film.value = reponseHTTP.data
}

onMounted(() => {
  recupererFilm()
});


</script>

<template>
  <main>
    <div class="container mt-4 text-center">
      <h1>Donnez votre avis !</h1>
    </div>
    <div class="container mt-4">
      <div class="row">
          <div class="col-md-6">
              <form>
                  <div class="form-group">
                      <label for="note">Note:</label>
                      <input class="form-control" id="note"
                      v-model="avis.note" type="number">
                  </div>
                  <div class="form-group">
                      <label for="commentaire">Commentaire:</label>
                      <input class="form-control" id="commentaire"
                      v-model="avis.commentaire" type="text">
                  </div>
                  <div>
                      <div class="form-group">
                          <button class="btn btn-primary"  @click="ajouterAvis" type="button">Ajouter
                          </button>
                      </div>
                  </div>
              </form>
          </div>
          <div class="col-md-6">
              <div class="form-group" v-if="film.poster">
                  <img alt="" class="img-fluid w-100"
                  :src="film.poster">
              </div>
          </div>
      </div>
    </div>
  </main>
</template>
