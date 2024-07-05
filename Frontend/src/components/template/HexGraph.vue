<template lang="html">
  <g>
    <polygon :points="points"></polygon>
    <circle cx="100" cy="100" r="80"></circle>

    <text
      v-for="(stat, i) in labels"
      :key="i"
      :x="stat.x"
      :y="stat.y">{{stat.label}}: {{ Math.floor((abilities[i] - 10) / 2) }}</text>
  </g>
</template>

<script>
export default {
  name: "HexGraph",
  props: {
    abilities: {
      type: Array,
      default: () => [10, 10, 10, 10, 10, 10]
    }
  },
  computed: {
    // a computed property for the polygon's points
    points() {
      const total = this.abilities.length;
      return this.abilities.map((stat, i) => {
        // abilities are out of 20 for now, then x 100 to get a % of the circle
        const { x, y } = valueToPoint((stat/20*100), i, total);
        return `${x},${y}`;
      }).join(' ');
    },
  },
  data() {
    return {
      labels: [
        { label: 'Str', x: 90, y: 12 },
        { label: 'Dex', x: 175, y: 56 },
        { label: 'Con', x: 175, y: 144 },
        { label: 'Int', x: 90, y: 193 },
        { label: 'Wis', x: 1, y: 144 },
        { label: 'Cha', x: 1, y: 56 }
      ]
    }
  },
  mounted() {
    // console.log(this.abilities);
  }
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

.ability-value {
  display: none;
}

</style>
