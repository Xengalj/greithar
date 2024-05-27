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

  <!--
  <footer>
  Vectors and icons by <a href="https://www.svgrepo.com" target="_blank">SVG Repo</a>
  </footer>
  -->

</template>

<script>
import UserService from "../services/user.service";

export default {
  name: "Home",
  data() {
    return {
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
