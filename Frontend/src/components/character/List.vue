<template>
  <div class="container">

    <el-row :gutter="10" style="margin-bottom:20px">
      <el-col :span="12">
        <el-input v-model="charNameFilter" placeholder="Character Name" id="nameFilter" aria-label="Character Name Filter" @input="searchByName" >
          <template #prepend>
            <g-icon iconSize="20px" iconName="search" />
          </template>
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="warning" @click="clearFilter">Reset name filter</el-button>
      </el-col>
      <el-col :offset="6" :span="3">
        <el-button type="success" @click="createCharacter" v-loading="loading"> New Char </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="characters" max-height="600" id="characterTable">
      <el-table-column prop="name" label="Name" width="200" sortable fixed >
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
            <span v-if="Object.keys(scope.row.classes).length == 0"> Level 0 </span>
            <span v-for="(cClass, cName, index) in scope.row.classes" :key="cName">
              {{ capFirsts(cName) }} {{ cClass.levels }}
              <span v-if="index < Object.keys(scope.row.classes).length-1">
                /
              </span>
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
            <el-popconfirm :title="`Delete ${scope.row.name}?`">
              <template #reference>
                <el-button type="danger" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="trash" />
                </el-button>
              </template>
              <template #actions="">
                <el-button type="danger" size="small" @click="deleteCharacter(scope.row.id, scope.$index)"> Yes </el-button>
              </template>
            </el-popconfirm>
          </el-row>
         </template>
       </el-table-column>
    </el-table>

    <div class="char-pager">
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
    </div>

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
      listID: this.$route.params.id, // user id

      // filters
      charNameFilter: "",

      // pagination
      currentPage: 1,
      pageSize: 10,

      characters: [],
      totalToons: 0,

      // TODO:
      debug: true,
      isAdmin: this.currentUser
    }
  },

  mounted() {
    console.log(this.currentUser);
    // if (!this.currentUser) { this.$router.push('/login'); }
    console.log(`listID: ${this.listID}`);
    this.loadCharacters();
  },

  methods: {
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },

    loadCharacters() {
      let offset = this.pageSize * (this.currentPage-1);
      CharacterService.getAllCharacters(this.listID, offset, this.pageSize)
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
        if (this.debug) {
          console.log(response);
          this.loadCharacters();
        } else {
          let id = response.character.id;
          this.$router.push({ name: 'character-edit', params: { id: id } });
        }
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },
    viewCharacter(id) {
      this.$router.push({ name: 'character-view', params: { id: id } });
    },
    editCharacter(id) {
      this.$router.push({ name: 'character-edit', params: { id: id } });
    },
    deleteCharacter(id, rowIndex) {
      CharacterService.deleteCharacter(id)
      .then(response => {
        this.$message({ message: response, type: 'warning' });
        this.characters.splice(rowIndex, 1);
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
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
    }
  }
};
</script>
<style media="screen">
.char-pager {
  display: flex;
  justify-content: center;
  margin-top: 10px;

}
.char-pager .el-pagination button .el-icon {
display: flex;
}
</style>
