<template>
  <div style="margin: 0 2%">

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

    <el-row :gutter="10" justify="center">
      <el-col :xs="24" :sm="12" :md="12" style="margin-bottom:10px">
        <el-input v-model="nameSearch" aria-label="Item Name">
          <template #prepend> <g-icon iconSize="20px" iconName="search" /> Search </template>
        </el-input>
      </el-col>
      <el-col :xs="10" :sm="4" :md="2" style="margin-bottom:10px">
        <el-button @click="clearFilters" type="warning"> Reset Filters </el-button>
      </el-col>
    </el-row>

    <el-table
      ref="equipTable"
      :data="tableData.filter(data => !nameSearch || data.Name.toLowerCase().includes(nameSearch.toLowerCase()))"
      :default-sort="{ prop: 'name', order: 'ascending' }"
      table-layout="auto"
      height="700"
      stripe
      sort-change="console.log('sorted')"
    >
      <el-table-column
        v-for="col in tableCols"
        :key="col"
        :prop="col"
        :label="col"
        :fixed="col == 'Name' ? 'left' : false"
        :sortable="['Name', 'Critical', 'Range', 'Cost', 'Weight'].includes(col) ? true : false"
        :filters="tableFilters[col]"
        :filter-method="Object.keys(tableFilters).includes(col) ? filterHandler : null"
      >
        <template #default="scope">

          <div v-if="col == 'Damage'">
            <div>Small: {{ scope.row[col].small }}</div>
            <div>Medium: {{ scope.row[col].medium }}</div>
            <el-collapse>
              <el-collapse-item name="damages">
                <template #title> <g-icon iconName="weapons" /> Sizes </template>
                <div v-for="(dmg, name) in scope.row[col]" :key="name"> {{ name }} : {{ dmg }} </div>
              </el-collapse-item>
            </el-collapse>
          </div>


          <div v-else-if="col == 'Range' && scope.row[col] > 0">
            <el-tooltip placement="top" effect="light">
              {{ scope.row[col] }} ft
              <template #content>
                Range Increment
              </template>
            </el-tooltip>
          </div>

          <div v-else-if="Array.isArray(scope.row[col])">
            <el-tag v-for="item in scope.row[col]" :key="item" effect="dark" style="margin-right:5px" > {{ item }} </el-tag>
          </div>
          <div v-else-if="col == 'Cost'">
            <el-tag color="#FFDE0A" style="color:black; border:none;">
              {{ scope.row[col] }} gp
            </el-tag>
          </div>
          <div v-else-if="col == 'Weight'">
            <el-tag type="info" effect="dark">
              {{ scope.row[col] }} lbs
            </el-tag>
          </div>

          <el-collapse v-else-if="col == 'Description'">
            <el-collapse-item name="Desc">
              <template #title> <g-icon iconName="openBook" /> Desc </template>
              {{ scope.row[col] }}
            </el-collapse-item>
          </el-collapse>

          <el-collapse v-else-if="col == 'Extras'">
            <el-collapse-item v-if="scope.row[col].Notes.length" name="Notes" class="center-horz">
              <template #title> <g-icon iconName="star" /> Notes </template>
              <ul>
                <li v-for="(note, index) in scope.row[col].Notes" :key="index"> {{ note }} </li>
              </ul>
            </el-collapse-item>

            <el-collapse-item name="Actions" class="center-horz">
              <template #title> <g-icon iconName="abilityPalm" /> Actions </template>
              <el-tooltip placement="left" effect="light">
                <el-button @click="editForToon(scope.row)" size="large" type="primary" circle>
                  <g-icon iconName="inventory" iconSize="24px"  />
                </el-button>
                <template #content>
                  Add to Character
                </template>
              </el-tooltip>
            </el-collapse-item>
          </el-collapse>

          <div v-else>
            {{ scope.row[col] }}
          </div>

        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- Add Item Dialogs -->
  <el-dialog v-model="toonEdit" width="750">
    <g-item :source="toonItem" @save-item="saveItem"/>
  </el-dialog>
  <el-dialog v-model="toonList" width="500">
    <h3> Add to which character? </h3>
    <el-select
      v-model="chosenToon"
      value-key="name"
      style="width: 240px"
    >
      <el-option v-for="toon in userToons" :key="toon.name" :label="toon.name" :value="toon" >
        <div class="flex items-center">
          <span>{{ toon.name }}</span>
        </div>
      </el-option>
    </el-select>
    <el-row justify="end">
      <el-button size="small" type="warning" @click="toonEdit = false; toonList = false;"> Cancel </el-button>
      <el-button size="small" type="success" @click="addToToon()"> Confirm </el-button>
    </el-row>
  </el-dialog>

