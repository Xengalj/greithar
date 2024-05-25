<template lang="html">

  <div class="top-bar">
    <router-link :to="{ name: 'home', params: {} }">
      <span class="text-large font-600 mr-3">
        Greiðar
      </span>
    </router-link>

    <div class="flex-grow" />

    <!-- TODO
      - get current active page and coloring working
      - get click outside closes menu working
   -->

    <el-menu
      class="el-menu"
      mode="horizontal"
      menu-trigger="click"
      style="max-width: 500px"
      ellipsis
    >
    <!-- close-on-click-outside -->
    <div class="flex-grow" />


      <!-- Search -->
      <el-menu-item index="search">
        <el-input
          v-model="input"
          style="width: 240px"
          placeholder="Search"
        >
          <template #prefix>
            <font-awesome-icon icon="search" />
          </template>
        </el-input>
      </el-menu-item>


      <!-- User Links -->
      <el-sub-menu index="0">
        <template #title>
          <font-awesome-icon icon="user" /> {{ currentUser.username }}
        </template>

        <el-menu-item v-if="currentUser" index="profile">
          <router-link :to="{ name: 'profile', params: { username: currentUser.username } }" class="nav-link">
            <font-awesome-icon icon="user-cog" /> Profile, {{ currentUser.username }}
          </router-link>
        </el-menu-item>

        <el-menu-item v-if="currentUser" index="hero">
          <router-link to="/hero" class="nav-link">
            <!-- TODO update link to use user/:id/char/:current -->
            <font-awesome-icon icon="street-view" /> Your Hero <!-- grab user's current toon name -->
          </router-link>
        </el-menu-item>

        <el-menu-item v-if="currentUser" index="characters">
          <router-link to="/toons" class="nav-link">
            <!-- TODO update link to use user/:id/char/list -->
            <font-awesome-icon icon="users" /> Other Characters
          </router-link>
        </el-menu-item>
      </el-sub-menu>

      <!-- Rules -->
      <el-sub-menu index="1">
        <template #title>
          <font-awesome-icon icon="book" /> Rules
        </template>

        <el-menu-item v-for="(page, rIndex) in rules" :key="rIndex" :index="`1-${rIndex}`">
          <router-link :to="page.link" class="nav-link">{{ page.title }}</router-link>
        </el-menu-item>
      </el-sub-menu>

      <!-- Lore -->
      <el-sub-menu index="2">
        <template #title>
          <font-awesome-icon icon="scroll" /> Lore
        </template>

        <el-menu-item v-for="(page, lIndex) in lores" :key="lIndex" :index="`2-${lIndex}`">
          <router-link :to="page.link" class="nav-link">{{ page.title }}</router-link>
        </el-menu-item>
      </el-sub-menu>



      <!-- DM Links -->
      <el-menu-item-group v-if="showAdmin" title="DM Things">
        <el-menu-item index="admin">
          <router-link to="/admin" class="nav-link">
            <font-awesome-icon icon="map" /> DM Screen
          </router-link>
        </el-menu-item>

        <el-menu-item index="monsters">
          <router-link to="/monsters" class="nav-link">
            <font-awesome-icon icon="dragon" /> Beastiary
          </router-link>
        </el-menu-item>

