<template class="dark">
  <div class="common-layout">
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-container>
        <el-container class="wrapper">
          <el-main class="main">
            <h1 class="jumbotron">{{ pageTitle }}</h1>
            <router-view v-model="pageTitle"/>

          </el-main>
          <el-footer>
            Vectors and icons by <a href="https://www.svgrepo.com" target="_blank">SVG Repo</a>
          </el-footer>
        </el-container>
        <!-- <el-aside width="200px">Aside</el-aside> -->
      </el-container>
    </el-container>
  </div>


</template>

<script>
import Header from './components/template/Header.vue'
export default {
  // name: "App",
  components: { Header },
  // props: {
  //   id: {
  //     type: Int,
  //     default: 40
  //   }
  // },

  // data() {
  //   return {
  //     loading: false,
  //   };
  // },

  computed: {
    pageTitle() {
      return this.$route.meta.title;
    }
    // currentUser() {
    //   return this.$store.state.auth.user;
    // },
  },

  // created() {
  //   console.log("created");
  // },
  // mounted() {
  //   console.log("mounted");
  // },

  // methods: {
  //   logOut() {
  //     this.$store.dispatch('auth/logout');
  //     this.$router.push('/login');
  //   }
  // }
};

/* TODO:
 *
 *  get lore & rules pages from DB
 *  get curr user data (hero, darkmode, etc)
 *
 *
 */




</script>

<style scoped>
/* Colors */
:root {
  --el-color-primary: green;
}

.main {
  height: calc(100vh - 120px);
}
h1 {
  text-align: center;
}
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  background-color: grey;
}
</style>
