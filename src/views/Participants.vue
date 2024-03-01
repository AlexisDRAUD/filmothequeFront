<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'


/*********************************************************************************
 ******************************* MODELE *****************************************
**********************************************************************************/
const editMode = ref(false)

const editParticipant = ref({
  id : '',
  prenom : '',
  nom : ''
})

const participantToAdd = ref({
  prenom : '',
  nom : ''
})

const listeParticipants = ref([])


/*********************************************************************************
 ******************************* FONCTIONS *****************************************
**********************************************************************************/

async function postParticipant(){
    await axios.post('http://localhost:8080/api/participants', participantToAdd.value)

    recupererParticipants()

    participantToAdd.value = {
     prenom : '',
     nom : ''
    }
}

function startEditParticipant(participant){
  editMode.value = true
  editParticipant.value.id = participant.id
  editParticipant.value.prenom = participant.prenom
  editParticipant.value.nom = participant.nom
}

async function stopEditParticipant(){
  editMode.value = false
}

async function validEditParticipant(){
  editMode.value = false
  await axios.put('http://localhost:8080/api/participants/'+editParticipant.value.id, editParticipant.value)

  recupererParticipants()
}

async function supprimerParticipant(id){
    await axios.delete('http://localhost:8080/api/participants/'+id)

    recupererParticipants()
}

async function recupererParticipants(){
    const reponseHTTP = await axios.get('http://localhost:8080/api/participants')

    listeParticipants.value = reponseHTTP.data

}

onMounted(() => {
  recupererParticipants()
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
                <h1>Liste des participants</h1>
            </div>
            <form>
                <div class="form-group container mt-4 d-flex align-items-center">
                    <input v-model="participantToAdd.prenom" class="form-control" placeholder="Prénom" type="text">
                    <input v-model="participantToAdd.nom" class="form-control" placeholder="Nom" type="text">
                    <button class="btn btn-primary" type="button" @click="postParticipant">Ajouter</button>
                </div>
            </form>
            <div class="container mt-4">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Prénom</th>
                            <th scope="col">Nom</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in listeParticipants" :key="p.id">
                            <td v-if="editMode && editParticipant.id === p.id">
                                <input v-model="editParticipant.prenom" type="text">
                            </td>
                            <td v-else>{{ p.prenom }}</td>

                            <td v-if="editMode && editParticipant.id === p.id">
                                <input v-model="editParticipant.nom" type="text">
                            </td>
                            <td v-else>{{ p.nom }}</td>

                            <td>
                                <template v-if="editMode && editParticipant.id === p.id">
                                    <button class="valid-button" @click="validEditParticipant">Valider</button>
                                    <a class="link-button edit-button" @click="stopEditParticipant">Annuler</a>
                                </template>
                                <template v-else>
                                    <a class="link-button edit-button btn btn-primary" @click="startEditParticipant(p)"><i
                                            class="far fa-pen-to-square"></i></a>
                                    <a class="link-button delete-button btn btn-danger"
                                        @click="supprimerParticipant(p.id)"><i class="far fa-trash-can"></i></a>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </main>
</template>
