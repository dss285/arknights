import { createRouter, createWebHistory } from "vue-router";
import ArknightsDropsView from "../views/ArknightsDropsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: ArknightsDropsView,
    },
  ],
});

export default router;
