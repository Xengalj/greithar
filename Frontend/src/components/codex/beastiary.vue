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
      height="250"
      stripe
      style="width: 80%"
    >
      <el-table-column sortable prop="name" label="Name" width="180" />
      <el-table-column sortable prop="type" label="Type" width="75" />
      <el-table-column sortable prop="cr" label="CR"
    />
    <!-- :filters="[
    { text: '1', value: '1' },
    { text: '1/4', value: '1/4' },
    ]"
    :filter-method="filterHandler" -->
      <el-table-column sortable prop="hp" label="HP" />
      <el-table-column sortable prop="ac" label="AC" />
      <el-table-column sortable prop="alignment" label="Alignment" />
      <el-table-column sortable prop="environment" label="Environment" />
    </el-table>


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
import UserService from "../../services/user.service";

// import {
//   AberrationIcon,

// } from '@/assets/svg-repo/index.js';

export default {
  components: {
    // AberrationIcon,

  },

  name: "Beastiary",
  data() {
    return {
      content: "",
      tableData: [
        {
          name: 'Wolf',
          type: 'animal',
          hp: '13',
          ac: '14',
          cr: '1',
          alignment: 'N',
          environment: 'cold or temperate forests',
        },
        {
          name: 'Kobold',
          type: 'humanoid (reptilian)',
          hp: '5',
          ac: '15',
          cr: '1/4',
          alignment: 'LE',
          environment: 'temperate underground or deep forest',
        },
      ]
    };
  },
  mounted() {
    UserService.getAdminBoard().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  },
  methods: {
    // clearFilter() {
    //   tableRef.value.clearFilter()
    // }

  },
  computed: {
    // filterHandler(
    //   value: string,
    //   row: User,
    //   column: TableColumnCtx<User>
    // ) {
    //   const property = column['property']
    //   return row[property] === value
    // }

  }
};
</script>
