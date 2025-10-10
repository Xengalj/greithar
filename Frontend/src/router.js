import { createWebHashHistory, createRouter } from "vue-router";

import Home from "./components/Home.vue";
import About from "./components/About.vue";
import Login from "./components/auth/Login.vue";
import Register from "./components/auth/Register.vue";
import PageNotFound from "./components/404.vue";

// temporary template
const temp = "<template><div class='user'><h2>User </h2><router-view /></div></template>";


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
        // load hero from $store, after /profile
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
          title: "Edit character",
        }
      },
    ],
  },

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
  *        RULE ROUTES        *
  *                           *
  \***************************/
  {
    path: "/rules",
    // component: Rules,
    children: [
      {
        path: "combat",
        name: "combat",
        component: temp,
        meta: {
          breadcrumb: "Combat",
          title: "Combat"
        }
      },
      {
        path: "magic",
        name: "magic",
        component: temp,
        meta: {
          breadcrumb: "Magic",
          title: "Magic"
        }
        // children: divine, arcane, spell slots v galdur
      }
    ]
  },


  /***************************\
  *                           *
  *        LORE ROUTES        *
  *                           *
  \***************************/
  {
    path: "/lore",
    name: "Lore",
    component: temp,
    meta: {
      breadcrumb: "Lore",
      title: "Lore",
    },
    children: [
      {
        path: "timeline",
        name: "timeline",
        component: temp,
        meta: {
          breadcrumb: "Timeline",
          title: "Timeline",
        }
      },
      {
        path: "races/:id", // /lore/races/:id <race_name> ?
        name: "race",
        component: temp,
        // component: () => import('./views/Races.vue'),
        meta: {
          breadcrumb: "Race",
          title: "Race",
        }
      },
    ]
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
