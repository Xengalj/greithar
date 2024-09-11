<template>

  <!--
  <div class="container">
    <header class="jumbotron">
      <h3>{{ user }}</h3>
    </header>
  </div>
  -->



  <div class="filter-row">
    <input type="text" id="seachName" placeholder="Search by name.." title="Type in a name" v-on:keyup="searchByName()" >

    <el-select
      v-for="(filter, key) in tableFilters" :key="key"
      v-model="filterValue[key]"
      value-key="label"
      multiple
      :placeholder="`Select ${key}`"
      style="width: 240px"
      v-on:change="filterTable()"
    >
      <el-option v-for="item in filter" :key="item.label" :label="item.label" :value="item" >
        <div class="flex items-center">
          <el-tag :color="item.color" style="margin-right: 8px" size="small" />
          <span :style="{ color: item.color }">{{ item.label }}</span>
        </div>
      </el-option>

      <template #footer>
        <el-button v-if="!isAdding" text bg size="small" @click="isAdding=true"> Add an option </el-button>
        <template v-else>
          <div style="display: flex;">
            <el-color-picker v-model="newOption.color" size="small" :teleported="false" />
            <el-input v-model="newOption.value" class="option-input" placeholder="Enter option name" size="small" style="width:75%; margin-left: 5px;"/>
            <el-button type="primary" size="small" style="margin-left: 5px;" @click="onConfirm(key)">confirm</el-button>
            <el-button size="small" @click="newOption = {}; isAdding = false;">cancel</el-button>
          </div>
        </template>
      </template>


   <template #tag>
     <el-tag v-for="(item, name) in filterValue[key]" effect="dark" :color="item.color" :key="name" >
       {{ item.label }}
     </el-tag>
   </template>


  </el-select>
  <!-- <el-button text bg size="small" @click="()=>{filterValue = {}})">
    Add an option
  </el-button> -->

  </div>





  <table :id="tableName">
    <tr>
      <th v-for="item in tableCols" @click="sortTable(item)" :key="item" >
        {{ item }}
      </th>
    </tr>
    <tr v-for="(item, name) in tableData" :key="name">
      <td name="Name">{{ name }}</td>
      <td v-for="(prop, key) in item" :key="key" :name="key">
        {{ prop }}
      </td>
    </tr>
  </table>




  <el-button type="primary" circle @click="monsterOpen('Death Worm')">
    <g-icon iconSize="24px" iconName="eye" />
  </el-button>
  <el-button type="primary" circle @click="monsterOpen('Adult Red Dragon')">
    <g-icon iconSize="24px" iconName="firebolt" />
  </el-button>

  <el-dialog
    width="650"
    v-model="monsterVisible"
    :before-close="monsterClose"
  >
    <CreatureCard :creatureName="creatureName"></CreatureCard>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="monsterClose()"> Close </el-button>
        <el-button type="primary" @click="addMonster()"> Add to Session </el-button>
      </div>
    </template>
  </el-dialog>


  <p v-for="(icon, name, index) in icons" :key="index">
    <strong>{{ name }}</strong>
    <g-icon :iconName="name" />
  </p>

</template>

<script>
import UserService from "@/services/user.service";
// import DataService from "@/services/data.service";
import CreatureCard from '@/components/template/CreatureCard.vue'
const icons = require('@/components/template/svgPaths.json');
// const miscTables = require('@/components/codex/tables.json');
// const supplementTables = require('@/components/codex/monsters.json');
const equipmentTables = require('@/components/codex/equipment.json');

