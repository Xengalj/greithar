<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>

    <!-- https://www.svgrepo.com/collection/game-skills-vectors/ -->
    <!-- https://element-plus.org/en-US/component/table.html -->

    <el-row class="row-bg" justify="space-between">
      <el-col :span="6">
        <el-input v-model="tableSearch" size="small" placeholder="Type to search" />
      </el-col>
      <el-col :span="6">
        <!--
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
       -->
      </el-col>
      <el-col :span="6">
        <el-button @click="filterHandler">Filter</el-button>
        <el-button @click="clearFilter">Reset</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="tableData"
      :default-sort="{ prop: 'cr', order: 'ascending' }"
      v-loading="loading"
      table-layout="auto"
      height="500"
      style="width: 100%"
      stripe
    >

      <el-table-column type="expand">
        <template #default="scope">
          <div>{{ scope.row }}</div>
        </template>
      </el-table-column>

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
    </el-table>

    <br><br>

    <g-icon iconSize="64px" iconName="aberration"/> Aberrations<br>
    <g-icon iconSize="64px" iconName="animal"/> Animals<br>
    <g-icon iconSize="64px" iconName="construct"/> Constructs<br>
    <g-icon iconSize="64px" iconName="dragon"/> Dragons<br>
    <g-icon iconSize="64px" iconName="fey"/> Fey<br>
    <g-icon iconSize="64px" iconName="humanoid"/> Humanoids<br>
    <g-icon iconSize="64px" iconName="magical beast"/> Magical Beasts<br>
    <g-icon iconSize="64px" iconName="monstrous humanoid"/> Monsterous Humanoids<br>
    <g-icon iconSize="64px" iconName="ooze"/> Oozes<br>
    <g-icon iconSize="64px" iconName="outsider"/> Outsiders<br>
    <g-icon iconSize="64px" iconName="plant"/> Plants<br>
    <g-icon iconSize="64px" iconName="undead"/> Undead<br>
    <g-icon iconSize="64px" iconName="vermin"/> Vermin<br>


    <el-button plain @click="dialogVisible = true">
      Click to open the Dialog
    </el-button>

    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="500"
      :before-close="handleClose"
    >
    <span>This is a message</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>

    
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
      dialogVisable: false,
      loading: false,
      tableSearch: "",
      tableData: [],
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
    handleClose() {
      console.log("Closing modal");
      // ElMessageBox.confirm('Are you sure to close this dialog?')
      // .then(() => {
      //   done()
      // })
      // .catch(() => {
      //   // catch error
      // }
  }
};
</script>
