<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>
  </div>

  <!--
  Element Plus Components
  https://element-plus.org/en-US/component/overview.html
  -->


  <!--
  Vue Examples
  https://vuejs.org/examples/#hello-world
  -->


</template>

<script>
import UserService from "@/services/user.service";
// import data from "../assets/d20pfsrd-beastiary.csv";


export default {
  name: "Home",
  data() {
    return {
      title: "Home",
      content: "",
    };
  },
  mounted() {
    UserService.getPublicContent().then(
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
