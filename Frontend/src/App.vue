<template>
  <div :class="`common-layout ${this.userMeta.theme}`">
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-container>
        <el-container class="wrapper">
          <el-main class="main">
            <h1 class="jumbotron center-horz title">{{ pageTitle }}</h1>
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
import '@/styles/index.css';
import Header from './components/template/Header.vue'

export default {
  name: "App",
  components: { Header },
  computed: {
    pageTitle() {
      return this.$route.meta.title;
    },
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  data() {
    return {
      userMeta: {}

    };
  },

  created() {
    // console.log("created");
    // console.log(this.currentUser);

    this.userMeta.theme = "dark";
  },



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
 *  get curr user meta data
      hero, darkmode, faveColor
 *
 *
 */

</script>
