<template lang="html">
  <div v-if="!loading" class="container">

    <el-row :gutter="10" justify="center">
      <el-col :xs="24" :sm="12">
        <el-divider >
          <g-icon iconSize="32px" iconName="map" />
        </el-divider>
        <el-input v-model="campaign.name" aria-label="Campaign Title">
          <template #prepend> Title </template>
        </el-input>
        <br>


        <!-- Characters -->
        [Characters]
        [toon.name] ^[user]   // both in fave color

      </el-col>

      <!-- Notes -->
      <el-col :xs="24" :sm="12" class="center-horz">
        <el-divider >
          <h4> <g-icon iconSize="32px" iconName="openScroll" /> Notes </h4>
        </el-divider>
        <el-input
          v-for="(note, index) in campaign.notes" :key="index"
          v-model="campaign.notes[index]"
          :autosize="{ minRows: 2, maxRows: 5 }"
          type="textarea"
          aria-label="textAreaName" />
        <el-button @click="campaign.notes.push('')" size="large" type="primary">
          Add Note
          <g-icon iconName="createScroll" iconSize="24px" iconColor="#CCC" />
        </el-button>
      </el-col>
    </el-row>
    <br>

    <el-row :gutter="10" justify="center" align="middle">
      <!-- Group Loot -->
      <el-col :xs="24" :sm="12">
        <el-divider >
          <h4> <g-icon iconSize="32px" iconName="inventory" /> Group Loot </h4>
        </el-divider>

        <el-row :gutter="10" justify="space-between">
          <el-col :xs="24" :sm="20">
            <el-input v-model="itemFilter" class="w-60 mb-2" placeholder="Item Search" aria-label="Item Search">
              <template #prefix>
                <g-icon iconSize="20px" iconName="search" />
              </template>
              <template #append>
                <el-button type="warning" @click="clearFilter"> Reset </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="4">
            <el-button @click="viewLoot()" type="primary" style="margin:0" circle>
              <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
            </el-button>
            <el-button @click="editLoot()" type="primary" style="margin:0" circle>
              <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
            </el-button>
          </el-col>
        </el-row>


        <!--
        draggable
        render-after-expand
        :default-expanded-keys="character.settings.expandInventory"
        :allow-drag="allowDrag"
        :allow-drop="allowDrop"
        -->
        <el-tree
          :data="campaign.loot"
          ref="tree"
          node-key="label"
          :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <el-col :span="2" style="text-align: center; margin-right:2px;">
              <g-icon iconSize="20px" v-if="data.extras && data.extras.icon" :iconName="data.extras.icon" />
              <span v-else> • </span>
            </el-col>
            <el-col :sm="9" :md="7">
              {{ node.label }}
            </el-col>
            <el-col :sm="3" :md="3">
              <el-tag v-if="data.value" color="#FFDE0A" style="color:black; border:none;">
                {{ data.value.Cost }} gp
              </el-tag>
            </el-col>
            <el-col :sm="2" :md="3">
              <el-tag v-if="data.value" type="info" effect="dark">
                {{ data.value.Weight }} lbs.
              </el-tag>
            </el-col>
            <el-col :sm="5" :md="3">
              <el-tag v-if="data.value" type="info" effect="dark">
                x 1
              </el-tag>
              <el-tag v-if="data.value && data.value.Ammount" type="info" effect="dark">
                x {{ data.value.Ammount }}
              </el-tag>
            </el-col>
          </template>
        </el-tree>
      </el-col>

      <el-col :xs="24" :sm="12">
        <!-- Encounters -->
        <el-divider>
          <h4> <g-icon iconSize="32px" iconName="weapons" /> Encounters </h4>
        </el-divider>

        <el-row :gutter="10" justify="space-between">
          <el-col :xs="24" :span="14">
            <el-input v-model="encounterFilter" @input="searchByName" id="nameFilter" placeholder="Encounter Name" aria-label="Encounter Name Filter">
              <template #prefix>
                <g-icon iconSize="20px" iconName="search" />
              </template>
              <template #append>
                <el-button type="warning" @click="clearFilter"> Reset </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button @click="createEncounter" plain>
              Add Encounter
            </el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="encounters"
          max-height="600"
          id="encounterTable"
          stripe
        >
          <el-table-column prop="id" label="Id" sortable />
          <!-- <el-table-column prop="extras.name" label="Name" min-width="100" sortable>
            <template #default="scope">
              {{ scope }}
            </template>
          </el-table-column> -->

          <el-table-column label="Actions" width="100" fixed="right">
            <template #default="scope">
              <el-row class="row-bg" justify="space-between">

                <el-button @click="viewEncounter(scope.row.id)" type="info" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                </el-button>

                <el-button @click="editEncounter(scope.row.id)" type="primary" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
                </el-button>

                <el-popconfirm :title="`Delete Encounter?`">
                  <template #reference>
                    <el-button type="danger" style="margin:0" circle>
                      <g-icon iconSize="24px" iconColor="#000" iconName="trash" />
                    </el-button>
                  </template>
                  <template #actions="">
                    <el-button @click="deleteEncounter(scope.row.id, scope.$index)" type="danger" size="small"> Yes </el-button>
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
              :total="totalEncounters"
              @current-change="loadEncounters"
              @size-change="loadEncounters"
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
              :total="totalEncounters"
              @current-change="loadEncounters"
              @size-change="loadEncounters"
              hide-on-single-page
            />
          </el-col>
        </el-row>






      </el-col>

    </el-row>


    <br>
    <br>
    <div v-for="(item, name) in campaign" :key="name">
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
import CampaignService from "@/services/campaign.service";
import EncounterService from "@/services/encounter.service";

