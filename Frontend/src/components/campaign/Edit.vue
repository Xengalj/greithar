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

    <el-row :gutter="10" justify="center">
      <!-- Characters -->
      <el-col :xs="24" :sm="12">
        <el-collapse v-model="collapse.characters">
          <el-collapse-item name="1">
            <template #title>
              <el-divider >
                <el-col :xs="24" :span="0">
                  <g-icon iconSize="26px" iconName="userList" style="margin:0" /> Toons
                </el-col>
                <el-col :xs="0" :sm="24">
                  <g-icon iconSize="32px" iconName="userList" /> Characters
                </el-col>
              </el-divider>
            </template>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;" >
              <el-card v-for="(character, index) in campaign.characters" :key="index" style="max-width: 200px">
                <template #header>
                  <el-tag :color="character.color" size="large" effect="dark">
                    <span>{{ character.name }} ({{ character.user }})</span>
                  </el-tag>
                </template>
                <el-input v-model="character.extras.alignment" aria-label="Character AC">
                  <template #prepend> Alignment </template>
                </el-input>
                <el-input v-model="character.extras.HP" aria-label="Character Max Health">
                  <template #prepend>
                    <el-tag type="danger" effect="dark" style="color: black"> HP </el-tag>
                  </template>
                </el-input>
                <el-input v-model="character.extras.AC" aria-label="Character Total AC">
                  <template #prepend>
                    <el-tag color="#42d4f4" effect="dark"> AC </el-tag>
                  </template>
                </el-input>
                <el-input v-model="character.extras.Perception" aria-label="Character Percpeption">
                  <template #prepend> Perception </template>
                </el-input>
                <div class="classList">
                  <span v-for="cClass in character.classes" :key="cClass.name">
                    <el-tag v-if="cClass.name != 'total'" size="small" effect="dark" type="primary">
                      {{ capFirsts(cClass.name) }} {{ cClass.levels }}
                    </el-tag>
                  </span>
                </div>


                <el-button @click=" this.$router.push({ name: 'character-view', params: { id: character.id } }); " type="info" style="margin:0 10px" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                </el-button>
              </el-card>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>

      <!-- Notes -->
      <el-col :xs="24" :sm="12" class="center-horz">
        <el-collapse v-model="collapse.notes">
          <el-collapse-item name="1">
            <template #title>
              <el-divider >
                <el-col :xs="24" :span="0">
                  <g-icon iconSize="26px" iconName="openScroll" style="margin:0" /> Notes
                </el-col>
                <el-col :xs="0" :sm="24">
                  <g-icon iconSize="32px" iconName="openScroll" /> Notes
                </el-col>
              </el-divider>
            </template>

            <el-row :gutter="10" justify="center" align="middle">
              <el-button @click="campaign.notes.push('')" size="large" type="success" plain>
                Add Note
                <g-icon iconName="createScroll" iconSize="24px" iconColor="#CCC" />
              </el-button>
            </el-row>
            <el-row v-for="(note, index) in campaign.notes" :key="index" align="middle">
              <el-col :span="21">
                <el-input v-model="campaign.notes[index]" :autosize="{ minRows: 2, maxRows: 5 }" type="textarea" aria-label="textAreaName" />
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
          </el-collapse-item>
        </el-collapse>
      </el-col>

      <!-- Group Loot -->
      <el-col :xs="24" :sm="12">
        <el-collapse v-model="collapse.loot">
          <el-collapse-item name="1">
            <template #title>
              <el-divider >
                <el-col :xs="24" :span="0">
                  <g-icon iconSize="26px" iconName="inventory" style="margin:0" /> Loot
                </el-col>
                <el-col :xs="0" :sm="24">
                  <g-icon iconSize="32px" iconName="inventory" /> Group Loot
                </el-col>
              </el-divider>
            </template>

            <el-row v-if="campaign.loot_lock.id" :gutter="10" justify="center" align="middle">
              <el-tag :color="campaign.loot_lock.color" size="large" effect="dark">
                <g-icon iconSize="24px" iconName="lock" iconColor="#000" />
                Locked by {{ campaign.loot_lock.username }} until {{ new Date(campaign.loot_lock.releaseTime).getHours() }}:{{ new Date(campaign.loot_lock.releaseTime).getMinutes() }}
              </el-tag>
            </el-row>
            <g-loot :source="campaign.loot" :lock="campaign.loot_lock" @edit-loot="editLoot"/>
          </el-collapse-item>
        </el-collapse>
      </el-col>

      <!-- Encounters -->
      <el-col :xs="24" :sm="12">
        <el-collapse v-model="collapse.encounters">
          <el-collapse-item name="1">
            <template #title>
              <el-divider >
                <el-col :xs="24" :span="0">
                  <g-icon iconSize="26px" iconName="weapons" style="margin:0" /> Events
                </el-col>
                <el-col :xs="0" :sm="24">
                  <g-icon iconSize="32px" iconName="weapons" /> Encounters
                </el-col>
              </el-divider>
            </template>

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
                <el-button @click="createEncounter" type="success" plain> Add Encounter </el-button>
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

          </el-collapse-item>
        </el-collapse>
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
      encounters: [],

      collapse: {
        characters: ['1'],
        notes: ['1'],
        loot: ['1'],
        encounters: ['1']
      }
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
        console.log('campaign', response);
        this.campaign = response.campaign;
        this.getLock();
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
    *           LOOT            *
    *                           *
    \***************************/
    getLock() {
      CampaignService.getLock(this.campaign.id)
      .then((response) => { if (!response.lock.id) { this.campaign.loot_lock = {}; } })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    },
    editLoot() {
      if ( !this.campaign.loot_lock.id ||
        this.campaign.loot_lock.id == this.currentUser.id ) {
        this.$router.push({ name: 'campaign-loot', params: { id: this.campaign.id } });
      }
    },

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
      this.$router.push({ name: 'dm-screen', params: { campaign: this.campaign.id, encounter: id } });
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
.el-card .el-input {
  margin-bottom: 10px;
}
.el-row {
  margin-bottom: 10px;
}
.classList {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
}

</style>
