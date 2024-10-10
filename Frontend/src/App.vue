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

  mounted() {
    let faveColor = "--el-color-primary: " + this.currentUser.usermeta.faveColor + " !important";
    document.documentElement.style.cssText = faveColor;
    this.userMeta.theme = this.currentUser.usermeta.darkmode ? "dark" : "";

    let html = document.getElementsByTagName("html")[0];
    html.setAttribute("class", this.userMeta.theme);
  }
};

/* TODO:
 *
 *  Header:
 *    get lore & rules pages from DB
 *
 *  Creature Card:
 *    Refactor to use a sinlge nice json, can load and send,
 *    can add to encounter
 */

</script>
