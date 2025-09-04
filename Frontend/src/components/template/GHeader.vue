<template lang="html">

  <el-row justify="space-between" align="middle" class="top-bar">
    <el-col :span="12">
      <router-link :to="{ name: 'home', params: {} }">
        <span class="font-600 mr-3 site-title">
          Greiðar
        </span>
      </router-link>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index">
          <router-link :to="crumb.to">{{ crumb.label }}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :xs="6" :span="2">
      <el-menu
        class="el-menu"
        mode="horizontal"
        ellipsis
      >

        <!-- Home -->
        <el-menu-item index="home">
          <router-link to="/home" class="nav-link">
            <g-icon :iconColor="iconColor" iconName="favicon" iconSize="24px" /> Home
          </router-link>
        </el-menu-item>

        <!-- User Links -->
        <el-sub-menu v-if="currentUser" index="userLinks">
          <template #title> <g-icon :iconColor="iconColor" iconName="user" iconSize="24px" /> {{ currentUser.username }} </template>
          <el-menu-item index="profile">
            <!-- /user/view/ <user_id> -->
            <router-link :to="{ name: 'user-view', params: { id: currentUser.id } }" class="nav-link">
              <g-icon :iconColor="iconColor" iconName="userProfile" iconSize="24px" /> Your Profile
            </router-link>
          </el-menu-item>
          <el-menu-item index="hero">
            <!-- /character/view/ <character_id> -->
            <router-link :to="{ name: 'character-view', params: { id: currentUser.usermeta.hero } }" class="nav-link">
              <g-icon :iconColor="iconColor" iconName="userHero" iconSize="24px" /> Your Hero
            </router-link>
          </el-menu-item>
          <el-menu-item index="characters">
            <!-- /character/list/ <user_id> -->
            <router-link :to="{ name: 'character-list', params: { id: currentUser.id } }" class="nav-link">
              <g-icon :iconColor="iconColor" iconName="userList" iconSize="24px" /> Your Characters
            </router-link>
          </el-menu-item>
        </el-sub-menu>

        <!-- Rules -->
        <el-sub-menu v-if="currentUser" index="rules">
          <template #title>
            <g-icon :iconColor="iconColor" iconName="lockedBook" iconSize="24px" /> Rules
          </template>
          <el-menu-item v-for="(page, rIndex) in rules" :key="rIndex" :index="`1-${rIndex}`">
            <router-link :to="page.link" class="nav-link">{{ page.title }}</router-link>
          </el-menu-item>
        </el-sub-menu>

        <!-- Lore -->
        <el-sub-menu v-if="currentUser" index="lore">
          <template #title>
            <g-icon :iconColor="iconColor" iconName="openScroll" iconSize="24px" /> Lore
          </template>
          <el-menu-item v-for="(page, lIndex) in lores" :key="lIndex" :index="`2-${lIndex}`">
            <router-link :to="page.link" class="nav-link">{{ page.title }}</router-link>
          </el-menu-item>
        </el-sub-menu>

        <!-- Codex -->
        <el-sub-menu index="codex">
          <template #title>
            <g-icon :iconColor="iconColor" iconName="openBook" iconSize="24px" /> Codex
          </template>
          <el-menu-item v-if="currentUser" index="beastiary">
            <router-link to="/beastiary" class="nav-link">
              <g-icon :iconColor="iconColor" iconName="dragon" iconSize="24px" /> Beastiary
            </router-link>
          </el-menu-item>
          <el-menu-item index="equipment">
            <router-link to="/equipment" class="nav-link">
              <g-icon :iconColor="iconColor" iconName="inventory" iconSize="24px" /> Equipment
            </router-link>
          </el-menu-item>
        </el-sub-menu>

        <!-- DM Links -->
        <el-menu-item-group v-if="showAdmin" title="DM Things">
          <el-menu-item index="dmScreen">
            <router-link to="/dm-screen" class="nav-link">
              <g-icon :iconColor="iconColor" iconName="map" iconSize="24px" /> DM Screen
            </router-link>
          </el-menu-item>
        </el-menu-item-group>

        <!-- Admin Links -->
        <el-menu-item-group v-if="showAdmin" title="Admin">
          <el-menu-item index="users">
            <router-link to="/user/list" class="nav-link">
              <g-icon :iconColor="iconColor" iconName="userList" iconSize="24px" /> Users
            </router-link>
          </el-menu-item>
          <el-menu-item index="characters">
            <!-- /character/list/ -->
            <router-link :to="{ name: 'character-list' }" class="nav-link">
              <g-icon :iconColor="iconColor" iconName="userList" iconSize="24px" /> All Characters
            </router-link>
          </el-menu-item>
        </el-menu-item-group>

        <!-- Sign In / Out -->
        <el-menu-item v-if="currentUser" index="logout">
          <a class="nav-link" @click.prevent="logOut">
            <g-icon :iconColor="iconColor" iconName="logout" iconSize="24px" /> LogOut
          </a>
        </el-menu-item>
        <el-menu-item v-if="!currentUser" index="login">
          <router-link to="/login" class="nav-link">
            <g-icon :iconColor="iconColor" iconName="login" iconSize="24px" /> Login
          </router-link>
        </el-menu-item>
        <el-menu-item v-if="!currentUser" index="register">
          <router-link to="/register" class="nav-link">
            <g-icon :iconColor="iconColor" iconName="userAdd" iconSize="24px" /> Sign Up
          </router-link>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'g-header',
  data() {
    return {
      input: "",
      activeIndex:"logout",
      iconColor: "var(--color-surface-600)",
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
    currentUser() { return this.$store.state.auth.user; },
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
  mounted() {
    // console.log('Curr User', this.currentUser);
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
.top-bar {
  height: 80px;
  border-bottom: 2px solid var(--el-menu-border-color);
}
.site-title {
  font-size: 40px;
}

/* Menu Button */
.el-menu {
  border: none !important;
  justify-content: center;
}

.el-sub-menu:first-child {
  border: solid var(--color-surface-300) 2px;
  border-radius: 5px;
}
.dark .el-sub-menu {
  background-color: var(--color-surface-300);
}


body .el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
  padding: 20px;
}
body .el-menu--horizontal > .el-sub-menu .el-sub-menu__title:hover {
  border-radius: 5px;
}
.dark .el-menu path {
  color: var(--el-color-primary);
}
.dark .el-sub-menu.is-active .el-sub-menu__title.el-tooltip__trigger {
  border-color: var(--el-color-primary);
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
  color: var(--el-color-primary);
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
  color: var(--color-secondary-100);
}


/* Breadcrumb Colors */
body .el-breadcrumb__inner.is-link,
body .el-breadcrumb__item .el-breadcrumb__inner a {
  color: var(--el-color-primary);
}

body .el-breadcrumb__inner.is-link:hover,
body .el-breadcrumb__item .el-breadcrumb__inner a:hover {
  color: var(--color-secondary-300);
}
body .el-breadcrumb__item:last-child .el-breadcrumb__inner a {
  color: var(--color-secondary-500);
}

</style>
