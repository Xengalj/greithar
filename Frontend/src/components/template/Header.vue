<template lang="html">
  <div class="top-bar">
    <router-link :to="{ name: 'home', params: {} }">
      <span class="font-600 mr-3 site-title">
        Greiðar
      </span>
    </router-link>

    <div class="flex-grow" />

    <div class="menu-container">
      <!-- Search -->
      <div class="nav-search">
        <el-input v-model="input" placeholder="Search" >
          <template #prefix>
            <g-icon iconSize="24px" iconName="search" :iconColor="iconColor" />
          </template>
        </el-input>
      </div>


      <el-menu class="el-menu dark" mode="horizontal" ellipsis >
        <!-- User Links -->
        <el-sub-menu v-if="currentUser" index="0">
          <template #title> <g-icon iconSize="24px" iconName="user" :iconColor="iconColor" /> {{ currentUser.username }} </template>

          <el-menu-item index="profile">
            <!-- /user/view/ <user_id> -->
            <router-link :to="{ name: 'user-view', params: { id: currentUser.id } }" class="nav-link">
              <g-icon iconSize="24px" iconName="userProfile" :iconColor="iconColor" /> Your Profile
            </router-link>
          </el-menu-item>

          <el-menu-item index="hero">
            <!-- /character/view/ <character_id> -->
            <router-link to="/hero" class="nav-link">
            <!-- <router-link :to="{ name: 'character-view', params: { id: currentUser.hero.id } }" class="nav-link"> -->
              <g-icon iconSize="24px" iconName="userHero" :iconColor="iconColor" /> Your Hero <!-- {{ currentUser.usermeta.hero.name }} -->
            </router-link>
          </el-menu-item>

          <el-menu-item index="characters">
            <!-- /character/list/ <user_id> -->
            <!-- <router-link :to="{ name: 'character-list', params: { id: currentUser.id } }" class="nav-link"> -->
            <router-link :to="{ name: 'character-list' }" class="nav-link">
              <g-icon iconSize="24px" iconName="userList" :iconColor="iconColor" /> Your Characters
            </router-link>
          </el-menu-item>
        </el-sub-menu>


        <!-- Rules -->
        <el-sub-menu v-if="currentUser" index="1">
          <template #title>
            <g-icon iconSize="24px" iconName="lockedBook" :iconColor="iconColor" /> Rules
          </template>

          <el-menu-item v-for="(page, rIndex) in rules" :key="rIndex" :index="`1-${rIndex}`">
            <router-link :to="page.link" class="nav-link">{{ page.title }}</router-link>
          </el-menu-item>
        </el-sub-menu>


        <!-- Lore -->
        <el-sub-menu v-if="currentUser" index="2">
          <template #title>
            <g-icon iconSize="24px" iconName="openScroll" :iconColor="iconColor" /> Lore
          </template>

          <el-menu-item v-for="(page, lIndex) in lores" :key="lIndex" :index="`2-${lIndex}`">
            <router-link :to="page.link" class="nav-link">{{ page.title }}</router-link>
          </el-menu-item>
        </el-sub-menu>


        <!-- Codex -->
        <el-sub-menu index="3">
          <template #title>
            <g-icon iconSize="24px" iconName="openBook" :iconColor="iconColor" /> Codex
          </template>

          <el-menu-item v-if="currentUser" index="beastiary">
            <router-link to="/beastiary" class="nav-link">
              <g-icon iconSize="24px" iconName="dragon" :iconColor="iconColor" /> Beastiary
            </router-link>
          </el-menu-item>
          <el-menu-item index="equipment">
            <router-link to="/equipment" class="nav-link">
              <g-icon iconSize="24px" iconName="inventory" :iconColor="iconColor" /> Equipment
            </router-link>
          </el-menu-item>
        </el-sub-menu>


        <!-- DM Links -->
        <el-menu-item-group v-if="showAdmin" title="DM Things">
          <el-menu-item index="dmScreen">
            <router-link to="/dm-screen" class="nav-link">
              <g-icon iconSize="24px" iconName="map" :iconColor="iconColor" /> DM Screen
            </router-link>
          </el-menu-item>
        </el-menu-item-group>


        <!-- Admin Links -->
        <el-menu-item-group v-if="showAdmin" title="Admin">
          <el-menu-item index="users">
            <router-link to="/user/list" class="nav-link">
              <g-icon iconSize="24px" iconName="userList" :iconColor="iconColor" /> Users
            </router-link>
          </el-menu-item>
        </el-menu-item-group>


        <!-- Sign In / Out -->
        <el-menu-item v-if="currentUser" index="logout">
          <a class="nav-link" @click.prevent="logOut">
            <g-icon iconSize="24px" iconName="logout" :iconColor="iconColor" /> LogOut
          </a>
        </el-menu-item>

        <el-menu-item v-if="!currentUser" index="login">
          <router-link to="/login" class="nav-link">
            <g-icon iconSize="24px" iconName="login" :iconColor="iconColor" /> Login
          </router-link>
        </el-menu-item>

        <el-menu-item v-if="!currentUser" index="register">
          <router-link to="/register" class="nav-link">
            <g-icon iconSize="24px" iconName="userAdd" :iconColor="iconColor" /> Sign Up
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
      iconColor: "var(--color-surface-600)",
      userMeta: {}
    }
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
        return this.currentUser['roles'].includes('admin');
      }
      return false;
    },
    showStoryteller() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('storyteller');
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
    }
  },

  created() {
    // this.$router.options.routes.forEach(route => {
    //   console.log(route);
    // });
    // this.userMeta = JSON.parse(localStorage.getItem("userMeta"));
  },
  mounted() {
    // let menu = document.getElementsByClassName("el-popper")[0];
    // menu = menu.parentNode;
    // menu.setAttribute("class", this.userMeta.theme);
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
  border-bottom: 2px solid var(--el-menu-border-color);
}
.site-title {
  font-size: 40px;
  color: var(--color-primary-100);
}

