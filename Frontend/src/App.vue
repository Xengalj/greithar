<template>

  <Header/>

  <div id="app">
    <div class="container">
      <router-view />
    </div>
  </div>

  <!--

  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-container>
          <el-main>Main</el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>

 -->

</template>

<script>
import Header from './components/template/Header.vue'
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
