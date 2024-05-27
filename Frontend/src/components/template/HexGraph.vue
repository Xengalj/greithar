<template lang="html">
  <g>
    <polygon :points="points"></polygon>
    <circle cx="100" cy="100" r="80"></circle>
    <axis-label
    v-for="(stat, index) in abilities"
    :stat="stat"
    :index="index"
    :key="index"
    :total="abilities.length"
    ></axis-label>
  </g>
</template>

<script>
import AxisLabel from './AxisLabel.vue'
export default {
  name: "HexGraph",
  components: { AxisLabel },
  props: {
    abilities: Array,
  },
  computed: {
    // a computed property for the polygon's points
    points() {
      const total = this.abilities.length
      return this.abilities.map((stat, i) => {
        const { x, y } = valueToPoint(stat.value, i, total)
        return `${x},${y}`
      }).join(' ')
    },
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
polygon {
  fill: #42b983;
  opacity: 0.75;
}

circle {
  fill: transparent;
  stroke: #999;
}

text {
  font-size: 10px;
  fill: #666;
}

label {
  display: inline-block;
  margin-left: 10px;
  width: 20px;
}

#raw {
  position: absolute;
  top: 0;
  left: 300px;
}
</style>
