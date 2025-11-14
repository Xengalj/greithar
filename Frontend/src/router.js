import { createWebHashHistory, createRouter } from "vue-router";

import Home from "./components/Home.vue";
import About from "./components/About.vue";
import Login from "./components/auth/Login.vue";
import Register from "./components/auth/Register.vue";
import PageNotFound from "./components/404.vue";

const routes = [
  /***************************\
  *                           *
  *       BASIC ROUTES        *
  *                           *
  \***************************/
  {
    path: "/",
    alias: "/home",
    name: "home",
    component: Home,
    meta: {
      breadcrumb: "Home", //cutom breadcrumb label
      title: "Home",
    }
  },
  {
    path: "/about",
    name: "about",
    component: About,
    meta: {
      breadcrumb: "About",
      title: "About",
    },
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/dm-screen",
    name: "dm-screen",
    // lazy-loaded
    component: () => import("./components/dm/DMScreen.vue"),
    meta: {
      breadcrumb: "DM Screen",
      title: "DM Screen",
    },
  },

  {
    path: "/admin",
    name: "admin",
    // lazy-loaded
    component: () => import("./components/dm/DMScreen.vue"),
    meta: {
      breadcrumb: "Admin",
      title: "Admin",
    },
  },



  /***************************\
  *                           *
  *        USER ROUTES        *
  *                           *
  \***************************/
  {
    path: "/user",
    name: "user",
    redirect: { name: 'user-list' },
    meta: {
      breadcrumb: "User",
      title: "User",
    },
    children: [
      {
        path: "list",
        name: "user-list",
        component: () => import("./components/user/List.vue"),
        meta: {
          breadcrumb: "User List",
          title: "User List",
        }
      },
      {
        // when /user/view/:id is matched
        path: "view/:id",
        // alias: "/profile",
        name: "user-view",
        component: () => import("./components/user/View.vue"),
        meta: {
          breadcrumb: "View User",
          title: "View User",
        }
      },
      {
        path: "edit/:id",
        name: "user-edit",
        component: () => import("@/components/user/Edit.vue"),
        meta: {
          breadcrumb: "Edit User",
          title: "Edit User",
        }
      },
    ],
  },


  /***************************\
  *                           *
  *     CHARACTER ROUTES      *
  *                           *
  \***************************/
  {
    path: "/character",
    name: "character",
    redirect: { name: 'character-list' },
    meta: {
      breadcrumb: "Character",
      title: "Character",
    },
    children: [
      {
        path: "list/:id?",
        name: "character-list",
        component: () => import("./components/character/List.vue"),
        meta: {
          breadcrumb: "Character List",
          title: "Character List",
        }
      },
      {
        path: "view/:id",
        name: "character-view",
        component: () => import("./components/character/View.vue"),
        meta: {
          breadcrumb: "View Character",
          title: "View Character",
        }
      },
      {
        path: "edit/:id",
        name: "character-edit",
        component: () => import("./components/character/Edit.vue"),
        meta: {
          breadcrumb: "Edit Character",
          title: "Edit Character",
        }
      },
    ],
  },

  /***************************\
  *                           *
  *      CAMPAIGN ROUTES      *
  *                           *
  \***************************/
  {
    path: "/campaign",
    name: "campaign",
    redirect: { name: 'campaign-list' },
    meta: {
      breadcrumb: "Campaign",
      title: "Campaign",
    },
    children: [
      {
        path: "list/:id?",
        name: "campaign-list",
        component: () => import("./components/campaign/List.vue"),
        meta: {
          breadcrumb: "Campaign List",
          title: "Campaign List",
        }
      },
      {
        path: "view/:id",
        name: "campaign-view",
        component: () => import("./components/campaign/View.vue"),
        meta: {
          breadcrumb: "View Campaign",
          title: "View Campaign",
        }
      },
      {
        path: "edit/:id",
        name: "campaign-edit",
        component: () => import("./components/campaign/Edit.vue"),
        meta: {
          breadcrumb: "Edit Campaign",
          title: "Edit Campaign",
        }
      },
    ],
  },

  /***************************\
  *                           *
  *     ENCOUNTER ROUTES      *
  *                           *
  \***************************/
  // {
  //   path: "/encoutner",
  //   name: "encoutner",
  //   redirect: { name: 'encoutner-list' },
  //   meta: {
  //     breadcrumb: "Encounter",
  //     title: "Encounter",
  //   },
  //   children: [
  //     {
  //       path: "list/:id?",
  //       name: "encoutner-list",
  //       component: () => import("./components/encoutner/List.vue"),
  //       meta: {
  //         breadcrumb: "Encounter List",
  //         title: "Encounter List",
  //       }
  //     },
  //     {
  //       path: "view/:id",
  //       name: "encoutner-view",
  //       component: () => import("./components/encoutner/View.vue"),
  //       meta: {
  //         breadcrumb: "View Encounter",
  //         title: "View Encounter",
  //       }
  //     },
  //     {
  //       path: "edit/:id",
  //       name: "encoutner-edit",
  //       component: () => import("./components/encoutner/Edit.vue"),
  //       meta: {
  //         breadcrumb: "Edit Encounter",
  //         title: "Edit Encoutner",
  //       }
  //     },
  //   ],
  // },

  /***************************\
  *                           *
  *       CODEX ROUTES        *
  *                           *
  \***************************/
  {
    path: "/beastiary",
    name: "Beastiary",
    component: () => import("./components/codex/Beastiary.vue"),
    meta: {
      breadcrumb: "Beastiary",
      title: "Beastiary"
    }
  },
  {
    path: "/equipment",
    name: "Equipment",
    component: () => import("./components/codex/Equipment.vue"),
    meta: {
      breadcrumb: "Equipment",
      title: "Equipment"
    }
  },


  /***************************\
  *                           *
  *         404 ROUTE         *
  *                           *
  \***************************/
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: PageNotFound,
    meta: {
      title: "404",
    }
  },
];

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/home', '/equipment', '/about'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
