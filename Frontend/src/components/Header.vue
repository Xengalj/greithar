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
            <font-awesome-icon icon="user-cog" /> Profile
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
// import { ref } from "vue";
// console.log(ref);

export default {
  data() {
    return {
      input: "",
      activeIndex:"logout",

    }
  },
  created() {
    // this.$router.options.routes.forEach(route => {
    //   console.log(route);
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
