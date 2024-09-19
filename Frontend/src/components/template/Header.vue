<template lang="html">
  <div class="top-bar">
    <router-link :to="{ name: 'home', params: {} }">
      <span class="font-600 mr-3 site-title">
        Greiðar
      </span>
    </router-link>

    <div class="flex-grow" />

    <!-- TODO
      - get current active page and coloring working
      - get click outside closes menu working
      https://element-plus.org/en-US/component/menu.html
    -->

    <div class="menu-container">

      <!-- Search -->
      <div class="nav-search">
        <el-input v-model="input" placeholder="Search" >
          <template #prefix>
            <font-awesome-icon icon="search" />
          </template>
        </el-input>
      </div>

      <el-menu
      menu-trigger="click"
      mode="horizontal"
      class="el-menu"
      ellipsis
      >
        <!-- close-on-click-outside -->


        <!-- User Links -->
        <el-sub-menu v-if="currentUser" index="0">
          <template #title>
            <g-icon iconSize="24px" iconName="user" /> {{ currentUser.username }}
          </template>

          <el-menu-item index="profile">
            <router-link :to="{ name: 'user-view', params: { id: currentUser.id } }" class="nav-link">
              <g-icon iconSize="24px" iconName="userProfile" /> Your Profile
            </router-link>
          </el-menu-item>

          <el-menu-item index="hero">
            <router-link to="/hero" class="nav-link">
              <!-- <router-link :to="{ name: 'character-view', params: { id: currentUser.hero.id } }" class="nav-link"> -->
              <!-- /character/view/<character_id> -->
              <g-icon iconSize="24px" iconName="userHero" /> Your Hero <!-- {{ currentUser.hero.name }} -->
            </router-link>
          </el-menu-item>

          <el-menu-item index="characters">
            <router-link to="/user/list" class="nav-link">
              <!-- <router-link :to="{ name: 'character-list', params: { id: currentUser.id } }" class="nav-link"> -->
              <!-- /character/list/<user_id> -->
              <g-icon iconSize="24px" iconName="userList" /> Your Characters
            </router-link>
          </el-menu-item>
        </el-sub-menu>


        <!-- Rules -->
        <el-sub-menu index="1">
          <template #title>
            <g-icon iconSize="24px" iconName="openBook" /> Rules
          </template>

          <el-menu-item index="beastiary">
            <router-link to="/beastiary" class="nav-link">
              <g-icon iconSize="24px" iconName="dragon" /> Beastiary
            </router-link>
          </el-menu-item>
          <el-menu-item index="equipment">
            <router-link to="/equipment" class="nav-link">
              <g-icon iconSize="24px" iconName="inventory" /> Equipment
            </router-link>
          </el-menu-item>


          <el-menu-item v-for="(page, rIndex) in rules" :key="rIndex" :index="`1-${rIndex}`">
            <router-link :to="page.link" class="nav-link">{{ page.title }}</router-link>
          </el-menu-item>
        </el-sub-menu>


        <!-- Lore -->
        <el-sub-menu index="2">
          <template #title>
            <g-icon iconSize="24px" iconName="openScroll" /> Lore
          </template>

          <el-menu-item v-for="(page, lIndex) in lores" :key="lIndex" :index="`2-${lIndex}`">
            <router-link :to="page.link" class="nav-link">{{ page.title }}</router-link>
          </el-menu-item>
        </el-sub-menu>


        <!-- DM Links -->
        <el-menu-item-group v-if="showAdmin" title="DM Things">
          <el-menu-item index="dmScreen">
            <router-link to="/admin" class="nav-link">
              <g-icon iconSize="24px" iconName="map" /> DM Screen
            </router-link>
          </el-menu-item>
        </el-menu-item-group>


        <!-- Admin Links -->
        <el-menu-item-group v-if="showAdmin" title="Admin">
          <el-menu-item index="users">
            <router-link to="/user/list" class="nav-link">
              <g-icon iconSize="24px" iconName="userList" /> Users
            </router-link>
          </el-menu-item>

        </el-menu-item-group>


        <!-- Sign In / Out -->
        <el-menu-item v-if="currentUser" index="logout">
          <a class="nav-link" @click.prevent="logOut">
            <g-icon iconSize="24px" iconName="logout" /> LogOut
          </a>
        </el-menu-item>

        <el-menu-item v-if="!currentUser" index="login">
          <router-link to="/login" class="nav-link">
            <g-icon iconSize="24px" iconName="login" /> Login
          </router-link>
        </el-menu-item>

        <el-menu-item v-if="!currentUser" index="register">
          <router-link to="/register" class="nav-link">
            <g-icon iconSize="24px" iconName="userAdd" /> Sign Up
          </router-link>
        </el-menu-item>

      </el-menu>
    </div>
  </div>

  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index">
      <router-link :to="crumb.to">{{ crumb.label }}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>

</template>

<script>
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
    // });
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
  mounted() {
    // Called from the header once, not everytime time SFC loads a new 'page'
    // TODO:
    /*
    get lore & rule pages from DB ?
    get curr user data (hero, darkmode, etc)
    */

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

<style>
#app .el-header {
  height: 80px;
}
.top-bar {
  display: flex;
  border-bottom: 1px solid var(--el-menu-border-color);
}
.site-title {
  font-size: 40px;
  color: var(--color-primary-100);
}
.flex-grow {
  flex-grow: 1;
}

/* Search & Nav */
.menu-container {
  display: flex;
  align-items: center;
}
.menu-container .nav-search {
  float: left;
  width: 240px;
  height: 100%;
  display: flex;
  align-items: center;
}
.menu-container .nav-search>div,
.el-menu.el-menu--horizontal {
  height: 80%;
}
.dark .nav-search input {
  color: #CCC;
}

/* Menu Button */
.el-menu {
  border-radius: 5px;
  border: none !important;
  max-width: 100px;
  text-align: center;
}
.dark .el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
  padding: 20px;
}
.dark .el-menu--horizontal > .el-sub-menu .el-sub-menu__title:hover {
  background-color: var(--color-surface-500);
  border-radius: 5px;
}
.dark .el-menu path {
  color: var(--color-primary-200);
}


/* Menu Items */



/* Breadcrumbs */
.dark .el-breadcrumb__inner.is-link,
.dark .el-breadcrumb__item:last-child .el-breadcrumb__inner a {
  color: var(--color-primary-200);
}
</style>
