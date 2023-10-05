import Vue from "vue";
import VueRouter from "vue-router";

// for implement permission menu

Vue.use(VueRouter);

const routes = [
  {
    path: "/:boothId/home",
    component: () => import("@/views/Home"),
  },
  {
    path: "/:boothId/select-frame",
    component: () => import("@/views/Frame"),
  },
  {
    path: "/:boothId/camera",
    component: () => import("@/views/Camera"),
  },
  {
    path: "/:boothId/print",
    component: () => import("@/views/Print"),
  },
  {
    path: "/:boothId/form/:id",
    component: () => import("@/views/Form"),
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
