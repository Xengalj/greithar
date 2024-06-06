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

    <div class="menu-container">

      <!-- Search -->
      <div class="nav-search">
        <el-input v-model="input" placeholder="Search" >
          <template #prefix>
            <font-awesome-icon icon="search" />
          </template>
        </el-input>
      </div>

      <el-menu menu-trigger="click" mode="horizontal" class="el-menu" ellipsis>
        <!-- close-on-click-outside -->

        <!-- User Links -->
        <el-sub-menu index="0">
          <template #title>
            <font-awesome-icon icon="user" /> {{ currentUser.username }}
          </template>

          <el-menu-item v-if="currentUser" index="profile">
            <router-link :to="{ name: 'user-view', params: { id: currentUser.id } }" class="nav-link">
              <font-awesome-icon icon="user-cog" /> Your Profile
            </router-link>
          </el-menu-item>

          <el-menu-item v-if="currentUser" index="hero">
            <router-link to="/hero" class="nav-link">
              <!-- <router-link :to="{ name: 'character-view', params: { id: currentUser.hero.id } }" class="nav-link"> -->
              <!-- /character/view/<character_id> -->
              <font-awesome-icon icon="street-view" /> Your Hero <!-- {{ currentUser.hero.name }} -->
            </router-link>
          </el-menu-item>

          <el-menu-item v-if="currentUser" index="characters">
            <router-link to="/user/list" class="nav-link">
              <!-- <router-link :to="{ name: 'character-list', params: { id: currentUser.id } }" class="nav-link"> -->
              <!-- /character/list/<user_id> -->
              <font-awesome-icon icon="users" /> Your Characters
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
          <el-menu-item index="dmScreen">
            <router-link to="/admin" class="nav-link">
              <font-awesome-icon icon="map" /> DM Screen
            </router-link>
          </el-menu-item>

          <el-menu-item index="beastiary">
            <router-link to="/beastiary" class="nav-link">
              <font-awesome-icon icon="dragon" /> Beastiary
            </router-link>
          </el-menu-item>
        </el-menu-item-group>


        <!-- Admin Links -->
        <el-menu-item-group v-if="showAdmin" title="Admin">
          <el-menu-item index="users">
            <router-link to="/user/list" class="nav-link">
              <font-awesome-icon icon="users" /> Users
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
  </div>


  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">home</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index">
        <router-link :to="crumb.to">{{ crumb.label }}</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>


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
    console.log("just once please");
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
.menu-container .nav-search {
  float: left;
  width: 240px;
  height: 100%;
  display: flex;
  align-items: center;
}
.menu-container .nav-search>div {
  height: 80%;
}

.el-menu {
  border: none !important;
  max-width: 100px;
}
.nav-link svg {
  vertical-align: middle;
}

.el-sub-menu svg.svg-inline--fa, .nav-link svg.svg-inline--fa {
  width: 20px;
}


.router-link-active {
  color: var(--el-color-success);
}
/* Desktop Styles */

</style>
