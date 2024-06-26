import { createWebHistory, createRouter } from "vue-router";

import Home from "./components/Home.vue";
import Login from "./components/Auth/Login.vue";
import Register from "./components/Auth/Register.vue";

// lazy-loaded
// https://router.vuejs.org/guide/advanced/lazy-loading.html#Lazy-Loading-Routes
// const
const BoardModerator = () => import("./components/BoardModerator.vue")
// const User = () => import("./components/BoardUser.vue")


const UserProfile = () => import("./components/Auth/Profile.vue")
// character


const temp = "<template><div class='user'><h2>User </h2><router-view /></div></template>";

// const Rules = temp;
const Lore = temp;
const Timeline = temp;
// const LoreRaces = temp;


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
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },


/*
    User Routes
*/
  {
    path: "/user",
    // component: User,
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: "profile", // user/:id/profile
        name: "profile",
        component: UserProfile,
        meta: { breadcrumb: "Profile" }
      },
      {
        path: "character/:id", // user/:id/character/:id
        name: "character",
        component: temp,
        meta: { breadcrumb: "Character Sheet" }
      },
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
        component: temp,
        // component: () => import('./views/Races.vue'),
        meta: { breadcrumb: "Race", },
      },
    ]
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
