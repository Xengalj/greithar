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
  </div>

  <table :id="id">
    <tr>
      <th v-for="item in tableCols" @click="sortTable(item)" :key="item" >
        {{ item }}
      </th>
    </tr>
    <tr v-for="(item, name) in data" :key="name">
      <td name="Name">{{ name }}</td>
      <td v-for="(prop, key) in item" :key="key" :name="key">
        {{ prop }}
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "g-table",
  props: {
    id: { type: String, required: true },
    data: { type: Object, required: true },
    filters: { type: Object },

  },
  computed: {
    tableFilters() {
      return this.filters;
    },
    tableCols() {
      let first = Object.values(this.data)[0];
      return ["Name"].concat(Object.keys(first));
    }
  },
  data() {
    return {
      filterValue: {},
      isAdding: false,  // Adding a new filter option
      newOption: {},    // The new filter option to add

      /*
      //   { value: '#E63415', label: 'red' },
      //   { value: '#FF6600', label: 'orange' },
      //   { value: '#FFDE0A', label: 'yellow' },
      //   { value: '#1EC79D', label: 'green' },
      //   { value: '#14CCCC', label: 'cyan' },
      //   { value: '#4167F0', label: 'blue' },
      //   { value: '#6222C9', label: 'purple' }
      */

    }
  },

  mounted() {},
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
}
</script>

<style lang="css" scoped>
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
</style>
