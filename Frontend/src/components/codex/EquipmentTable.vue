<template lang="html">

  <el-row
    :gutter="10"
    justify="center"
    align="middle"
    class="center-horz"
  >
    <!-- SEARCH -->
    <el-col :xs="24" :sm="18" :md="12" style="margin-bottom:10px">
      <el-input v-model="nameSearch" @input="searchByName" aria-label="Item Name">
        <template #prepend> <g-icon iconSize="20px" iconName="search" /> Search </template>
      </el-input>
    </el-col>

    <!-- FILTERS -->
    <el-col :xs="24" :sm="18" :md="18" style="margin-bottom:10px">
      <el-select
        v-for="(filter, key) in tableFilters" :key="key"
        v-model="filterValue[key]"
        :placeholder="`Select ${key}`"
        v-on:change="filterTable()"
        value-key="label"
        multiple
        style="width: 240px"
      >
        <template #tag>
          <el-tag v-for="(item, name) in filterValue[key]" effect="dark" :color="item.color" :key="name" >
            {{ item.label }}
          </el-tag>
        </template>
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
      </el-select>
    </el-col>

    <el-col :xs="24" :sm="12" :md="6" style="margin-bottom:10px">
      <div style="display:flex; justify-content: space-evenly;">
        <el-button @click="clearFilter" type="warning">Reset</el-button>
        <el-tag size="large" effect="dark" type="info" v-if="displayedRows"> <span style="font-size:14px"> {{ displayedRows }} Results </span> </el-tag>
        <el-button @click="randomItem" type="primary"> Random Item </el-button>
      </div>
    </el-col>
  </el-row>


  <table v-loading="loading" :id="id" class="g-table">
    <tr>
      <th v-for="item in tableCols" :key="item" @click="sortTable(item)">
        {{ item }}
      </th>
    </tr>

    <tr v-for="(item, name) in data" :key="name">
      <td name="Name">{{ name }}</td>

      <td v-for="(prop, key) in item" :key="key" :name="key">

        <div v-if="key == 'Damage'">
          <div>Small: {{ prop.small }}</div>
          <div>Medium: {{ prop.medium }}</div>
          <el-collapse>
            <el-collapse-item name="damages">
              <template #title> <g-icon iconName="weapons" /> Sizes </template>
              <div v-for="(dmg, name) in prop" :key="name"> {{ name }} : {{ dmg }} </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div v-else-if="key == 'Range' && prop > 0">
          <el-tooltip placement="top" effect="light">
            {{ prop }} ft
            <template #content>
              Range Increment
            </template>
          </el-tooltip>
        </div>

        <div v-else-if="Array.isArray(prop)">
          <el-tag v-for="item in prop" :key="item" effect="dark" > {{ item }} </el-tag>
        </div>
        <div v-else-if="key == 'Cost'">
          <el-tag color="#FFDE0A" style="color:black; border:none;">
            {{ prop }} gp
          </el-tag>
        </div>
        <div v-else-if="key == 'Weight'">
          <el-tag type="info" effect="dark">
            {{ prop }} lbs
          </el-tag>
        </div>

        <el-collapse v-else-if="key == 'Extras'">
          <el-collapse-item v-for="(extra, name) in prop" :key="name" :name="name">
            <template #title> <g-icon iconName="star" /> {{ name }} </template>
            <ul v-if="Array.isArray(extra)">
              <li v-for="item in extra" :key="item"> {{ item }} </li>
            </ul>
          </el-collapse-item>
        </el-collapse>

        <div v-else> {{ prop }} </div>

      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "equipment-table",
  props: {
    id: { type: String, required: true },
    data: { type: Object, required: true },
    filters: { type: Object },

  },
  computed: {
    tableFilters() {
      console.log('filters', this.filters);
      return this.filters;
    },
    tableCols() {
      let first = Object.values(this.data)[0];
      return first ? ["Name"].concat(Object.keys(first)) : ["No Data"];
    }
  },
  data() {
    return {
      loading: false,
      filterValue: {},
      displayedRows: 0,
      nameSearch: "",
      isAdding: false,  // Adding a new filter option
      newOption: {},    // The new filter option to add

    }
  },
  // mounted() {
  //   this.$message({ message: "Resting for 8 hours", type: "success" });
  //
  // },
  methods: {
    searchByName() {
      let filter, table, tr, td, i, txtValue;
      filter = this.nameSearch.toUpperCase();
      table = document.getElementById(this.id);
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



    sortTable(sortStr) {
      this.loading = true;
      // this.$loading({text:'Loading'});

      console.log(sortStr);
      this.switchRows(sortStr);
    },

    switchRows(sortStr) {
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
      this.loaded = false;
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

    /*
      Called by : filter dropdown updating
      loops through all rows and hides the row if it doesn't match a filter option selected
    */
    filterTable() {
      this.displayedRows = 0;
      let rows, i, cell, shouldRemove = true;
      rows = document.getElementById("equipmentTable").rows;

      // Loop through all table rows
      // (except the first, which contains table headers):
      for (i = 1; i < (rows.length); i++) {

        // Loop through each filter
        for (const [filter, choices] of Object.entries(this.filterValue)) {
          cell = rows[i].children[filter] ? rows[i].children[filter].children[0].children[0] : false;

          // If a filter has choices selected
          // && the row has selected columns (group, proficiency, cost)
          if (choices.length && cell) {

            // Loop through selected choices
            // And loop through the items in the cell
            for (const choice of choices) {
              for (const child of cell.children) {

                if (choice.label == child.innerHTML) {
                  shouldRemove = false;
                  this.displayedRows = this.displayedRows + 1;
                }
              }
            }
            rows[i].hidden = shouldRemove;
            shouldRemove = true;
          }
        } // End loop of filter
      }
    },

    clearFilter() {
      this.filterValue = {};
      let rows = document.getElementById("equipmentTable").rows;
      this.displayedRows = rows.length;
      for (let i = 1; i < (rows.length); i++) {
        rows[i].hidden = false;
      }
    },

    // Scrolls to random item of filtered / displayed items
    randomItem() {
      let rows = document.getElementById("equipmentTable").rows;
      let valid = [];
      for (let i = 1; i < (rows.length); i++) {
        if (!rows[i].hidden) {
          valid.push(rows[i]);
        }
      }
      let rand = Math.floor(Math.random() * (valid.length ? valid.length-1 : rows.length-1));
      valid[rand].scrollIntoView();
    }

    // End Methods
  }
}
</script>

<style lang="css" scoped>
/* Layout */
.filter-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
}
.filter-row > * {
  margin: 0 5px;
  border-radius: var(--el-border-radius-base);
  border: 1px solid #DCDFE6;
  color: #DCDFE6;
}
table {
  border-spacing: 0;
  width: 100%;
  border: 1px solid #ddd;
}
th { cursor: pointer; }
th, td { padding: 16px; }
th:last-child, th:nth-last-child(2) { min-width: 20%; }

th:nth-child(n+2):nth-last-child(n+3),
td:nth-child(n+2):nth-last-child(n+3) {
  text-align: center;
}

/* Colors */
.dark .filter-row :nth-child(n+1):not(span) {
  background-color: var(--color-surface-300);
  color: #CCC;
}
tr:nth-child(even) {
  background-color: #f2f2f2
}
.g-table tr:nth-child(n+2):hover {
  border: 2px solid var(--color-secondary-100);
}
.dark .g-table tr:nth-child(n+2):hover {
  border: 2px solid var(--color-primary-100);
}
.dark tr:nth-child(odd) {
  background-color: var(--color-surface-200);
}
.dark tr:nth-child(even) {
  background-color: var(--color-surface-500);
}
.dark .g-table {
  color: #EEE;
}

</style>
