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

    // Dynamic colored favicon
    const canvas = document.createElement('canvas');
    canvas.height = 400;
    canvas.width = 400;
    const ctx = canvas.getContext('2d');
    var path = new Path2D('M143.034 55.181 C 113.065 85.438,68.638 130.122,44.308 154.478 C 19.978 178.834,0.055 199.189,0.036 199.712 C 0.016 200.235,44.892 245.613,99.760 300.552 L 199.520 400.440 299.692 300.002 L 399.864 199.563 300.335 99.781 C 245.594 44.902,200.067 0.037,199.165 0.083 C 198.262 0.129,173.003 24.923,143.034 55.181 M250.209 110.132 C 305.988 166.022,303.068 161.394,282.202 160.844 L 271.827 160.571 236.265 125.191 C 216.705 105.732,200.266 89.667,199.732 89.490 C 198.787 89.178,89.164 198.454,89.164 199.709 C 89.164 200.884,198.302 309.598,199.482 309.598 C 200.840 309.598,300.929 210.293,300.929 208.946 C 300.929 208.453,275.294 208.050,243.963 208.050 L 186.997 208.050 186.997 200.000 L 186.997 191.950 267.136 191.950 L 347.275 191.950 341.130 198.222 C 304.093 236.017,200.444 339.319,199.559 339.319 C 198.754 339.319,65.839 207.023,59.559 199.971 C 58.824 199.147,197.974 60.681,199.537 60.681 C 200.262 60.681,223.065 82.934,250.209 110.132');
    ctx.fillStyle = this.currentUser.usermeta.faveColor;
    ctx.fill(path);

    const link = document.createElement('link');
    const oldLinks = document.querySelectorAll('link[rel="shortcut icon"]');
    oldLinks.forEach(e => e.parentNode.removeChild(e));
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL();
    document.head.appendChild(link);
  }
};
</script>
