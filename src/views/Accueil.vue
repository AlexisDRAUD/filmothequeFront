<script setup>
import { RouterLink, RouterView } from 'vue-router'

// juste pour l'exemple, on recuperera les id autrement en vrai
const idBidon = 3;

// à compléter
</script>

<template>
  <main>
    <h2>Vous êtes sur la page d'accueil</h2>
    <p>à compléter</p>


    <!--
      Voici comment faire un lien "dynamique" :
      le ":" correspond à th: en thymeleaf
      va permettre de faire des attributs dynamiques
      et on va pouvoir mélanger texte et variables avec la syntaxe `/films/${film.id}` qui correspond à |/films/${film.id}| en thymeleaf
    -->
    <RouterLink :to="`/films/${idBidon}`">Lien vers le films d'id bidon (idBidon = 3) : "`/films/${idBidon}`"</RouterLink>
  </main>
</template>
