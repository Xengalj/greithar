<template lang="html">

  <div class="top-bar">
    <router-link :to="{ name: 'home', params: {} }">
      <span class="text-large font-600 mr-3">
        Greiðar
      </span>
    </router-link>


    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      menu-trigger="click"
      ellipsis
    >
      <div class="flex-grow" />
      <!-- style="max-width: 100px" -->

      <!-- Search -->
      <el-input
        v-model="input4"
        style="width: 240px"
        placeholder="Type something"
      >
        <template #prefix>
          <font-awesome-icon icon="search" />
        </template>
      </el-input>

      <!-- <template>
         <input type="text" v-model="input" placeholder="Search fruits..." />
        <div class="item fruit" v-for="fruit in filteredList()" :key="fruit">
          <p>{{ fruit }}</p>
        </div>
        <div class="item error" v-if="input&&!filteredList().length">
           <p>No results found!</p>
        </div>
      </template> -->



      <!-- Profile -->
      <el-menu-item v-if="currentUser" index="0">
        <!-- <router-link to="/profile" class="nav-link"> -->
        <router-link :to="{ name: 'profile', params: { username: currentUser.username } }" class="nav-link">
          <font-awesome-icon icon="user" />
          {{ currentUser.username }}
        </router-link>
      </el-menu-item>

      <!-- Rules -->
      <el-sub-menu index="1">
        <template #title>
          <font-awesome-icon icon="book" />
          Rules
        </template>
        <el-menu-item v-for="(page, index) in rules" :key="index" :index="`1-${index}`">
          <router-link :to="page.link" class="nav-link">{{ page.title }}</router-link>
        </el-menu-item>
      </el-sub-menu>

      <!-- Lore -->
      <el-sub-menu index="2">
        <template #title>
          <font-awesome-icon icon="book" />
          Lore
        </template>
        <el-menu-item v-for="(page, index) in lores" :key="index" :index="`2-${index}`">
          <router-link :to="page.link" class="nav-link">{{ page.title }}</router-link>
        </el-menu-item>
      </el-sub-menu>



      <!-- DM Links -->
      <el-menu-item v-if="showAdmin" index="3">
        <router-link to="/admin" class="nav-link">
          <font-awesome-icon icon="map" /> DM Screen
        </router-link>
      </el-menu-item>


      <!-- Sign In / Out -->
      <el-menu-item v-if="currentUser" index="0">
        <a class="nav-link" @click.prevent="logOut">
          <font-awesome-icon icon="sign-out-alt" /> LogOut
        </a>
      </el-menu-item>

      <el-menu-item v-if="!currentUser" index="0">
        <router-link to="/login" class="nav-link">
          <font-awesome-icon icon="sign-in-alt" /> Login
        </router-link>
      </el-menu-item>

      <el-menu-item v-if="!currentUser" index="0">
        <router-link to="/register" class="nav-link">
          <font-awesome-icon icon="user-plus" /> Sign Up
        </router-link>
      </el-menu-item>



    </el-menu>


  </div>

  <div class="hero">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">home</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index">
        <router-link :to="crumb.to">{{ crumb.label }}</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
    title

  </div>









</template>

<script>
// import { ref } from "vue";
// let input = ref("");
// const fruits = ["apple", "banana", "orange"];
// function filteredList() {
//   return fruits.filter((fruit) =>
//     fruit.toLowerCase().includes(input.value.toLowerCase())
//   );
// }
// console.log(ref, filteredList);

export default {
  created() {
    // this.$router.options.routes.forEach(route => {
    //   console.log(route);
      //lore.children
    // this.items.push({
    //     name: route.name
    //     , path: route.path
    // })
    // })
  },

  computed: {
    breadcrumbs() {
      const route = this.$route;
      const matchedRoutes = route.matched;

      return matchedRoutes.map((routeItem) => ({
        label: routeItem.meta.breadcrumb || routeItem.name,
        to: this.getRoutePath(route, routeItem),
      }));
    },
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdmin() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_ADMIN');
      }
      return false;
    },
    showModerator() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_MODERATOR');
      }
      return false;
    },

    searchPlaceholder() {
      return "Search.;..";
    },

    // TODO: get pages from DB
    rules() {
      const rules = [
        {
          title: "Combat",
          link: "/rules/comabt"
        },
        {
          title: "Magic",
          link: "/rules/magic"
        }
      ];
      return rules;
    },
    lores() {
      let lore = [];
      this.$router.options.routes.forEach(route => {
        if (route.name == 'Lore') {
          route.children.forEach(route => {
            lore.push({
              title: route.name,
              link: route.path
            })
          });

        }
      })
      return lore;
    },
    npcs() {
      const npcs = [];
      return npcs;
    }
  },
  methods: {
    getRoutePath(route, routeItem) {
      const matchedSegments = route.matched.slice(0, route.matched.indexOf(routeItem) + 1);
      return matchedSegments.map((segment) => segment.path).join('/');
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
}
</script>

<style lang="css" scoped>
.flex-grow {
  flex-grow: 1;
}
.nav-link svg {
  vertical-align: middle;
}
.router-link-active {
  color: var(--el-color-success);
}
</style>
