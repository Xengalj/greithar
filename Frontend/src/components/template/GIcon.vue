<template>
  <svg
    :width="iconSize"
    :viewBox="icon.viewBox"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path v-for="(path, index) in icon.paths" :key="index" :fill="iconColor" :d="path"></path>
    </g>
  </svg>
</template>

<script>
const icons = require('./svgPaths.json');
// https://www.svgrepo.com/collection/hearthsim-game-icons/
// Font Awesome = https://www.svgrepo.com/collection/font-awesome-solid-icons

export default {
  name: 'g-icon',
  props: {
    iconSize: {
      type: String,
      default: '32px'
    },
    iconColor: {
      type: String,
      default: '#000000'
    },
    iconName: {
      type: String,
      default: 'runeStone'
    },
  },
  data() {
    return {
      icon: {}
    }
  },
  mounted() {
    let name = this.iconName[0].toLowerCase() + this.iconName.slice(1);
    this.icon = icons[name];
  }
}
</script>

<style scoped>
</style>
