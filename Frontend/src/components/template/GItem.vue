<template>
  <div class="crd">
    <el-row :gutter="5">
      <el-col :span="5">
        <el-input v-model="item.label" size="small" placeholder="Item Name" />
      </el-col>
      <el-col :span="10">
        <el-input v-model="item.value.Description" :rows="2" type="textarea" placeholder="Enter item description" />
      </el-col>

      <el-col :span="9">
        <el-row>
          <el-input-number v-model="item.value.Cost" :precision="2" placeholder="Cost">
            <template #suffix>
              <span>gp</span>
            </template>
          </el-input-number>
        </el-row>
        <el-row>
          <el-input-number v-model="item.value.Weight" :precision="2" placeholder="Weight">
            <template #suffix>
              <span>lbs</span>
            </template>
          </el-input-number>
        </el-row>
      </el-col>
    </el-row>
    <div class="">
      <div v-for="(value, prop) in item.value" :key="prop">
        <div v-if="!['Description', 'Cost', 'Weight', 'Extras'].includes(prop)">
          <el-row :gutter="5">
            <el-col :span="10">{{ prop }}</el-col>
            <el-col :span="10">
              <el-select v-if="Object.keys(selects).includes(prop)" v-model="item.value[prop]" value-key="label" multiple>
                <template #tag>
                  <el-tag v-for="(element, name) in item.value[prop]" effect="dark" :key="name" >
                    {{ element }}
                  </el-tag>
                </template>
                <el-option v-for="element in selects[prop]" :key="element.name" :label="element.name" :value="element.label" >
                  <div class="flex items-center">
                    <el-tag :color="element.color" style="margin-right: 8px" size="small" />
                    <span :style="{ color: element.color }">{{ element.label }}</span>
                    <span>{{ element.name }}</span>
                  </div>
                </el-option>
              </el-select>
              <el-input v-else-if="!Array.isArray(value)" v-model="item.value[prop]" />
            </el-col>
          </el-row>
        </div>
      </div>

      <el-divider>Extras</el-divider>
      <!-- Masterwork, Abilities, (Magic) Enhancement, Notes -->

      <el-row v-for="prop in item.value.Extras" :key="prop" :gutter="5">
        <el-col :span="10">{{ prop }}</el-col>
        <el-col :span="10">
          {{ item.value.Extras[prop] }}
          <el-input v-model="item.value.Extras[prop]" :rows="2" type="textarea" placeholder="Special notes about this weapon" />
        </el-col>
      </el-row>
    </div>

    <el-row>
      <el-col :span="3" class="addCondition">
        <el-button size="small" type="warning" @click="reset()">Reset</el-button>
      </el-col>
    </el-row>

    {{ item }}<br>

  </div>
</template>

<script>
export default {
  name: 'g-item',
  props: { source: { type: Object } },
  data() {
    return {
      original: {},
      selects: {
        "Damage Type": {
          "Slashing":     { color: "#E63415", label: "Slashing" },
          "Piercing":     { color: "#FFDE0A", label: "Piercing" },
          "Bludgeoning":  { color: "#4167F0", label: "Bludgeoning" }
        },
        "Group": {
          "Axes":         { color: '#E63415', label: 'Axes' },
          "Light Blades": { color: '#FF6600', label: 'Light Blades' },
          "Heavy Blades": { color: '#FFDE0A', label: 'Heavy Blades' },
          "Bows":         { color: '#3cb44b', label: 'Bows' },
          "Close":        { color: '#4167F0', label: 'Close' },
          "Crossbows":    { color: '#911eb4', label: 'Crossbows' },
          "Double":       { color: '#800000', label: 'Double' },
          "Flails":       { color: '#bfef45', label: 'Flails' },
          "Hammers":      { color: '#1EC79D', label: 'Hammers' },
          "Monk":         { color: '#42d4f4', label: 'Monk' },
          "Polearms":     { color: '#f032e6', label: 'Polearms' },
          "Spears":       { color: '#ffd8b1', label: 'Spears' },
          "Thrown":       { color: '#aaffc3', label: 'Thrown' },
          "Tribal":       { color: '#dcbeff', label: 'Tribal' }
        },
        "targets": {

          "Axes":         { color: '#E63415', label: 'Axes' },
          "Light Blades": { color: '#FF6600', label: 'Light Blades' },
          "Heavy Blades": { color: '#FFDE0A', label: 'Heavy Blades' },
          "Bows":         { color: '#3cb44b', label: 'Bows' },
          "Close":        { color: '#4167F0', label: 'Close' },
          "Crossbows":    { color: '#911eb4', label: 'Crossbows' },
          "Double":       { color: '#800000', label: 'Double' },
          "Flails":       { color: '#bfef45', label: 'Flails' },
          "Hammers":      { color: '#1EC79D', label: 'Hammers' },
          "Monk":         { color: '#42d4f4', label: 'Monk' },
          "Polearms":     { color: '#f032e6', label: 'Polearms' },
          "Spears":       { color: '#ffd8b1', label: 'Spears' },
          "Thrown":       { color: '#aaffc3', label: 'Thrown' },
          "Tribal":       { color: '#dcbeff', label: 'Tribal' }

        }
      },
    }
  },
  mounted() {
    this.original = JSON.stringify(this.source);
  },
  computed: {
    rules() { return this.$store.state.data.rules; },
    equipment() { return this.$store.state.data.equipment; },
    item() {
      let item = Object.keys(this.source).length ? this.source : {
        label: "",
        value: {
          Description: "",
          Cost: 0,
          Weight: 0
        }
      };
      return item;
    }
  },
  methods: {
    reset() {
      let old = JSON.parse(this.original);
      this.item.label = old.label;
      this.item.value = old.value;
      this.$message({ message: "Changes Discarded", type: "warning" });
    }
  }
}
</script>

<style scoped>
</style>
