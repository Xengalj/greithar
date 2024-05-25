import { createWebHistory, createRouter } from "vue-router";

import Home from "./components/Home.vue";
import Login from "./components/auth/Login.vue";
import Register from "./components/auth/Register.vue";
import PageNotFound from "./components/404.vue";

// lazy-loaded
// https://router.vuejs.org/guide/advanced/lazy-loading.html#Lazy-Loading-Routes
const BoardModerator = () => import("./components/BoardModerator.vue")
// const User = () => import("./components/BoardUser.vue")


// const UserProfile =
// const
// character


const temp = "<template><div class='user'><h2>User </h2><router-view /></div></template>";

const Rules = temp;
const Lore = temp;
const Timeline = temp;
const LoreRaces = temp;
// const CharacterSheet = temp;


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
    component: () => import("./components/dmScreen.vue"),
    meta: { breadcrumb: "Admin", },
  },
  {
    path: "/mod",
    name: "moderator",
    // lazy-loaded
    component: BoardModerator,
  },


/*
    User Routes
*/
  {
    path: "/user",
    meta: { breadcrumbs: "User" },
    children: [
      {
        path: "list",
        name: "user-list",
        component: () => import("./components/user/List.vue"),
        meta: { breadcrumbs: "User List" }
      },
      {
        path: "/edit",
        name: "user-edit",
        component: temp,
        meta: { breadcrumbs: "User Edit" }
      },
      {
        // when /user/:id is matched
        // path: "/:id",
        path: "/profile",
        name: "profile",
        component: () => import("./components/user/Profile.vue"),
        meta: { breadcrumbs: "Profile" },
      },
    ],
  },


/*
    Character Routes
*/

  {
    path: "/hero",
    name: "hero",
    component: () => import("./components/user/character.vue"),
    meta: { breadcrumb: "Character Sheet" }
  },
  // {
    //   path: "characters",
    //   name: "character-list",
    //   component: CharacterSheet,
    //   meta: { breadcrumb: "My Characters" }
    // },
    // {
      //   path: "character/:id", // user/:id/character/:id
      //   name: "character",
      //   component: CharacterSheet,
      //   meta: { breadcrumb: "Character Sheet" }
      // },
    // {
    //   path: "/character",
    //   meta: { breadcrumbs: "Character" },
    //   children: [
    //     {
    //       path: "/list",
    //       name: "character-list",
    //       component: temp,
    //       meta: { breadcrumbs: "User List" }
    //     },
    //     {
    //       path: "/edit",
    //       name: "user-edit",
    //       component: temp,
    //       meta: { breadcrumbs: "User Edit" }
    //     },
    //     {
    //       path: "/:id",
    //       meta: { breadcrumbs: ":id" },
    //       children: [
    //         {
    //           // when /user/:id/profile is matched
    //           path: "/profile", // user/:id/profile
    //           name: "profile",
    //           component: () => import("./components/user/Profile.vue"),
    //           meta: { breadcrumb: "Profile" }
    //         },
    //       ]
    //     },






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
        component: Rules,
        meta: { breadcrumb: "Combat" }
      },
      {
        path: "magic",
        name: "magic",
        component: Rules,
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
    component: Lore,
    meta: { breadcrumb: "Lore", },
    children: [
      {
        path: "timeline",
        name: "timeline",
        component: Timeline,
        meta: { breadcrumb: "Timeline", },
      },
      {
        path: "races/:id", // /lore/races/:id <race_name> ?
        name: "race",
        component: LoreRaces,
        // component: () => import('./views/Races.vue'),
        meta: { breadcrumb: "Race", },
      },
    ]
  },

/*
    404 Route
*/
  {
    // path: "*",
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
