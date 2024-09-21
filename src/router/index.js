import { createRouter, createWebHashHistory } from "vue-router";


const router = createRouter({
  mode: import.meta.env.PROD ? "hash" : "history",
  base: import.meta.env.BASE_URL,

  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/layout/LayoutContainer.vue"),
      /* redirect: "/calendar", */
      children: [
        {
          path: "/calendar",
          name: "calendar",
          component: () => import("@/views/pc/Calendar.vue"),
        },
        {
          path: "/todo",
          name: "todo",
          component: () => import("@/views/pc/ToDo.vue"),
        },

        {
          path: "/tomatotimerconfig",
          name: "tomatotimer-config",
          component: () => import("@/views/pc/TomatoTimer/TomatoTimer.vue"),
        },
        {
          path: "/tomatotimerstart",
          name: "tomatotimer-start",
          component: () =>
            import("@/views/pc/TomatoTimer/TomatoTimerStart.vue"),
        },
        {
          path: "/timetable",
          name: "timetable",
          component: () => import("@/views/pc/TimeTable.vue"),
        },
        {
          path: "/login",
          name: "login",
          component: () => import("@/views/pc/Login.vue"),
        },
        {
          path: "/setting",
          name: "setting",
          component: () => import("@/views/pc/Setting.vue"),
        },
        {
          path: "/service",
          name: "service",
          component: () => import("@/views/pc/ServiceTerm.vue"),
        }
        ,
        {
          path: "/about",
          name: "about",
          component: () => import("@/views/pc/About.vue"),
        }
      ],
    }
  ],
});

export default router;
