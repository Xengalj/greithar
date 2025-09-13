<template>
  <div style="margin: 25px;">

    <div class="hero-section">
      Select Item Type
      <el-select
        v-model="selectedType"
        value-key="label"
        style="width: 240px"
        v-on:change="tableUpdate()"
      >
        <el-option v-for="item in equipmentTypes" :key="item.label" :label="item.label" :value="item" >
          <div class="flex items-center">
            <el-tag :color="item.color" style="margin-right: 8px" size="small" />
            <span :style="{ color: item.color }">{{ item.label }}</span>
          </div>
        </el-option>
      </el-select>
    </div>

    <equipment-table
      :id="tableName"
      :data="tableData"
      :filters="tableFilters"
    />
  </div>
</template>

<script>
import EquipmentTable from "./EquipmentTable.vue";

export default {
  name: "Equipment",
  components: { EquipmentTable },
  data() {
    return {
      // equipment: {}, // equipment JSON from server

      tableName: "equipmentTable",
      tableData: {},
      tableFilters: {},

      equipmentTypes: {
        "Armor":              { color: "#4167F0", label: "Armor" },
        "Shields":            { color: "#14CCCC", label: "Shields" },
        "Weapons":            { color: "#FF6600", label: "Weapons" },
        "Materials":          { color: "#71797E", label: "Materials" },
        "Goods and Services": { color: "#FFDE0A", label: "Goods and Services" }
      },
      selectedType: { label: "Weapons", color: "#4167F0" },

    };
  },
  computed: {
    equipment() { return this.$store.state.data.equipment; },
  },
  mounted() {
    if (!this.equipment) { this.$router.push("/"); }
    this.loading = true;
    this.tableUpdate();
  },
  methods: {
    tableUpdate() {
      this.tableData = this.equipment[this.selectedType.label] ? this.equipment[this.selectedType.label] : {};

      switch (this.selectedType.label) {
        case "Armor":
          this.tableFilters = {
            "Proficiency": {
              "Light":        { color: "#1EC79D", label: "Light" },
              "Medium":       { color: "#FFDE0A", label: "Medium" },
              "Heavy":        { color: "#E63415", label: "Heavy" },
            }
          };
          break;

        case "Shields":
          this.tableFilters = {
            "Group": {
              "Light Blades": { color: '#FF6600', label: 'Light Blades' },
              "Heavy Blades": { color: '#FFDE0A', label: 'Heavy Blades' },
              "Close":        { color: '#4167F0', label: 'Close' },
              "Thrown":       { color: '#aaffc3', label: 'Thrown' },
              "Tribal":       { color: '#dcbeff', label: 'Tribal' }
            }
          };
          break;

        case "Weapons":
          this.tableFilters = {
            "Damage Type": {
              "Slashing":     { color: "#E63415", label: "Slashing" },
              "Piercing":     { color: "#FFDE0A", label: "Piercing" },
              "Bludgeoning":  { color: "#4167F0", label: "Bludgeoning" }
            },
            "Proficiency": {
              "Simple":       { color: "#1EC79D", label: "Simple" },
              "Martial":      { color: "#FFDE0A", label: "Martial" },
              "Exotic":       { color: "#E63415", label: "Exotic" },
              "Natural":      { color: "#bfef45", label: "Natural" }
            },
            "Category": {
              "Unarmed":      { color: "#E63415", label: "Unarmed" },
              "Light":        { color: "#FF6600", label: "Light" },
              "One-Handed":   { color: "#FFDE0A", label: "One-Handed" },
              "Two-Handed":   { color: "#1EC79D", label: "Two-Handed" },
              "Ranged":       { color: "#4167F0", label: "Ranged" },
              "Ammunition":   { color: "#6222C9", label: "Ammunition" },
              "Primary":      { color: "#42d4f4", label: "Primary" },
              "Secondary":    { color: "#dcbeff", label: "Secondary" }
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
            }
          };
          break;

        case "Materials":
          this.tableFilters = {
            "Type": {
              "Metal":        { color: "#71797E", label: "Metal" },
              "Textile":      { color: "#42d4f4", label: "Textile" },
              "Stone":        { color: "#dcbeff", label: "Stone" },
              "Organic":      { color: "#ffd8b1", label: "Organic" }
            }
          };
          break;

        case "Goods and Services":
          this.tableFilters = {
            "Category": {
              "Adventuring Gear":
                              { color: "#E63415", label: "Adventuring Gear" },
              "Alchemical Creations":
                              { color: "#FF6600", label: "Alchemical Creations" },
              "Animals & Animal Gear":
                              { color: "#FFDE0A", label: "Animals & Animal Gear" },
              "Books & Writing":
                              { color: "#3cb44b", label: "Books & Writing" },
              "Clothing & Containers":
                              { color: "#4167F0", label: "Clothing & Containers" },
              "Furniture, Trade Goods & Vehicles":
                              { color: "#911eb4", label: "Furniture, Trade Goods & Vehicles" },
              "Hirelings, Servants & Services":
                              { color: "#800000", label: "Hirelings, Servants & Services" },
              "Locks, Keys, Tools & Kits":
                              { color: "#bfef45", label: "Locks, Keys, Tools & Kits" },
              "Religious Items, Toys & Games":
                              { color: "#1EC79D", label: "Religious Items, Toys & Games" }
            }
          };
          break;

        default:
          this.tableData = {};
          this.tableFilters = {};
      }
      this.loading = false;
    }
  }
};
</script>
<style media="screen">
  .hero-section {
    color: #CCC;
    text-align: center;
    margin-bottom: 20px;
  }
</style>