export default {
  name: "DM Screen",
  components: {
    CreatureCard
  },
  data() {
    return {
      content: "DM Screen",

      icons: icons,

      monsterVisible: false,
      creatureName: "",


      equipment: equipmentTables,
      tableName: "equipmentTable",
      tableCols: {},
      tableData: {},
      tbaleFilters: {},
      filterValue: {},
      isAdding: false,
      newOption: {}

    }
  },
  computed: {
    user() {
      let user = "Xen";
      user = localStorage.getItem('user');

      // this.$store.state.auth.status.loggedIn
      // console.log(this.$store.state.auth);
      return user;
    }
  },
  mounted() {

    // DataService.getEquipment().then(
    //   (response) => {
    //     this.equipment = response.data;
    //     console.log(response.data);
    //   }
    // );
    // console.log(this.equipment.armor);
    this.tableData = this.equipment.armor;
    let first = Object.values(this.tableData)[0];
    this.tableCols = ["Name"].concat(Object.keys(first));

    this.tableFilters = {
      /*
      //   { value: '#E63415', label: 'red' },
      //   { value: '#FF6600', label: 'orange' },
      //   { value: '#FFDE0A', label: 'yellow' },
      //   { value: '#1EC79D', label: 'green' },
      //   { value: '#14CCCC', label: 'cyan' },
      //   { value: '#4167F0', label: 'blue' },
      //   { value: '#6222C9', label: 'purple' }
      */
      "Proficiency": {
        "Light": { label: 'Light', color: '#1EC79D' },
        "Medium": { label: 'Medium', color: '#FF6600' },
        "Heavy": { label: 'Heavy', color: '#E63415' },
      },
      "Category": {
        "Unarmed": { label: 'Unarmed', color: '#E63415' },
        "Light": { label: 'Light', color: '#FF6600' },
        "One-Handed": { label: 'One-Handed', color: '#FFDE0A' },
        "Two-Handed": { label: 'Two-Handed', color: '#1EC79D' },
        "Ranged": { label: 'Ranged', color: '#4167F0' },
        "Ammunition": { label: 'Ammunition', color: '#6222C9' }
      },
      "Group": {
        "Close": { label: 'Close', color: '#E63415' }
      },
      "Damage Type": {
        "Slashing": { label: 'Slashing', color: '#E63415' },
        "Piercing": { label: 'Piercing', color: '#FFDE0A' },
        "Bludgeoning": { label: 'Bludgeoning', color: '#4167F0' }
      }
    };


    // console.log(this.tableCols);

    // console.log(Object.keys(this.equipment.armor[0]));

    UserService.getAdminBoard().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content =
          (error.response && error.response.data && error.response.data.message)
          || error.message || error.toString();
      }
    );
  },
  methods: {
    monsterOpen(name) {
      this.creatureName = name

      // this.monster.Name = name;
      // this.getMonster(this.monster);
      this.monsterVisible = true;
    },
    monsterClose() {
      this.monsterVisible = false;
    },

    sortTable(sortStr) {
      let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
      table = document.getElementById("equipmentTable");
      switching = true;
      dir = "asc";

      /*Make a loop that will continue until
      no switching has been done:*/
      while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
          //start by saying there should be no switching:
          shouldSwitch = false;

          /*Get the two elements you want to compare,
          one from current row and one from the next:*/
          x = rows[i].children[sortStr];
          x = x ? x.innerHTML : "";
          y = rows[i + 1].children[sortStr];
          y = y ? y.innerHTML : "";


          // if we are sorting by string
          if ( isNaN( parseInt(x) ) ) {
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
              if (x.toLowerCase() > y.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch= true;
                break;
              }
            } else if (dir == "desc") {
              if (x.toLowerCase() < y.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            }

          // if we are sorting by number
          } else {
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
              if (parseInt(x) > parseInt(y)) {
                //if so, mark as a switch and break the loop:
                shouldSwitch= true;
                break;
              }
            } else if (dir == "desc") {
              if (parseInt(x) < parseInt(y)) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            }
          }
        }
        if (shouldSwitch) {
          /*If a switch has been marked, make the switch
          and mark that a switch has been done:*/
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
          //Each time a switch is done, increase this count by 1:
          switchcount ++;
        } else {
          /*If no switching has been done AND the direction is "asc",
          set the direction to "desc" and run the while loop again.*/
          if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            switching = true;
          }
        }
      }
    },

    searchByName() {
      let input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("searchName");
      filter = input.value.toUpperCase();
      table = document.getElementById(this.tableName);
      tr = table.getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    },

    // Add filter dropdown option
    onConfirm(filter) {
      if (this.newOption.value) {
        this.tableFilters[filter][this.newOption.value] ={
          label: this.newOption.value,
          color: this.newOption.color
        };
        this.newOption = {};
        this.isAdding = false;
      }
    },
    // Filters the table
    // Triggered by a change in a filter dropdown
    filterTable() {
      let rows, i, rowItem, shouldRemove = true;
      rows = document.getElementById("equipmentTable").rows;

      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {

        // Loop through the filters
        for (const [filter, choices] of Object.entries(this.filterValue)) {

          // If a filter has choices && the item has selected options
          rowItem = rows[i].children[filter];
          if (choices.length && rowItem) {

            // for each choice, check if the item matches it
            for (const choice of choices) {
              if (choice.label == rowItem.innerHTML) {
                shouldRemove = false;
              }
            }
          }
          rows[i].hidden = shouldRemove;
        }
      }
    }


    // End Methods
  }
};
</script>

<style>
table {
  border-spacing: 0;
  width: 100%;
  border: 1px solid #ddd;
}

th {
  cursor: pointer;
}

th, td {
  text-align: left;
  padding: 16px;
}

tr:nth-child(even) {
  background-color: #f2f2f2
}

th:not(:first-child):not(:last-child),
td:not(:first-child):not(:last-child)
{
  text-align: center;
}

th:last-child,
th:nth-last-child(2) {
  width: 20%;
}
/* .center-vert {
  align-content: center;
}
.center-horz {
  text-align: center;
}
.stat-controls .el-input-number {
  width: 70px;
} */
</style>
