<template>
  <svg
    :width="iconSize"
    :viewBox="viewBox"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path :fill="iconColor" :d="svgPath(iconName)"></path>
    </g>
  </svg>
</template>

<script>
const icons = require('./svgPaths.json');
export default {
  name: 'g-icon',
  props: {
    iconSize: {
      type: String,
      default: '32px'
    },
    viewBox: {
      type: String,
      default: '0 0 512 512'
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
  methods: {
    svgPath(iconName) {
      return icons[iconName];
    }
  }
}
</script>

<style scoped>
</style>
