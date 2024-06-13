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
      class="ability-value"
    ></axis-label>

    <text
      v-for="(stat, i) in locations"
      :key="i"
      :x="stat.x"
      :y="stat.y">{{stat.label}}</text>
  </g>
</template>

<script>
import AxisLabel from './AxisLabel.vue'
export default {
  name: "HexGraph",
  components: { AxisLabel },
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
      locations: [
        { label: 'Str', x: 100, y: 12 },
        { label: 'Dex', x: 176, y: 56 },
        { label: 'Con', x: 176, y: 144 },
        { label: 'Int', x: 100, y: 193 },
        { label: 'Wis', x: 10, y: 144 },
        { label: 'Cha', x: 10, y: 56 }
      ]

      // abilities: [
      //   { label: 'Str', value: 16, location: { x: 100, y: 12 } },
      //   { label: 'Dex', value: 13, location: { x: 176, y: 56 } },
      //   { label: 'Con', value: 18, location: { x: 176, y: 144 } },
      //   { label: 'Int', value: 10, location: { x: 100, y: 193 } },
      //   { label: 'Wis', value: 11, location: { x: 10, y: 144 } },
      //   { label: 'Cha', value: 8, location: { x: 10, y: 56 } }
      // ],
    }
  },
  watch: {

  },
  mounted() {
    console.log(this.abilites);
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
