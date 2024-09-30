<template>
  <div class="container">

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


    <g-table
      :id="tableName"
      :data="tableData"
      :filters="tableFilters"
    />

  </div>
</template>

<script>
import DataService from "@/services/data.service";

// const equipmentTable = require("@/components/codex/equipment.json");

export default {
  name: "Equipment",
  data() {
    return {
      equipment: {}, // equipment JSON from server

      tableName: "equipmentTable",
      tableData: {},
      tableFilters: {},

      equipmentTypes: {
        "Armor": { label: "Armor", color: "#4167F0" },
        "Shields": { label: "Shields", color: "#14CCCC" },
        "Weapons": { label: "Weapons", color: "#FF6600" },
        "Special Materials": { label: "Special Materials", color: "#6222C9" },
        "Goods and Services": { label: "Goods and Services", color: "#FFDE0A" }
      },
      selectedType: { label: "Armor", color: "#4167F0" }
    };
  },

  created() {
    this.getEquipment();
  },
  mounted() {},
  methods: {
    async getEquipment() {
      this.loading = true;
      DataService.getEquipment()
      .then(response => {
        // console.log("Server:", response);
        this.equipment = response;
        this.tableUpdate();
      })
      .catch(err => { console.error(err); })

    },
    tableUpdate() {
      this.tableData = this.equipment[this.selectedType.label] ? this.equipment[this.selectedType.label] : this.equipment["Armor"];

      switch (this.selectedType.label) {
        case "Armor":
          this.tableFilters = {
            "Proficiency": {
              "Light": { label: "Light", color: "#1EC79D" },
              "Medium": { label: "Medium", color: "#FF6600" },
              "Heavy": { label: "Heavy", color: "#E63415" },
            }
          };
          break;

        case "Shields":
          this.tableFilters = {
            "Proficiency": {
              "Light": { label: "Light", color: "#1EC79D" },
              "Martial": { label: "Martial", color: "#FF6600" },
              "Exotic": { label: "Exotic", color: "#E63415" },
            }
          };
          break;

        case "Weapons":
          this.tableFilters = {
            "Proficiency": {
              "Light": { label: "Light", color: "#1EC79D" },
              "Martial": { label: "Martial", color: "#FF6600" },
              "Exotic": { label: "Exotic", color: "#E63415" },
            },
            "Category": {
              "Unarmed": { label: "Unarmed", color: "#E63415" },
              "Light": { label: "Light", color: "#FF6600" },
              "One-Handed": { label: "One-Handed", color: "#FFDE0A" },
              "Two-Handed": { label: "Two-Handed", color: "#1EC79D" },
              "Ranged": { label: "Ranged", color: "#4167F0" },
              "Ammunition": { label: "Ammunition", color: "#6222C9" }
            },
            "Group": {
              "Close": { label: "Close", color: "#E63415" }
            },
            "Damage Type": {
              "Slashing": { label: "Slashing", color: "#E63415" },
              "Piercing": { label: "Piercing", color: "#FFDE0A" },
              "Bludgeoning": { label: "Bludgeoning", color: "#4167F0" }
            }
          };
          break;

        case "Special Materials":
          this.tableFilters = {
            "Type": {
              "Wood": { label: "Wood", color: "#84240C" },
              "Metal": { label: "Metal", color: "#71797E" },
              "Organic": { label: "Organic", color: "#FFCBC4." },
              "Other": { label: "Other", color: "#F259FF" },
            }
          };
          break;

        case "Goods and Services":
          this.tableFilters = {
            "Category": {
              "Adventuring Gear": { label: "Adventuring Gear", color: "#E63415" },
              "Alchemical Creations": { label: "Alchemical Creations", color: "#FF6600" },
              "Animals & Animal Gear": { label: "Animals & Animal Gear", color: "#FFDE0A" },
              "Books & Writing": { label: "Books & Writing", color: "#1EC79D" },
              "Clothing & Containers": { label: "Clothing & Containers", color: "#14CCCC" },
              "Furniture, Trade Goods & Vehicles": { label: "Furniture, Trade Goods & Vehicles", color: "#4167F0" },
              "Hirelings, Servants & Services": { label: "Hirelings, Servants & Services", color: "#6222C9" },
              "Locks, Keys, Tools & Kits": { label: "Locks, Keys, Tools & Kits", color: "#71797E" },
              "Religious Items, Toys & Games": { label: "Religious Items, Toys & Games", color: "#F259FF" }
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
