<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>
  </div>
  DM SCREEN


  <div class="">
    <p v-for="(icon, name, index) in icons" :key="index">
      <strong>{{ name }}</strong>
      <g-icon :iconName="name" />

    </p>
  </div>




</template>

<script>
import UserService from "@/services/user.service";
const icons = require('../template/svgPaths.json');

export default {
  name: "Admin",
  data() {
    return {
      content: "DM Screen",
      icons: icons
    };
  },
  mounted() {
    UserService.getAdminBoard().then(
      (response) => {
        this.content = response.data;
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
