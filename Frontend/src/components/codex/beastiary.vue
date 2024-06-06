<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>

    <!-- https://www.svgrepo.com/collection/game-skills-vectors/ -->
    <!-- https://element-plus.org/en-US/component/table.html -->
    <el-button @click="clearFilter">reset all filters</el-button>
    <el-table
      :data="tableData"
      :default-sort="{ prop: 'cr', order: 'ascending' }"
      v-loading="loading"
      height="500"
      style="width: 100%"
      stripe
    >
      <el-table-column sortable prop="Name" label="Name" width="180" />
      <el-table-column sortable prop="Type" label="Type" width="75" :filters="typeFilter" :filter-method="filterHandler" />
      <el-table-column sortable prop="CR" label="CR" />
      <el-table-column sortable prop="HP" label="HP" />
      <el-table-column sortable prop="AC" label="AC" />
      <el-table-column sortable prop="Alignment" label="Alignment" />
      <el-table-column sortable prop="Environment" label="Environment" :filters="environFilter" :filter-method="filterHandler" />
    </el-table>

    <br><br>

    <g-icon iconSize="64px" iconName="aberration"/> Aberrations<br>
    <g-icon iconSize="64px" iconName="animal"/> Animals<br>
    <g-icon iconSize="64px" iconName="construct"/> Constructs<br>
    <g-icon iconSize="64px" iconName="dragon"/> Dragons<br>
    <g-icon iconSize="64px" iconName="fey"/> Fey<br>
    <g-icon iconSize="64px" iconName="humanoid"/> Humanoids<br>
    <g-icon iconSize="64px" iconName="magicalBeast"/> Magical Beasts<br>
    <g-icon iconSize="64px" iconName="monsterousHumanoid"/> Monsterous Humanoids<br>
    <g-icon iconSize="64px" iconName="ooze"/> Oozes<br>
    <g-icon iconSize="64px" iconName="outsider"/> Outsiders<br>
    <g-icon iconSize="64px" iconName="plant"/> Plants<br>
    <g-icon iconSize="64px" iconName="undead"/> Undead<br>
    <g-icon iconSize="64px" iconName="vermin"/> Vermin<br>

  </div>
</template>

<script>
import DataService from "@/services/data.service";

export default {
  components: {
    // AberrationIcon,
  },
  name: "Beastiary",
  data() {
    return {
      content: "Super Temp",
      loading: false,
      tableData: [],
      typeFilter: [
        { text: 'Aberrations', value: 'aberration' },
        { text: 'Animal', value: 'animal' },
        { text: 'Construct', value: 'construct' },
      ],
      environFilter: [
        { text: 'Any', value: 'any' },
      ]
    };
  },
  mounted() {
    this.getBeastiary();
  },
  methods: {
    async getBeastiary() {
      this.loading = true;
      DataService.getBeastiary()
      .then(response => {
        console.log(response);
        this.tableData = response;
        this.loading = false;
      })
      .catch(err => { console.error(err); });
    },
    clearFilter() {
      this.$router.go();
    },
    filterHandler( value, row, column ) {
      const property = column['property'];
      return row[property] === value;
    }
  },
};
</script>
