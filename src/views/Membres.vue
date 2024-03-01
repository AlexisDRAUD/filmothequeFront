<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'


/*********************************************************************************
 ******************************* MODELE *****************************************
**********************************************************************************/

const editMode = ref(false)

const editMembre = ref({
  id : '',
  prenom : '',
  nom : '',
  pseudo : '',
  password : '',
  admin : ''
})

const membreToAdd = ref({
  prenom : '',
  nom : '',
  pseudo : '',
  password : '',
  admin : ''
})

const listeErreurs = ref([])

const listeMembres = ref([])


/*********************************************************************************
 ******************************* FONCTIONS *****************************************
**********************************************************************************/

async function postMembre(){
    try {
        await axios.post('http://localhost:8080/api/membres', membreToAdd.value)
        listeErreurs.value = []
        recupererMembres()

        membreToAdd.value = {
            prenom : '',
            nom : '',
            pseudo : '',
            password : '',
            admin : ''
        }
    } catch (error){
        listeErreurs.value = error.response.data.errors
    }
}

function startEditMembre(membre){
  editMode.value = true
  editMembre.value.id = membre.id
  editMembre.value.prenom = membre.prenom
  editMembre.value.nom = membre.nom
  editMembre.value.pseudo = membre.pseudo
  editMembre.value.password = membre.password
  editMembre.value.admin = membre.admin
}

function stopEditMembre(){
  editMode.value = false
}

async function validEditMembre(){
    try {
        await axios.put('http://localhost:8080/api/membres/'+editMembre.value.id, editMembre.value)
        listeErreurs.value = []
        recupererMembres()

        membreToAdd.value = {
            prenom : '',
            nom : '',
            pseudo : '',
            password : '',
            admin : ''
        }

        editMode.value = false
    } catch (error){
        listeErreurs.value = error.response.data.errors
    }
}

async function supprimerMembre(id){
    await axios.delete('http://localhost:8080/api/membres/'+id)

    recupererMembres()
}

async function recupererMembres(){
    const reponseHTTP = await axios.get('http://localhost:8080/api/membres')

    listeMembres.value = reponseHTTP.data

}

onMounted(() => {
  recupererMembres()
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
                <h1>Liste des membres</h1>
            </div>
            <form>
                <div class="form-group container mt-4 d-flex align-items-center">
                    <input v-model="membreToAdd.prenom" class="form-control" placeholder="Prénom" type="text">
                    <input v-model="membreToAdd.nom" class="form-control" placeholder="Nom" type="text">
                    <input v-model="membreToAdd.pseudo" class="form-control" placeholder="Pseudo" type="text">
                    <input v-model="membreToAdd.password" class="form-control" placeholder="Mot de passe" type="text">
                    <div class="form-check form-check-inline">
                        <input v-model="membreToAdd.admin" class="form-check-input" type="checkbox">
                        <label class="form-check-label">Admin ?</label>
                    </div>
                    <button class="btn btn-primary" type="button" @click="postMembre">Ajouter</button>
                </div>
            </form>
            <ul v-if="listeErreurs != []" class="list-group list-group-flush">
                <li v-for="e in listeErreurs">{{e.defaultMessage}}</li>
              </ul>
            <div class="container mt-4">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Prénom</th>
                            <th scope="col">Nom</th>
                            <th scope="col">Pseudo</th>
                            <th scope="col">Mot de passe</th>
                            <th scope="col">Admin</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="m in listeMembres" :key="m.id">
                            <td v-if="editMode && editMembre.id === m.id">
                                <input v-model="editMembre.prenom" type="text">
                            </td>
                            <td v-else>{{ m.prenom }}</td>

                            <td v-if="editMode && editMembre.id === m.id">
                                <input v-model="editMembre.nom" type="text">
                            </td>
                            <td v-else>{{ m.nom }}</td>

                            <td v-if="editMode && editMembre.id === m.id">
                                <input v-model="editMembre.pseudo" type="text">
                            </td>
                            <td v-else>{{ m.pseudo }}</td>

                            <td v-if="editMode && editMembre.id === m.id">
                                <input v-model="editMembre.password" type="password">
                            </td>
                            <td v-else>{{ m.password }}</td>

                            <td v-if="editMode && editMembre.id === m.id">
                                <input v-model="editMembre.admin" type="checkbox">
                            </td>
                            <td v-else class="check">{{ m.admin ? '✓' : '' }}</td>

                            <td>
                                <template v-if="editMode && editMembre.id === m.id">
                                    <button class="valid-button" @click="validEditMembre">Valider</button>
                                    <a class="link-button edit-button" @click="stopEditMembre">Annuler</a>
                                </template>
                                <template v-else>
                                    <a class="link-button edit-button btn btn-primary" @click="startEditMembre(m)"><i
                                            class="far fa-pen-to-square"></i></a>
                                    <a class="link-button delete-button btn btn-danger"
                                        @click="supprimerMembre(m.id)"><i class="far fa-trash-can"></i></a>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </main>
</template>