<!--

        <el-menu-item index="fey">
          <svg width="32px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M58.03 24.5C23.27 94.19 12.043 159.392 21.813 208.344c9.777 48.98 38.724 81.862 88.157 91.562.273 7.875 1.34 15.623 3.155 23.156.002.01-.002.022 0 .032-28.127 27.637-42.97 61.425-43.5 97.03 48.38 13.457 82.514 3.99 106.563-18.905 6.406 3.07 13.175 5.595 20.28 7.5 7.128 1.91 14.27 3.113 21.376 3.655.156.957.32 1.9.5 2.844C225.29 452 247.24 480.26 292.53 491.81c17.09-29.536 21.327-63.994 10.94-107.906 5.174-4.5 9.967-9.482 14.31-14.875 22.468 14.3 43.262 19.52 62.158 17.595 19.33-1.97 37.185-11.402 53.218-28.28 31.266-32.916 54.233-94.763 59.906-176.876-24.374-11.548-48.163-16.737-71-16.657-24.58.086-48.055 6.17-70.03 16.593-16.08 7.626-31.292 17.67-45.313 29.47-13.61-12.85-30.473-22.608-49.783-27.782-11.663-3.125-23.398-4.37-34.875-3.906-6.836.276-13.57 1.18-20.156 2.625C178.323 111.115 129.416 47.12 58.03 24.5zm23.94 66.688c18.666 0 33.593 14.926 33.593 33.593 0 18.672-14.926 33.595-33.594 33.595-18.67 0-33.626-14.926-33.626-33.594 0-18.666 14.957-33.593 33.625-33.593zm-24.376 82.53c10.23 0 18.312 8.116 18.312 18.345 0 10.228-8.083 18.312-18.312 18.312-10.23 0-18.313-8.08-18.313-18.313 0-10.228 8.085-18.343 18.314-18.343zm156.156 24.876c-32.586 12.06-55.813 43.41-55.813 80.187 0 47.21 38.26 85.5 85.47 85.5 37.43 0 69.24-24.062 80.812-57.56-.55 4.852-1.448 9.728-2.75 14.592-14.055 52.448-67.71 83.43-120.158 69.375-52.447-14.053-83.428-67.74-69.375-120.187 10.592-39.528 43.698-66.854 81.813-71.906zm215.938 16.47c18.667 0 33.593 14.956 33.593 33.624 0 18.67-14.924 33.593-33.592 33.593s-33.625-14.925-33.625-33.592c0-18.668 14.957-33.625 33.625-33.625zm-354.75 13.155c8.86 0 15.843 6.982 15.843 15.843 0 8.86-6.982 15.843-15.843 15.843-8.86 0-15.843-6.98-15.843-15.844 0-8.86 6.983-15.843 15.843-15.843zm341.093 71.874c10.23 0 18.314 8.083 18.314 18.312 0 10.232-8.083 18.344-18.313 18.344-10.228 0-18.31-8.115-18.31-18.344 0-10.23 8.082-18.312 18.31-18.312zm-41.31 37.156c8.86 0 15.874 6.983 15.874 15.844 0 8.863-7.014 15.844-15.875 15.844-8.862 0-15.845-6.984-15.845-15.844s6.983-15.844 15.844-15.844zm-265.533 37.594c8.86 0 15.844 6.983 15.844 15.844 0 8.862-6.98 15.843-15.843 15.843-8.86 0-15.843-6.982-15.843-15.842s6.983-15.844 15.844-15.844zm163.532 52.03c8.86 0 15.874 6.984 15.874 15.845 0 8.862-7.014 15.842-15.875 15.842-8.862 0-15.845-6.983-15.845-15.843 0-8.862 6.983-15.845 15.844-15.845z"></path></g></svg>

        </el-menu-item>

-->


      </el-menu-item-group>









      <!-- Sign In / Out -->
      <el-menu-item v-if="currentUser" index="logout">
        <a class="nav-link" @click.prevent="logOut">
          <font-awesome-icon icon="sign-out-alt" /> LogOut
        </a>
      </el-menu-item>

      <el-menu-item v-if="!currentUser" index="login">
        <router-link to="/login" class="nav-link">
          <font-awesome-icon icon="sign-in-alt" /> Login
        </router-link>
      </el-menu-item>

      <el-menu-item v-if="!currentUser" index="register">
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
    <!-- title -->
  </div>


</template>

<script>
import { ref } from "vue";
console.log(ref);

export default {
  data() {
    return {
      ref,
      input: "",
      activeIndex:"logout",
    }
  },
  created() {
    this.$router.options.routes.forEach(route => {
      console.log(route);
    });
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
              title: route.name.charAt(0).toUpperCase() + route.name.slice(1), // fancy magic to capitalize
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
.top-bar {
  display: flex;
  border-bottom: 1px solid var(--el-menu-border-color);
}
.text-large {
  font-size: 40px;
}
.flex-grow {
  flex-grow: 1;
}
.el-menu {
  border: none !important;
}
.nav-link svg {
  vertical-align: middle;
}

.router-link-active {
  color: var(--el-color-success);
}
</style>
