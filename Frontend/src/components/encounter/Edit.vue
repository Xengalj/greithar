<template lang="html">
  <div v-if="!loading" class="container">

    <el-row :gutter="10" justify="center">
      <!-- Actions -->
      <el-col :xs="24" :sm="10" :md="6" class="center-horz">
        <el-divider >
          <g-icon iconSize="32px" iconName="abilityPalm" />
        </el-divider>

        <!-- Title -->
        <el-row justify="center" align="middle">
          <el-col :span="24">
            <el-input v-model="encounter.name">
              <template #prepend> Title </template>
            </el-input>
          </el-col>
        </el-row>

        <!-- Prev / Next -->
        <el-row justify="center" align="middle">
          <el-col :span="5">
            <el-tag size="large" effect="dark" type="info"> Prev </el-tag>
          </el-col>
          <el-col :span="19">
            <el-select v-model="encounter.extras.prev" value-key="id" filterable>
              <el-option v-for="sib in siblings" :key="sib.id" :label="sib.name" :value="sib" />
            </el-select>
          </el-col>
        </el-row>

        <el-row justify="center" align="middle">
          <el-col :span="5">
            <el-tag size="large" effect="dark" type="info"> Next </el-tag>
          </el-col>
          <el-col :span="19">
            <el-select v-model="encounter.extras.next" value-key="id" filterable>
              <el-option v-for="sib in siblings" :key="sib.id" :label="sib.name" :value="sib" />
            </el-select>
          </el-col>
        </el-row>

        <!-- DM Screen, Save, Campaign -->
        <el-row justify="space-between" align="middle">
          <el-col :span="12">
            <el-button @click="this.$router.push({ name: 'dm-screen', params: { campaign: encounter.campaignId, encounter: encounter.id } });" type="primary" size="large">
              DM Screen <g-icon iconName="map" iconSize="24px" iconColor="#CCC" />
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-button @click="saveEncounter" type="primary" size="large">
              Save <g-icon iconName="rolledScroll" iconSize="24px" iconColor="#CCC" />
            </el-button>
          </el-col>
        </el-row>
        <el-row justify="center" align="middle">
          <el-col :span="24">
            <el-button @click="this.$router.push({ name: 'campaign-edit', params: { id: encounter.campaignId } });" type="primary" size="large">
              Campaign <g-icon iconName="eye" iconSize="24px" iconColor="#CCC" />
            </el-button>
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

    <el-row :gutter="10" justify="center" align="middle">
      <!-- Monsters -->
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
                <el-button @click="viewCreature(scope.row, scope.$index)" type="info" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                </el-button>
                <el-button @click="index=scope.$index;creature=scope.row; openDrawer(scope.row)" type="primary" style="margin:0" circle>
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


    <!-- MONSTER MODAL -->
    <el-auto-resizer style="height: 10px">
      <template #default="{ width }">
        <el-dialog v-model="creatureVisible" :width="width" style="margin-top: 75px" >
          <CreatureCard :source="creature" @save-creature="saveCreature(creature)" @open-drawer="openDrawer(creature)"></CreatureCard>
        </el-dialog>
      </template>
    </el-auto-resizer>

    <!-- DRAWER -->
    <el-drawer v-model="drawer" direction="rtl">
      <template #header> <h4>{{ creature.name }}</h4> </template>
      <template #default>
        <div v-if="creature.name">
          <div class="center-horz">
            <el-button @click="adminUpdate" type="primary"> Update </el-button>
            <el-button @click="adminCopy" type="primary"> Copy JSON </el-button>
          </div>
          <div v-for="(section, name) in creatureJSON" :key="name">
            <span>{{ capFirsts(name) }}</span>
            <el-input type="textarea" v-model="creatureJSON[name]" :autosize="{ minRows: 5, maxRows: 20 }" :aria-label="`Admin ${name} JSON Input`" />
          </div>
        </div>
      </template>
    </el-drawer>

  </div>
</template>

<script>
import EncounterService from "@/services/encounter.service";
import CreatureCard from '@/components/template/CreatureCard.vue'

export default {
  name: "Edit Encounter",
  components: { CreatureCard },
  computed: {
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    currentUser() { return this.$store.state.auth.user; },
  },
  data() {
    return {
      loading: true,
      encounter: {},

      monsters: [],
      NPCs: [],
      siblings: [], // other encounters within the campaign

      // MONSTER MODAL
      creatureVisible: false,
      creature: {},
      creatureJSON: {},
      index: -1,

      // DRAWER
      drawer: false,

    };
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

    /***************************\
    *                           *
    *         MONSTERS          *
    *                           *
    \***************************/
    // opens the drawer to allow AdminEdit mode
    openDrawer() {
      this.creatureJSON = {};
      for (const [key, value] of Object.entries(this.creature)) {
        this.creatureJSON[key] = JSON.stringify(value);
      }
      this.drawer = true;
    },
    viewCreature(creature, index) {
      this.drawer = false;
      this.creature = creature;
      this.index = index;
      this.creatureVisible = true;
    },
    saveCreature(creature) {
      if (creature.settings.isMonster) {
        this.encounter.monsters[this.index] = creature;
      } else if (creature.settings.isNPC) {
        this.encounter.npcs[this.index] = creature;
      }
      this.saveEncounter();
    },
    adminUpdate() {
      for (const key of Object.keys(this.creature)) {
        this.creature[key] = JSON.parse(this.creatureJSON[key]);
      }
      this.saveEncounter();
    },
    adminCopy() {
      navigator.clipboard.writeText(JSON.stringify(this.creatureJSON))
      .then(() => { this.$message({ message: `${this.capFirsts(name)} coppied to clipboard`, type: 'success', }); })
      .catch(err => { console.error('Could not copy text: ', err); });
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
.el-row {
  margin-bottom: 5px;
}
</style>
