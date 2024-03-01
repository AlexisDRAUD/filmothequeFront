import { createRouter, createWebHistory } from 'vue-router'

/**
 * Dans le router
 * Je définie quel composant Vue correspond à quelle route
 */

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Accueil.vue')
    },
    {
      path: '/login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/films',
      component: () => import('@/views/Films.vue')
    },
    {
      path: '/genres',
      component: () => import('@/views/Genres.vue')
    },
    {
      path: '/participants',
      component: () => import('@/views/Participants.vue')
    },
    {
      path: '/membres',
      component: () => import('@/views/Membres.vue')
    },
    // on charge le même template sur la vue de création et d'affichage
    {
      path: '/films/ajouter',
      component: () => import('@/views/Film.vue')
    },
    /*
     routes avec un paramètre variable :id
     on pourra recupérer l'id dans le composant avec :
     import { useRoute } from 'vue-router'
     const id = useRoute().params.id
    */

    {
      path: '/films/:id/details',
      component: () => import('@/views/Film.vue')
    },
    {
      path: '/films/:id/modifier',
      component: () => import('@/views/Film.vue')
    },
    {
      path: '/avis/ajouter/:id',
      component: () => import('@/views/Avis.vue')
    }
  ]
})

export default router
