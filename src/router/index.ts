import { createRouter, createWebHashHistory } from "vue-router";
import ArknightsDropsView from "../views/ArknightsDropsView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: ArknightsDropsView,
    },
  ],
});

export default router;
