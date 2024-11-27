<template>
  <div class="container">

    <!-- FILTERS -->
    <el-row class="row-bg" justify="space-between">
      <el-col :span="6">
        <el-input v-model="tableSearch" size="small" placeholder="Type to search" v-on:change="nameSearch()" />
      </el-col>
      <el-col :span="16">
        <el-button @click="clearFilter">Reset</el-button>
      </el-col>
    </el-row>

    <!-- MONSTER TABLE -->
    <el-table
      ref="filterTable"
      :data="tableData"
      :default-sort="{ prop: 'cr', order: 'ascending' }"
      v-loading="loading"
      table-layout="auto"
      height="500"
      style="width: 100%"
      stripe
      :lazy="true"
    >
      <el-table-column sortable prop="Name" label="Name" width="180" />

      <el-table-column
        prop="Type"
        label="Type"
        :filters="typeFilter"
        :filter-method="handleFilter"
        filter-placement="bottom">
        <template #default="scope">
          <el-row class="row-bg" justify="space-between">
            <el-col :span="6">
              <g-icon iconSize="32px" :iconName="scope.row.Type" :key="scope.row.Name" />
            </el-col>
            <el-col :span="15">
              {{ scope.row.Type }}
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column sortable prop="CR" label="CR" />
      <el-table-column sortable prop="HP" label="HP" />
      <el-table-column sortable prop="AC" label="AC" />
      <el-table-column
        prop="Alignment"
        label="Align"
        :filters="alignmentFilter"
        :filter-method="handleFilter"
        filter-placement="bottom">
        <template #default="scope">
          {{ scope.row.Alignment }}
        </template>
      </el-table-column>

      <el-table-column
        prop="Environment"
        label="Environment"
        :filters="environFilter"
        :filter-method="handleFilter"
        filter-placement="bottom">
        <template #default="scope">
          {{ scope.row.Environment }}
        </template>
      </el-table-column>


      <el-table-column label="Actions" width="100px;">
        <template #default="scope">
          <el-row class="row-bg" justify="space-between">
            <el-button type="primary" circle @click="openMonster(scope.row)">
              <g-icon iconSize="24px" iconName="eye" />
            </el-button>

            <el-button type="primary" circle @click="addMonster(scope.row)">
              <g-icon iconSize="24px" iconName="createScroll" />
            </el-button>
          </el-row>
         </template>
       </el-table-column>
    </el-table>


    <!-- MONSTER MODAL -->
    <el-dialog
      width="650"
      style="margin-top: 75px"
      v-model="monsterVisible"
      :before-close="closeMonster"
    >
      <CreatureCard :creatureName="creatureName"></CreatureCard>
    </el-dialog>


  </div>
</template>

<script>
import DataService from "@/services/data.service";
import CreatureCard from "@/components/template/CreatureCard.vue";

export default {
  name: "Beastiary",
  components: {
    CreatureCard
  },
  data() {
    return {
      loading: false,
      allMonsters: [],
      tableData: [],
      tableSearch: "",
      typeFilter: [
        { text: 'Aberrations', value: 'aberration' },
        { text: 'Animals', value: 'animal' },
        { text: 'Constructs', value: 'construct' },
        { text: 'Dragons', value: 'dragon' },
        { text: 'Fey', value: 'fey' },
        { text: 'Humanoids', value: 'humanoid' },
        { text: 'Magical Beasts', value: 'magical beast' },
        { text: 'Monsterous Humanoids', value: 'monstrous humanoid' },
        { text: 'Oozes', value: 'ooze' },
        { text: 'Outsiders', value: 'outsider' },
        { text: 'Plants', value: 'plant' },
        { text: 'Undead', value: 'undead' },
        { text: 'Vermin', value: 'vermin' },
      ],
      alignmentFilter: [
        { text: 'LG', value: 'lg' },
        { text: 'NG', value: 'ng' },
        { text: 'CG', value: 'cg' },
        { text: 'LN', value: 'ln' },
        { text: 'N',  value: 'n' },
        { text: 'CN', value: 'cn' },
        { text: 'LE', value: 'le' },
        { text: 'NE', value: 'ne' },
        { text: 'CE', value: 'ce' },
      ],
      environFilter: [
        { text: "Any", value: "any" },
        { text: "Cold", value: "cold" },
        { text: "Temperate", value: "temperate" },
        { text: "Warm", value: "warm" },
        { text: "Aquatic", value: "aquatic" },
        { text: "Coastline", value: "coastline" },
        { text: "Desert", value: "desert" },
        { text: "Forest", value: "forest" },
        { text: "Hills", value: "hills" },
        { text: "Jungle", value: "jungle" },
        { text: "Mountains", value: "mountains" },
        { text: "Ocean", value: "ocean" },
        { text: "Sea", value: "sea" },
        { text: "Plains", value: "plains" },
        { text: "River", value: "river" },
        { text: "Lakes", value: "lakes" },
        { text: "Swamp", value: "swamp" },
        { text: "Marsh", value: "marsh" },
        { text: "Urban", value: "urban" },
        { text: "Underground", value: "underground" }
      ],

      tableColor: "",
      colors: [
        { value: '#E63415', label: 'red' },
        { value: '#FF6600', label: 'orange' },
        { value: '#FFDE0A', label: 'yellow' },
        { value: '#1EC79D', label: 'green' },
        { value: '#14CCCC', label: 'cyan' },
        { value: '#4167F0', label: 'blue' },
        { value: '#6222C9', label: 'purple' },
      ],


      // MONSTER MODAL
      monsterVisible: false,
      creatureName: "",
    };
  },

  created() {
    this.getBeastiary();
  },
  mounted() {},
  methods: {
    async getBeastiary() {
      this.loading = true;
      DataService.getBeastiary()
      .then(response => {
        this.allMonsters = response;
        this.tableData = this.allMonsters;
        this.loading = false;

        for ( const mon of response ) {
          if (mon.HD.split(';')[1]) {
            console.log('true');
            console.log(mon.HD, mon.Name);
          }
        }

      })
      .catch(err => { console.error(err); });
    },
    handleFilter(value, row, column) {
      const property = column['property'];
      if (row[property]) {
        return row[property].toLowerCase().includes(value);
      }
    },
    clearFilter() {
      this.tableSearch = "";
      this.$refs.filterTable.clearFilter();
      // this.tableData = this.allMonsters;
    },
    nameSearch() {
      let monName, searchStr, mons = this.allMonsters;
      searchStr = this.tableSearch.toLowerCase();
      this.tableData = [];
      if (searchStr == "") {
        this.tableData = mons;
        return;
      }
      this.loading = true;
      for (let i = 0; i < mons.length; i++) {
        monName = mons[i].Name.toLowerCase();
        if ( monName.includes( searchStr ) ) {
          this.tableData.push(mons[i]);
        }
      }
      this.loading = false;
    },

    // MONSTER MODAL
    openMonster(name) {
      this.creatureName = name.Name;
      this.monsterVisible = true;
    },
    closeMonster() {
      this.monsterVisible = false;
    }
  }
};
</script>

<style media="screen">
.dark table {
  background-color: light-dark( var(--white), var(--color-surface-100) );
}
</style>