</template>

<script>
import GItem from '@/components/template/GItem.vue';
import CharacterService from "@/services/character.service";

export default {
  name: "Equipment",
  components: { GItem },
  data() {
    return {
      equipmentTypes: {
        "Armor":      { color: "#4167F0", label: "Armor" },
        "Shields":    { color: "#14CCCC", label: "Shields" },
        "Weapons":    { color: "#FF6600", label: "Weapons" },
        "Materials":  { color: "#71797E", label: "Materials" },
        "Goods":      { color: "#FFDE0A", label: "Goods" }
      },
      selectedType: { label: "" },

      tableCols: [], // Array of table headers
      tableData: [],
      nameSearch: "",
      tableFilters: {},

      toonItem: {},
      toonEdit: false,
      toonList: false,
      userToons: [],
      chosenToon: {},
    };
  },
  computed: {
    currentUser() { return this.$store.state.auth.user; },
    equipment() { return JSON.parse(localStorage.getItem('equipment')); },
  },
  mounted() {
    this.tableUpdate();
    // console.log(this.equipment);
  },
  methods: {
    /***************************\
    *                           *
    *          FILTERS          *
    *                           *
    \***************************/
    clearFilters() { this.$refs.equipTable.clearFilter(); },
    // displays table based on item type select
    tableUpdate() {
      this.tableData = [];

      if (this.selectedType.label) {
        for (let [name, item] of Object.entries( this.equipment[this.selectedType.label] )) {
          item.Name = name;
          this.tableData.push(item);
        }
        this.tableCols = Object.keys(Object.values(this.tableData)[0]);
      }

      switch (this.selectedType.label) {
        case "Armor":
          this.tableFilters = {
            "Proficiency": [
              { text: "Light",        value: "Light" },
              { text: "Medium",       value: "Medium" },
              { text: "Heavy",        value: "Heavy" },
            ]
          };
          break;

        case "Shields":
          this.tableFilters = {
            "Group": [
              { text: "Light Blades", value: 'Light Blades' },
              { text: "Heavy Blades", value: 'Heavy Blades' },
              { text: "Close",        value: 'Close' },
              { text: "Thrown",       value: 'Thrown' },
              { text: "Tribal",       value: 'Tribal' }
            ]
          };
          break;

        case "Weapons":
          this.tableFilters = {
            "Damage Type": [
              { text: "Slashing",     value: "Slashing" },
              { text: "Piercing",     value: "Piercing" },
              { text: "Bludgeoning",  value: "Bludgeoning" }
            ],
            "Proficiency": [
              { text: "Simple",       value: "Simple" },
              { text: "Martial",      value: "Martial" },
              { text: "Exotic",       value: "Exotic" },
              { text: "Natural",      value: "Natural" }
            ],
            "Category": [
              { text: "Unarmed",      value: "Unarmed" },
              { text: "Light",        value: "Light" },
              { text: "One-Handed",   value: "One-Handed" },
              { text: "Two-Handed",   value: "Two-Handed" },
              { text: "Ranged",       value: "Ranged" },
              { text: "Ammunition",   value: "Ammunition" },
              { text: "Primary",      value: "Primary" },
              { text: "Secondary",    value: "Secondary" }
            ],
            "Group": [
              { text: "Axes",         value: 'Axes' },
              { text: "Light Blades", value: 'Light Blades' },
              { text: "Heavy Blades", value: 'Heavy Blades' },
              { text: "Bows",         value: 'Bows' },
              { text: "Close",        value: 'Close' },
              { text: "Crossbows",    value: 'Crossbows' },
              { text: "Double",       value: 'Double' },
              { text: "Flails",       value: 'Flails' },
              { text: "Hammers",      value: 'Hammers' },
              { text: "Monk",         value: 'Monk' },
              { text: "Polearms",     value: 'Polearms' },
              { text: "Spears",       value: 'Spears' },
              { text: "Thrown",       value: 'Thrown' },
              { text: "Tribal",       value: 'Tribal' }
            ]
          };
          break;

        case "Materials":
          this.tableFilters = {
            "Type": [
              { text: "Metal",        value: "Metal" },
              { text: "Textile",      value: "Textile" },
              { text: "Stone",        value: "Stone" },
              { text: "Organic",      value: "Organic" }
            ]
          };
          break;

        case "Goods":
          this.tableFilters = {
            "Category": [
              { text: "Animals",      value: "Animals" },
              { text: "Containers",   value: "Containers" },
              { text: "Food",         value: "Food" },
              { text: "Kits",         value: "Kits" },
              { text: "Light",        value: "Light" },
              { text: "Services",     value: "Services" },
              { text: "Sleep",        value: "Sleep" },
              { text: "Tools",        value: "Tools" },
              { text: "Transport",    value: "Transport" },
              { text: "Vehicles",     value: "Vehicles" }
            ]
          };
          break;
      }
    },
    // Filters a given row with the value (more options shows more results)
    filterHandler(value, row, column) {
      const prop = column['property'];
      if (Array.isArray(row[prop])) {
        return row[prop].includes(value);
      }
      return row[prop] === value
    },


    /***************************\
    *                           *
    *        ADD TO TOON        *
    *                           *
    \***************************/
    editForToon(item) {
      this.toonItem = { label: item.Name, value: {} }
      for (const [key, val] of Object.entries(item)) {
        if (key != 'Name') {
          this.toonItem.value[key] = val;
        }
      }
      this.toonItem.value.Extras.Masterwork = false;
      this.toonItem.value.Extras.Enhancement = 0;
      this.toonItem.value.Ammount = 1;
      this.toonEdit = true;
    },
    saveItem(item) {
      this.toonItem = item;
      CharacterService.getAllCharacters(this.currentUser.id, 0, null)
      .then(response => {
        this.userToons = JSON.parse(response.characters).rows;
        this.toonList = true;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },
    addToToon() {
      let newItem = this.toonItem;

      if (this.toonItem.value.Category == "Containers") {
        newItem = {
          label: this.toonItem.label,
          extras: {
            icon: this.toonItem.value.Extras.icon,
            capacity: this.toonItem.value.Extras.capacity
          },
          children: [],
          value: {
            Cost: this.toonItem.value.Cost,
            Weight: this.toonItem.value.Weight,
            Description: this.toonItem.value.Description
          }
        };
      }

      // add toonItem to chosenToon in items
      this.chosenToon.inventory[2].children.push(newItem);
      this.chosenToon.user = { "id": this.chosenToon.userId };
      // update toon
      CharacterService.updateCharacter(this.chosenToon)
      .then((response) => { this.$message({ message: `Added ${newItem.label} to ${response.character.name}`, type: 'success', }); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
      this.toonEdit = false;
      this.toonList = false;
      setTimeout(function () {
        this.toonItem = {};
      }, 10);
    },
  }
};
</script>
<style media="screen">
  .hero-section {
    color: #CCC;
    text-align: center;
    margin-bottom: 10px;
  }
</style>
