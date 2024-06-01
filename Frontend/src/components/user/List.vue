<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>{{currentUser.username}}</strong> Profile
      </h3>
    </header>
    <p>
      <strong>Token:</strong>
      {{currentUser.accessToken.substring(0, 20)}} ... {{currentUser.accessToken.substr(currentUser.accessToken.length - 20)}}
    </p>
    <p>
      <strong>Id:</strong>
      {{currentUser.id}}
    </p>
    <p>
      <strong>Email:</strong>
      {{currentUser.email}}
    </p>
    <strong>Authorities:</strong>
    <ul>
      <li v-for="role in currentUser.roles" :key="role">{{role}}</li>
    </ul>
  </div>


  <el-switch v-model="value1">
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

// import { ref } from 'vue'
// const value1 = ref(true)
// console.log(value1);

export default {
  name: "User List",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
    this.getUsers();
  },
  methods: {
    getUsers() {
      // console.log('getting users');
      // console.log(this.currentUser);

      UserService.getAllUsers(this.currentUser).then(response => {
        console.log(response);
        // this.content = response.data;
      })
      .catch(err => { console.error(err); });
    }

  }
};
</script>
