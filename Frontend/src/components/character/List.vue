<template>
  <div class="container">

    <el-row :gutter="10" style="margin-bottom:20px">
      <el-col :span="12">
        <el-input v-model="charNameFilter" placeholder="Character Name" aria-label="Character Name Filter" @input="searchByName" >
          <template #prepend>
            <g-icon iconSize="20px" iconName="search" />
          </template>
        </el-input>
      </el-col>

      <el-col :span="4">
        <el-button type="success" @click="createCharacter" v-loading="loading"> New Char </el-button>
      </el-col>

      <el-col :span="4">
        <el-switch v-model="advanced" inline-prompt active-text=" Advanced " inactive-text=" Normal " aria-label="Advanced Mode Switch" />
      </el-col>

      <el-button type="warning" @click="clearFilter">reset all filters</el-button>

    </el-row>


    <el-table v-loading="loading" :data="characters" style="width: 100%" max-height="800" id="characterTable">
      <el-table-column prop="id" label="ID" width="40" v-if="advanced" fixed />
      <el-table-column label="Name" width="200" sortable fixed >
        <template #default="scope">
          <el-tag effect="dark"> {{ scope.row.name }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="user.username" label="User" width="120" sortable v-if="!listID" />
      <el-table-column prop="basics.appearance.age" label="Age" width="80" sortable />
      <el-table-column prop="basics.race" label="Race" sortable />
      <el-table-column prop="classes" label="Class" sortable>
        <template #default="scope">
          <el-tag effect="dark">
            Level
            <span v-for="(cClass, cName) in scope.row.classes" :key="cName">
              {{ cClass.levels }} {{ cName }}
            </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="150">
        <template #default="scope">
          <el-row class="row-bg" justify="space-between">
            <el-button type="primary" circle @click="viewCharacter(scope.row.id)">
              <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
            </el-button>
            <el-button type="primary" circle @click="editCharacter(scope.row.id)">
              <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
            </el-button>
            <el-popconfirm title="Are you sure to delete this?">
              <template #reference>
                <el-button type="danger" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="trash" />
                </el-button>
              </template>
              <template #actions="">
                <el-button type="danger" size="small" @click="deleteCharacter(scope.row.id)"> Yes </el-button>
              </template>
            </el-popconfirm>
          </el-row>
         </template>
       </el-table-column>
    </el-table>

<!--
    <div class="demo-pagination-block">
        <div class="demonstration">All combined</div>
        <el-pagination
          v-model:current-page="currentPage4"
          v-model:page-size="pageSize4"
          :page-sizes="[100, 200, 300, 400]"
          :size="size"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    -->

  </div>
</template>

<script>
import CharacterService from "@/services/character.service";

export default {
  name: "List Characters",
  computed: {
    currentUser() { return this.$store.state.auth.user; }
  },
  data() {
    return {
      loading: true,
      advanced: false,
      listID: this.$route.params.id,

      // filters
      charNameFilter: "",

      characters: [],
    }
  },

  mounted() {
    // if (!this.currentUser) { this.$router.push('/login'); }
    console.log(`listID: ${this.listID}`);

    CharacterService.getAllCharacters(this.listID).then(response => {
      this.characters = JSON.parse(response.characters);
console.log(this.characters);
      this.loading = false;
    })
    .catch(err => { console.error(err); });
  },

  methods: {
    createCharacter() {
      this.loading = true;
      CharacterService.createCharacter()
      .then(response => {
        console.log(response);
        let id = response.character.id;
        this.$router.push({ name: 'character-edit', params: { id: id } });
      })
      .catch(err => { console.error(err); });
    },
    viewCharacter(id) {
      console.log(id);
      this.$router.push({ name: 'character-view', params: { id: id } });
    },
    editCharacter(id) {
      console.log(id);
      this.$router.push({ name: 'character-edit', params: { id: id } });
    },
    deleteCharacter(id) {
      console.log(id);
    },

    /***************************\
    *                           *
    *          FILTERS          *
    *                           *
    \***************************/
    clearFilter() {
      this.charNameFilter = "";
      this.searchByName("");
    },

    // HIDES non-matching rows (display: none)
    searchByName(filter) {
      let table, tr, td, i, txtValue;
      filter = filter.toUpperCase();
      table = document.getElementById("characterTable");
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
    usernameFilter() {
      console.log('update :)');
      // const filterHandler = (
      //   value: string,
      //   row: User,
      //   column: TableColumnCtx<User>
      // ) => {
      //   const property = column['property']
      //   return row[property] === value
      // }

    }

  }
};
</script>
