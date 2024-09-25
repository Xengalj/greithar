<template lang="html">

  <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>{{ user.username }}</strong> Profile
      </h3>
    </header>
    <p v-if="currentUser">
      <strong>Token:</strong>
      {{currentUser.accessToken.substring(0, 20)}} ... {{currentUser.accessToken.substr(currentUser.accessToken.length - 20)}}
    </p>
    <p>
      <strong>Id:</strong>
      {{ user.id }}
    </p>
    <p>
      <strong>Email:</strong>
      {{ user.email }}
    </p>
    <strong>Authorities:</strong>
    <ul>
      <li v-for="role in currentUser.roles" :key="role">{{role}}</li>
    </ul>
  </div>


  <el-switch v-model="mode">
    <template #active-action>
      <span class="custom-active-action">T</span>
    </template>
    <template #inactive-action>
      <span class="custom-inactive-action">F</span>
    </template>
  </el-switch>

</template>

<script>
import UserService from "@/services/user.service";

export default {
  name: "View User",
  data() {
    return {
      user: {
        token: "",
        id: "",
        username: "",
        email: "",
        Authorities: []
      },
      mode: true
    };
  },
  computed: {
    currentUser() {

      // TODO: change user's fave color:
      // document.documentElement.style.cssText = "--main-background-color: red";
      
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
    console.log(this.currentUser);

    UserService.getUser(this.$route.params.id)
      .then(response => {
        for(const [key, value] of Object.entries(response)) {
          this.user[key] = value;
        }
      })
      .catch(err => {
        console.error(err);
      });

    // UserService.getPublicContent().then(
    //   (response) => {
    //     this.content = response.data;
    //   },
    //   (error) => {
    //     this.content =
    //       (error.response &&
    //         error.response.data &&
    //         error.response.data.message) ||
    //       error.message ||
    //       error.toString();
    //   }
    // );

  }
}
</script>

<style lang="css" scoped>
</style>
