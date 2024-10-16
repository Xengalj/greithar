<template>
  <div class="common-layout">
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
        </el-container>
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
      usermeta: {
        faveColor: "",
        theme: ""
      }
    };
  },

  mounted() {
    this.usermeta.faveColor = "--el-color-primary: " + this.currentUser.usermeta.faveColor + " !important";
    document.documentElement.style.cssText = this.usermeta.faveColor;

    this.usermeta.theme = this.currentUser.usermeta.darkmode ? "dark" : "";
    let html = document.getElementsByTagName("html")[0];
    html.setAttribute("class", this.usermeta.theme);
  }
};
</script>
