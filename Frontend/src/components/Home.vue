<template>
  <div class="container">

    <h3>Welcome to Greiðar!</h3>

    <div>
      This site was built by Xengalj to help facilitate games run with Pathfinder First Edition. This site is meant to be used for quick refrences and to help sort through the huge amounts of data with sortable tables. That being said, not all rules have been included here to help streamline the site.
      Your DM is still the final arbiter of all rules.
    </div>

    <el-row class="center-horz" justify="space-between">
      <el-divider> <g-icon iconName="rolledScroll" /> </el-divider>
      <el-col :span="8">
        <router-link to="/equipment" class="nav-link">
          <el-button type="primary">
            <g-icon iconSize="24px" iconName="inventory" /> Equipment
          </el-button>
        </router-link>
        <router-link v-if="this.user" to="/beastiary" class="nav-link">
          <el-button type="primary">
            <g-icon iconSize="24px" iconName="dragon" /> Beastiary
          </el-button>
        </router-link>
      </el-col>

      <el-col :span="8">
        <router-link to="/equipment" class="nav-link">
          <el-button type="primary">
            <g-icon iconSize="24px" iconName="openScroll" /> Lore (WIP)
          </el-button>
        </router-link>

        <router-link to="/equipment" class="nav-link">
          <el-button type="primary">
            <g-icon iconSize="24px" iconName="lockedBook" /> Rules (WIP)
          </el-button>
        </router-link>
      </el-col>

      <el-col :span="8">
        <router-link to="/about" class="nav-link">
          <el-button type="primary">
            <g-icon iconSize="24px" iconName="openBook" /> About
          </el-button>
        </router-link>
      </el-col>
    </el-row>

    <!-- LOGIN CHECK -->
    <el-row v-if="this.user" class="center-horz" justify="space-between">
      <el-col :span="11">
        <el-divider> DM <g-icon iconName="lockedBook" /> </el-divider>

        <span v-if="user.roles.includes('storyteller')">
          <router-link to="/dm-screen" class="nav-link">
            <el-button type="primary">
              <g-icon iconSize="24px" iconName="map" /> DM Screen
            </el-button>
          </router-link>
        </span>

        <span v-if="user.roles.includes('storyteller')">
          <router-link to="/dm-screen" class="nav-link">
            <el-button type="primary">
              <g-icon iconSize="24px" iconName="map" /> Your Campaigns
            </el-button>
          </router-link>
        </span>
      </el-col>

      <el-col :span="11" :offset="2">
        <el-divider> ADMIN <g-icon iconName="userProfile" /> </el-divider>

        <span v-if="user.roles.includes('admin')">
          <router-link to="/user/list" class="nav-link">
            <el-button type="primary">
              <g-icon iconSize="24px" iconName="userList" /> All Users
            </el-button>
          </router-link>
        </span>

        <span v-if="user.roles.includes('admin')">
          <router-link :to="{ name: 'character-list' }" class="nav-link">
            <el-button type="primary">
              <g-icon iconSize="24px" iconName="userList" /> All Characters
            </el-button>
          </router-link>
        </span>
      </el-col>
    </el-row>

    <el-row v-else class="center-horz">
      <el-col>
        <el-divider> <g-icon iconName="sparkle" /> </el-divider>
        <h3>Please login to view user details</h3>
        <router-link to="/login" class="nav-link">
          <el-button type="primary" size="large">
            <g-icon iconSize="24px" iconName="login" /> Login
          </el-button>
        </router-link>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      title: "Home",
      content: "",
      user: this.$store.state.auth.user
    };
  },
  computed:{
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    races() { return JSON.parse(localStorage.getItem('races')); },
    classes() { return JSON.parse(localStorage.getItem('classes')); },
    equipment() { return JSON.parse(localStorage.getItem('equipment')); },
  },
  mounted() {
    console.log('home -> user', this.user);
    console.log('rules', this.rules);
  },
};
</script>

<style media="screen">
svg {
  margin: 5px;
}
</style>
