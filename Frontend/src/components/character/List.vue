<template>
  <div class="container">

    <el-row :gutter="10" justify="space-between" style="margin-bottom:20px">
      <el-col :xs="24" :span="12">
        <el-input v-model="charNameFilter" @input="searchByName" id="nameFilter" placeholder="Character Name" aria-label="Character Name Filter" style="margin-bottom:5px">
          <template #prepend>
            <g-icon iconSize="20px" iconName="search" />
          </template>
          <template #append>
            <el-button type="warning" @click="clearFilter"> Reset </el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :offset="8" :span="3">
        <el-button @click="createCharacter" plain>
          <g-icon iconSize="24px" iconName="userAdd" style="margin-right: 5px;" /> New
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="characters"
      max-height="600"
      id="characterTable"
      stripe
    >
      <el-table-column prop="name" label="Name" min-width="100" sortable />
      <el-table-column prop="user.username" label="User" sortable v-if="!userID" />
      <el-table-column prop="basics.appearance.age" label="Age" sortable />
      <el-table-column prop="basics.race" label="Race" sortable />
      <el-table-column prop="classes" label="Class" min-width="90" sortable>
        <template #default="scope">
          <el-tag effect="dark">
            <span v-if="Object.keys(scope.row.classes).length == 0"> Level 0 </span>
            <span v-for="(cClass, cName, index) in scope.row.classes" :key="cName">
              {{ capFirsts(cName) }} {{ cClass.levels }}
              <span v-if="index < Object.keys(scope.row.classes).length-1"> / </span>
            </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="130" fixed="right">
        <template #default="scope">
          <el-row class="row-bg" justify="space-between">
            <el-button @click="viewCharacter(scope.row.id)" type="primary" style="margin:0" circle>
              <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
            </el-button>
            <el-button @click="editCharacter(scope.row.id)" type="primary" style="margin:0" circle>
              <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
            </el-button>
            <el-popconfirm :title="`Delete ${scope.row.name}?`">
              <template #reference>
                <el-button type="danger" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="trash" />
                </el-button>
              </template>
              <template #actions="">
                <el-button @click="deleteCharacter(scope.row.id, scope.$index)" type="danger" size="small"> Yes </el-button>
              </template>
            </el-popconfirm>
          </el-row>
         </template>
       </el-table-column>
    </el-table>

    <el-row justify="center" class="char-pager">
      <el-col :xs="19" :span="0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :background="true"
          layout="prev, pager, next, total"
          :total="totalToons"
          @current-change="loadCharacters"
          @size-change="loadCharacters"
          hide-on-single-page
        />
      </el-col>
      <el-col :xs="0"  :span="11">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 25, 50, 100]"
          :background="true"
          layout="sizes, prev, pager, next, jumper, total"
          :total="totalToons"
          @current-change="loadCharacters"
          @size-change="loadCharacters"
          hide-on-single-page
        />
      </el-col>
    </el-row>

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
      userID: this.$route.params.id, // user id

      // filters
      charNameFilter: "",

      // pagination
      currentPage: 1,
      pageSize: 10,
      totalToons: 0,

      characters: [],
    }
  },

  mounted() {
    if (!this.currentUser.roles.includes("admin")) {
      this.userID = this.currentUser.id;
    }
    this.loadCharacters();
  },

  methods: {
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },

    loadCharacters() {
      let offset = this.pageSize * (this.currentPage-1);
      CharacterService.getAllCharacters(this.userID, offset, this.pageSize)
      .then(response => {
        let tmp = JSON.parse(response.characters);
        this.totalToons = tmp.count;
        this.characters = tmp.rows;
        this.loading = false;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },
    createCharacter() {
      // this.loading = true;
      CharacterService.createCharacter()
      .then(response => {
        let id = response.character.id;
        this.$router.push({ name: 'character-edit', params: { id: id } });
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },
    viewCharacter(id) { this.$router.push({ name: 'character-view', params: { id: id } }); },
    editCharacter(id) { this.$router.push({ name: 'character-edit', params: { id: id } }); },
    deleteCharacter(id, rowIndex) {
      CharacterService.deleteCharacter(id)
      .then(response => { this.$message({ message: response, type: 'warning' }); this.characters.splice(rowIndex, 1); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },

    /***************************\
    *                           *
    *          FILTERS          *
    *                           *
    \***************************/
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
    clearFilter() { this.charNameFilter = ""; this.searchByName(""); }

  }
};
</script>
<style media="screen">
.char-pager {
  margin-top: 10px;
}
.char-pager .el-pagination button .el-icon {
  display: flex;
}
</style>
