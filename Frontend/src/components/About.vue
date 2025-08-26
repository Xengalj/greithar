<template>
  <div class="container">

    <div class="center-horz">
      Vectors and icons by <a href="https://www.svgrepo.com" target="_blank">SVG Repo</a>
    </div>
    <el-row>
      <div v-for="(icon, name, index) in icons" :key="index" class="center-horz" style="margin: 5px;">
        <el-button size="large" type="primary" circle>
          <g-icon iconSize="24px" :iconName="name" />
        </el-button>
        <br>
        {{ name }}
      </div>
    </el-row>

    <el-divider />

    <div class="center-horz">
      Site built by Xengalj, rules provided by d20pfsrd.com
    </div>

  </div>
</template>

<script>
const icons = require('@/components/template/svgPaths.json');

export default {
  name: "About",
  data() {
    return {
      icons: icons
    };
  }
};
</script>
