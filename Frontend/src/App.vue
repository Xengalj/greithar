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

    /*
    grab user meta from DB
    store in local storage

    use below to set favorite primary & secondary colors
    document.documentElement.style.cssText = "--main-background-color: red";
    */

    let test = "dark";
    // test = "";
    this.userMeta.theme = test;

    let html = document.getElementsByTagName("html")[0];
    html.setAttribute("class", this.userMeta.theme);

    localStorage.setItem("userMeta", JSON.stringify(this.userMeta));



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
 *  App (here):
 *    get current user meta data (hero, darkmode, faveColor)
 *    use store for user meta data
 *
 *  Header:
 *    get lore & rules pages from DB
 *
 *  Creature Card:
 *    Refactor to use a sinlge nice json, can load and send,
 *    can add to encounter
 */

</script>
