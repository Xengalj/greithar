<template lang="html">
  <div class="filter-row">
    <input type="text" id="searchName" placeholder="Search by name.." title="Type in a name" v-on:keyup="searchByName()" >

    <el-select
      v-for="(filter, key) in tableFilters" :key="key"
      v-model="filterValue[key]"
      value-key="label"
      multiple
      :placeholder="`Select ${key}`"
      style="width: 240px"
      v-on:change="filterTable()"
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

    <el-button @click="clearFilter">Reset</el-button>
    <el-tag v-if="displayedRows" size="large" effect="dark" type="primary">
      {{ displayedRows }} Results
    </el-tag>
  </div>

  <table :id="id" class="g-table">
    <tr>
      <th v-for="item in tableCols" @click="sortTable(item)" :key="item" >
        {{ item }}
      </th>
    </tr>
    <tr v-for="(item, name) in data" :key="name">
      <td name="Name">{{ name }}</td>
      <td v-for="(prop, key) in item" :key="key" :name="key">

        <div v-if="Array.isArray(prop)">
          <el-collapse v-if="key == 'Special' && prop[0] ">
            <el-collapse-item title="" name="1">
              <template #title> <g-icon iconName="star" /> Extras </template>
              <ul>
                <li v-for="item in prop" :key="item"> {{ item }} </li>
              </ul>
            </el-collapse-item>
          </el-collapse>

          <ul v-else>
            <li v-for="item in prop" :key="item"> {{ item }} </li>
          </ul>
        </div>

        <div v-else>
          <div>
            <span> {{ prop }} </span>
          </div>
        </div>

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
      // console.log(this.filters);
      return this.filters;
    },
    tableCols() {
      let first = Object.values(this.data)[0];
      return first ? ["Name"].concat(Object.keys(first)) : ["No Data"];
    }
  },
  data() {
    return {
      filterValue: {},
      isAdding: false,  // Adding a new filter option
      newOption: {},    // The new filter option to add
      displayedRows: 0,

      colors: [
        { value: '#E63415', label: 'Red' },
        { value: '#FF6600', label: 'Orange' },
        { value: '#FFDE0A', label: 'Yellow' },

        { value: '#3cb44b', label: 'Green' },
        { value: '#4167F0', label: 'Blue' },
        { value: '#911eb4', label: 'Purple' },

        { value: '#800000', label: 'Maroon' },
        { value: '#bfef45', label: 'Lime' },
        { value: '#1EC79D', label: 'Teal' },

        { value: '#42d4f4', label: 'Cyan' },
        { value: '#000075', label: 'Navy' },
        { value: '#f032e6', label: 'Magenta' },

        { value: '#ffd8b1', label: 'Apricot' },
        { value: '#aaffc3', label: 'Mint' },
        { value: '#dcbeff', label: 'Lavender' }
      ]

    }
  },

  // beforeUpdate() {
  //   // this.filterValue = {};
  //   // console.log(this.data);
  // },
  // mounted() {},
  methods: {
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
      this.displayedRows = 0;
      let rows, i, cell, shouldRemove = true;
      rows = document.getElementById("equipmentTable").rows;

      // Loop through all table rows
      // (except the first, which contains table headers):
      for (i = 1; i < (rows.length); i++) {
// console.log(`***** ${rows[i].children[0].innerHTML}`);

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
      for (let i = 1; i < (rows.length); i++) {
        rows[i].hidden = false;
      }
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
th:last-child, th:nth-last-child(2) { width: 20%; }

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
