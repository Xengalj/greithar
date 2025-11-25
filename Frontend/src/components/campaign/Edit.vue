<template lang="html">
  <div v-if="!loading" class="container">

    <el-row :gutter="10" justify="center" align="middle">
      <el-col :xs="24" :span="14">
        <el-input v-model="campaign.name" aria-label="Campaign Title">
          <template #prepend> Title </template>
        </el-input>
      </el-col>
      <el-col :xs="12" :span="3">
        <el-button @click="saveCampaign" size="large" type="primary">
          Save <g-icon iconName="rolledScroll" iconSize="24px" iconColor="#CCC" />
        </el-button>
      </el-col>
    </el-row>

    <!-- Characters -->
    <el-row :gutter="10" justify="center">
      <el-col :xs="24" :sm="12">
        <el-divider >
          <el-col :xs="24" :span="0">
            <g-icon iconSize="26px" iconName="userList" style="margin:0" /> Characters
          </el-col>
          <el-col :xs="0" :sm="24">
            <g-icon iconSize="32px" iconName="userList" /> Characters
          </el-col>
        </el-divider>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;" >
          <el-card v-for="(character, index) in campaign.characters" :key="index" style="max-width: 200px">
            <template #header>
              <el-tag :color="character.color" size="large" effect="dark" class="card-header">
                <div class="card-header">
                  <span>{{ character.name }} ({{ character.username }})</span>
                </div>
              </el-tag>
            </template>
            <el-row>
              <el-input v-model="character.alignment" disabled>
                <template #prepend>
                  Alignment
                </template>
              </el-input>
            </el-row>
            <el-row justify="space-between" align="middle">
              <el-tag type="danger" effect="dark" style="color: black">
                {{ character.health }} HP
              </el-tag>
              <el-button @click=" this.$router.push({ name: 'character-view', params: { id: character.id } }); " type="primary" style="margin:0" circle>
              <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
            </el-button>
            </el-row>
            <el-tag v-for="(cClass, cName) in character.classes" :key="cName" size="large" effect="dark" type="primary" >
              {{ capFirsts(cName) }} {{ cClass.levels }}
            </el-tag>
          </el-card>
        </div>
      </el-col>

      <!-- Notes -->
      <el-col :xs="24" :sm="12" class="center-horz">
        <el-divider >
          <h4> <g-icon iconSize="32px" iconName="openScroll" /> Notes </h4>
        </el-divider>
        <el-button @click="campaign.notes.push('')" size="large" type="primary">
          Add Note
          <g-icon iconName="createScroll" iconSize="24px" iconColor="#CCC" />
        </el-button>
        <el-row v-for="(note, index) in campaign.notes" :key="index" align="middle">
          <el-col :span="21">
            <el-input
              v-model="campaign.notes[index]"
              :autosize="{ minRows: 2, maxRows: 5 }"
              type="textarea"
              aria-label="textAreaName" />
          </el-col>
          <el-col :span="3">
            <el-popconfirm :title="`Delete Note?`">
              <template #reference>
                <el-button type="danger" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="trash" />
                </el-button>
              </template>
              <template #actions="">
                <el-button @click="campaign.notes.splice(index, 1);" type="danger" size="small"> Yes </el-button>
              </template>
            </el-popconfirm>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- Group Loot -->
    <el-row :gutter="10" justify="center" align="middle">
      <el-col :xs="24" :sm="12">
        <el-divider >
          <h4>
            <g-icon iconSize="32px" iconName="inventory" />
            Group Loot
            <el-tooltip v-if="campaign.loot_lock.username" placement="top" effect="light">
              <el-button type="warning" style="margin:0" circle>
                <g-icon iconSize="32px" iconColor="#000" iconName="lock" />
              </el-button>
              <template #content>
                <el-tag :color="campaign.loot_lock.color" size="small" effect="dark">
                  {{ campaign.loot_lock.username }}
                </el-tag>
              </template>
            </el-tooltip>
          </h4>
        </el-divider>
        <g-loot :source="campaign.loot" @edit-loot="editLoot"/>
      </el-col>

      <!-- Encounters -->
      <el-col :xs="24" :sm="12">
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
          <el-table-column prop="name" label="Name" min-width="120" sortable />
          <el-table-column prop="id" label="Id" sortable />

          <el-table-column label="Actions" width="135" fixed="right">
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

  </div>
</template>

<script>
import CampaignService from "@/services/campaign.service";
import EncounterService from "@/services/encounter.service";
import GLoot from '@/components/template/GLoot.vue';

export default {
  name: "Edit Campaign",
  components: { GLoot },
  data() {
    return {
      loading: true,
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



  methods: {
    // Helper Methods
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },

    saveCampaign() {
      CampaignService.updateCampaign(this.campaign)
      .then((response) => { this.$message({ message: `${response.campaign.name} updated`, type: 'success', }); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },

    editLoot() {
      console.log('edit');

      if (!this.campaign.loot_lock.id) {
       // this.$router.push({ name: 'character-view', params: { id: character.id } })
       console.log(this.campaign.loot_lock);

      }

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
      .then(() => { this.loadEncounters(); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err.message); });
    },
    viewEncounter(id) {
      console.log('view encounter', id);
      // this.$router.push({ name: 'campaign-view', params: { id: id } });
    },
    editEncounter(id) { this.$router.push({ name: 'encounter-edit', params: { id: id } }); },
    deleteEncounter(id, rowIndex) {
      EncounterService.deleteEncounter(id)
      .then(response => { this.$message({ message: response.message, type: 'warning' }); this.encounters.splice(rowIndex, 1); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },

  }
}
</script>

<style lang="css" scoped>
.el-row {
  margin-bottom: 5px;
}
</style>
