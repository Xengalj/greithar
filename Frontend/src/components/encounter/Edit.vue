<template lang="html">
  <div v-if="!loading" class="container">

    <el-row :gutter="10" justify="center">
      <el-col :xs="24" :sm="10" :md="6" class="center-horz">
        <el-divider >
          <g-icon iconSize="32px" iconName="map" />
        </el-divider>

        <!-- Actions -->
        <el-button @click=" console.log(`this.$router.push({ name: 'dm-screen', params: { id: character.id } });`); " type="primary" size="large">
          View <g-icon iconName="eye" iconSize="24px" iconColor="#CCC" />
        </el-button>
        <el-button @click="saveEncounter" type="primary" size="large">
          Save <g-icon iconName="rolledScroll" iconSize="24px" iconColor="#CCC" />
        </el-button>

        <!-- Title -->
        <el-input v-model="encounter.name">
          <template #prepend> Title </template>
        </el-input>
        <br>

        <!-- Prev / Next -->
        <el-row>
          <el-col :span="5">
            <el-tag size="large" effect="dark" type="info"> Prev </el-tag>
          </el-col>
          <el-col :span="19">
            <el-select v-model="encounter.extras.prev" value-key="id" filterable>
              <el-option v-for="sib in siblings" :key="sib.id" :label="sib.name" :value="sib" />
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">
            <el-tag size="large" effect="dark" type="info"> Next </el-tag>
          </el-col>
          <el-col :span="19">
            <el-select v-model="encounter.extras.next" value-key="id" filterable>
              <el-option v-for="sib in siblings" :key="sib.id" :label="sib.name" :value="sib" />
            </el-select>
          </el-col>
        </el-row>
      </el-col>

      <!-- Notes -->
      <el-col :xs="24" :sm="14" :md="18" class="center-horz">
        <el-divider >
          <el-col :xs="24" :span="0">
            <g-icon iconName="openScroll" iconSize="26px" style="margin:0" /> Notes
          </el-col>
          <el-col :xs="0" :sm="24">
            <g-icon iconName="openScroll" iconSize="32px" /> Notes
          </el-col>
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

    <!-- Monsters -->
    <el-row :gutter="10" justify="center" align="middle">
      <el-col :xs="24" :sm="12">
        <el-divider >
          <el-col :xs="24" :span="0">
            <g-icon iconName="magical beast" iconSize="26px" style="margin:0" /> Monsters
          </el-col>
          <el-col :xs="0" :sm="24">
            <g-icon iconName="magical beast" iconSize="32px" /> Monsters
          </el-col>
        </el-divider>
        <el-table v-loading="loading" :data="this.encounter.monsters" stripe >
          <el-table-column label="Type" min-width="55">
            <template #default="scope">
              <g-icon :iconName="scope.row.type" iconSize="24px" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Name" min-width="120" sortable />
          <el-table-column prop="alignment" label="Align" min-width="90" sortable />
          <el-table-column prop="hp" label="HP" min-width="70" sortable />

          <el-table-column label="Actions" width="135" fixed="right">
            <template #default="scope">
              <el-row class="row-bg" justify="space-between">
                <el-button @click="viewMonster(scope.row.id)" type="info" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                </el-button>
                <el-button @click="editMonster(scope.row.id)" type="primary" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
                </el-button>
                <el-popconfirm :title="`Delete Monster?`">
                  <template #reference>
                    <el-button type="danger" style="margin:0" circle>
                      <g-icon iconSize="24px" iconColor="#000" iconName="trash" />
                    </el-button>
                  </template>
                  <template #actions="">
                    <el-button @click="deleteMonster(scope.$index)" type="danger" size="small"> Yes </el-button>
                  </template>
                </el-popconfirm>
              </el-row>
             </template>
           </el-table-column>
        </el-table>
      </el-col>

      <!-- NPCs -->
      <el-col :xs="24" :sm="12">
        <el-divider >
          <el-col :xs="24" :span="0">
            <g-icon iconName="userList" iconSize="26px" style="margin:0" /> NPCs
          </el-col>
          <el-col :xs="0" :sm="24">
            <g-icon iconName="userList" iconSize="32px" /> NPCs
          </el-col>
        </el-divider>

        <el-table v-loading="loading" :data="this.encounter.npcs" stripe >
          <el-table-column label="Type" min-width="55">
            <template #default="scope">
              <g-icon :iconName="scope.row.type" iconSize="24px" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Name" min-width="120" sortable />
          <el-table-column prop="alignment" label="Align" min-width="90" sortable />
          <el-table-column prop="hp" label="HP" min-width="70" sortable />

          <el-table-column label="Actions" width="135" fixed="right">
            <template #default="scope">
              <el-row class="row-bg" justify="space-between">
                <el-button @click="viewNPC(scope.row.id)" type="info" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                </el-button>
                <el-button @click="editNPC(scope.row.id)" type="primary" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
                </el-button>
                <el-popconfirm :title="`Delete NPC?`">
                  <template #reference>
                    <el-button type="danger" style="margin:0" circle>
                      <g-icon iconSize="24px" iconColor="#000" iconName="trash" />
                    </el-button>
                  </template>
                  <template #actions="">
                    <el-button @click="deleteNPC(scope.$index)" type="danger" size="small"> Yes </el-button>
                  </template>
                </el-popconfirm>
              </el-row>
             </template>
           </el-table-column>
        </el-table>
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
      monsters: [],
      NPCs: [],

      siblings: [], // other encounters within the campaign
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

        EncounterService.getEncounterList(this.encounter.campaignId, 0, 100)
        .then((response) =>{
          for (let encounter of response.encounters.rows) {
            this.siblings.push({ 'id': encounter.id, 'name': encounter.name });
          }
        })
        .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
        this.loading = false;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })



    }
  },
  methods: {
    // Helper Methods
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },



    saveEncounter() {
      EncounterService.updateEncounter(this.encounter)
      .then((response) => { this.$message({ message: `${response.encounter.name} updated`, type: 'success', }); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },

    viewEncounter() {
      console.log('load into DM Screen');
      // EncounterService.updateEncounter(this.campaign)
      // .then((response) => { this.$message({ message: `${response.campaign.name} updated`, type: 'success', }); })
      // .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
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
    deleteMonster(rowIndex) {
      this.encounter.monsters.splice(rowIndex, 1);
      this.saveEncounter();
    },

    /***************************\
    *                           *
    *            NPCs           *
    *                           *
    \***************************/
    viewNPC(id) {
      console.log('view npc', id);
      // this.$router.push({ name: 'encounter-view', params: { id: id } });
    },
    editNPC(id) {
      console.log('edit npc', id);
      // this.$router.push({ name: 'encounter-edit', params: { id: id } });
    },
    deleteNPC(rowIndex) {
      this.encounter.npcs.splice(rowIndex, 1);
      this.saveEncounter();
    },


  }
}
</script>

<style lang="css" scoped>
</style>
