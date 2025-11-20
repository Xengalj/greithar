<template lang="html">
  <div v-if="!loading" class="container">

    <el-row :gutter="10" justify="center">
      <el-col :xs="24" :sm="6">
        <el-divider >
          <g-icon iconSize="32px" iconName="map" />
        </el-divider>
        <el-input v-model="encounter.extras.name">
          <template #prepend> Title </template>
        </el-input>
        <br>

        [next]
        <br>
        [prev]

      </el-col>

      <!-- Notes -->
      <el-col :xs="24" :sm="18" class="center-horz">
        <el-divider >
          <h4> <g-icon iconSize="32px" iconName="openScroll" /> Notes </h4>
        </el-divider>
        <el-input
          v-for="(note, index) in encounter.notes" :key="index"
          v-model="encounter.notes[index]"
          :autosize="{ minRows: 2, maxRows: 5 }"
          type="textarea"
          aria-label="textAreaName" />
        <el-button @click="encounter.notes.push('')" size="large" type="primary">
          Add Note
          <g-icon iconName="createScroll" iconSize="24px" iconColor="#CCC" />
        </el-button>
      </el-col>
    </el-row>
    <br>

    <el-row :gutter="10" justify="center" align="middle">
      <!-- Monsters -->
      <el-col :xs="24" :sm="12">
        <el-divider >
          <h4> <g-icon iconSize="32px" iconName="magical beast" /> Monsters </h4>
        </el-divider>


        <el-row v-for="(monster, index) in encounter.monsters" :key="index" :gutter="10" justify="center" align="middle">
          <el-col :xs="24" :sm="12" :md="1">
            <!-- iconSize="32px"
           -->
            <!-- <g-icon :iconName="monster.basics.type" /> -->
            <g-icon iconName="dragon" />
            monster.name
          </el-col>

          <el-col :xs="24" :sm="12" :md="6">
            <el-tag size="small" effect="dark" type="primary" color="#FFAA00">
              monster.HP.total
            </el-tag>
          </el-col>

          <el-col :xs="24" :sm="12" :md="6">
            <el-tag size="small" effect="dark" type="primary" color="#00AAFF">
              monster.ac.total
            </el-tag>
          </el-col>

          <el-col :xs="24" :sm="12" :md="6">

            <el-button @click="viewMonster(monster.id)" type="primary" style="margin:0" circle>
              <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
            </el-button>

            <el-button @click="editMonster(monster.id)" type="primary" style="margin:0" circle>
              <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
            </el-button>

            <el-popconfirm :title="`Delete ${monster.name}?`">
              <template #reference>
                <el-button type="danger" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="trash" />
                </el-button>
              </template>
              <template #actions="">
                <el-button @click="encounters.monsters.splice(index, 1)" type="danger" size="small"> Yes </el-button>
              </template>
            </el-popconfirm>

          </el-col>
        </el-row>

        list
        icon - name - hp - ac - view - edit - delete

      </el-col>

      <!-- NPCs -->
      <el-col :xs="24" :sm="12">
        <el-divider >
          <h4> <g-icon iconSize="32px" iconName="userList" /> NPCs </h4>
        </el-divider>

        list
        icon - name - hp - ac - view - edit - delete

      </el-col>
    </el-row>





    <br>
    <br>
    <div v-for="(item, name) in encounter" :key="name">
      {{ name }} : {{ item }}
      <br>
    </div>

    <!-- EDIT ITEM DIALOG -->
    <!-- <el-dialog v-model="editingItem" width="800">
      <g-item :source="item" @save-item="saveItem"/>
    </el-dialog> -->

  </div>
</template>

<script>
import EncounterService from "@/services/encounter.service";

export default {
  name: "Edit Encounter",
  data() {
    return {
      loading: true,
      itemFilter: '',

      encounter: {},
    };
  },
  computed: {
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    currentUser() { return this.$store.state.auth.user; },
  },
  mounted() {
    if (!this.rules.size) { this.$router.push("/"); }

    if ( this.currentUser.roles.includes("storyteller") ) {

      EncounterService.getEncounter(this.$route.params.id)
      .then((response) => {
        console.log(response);
        this.encounter = response.encounter;

        this.loading = false;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    }
  },

  watch: {
    // Loot Search, part 1
    itemFilter(val) { this.$refs.tree.filter(val); }
  },

  methods: {
    // Helper Methods
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },

    // saveCharacter() {
    //   CharacterService.updateCharacter(this.character)
    //   .then((response) => { this.$message({ message: `${response.character.name} updated`, type: 'success', }); })
    //   .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    // },
    viewLoot() {
      console.log('view');
    },
    editLoot() {
      console.log('edit');
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
      table = document.getElementById("encounterTable");
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
    clearFilter() { this.charNameFilter = ""; this.searchByName(""); },
    // Loot Search, part 2
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    /***************************\
    *                           *
    *         MONSTERS          *
    *                           *
    \***************************/
    viewMonster(id) {
      console.log('view monster', id);
      // this.$router.push({ name: 'encounter-view', params: { id: id } });
    },
    editMonster(id) {
      console.log('edit monster', id);
      // this.$router.push({ name: 'encounter-edit', params: { id: id } });
    },
    // deleteMonster(id, rowIndex) {
    //   console.log('deleteEncounter', id);
    //   console.log(rowIndex);
    //   // CampaignService.deleteCampaign(id)
    //   // .then(response => { this.$message({ message: response, type: 'warning' }); this.encounters.splice(rowIndex, 1); })
    //   // .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    // },


  }
}
</script>

<style lang="css" scoped>
</style>
