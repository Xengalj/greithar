<template>
  <div class="container">

    <h3>Welcome to Greiðar!</h3>

    <div>
      This site was built by Xengalj to help facilitate games run with Pathfinder First Edition. This site is meant to be used for quick refrences and to help sort through the huge amounts of data with sortable tables. That being said, not all rules have been included here to help streamline the site.
      Your DM is still the final arbiter of all rules.
    </div>

    <el-divider>
      <g-icon iconSize="24px" iconName="rolledScroll" />
    </el-divider>

    <el-row class="center-horz" justify="space-between">
      <el-col :span="6">
        Campaign
      </el-col>
      <el-col :span="6">
        Lore
      </el-col>
      <el-col :span="6">
        Rules
      </el-col>
      <el-col :span="6">
        Site Info
      </el-col>
    </el-row>


    <el-row class="center-horz" justify="space-between">
      <el-col :span="8">
        <router-link to="/equipment" class="nav-link">
          <el-button type="primary">
            <g-icon iconSize="24px" iconName="inventory" /> Equipment
          </el-button>
        </router-link>
        <router-link to="/beastiary" class="nav-link">
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



    <el-row class="center-horz" justify="space-between">
      <el-col :span="10">
        <el-divider> DM <g-icon iconSize="24px" iconName="rolledScroll" /> </el-divider>

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

      <el-col :span="10" :offset="4">
        <el-divider> ADMIN <g-icon iconSize="24px" iconName="rolledScroll" /> </el-divider>

        <span v-if="user.roles.includes('admin')">
          <router-link to="/user/list" class="nav-link">
            <el-button type="primary">
              <g-icon iconSize="24px" iconName="userList" :iconColor="iconColor" /> All Users
            </el-button>
          </router-link>
        </span>

        <span v-if="user.roles.includes('admin')">
          <router-link :to="{ name: 'character-list' }" class="nav-link">
            <el-button type="primary">
              <g-icon iconSize="24px" iconName="userList" :iconColor="iconColor" /> All Characters
            </el-button>
          </router-link>
        </span>
      </el-col>
    </el-row>






  </div>
</template>

<script>
import UserService from "@/services/user.service";

export default {
  name: "Home",
  data() {
    return {
      title: "Home",
      content: "",
      user: this.$store.state.auth.user
    };
  },
  mounted() {
    // console.log(this.$store.state.auth.user);

    UserService.getPublicContent().then(
      (response) => {
        this.content = response.data;
        this.content = localStorage.getItem('encounter');
      },
      (error) => {
        this.content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  },
};
</script>

<style media="screen">
svg {
  margin: 5px;
}
</style>
