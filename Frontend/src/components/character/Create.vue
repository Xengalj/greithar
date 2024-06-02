<template lang="html">

  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>
  </div>

</template>

<script>
import UserService from "@/services/user.service";

export default {
  name: "Create Character",
  data() {
    return {
      content: "",
    };
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
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
  }
}
</script>

<style lang="css" scoped>
</style>
