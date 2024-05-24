<template>

  <Header/>

  <div id="app">
    <div class="container">
      <router-view />
    </div>
  </div>

</template>

<script>
import Header from './components/Header.vue'
export default {
  components: { Header },
  // computed: {
  //   currentUser() {
  //     return this.$store.state.auth.user;
  //   },
  // },
  // methods: {
  //   logOut() {
  //     this.$store.dispatch('auth/logout');
  //     this.$router.push('/login');
  //   }
  // }
};
</script>

<style scoped>
:root {
  --el-color-primary: green;
}
</style>