export default {
  name: "Edit Campaign",
  data() {
    return {
      loading: true,
      itemFilter: '',
      encounterFilter: '',

      // pagination
      currentPage: 1,
      pageSize: 10,
      totalEncounters: 0,

      campaign: {},
      encounters: []
    };
  },
  computed: {
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    currentUser() { return this.$store.state.auth.user; },
  },
  mounted() {
    if (!this.rules.size) { this.$router.push("/"); }
    if ( this.currentUser.roles.includes("storyteller") ) {
      CampaignService.getCampaign(this.$route.params.id)
      .then((response) => {
        console.log(response);
        this.campaign = response.campaign;
        this.loadEncounters();
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
    // Loot Search, part 2
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // filters encounter table
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
    clearFilter() { this.encounterFilter = ""; this.searchByName(""); },

    /***************************\
    *                           *
    *         ENCOUNTERS        *
    *                           *
    \***************************/
    loadEncounters() {
      let offset = this.pageSize * (this.currentPage-1);
      EncounterService.getEncounterList(this.campaign.id, offset, this.pageSize)
      .then(response => {
        let tmp = response.encounters;
        this.totalEncounters = tmp.count;
        this.encounters = tmp.rows;
        this.loading = false;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },
    createEncounter() {
      EncounterService.createEncounter(this.campaign.id)
      .then(response => {
        console.log(response);
        // let id = response.encounter.id;
        // this.$router.push({ name: 'encounter-edit', params: { id: id } });
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err.message); });
    },
    viewEncounter(id) {
      console.log('view encounter', id);
      // this.$router.push({ name: 'campaign-view', params: { id: id } });
    },
    editEncounter(id) { this.$router.push({ name: 'encounter-edit', params: { id: id } }); },
    deleteEncounter(id, rowIndex) {
      console.log('deleteEncounter', id);
      console.log(rowIndex);
      // CampaignService.deleteEncounter(id)
      // .then(response => { this.$message({ message: response, type: 'warning' }); this.campaigns.splice(rowIndex, 1); })
      // .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },

  }
}
</script>

<style lang="css" scoped>
</style>
