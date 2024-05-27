<template lang="html">
  <text :x="point.x" :y="point.y">{{stat.label}}</text>
</template>

<script>
export default {
  props: {
    stat: Object,
    index: Number,
    total: Number
  },
  computed: {
    point: function () {
      console.log(this.stat);
      return valueToPoint(+this.stat.value + 10, this.index, this.total)
    }
  },
}

function valueToPoint(value, index, total) {
  const x = 0
  const y = -value * 0.8
  const angle = ((Math.PI * 2) / total) * index
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const tx = x * cos - y * sin + 100
  const ty = x * sin + y * cos + 100
  return {
    x: tx,
    y: ty
  }
}
</script>

<style lang="css" scoped>
</style>