/* Search */
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
.dark .el-input,
.dark .el-input__wrapper {
  background-color: var(--color-surface-300);
}
.dark .nav-search input {
  color: #CCC;
}
.menu-container .nav-search>div,
.el-menu.el-menu--horizontal {
  height: 80%;
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
  border-radius: 5px;
}
.dark .el-menu {
  background-color: var(--color-surface-300);
}
.dark .el-menu path {
  color: var(--color-primary-100);
}
.dark .el-sub-menu.is-active .el-sub-menu__title.el-tooltip__trigger {
  border-color: var(--color-primary-100);
  border-radius: 5px;
}
.dark .el-menu--horizontal > .el-sub-menu .el-sub-menu__title:hover {
  background-color: var(--color-surface-500);
  border-radius: 5px;
}

/* Opened Menu & Items */
.dark .el-menu--horizontal .el-menu .el-sub-menu__title,
.dark .el-menu--horizontal .el-menu .el-menu-item {
  background-color: var(--color-surface-300);
  border-color: var(--color-surface-300);
}
.el-menu .el-sub-menu .el-sub-menu__title.el-tooltip__trigger {
  color: var(--color-primary-100);
}
.el-menu--horizontal .el-menu li.el-menu-item {
  padding: 0px;
}
.el-menu-item .nav-link {
  display: flex;
  padding-left: 10px;
}
.el-sub-menu svg,
.el-menu-item svg {
  margin-right: 5px;
}

/* Active Menu Item */
.dark .el-popper .el-menu--horizontal .el-menu .el-sub-menu.is-active > .el-sub-menu__title {
  color: var(--color-secondary-300);
}


/* Breadcrumb Colors */
.dark .el-breadcrumb__inner.is-link,
.dark .el-breadcrumb__item .el-breadcrumb__inner a {
  color: var(--color-primary-200);
}

.dark .el-breadcrumb__inner.is-link:hover,
.dark .el-breadcrumb__item .el-breadcrumb__inner a:hover {
  color: var(--color-secondary-300);
}
.dark .el-breadcrumb__item:last-child .el-breadcrumb__inner a {
  color: var(--color-secondary-500);
}

</style>
