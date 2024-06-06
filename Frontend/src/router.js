import { createWebHistory, createRouter } from "vue-router";

import Home from "./components/Home.vue";
import Login from "./components/auth/Login.vue";
import Register from "./components/auth/Register.vue";
import PageNotFound from "./components/404.vue";

// temporary template
const temp = "<template><div class='user'><h2>User </h2><router-view /></div></template>";


const routes = [
  {
    path: "/",
    alias: "/home",
    name: "home",
    component: Home,
    meta: {
      breadcrumb: "Home", //cutom breadcrumb label
    }
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
    path: "/admin",
    name: "admin",
    // lazy-loaded
    component: () => import("./components/dm/dmScreen.vue"),
    meta: { breadcrumb: "Admin", },
  },
  {
    path: "/mod",
    name: "moderator",
    // lazy-loaded
    component: () => import("./components/auth/BoardModerator.vue"),
  },


  /*
    User Routes
  */
  {
    path: "/user",
    name: "user",
    meta: { breadcrumb: "User" },
    children: [
      {
        path: "list",
        name: "user-list",
        component: () => import("./components/user/List.vue"),
        meta: { breadcrumb: "User List" }
      },
      {
        path: "create",
        name: "user-create",
        component: () => import("./components/user/Create.vue"),
        meta: { breadcrumb: "Create User" }
      },
      {
        // when /user/view/:id is matched
        path: "view/:id",
        name: "user-view",
        component: () => import("./components/user/View.vue"),
        meta: { breadcrumb: "View User" }
      },
      {
        path: "edit",
        name: "user-edit",
        component: temp,
        meta: { breadcrumb: "Edit User" }
      },
      {
        // when /user/:id is matched
        // path: "/:id",
        path: "profile",
        name: "profile",
        component: () => import("./components/user/Profile.vue"),
        meta: { breadcrumb: "Profile" },
      },
    ],
  },


/*
    Character Routes
*/

  // {
  //   path: "/hero",
  //   name: "hero",
  //   component: () => import("./components/user/character.vue"),
  //   meta: { breadcrumb: "Character Sheet" }
  // },
    {
      path: "/character",
      name: "character",
      meta: { breadcrumbs: "User" },
      children: [
        {
          path: "list",
          name: "character-list",
          component: () => import("./components/character/List.vue"),
          meta: { breadcrumbs: "Character List" }
        },
        {
          path: "create",
          name: "character-create",
          component: () => import("./components/character/Create.vue"),
          meta: { breadcrumbs: "Create Character" }
        },
        {
          path: "view",
          alias: "/hero",
          name: "character-view",
          component: () => import("./components/character/View.vue"),
          meta: { breadcrumbs: "View Character" }
        },
        {
          path: "edit",
          name: "character-edit",
          component: temp,
          meta: { breadcrumbs: "Edit Character" }
        },
        // {
        //   // when /user/:id is matched
        //   // path: "/:id",
        //   path: "profile",
        //   name: "profile",
        //   component: () => import("./components/user/Profile.vue"),
        //   meta: { breadcrumbs: "Profile" },
        // },
      ],
    },




/*
    Rule Routes
*/
  {
    path: "/rules",
    // component: Rules,
    children: [
      {
        path: "combat",
        name: "combat",
        component: temp,
        meta: { breadcrumb: "Combat" }
      },
      {
        path: "magic",
        name: "magic",
        component: temp,
        meta: { breadcrumb: "Magic" }
        // children: divine, arcane, spell slots v galdur
      }
    ]
  },


/*
    Lore Routes
*/
  {
    path: "/lore",
    name: "Lore",
    component: temp,
    meta: { breadcrumb: "Lore", },
    children: [
      {
        path: "timeline",
        name: "timeline",
        component: temp,
        meta: { breadcrumb: "Timeline", },
      },
      {
        path: "races/:id", // /lore/races/:id <race_name> ?
        name: "race",
        component: temp,
        // component: () => import('./views/Races.vue'),
        meta: { breadcrumb: "Race", },
      },
    ]
  },


/*
    Codex Routes
*/
  {
    path: "/beastiary",
    name: "Beastiary",
    component: () => import("./components/codex/beastiary.vue"),
    meta: { breadcrumb: "Beastiary" }
  },

/*
    404 Route
*/
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register', '/home'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('user');

//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (authRequired && !loggedIn) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;
