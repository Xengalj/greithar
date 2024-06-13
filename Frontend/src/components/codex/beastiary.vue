<template>
  <div class="container">

    <!--
     https://www.svgrepo.com/collection/game-skills-vectors
    https://element-plus.org/en-US/component/table.html
    https://element-plus.org/en-US/component/pagination.html
    -->

    <!-- FILTERS -->
    <el-row class="row-bg" justify="space-between">
      <el-col :span="6">
        <el-input v-model="tableSearch" size="small" placeholder="Type to search" />
      </el-col>

      <el-col :span="6">
        <el-select v-model="value" multiple placeholder="Select" style="width: 240px">
          <el-option
            v-for="item in colors"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <div class="flex items-center">
              <el-tag :color="item.value" style="margin-right: 8px" size="small" />
              <span :style="{ color: item.value }">{{ item.label }}</span>
            </div>
          </el-option>
          <template #tag>
            <el-tag v-for="color in value" :key="color" :color="color" />
          </template>
        </el-select>
      </el-col>

      <el-col :span="6">
        <el-button @click="filterHandler">Filter</el-button>
        <el-button @click="clearFilter">Reset</el-button>
      </el-col>
    </el-row>


    <!-- MONSTER TABLE -->
    <el-table
      :data="tableData"
      :default-sort="{ prop: 'cr', order: 'ascending' }"
      v-loading="loading"
      table-layout="auto"
      height="500"
      style="width: 100%"
      stripe
    >
      <el-table-column sortable prop="Name" label="Name" width="180" />

      <el-table-column sortable prop="Type" label="Type">
        <template #default="scope">
          <el-row class="row-bg" justify="space-between">
            <el-col :span="6">
              <g-icon iconSize="32px" :iconName="scope.row.Type"/>
            </el-col>
            <el-col :span="17">
              {{ scope.row.Type }}
            </el-col>
          </el-row>
         </template>
       </el-table-column>

      <el-table-column sortable prop="CR" label="CR" />
      <el-table-column sortable prop="HP" label="HP" />
      <el-table-column sortable prop="AC" label="AC" />
      <el-table-column sortable prop="Alignment" label="Align" />
      <el-table-column sortable prop="Environment" label="Environment" />

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
      width="500"
      v-model="cardVisible"
      :title="this.monster.Name"
      :before-close="handleClose"
    >

    {{ monster }}



      <el-row>
        <el-col :span="9" class="center">
          <g-icon iconSize="128px" />
          <br>
          HP
          <br>
          init, sense, speed
        </el-col>


        <el-col :span="9" class="center">
          <svg width="200" height="200">
            <!-- <HexGraph :abilities="abilities"></HexGraph> -->
            <HexGraph :abilities="[this.monster.str, this.monster.dex, this.monster.con, this.monster.int, this.monster.wis, this.monster.cha]"></HexGraph>
            <!-- <HexGraph :abilities="[18, 16, 14, 12, 10, 8]"></HexGraph> -->
          </svg>
        </el-col>

        <el-col :span="6" style="display: inline-grid">
          <div v-for="(stat, index) in abilities" :key="index">
            <strong>{{ stat }}: </strong>
          </div>
        </el-col>
      </el-row>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose()"> Close </el-button>
        <el-button type="primary" @click="addMonster()"> Add to Session </el-button>
      </div>
    </template>
  </el-dialog>


  </div>
</template>

<script>
import DataService from "@/services/data.service";
// import CreatureSheet from '@/components/template/CreatureSheet.vue'
import HexGraph from '@/components/template/HexGraph.vue'

export default {
  name: "Beastiary",
  components: {
    // CreatureSheet,
    HexGraph
  },
  data() {
    return {
      loading: false,
      tableData: [],
      tableSearch: "",
      typeFilter: [
        // { text: 'Aberrations', value: 'aberration' },
        // { text: 'Animals', value: 'animal' },
        // { text: 'Constructs', value: 'construct' },
        { text: 'Dragons', value: 'dragon' },
        // { text: 'Fey', value: 'fey' },
        // { text: 'Humanoids', value: 'humanoid' },
        // { text: 'Magical Beasts', value: 'magical beast' },
        // { text: 'Monsterous Humanoids', value: 'monstrous humanoid' },
        // { text: 'Oozes', value: 'ooze' },
        // { text: 'Outsiders', value: 'outsider' },
        // { text: 'Plants', value: 'plant' },
        // { text: 'Undead', value: 'undead' },
        // { text: 'Vermin', value: 'vermin' },
      ],
      environFilter: [
        { text: 'Any', value: 'any' },
      ],

      colors: [
        { value: '#E63415', label: 'red' },
        { value: '#FF6600', label: 'orange' },
        { value: '#FFDE0A', label: 'yellow' },
        { value: '#1EC79D', label: 'green' },
        { value: '#14CCCC', label: 'cyan' },
        { value: '#4167F0', label: 'blue' },
        { value: '#6222C9', label: 'purple' },
      ],
      value: "",



      abilities: [
        { label: 'Str', value: 16, location: { x: 100, y: 12 } },
        { label: 'Dex', value: 13, location: { x: 176, y: 56 } },
        { label: 'Con', value: 18, location: { x: 176, y: 144 } },
        { label: 'Int', value: 10, location: { x: 100, y: 193 } },
        { label: 'Wis', value: 11, location: { x: 10, y: 144 } },
        { label: 'Cha', value: 8, location: { x: 10, y: 56 } }
      ],



      // MONSTER MODAL
      monster: {},
      cardVisible: false,
    };
  },
  computed: {},
  mounted() {
    this.getBeastiary();
  },
  methods: {
    async getBeastiary() {
      this.loading = true;
      DataService.getBeastiary()
      .then(response => {
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
      /*
      const filterTableData = computed(() =>
        tableData.filter(
          (data) =>
            !tableSearch.value ||
            data.name.toLowerCase().includes(tableSearch.value.toLowerCase())
        )
      )
      */
    },
    addMonster(monster) {
      console.log('add', monster);
    },


    // MONSTER MODAL
    openMonster(monster) {
      this.monster = monster;
      // console.log(monster);
      this.cardVisible = true;
    },
    handleClose() {
      console.log("Closing modal");
      this.cardVisible = false;
      this.monster = {};
      // ElMessageBox.confirm('Are you sure to close this dialog?')
      // .then(() => {
      //   done()
      // })
      // .catch(() => {
      //   // catch error
      }


  }
};
</script>
