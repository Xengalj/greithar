<template>
  <div class="container">

    <!-- PARTY -->
    <el-row justify="space-around">
      <el-card v-for="(character, index) in campaign.characters" :key="index" style="max-width: 200px">
        <template #header>
          <div class="card-header">
            <el-tag :color="character.color" size="large" effect="dark">
              <span>{{ character.name }} ({{ character.user }})</span>
            </el-tag>
          </div>
        </template>

        <el-input v-model="campaign.extras.playerNotes[character.id].alignment" aria-label="Character AC">
          <template #prepend> Alignment </template>
        </el-input>
        <el-input v-model="campaign.extras.playerNotes[character.id].HP" aria-label="Character Max Health">
          <template #prepend>
            <el-tag type="danger" effect="dark" style="color: black"> HP </el-tag>
          </template>
        </el-input>
        <el-input v-model="campaign.extras.playerNotes[character.id].AC" aria-label="Character Total AC">
          <template #prepend>
            <el-tag color="#42d4f4" effect="dark" style="color: black"> AC </el-tag>
          </template>
        </el-input>
        <el-input v-model="campaign.extras.playerNotes[character.id].perception" aria-label="Character Percpeption">
          <template #prepend> Perception </template>
        </el-input>
        <el-button @click=" this.$router.push({ name: 'character-view', params: { id: character.id } }); " type="info" style="margin:0 10px" circle>
          <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
        </el-button>
        <el-tag v-for="cClass in character.classes" :key="cClass.name" size="large" effect="dark" type="primary" >
          {{ capFirsts(cClass.name) }} {{ cClass.levels }}
        </el-tag>
      </el-card>
    </el-row>

    <!-- Weather & Encounter -->
    <el-card>
      <el-row :gutter="10" justify="center" align="middle" class="campaignExtras">
        <el-col :xs="24" :sm="12" :md="6">
          <el-input v-if="campaign.extras" v-model="campaign.extras.time" aria-label="campaignTime">
            <template #prepend> Current Time </template>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-input v-if="campaign.extras" v-model="campaign.extras.weather" aria-label="campaignWeather">
            <template #prepend> Weather </template>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-input type="textarea" v-if="campaign.extras" v-model="campaign.extras.weatherNotes" :autosize="{ minRows: 1, maxRows: 4 }" placeholder="Weather notes..." aria-label="campaignWeatherNotes" />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" class="center-horz">
          <el-button @click="saveCampaign" size="large" type="primary">
            Save <g-icon iconName="rolledScroll" iconSize="24px" iconColor="#CCC" />
          </el-button>
          <el-button @click="drawer = true" size="large" type="primary" >
            Open Drawer
          </el-button>
        </el-col>
      </el-row>

      <el-row :gutter="10" justify="center">
        <el-tag size="large" effect="dark" type="info">
          <h3>
            Random Name Generator
          </h3>
        </el-tag>
      </el-row>

      <el-row :gutter="10" align="middle">
        <el-col :xs="12" :sm="8" :md="4">
          Race
          <el-select v-model="tempName.race" size="large" placeholder="Choose Race">
            <el-option v-for="(race, name) in races" :key="name" :label="name" :value="name" />
          </el-select>
        </el-col>

        <el-col :xs="12" :sm="8" :md="4">
          <div v-if="tempName.race">
            Gender (♀, ♂, ⚨)
            <el-select v-model="tempName.gender" size="large" placeholder="Choose Gender">
              <el-option v-if="races[tempName.race].female" key="female" label="♀ female" value="female" />
              <el-option v-if="races[tempName.race].male" key="male" label="♂ male" value="male" />
              <el-option v-if="races[tempName.race].agender" key="agender" label="⚨ agender" value="agender" />
            </el-select>
          </div>
        </el-col>

        <el-col :xs="24" :sm="8" :md="4">
          <div v-if="tempName.gender" class="center-horz">
            <br>
            <el-button type="primary" @click="genRandomName()"> Random Name! </el-button>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" class="center-horz">
          <br>
          <el-tag v-if="tempName.fName" size="large" effect="plain" type="success" style="font-size: 16px;">
            {{ tempName.fName }} {{ tempName.surname }}
          </el-tag>
        </el-col>
      </el-row>
    </el-card>


    <el-card v-if="encounter">
      <el-input
        v-for="(note, index) in encounter.notes" :key="index"
        v-model="encounter.notes[index]"
        :autosize="{ minRows: 2, maxRows: 5 }"
        type="textarea"
        aria-label="textAreaName" />
        <div class="center-horz">
          <el-button @click="encounter.notes.push('')" size="large" type="primary">
            Add Note
            <g-icon iconName="createScroll" iconSize="24px" iconColor="#CCC" />
          </el-button>
        </div>
    </el-card>


    <!-- MONSTER MODAL -->
    <el-auto-resizer style="height: 10px">
      <template #default="{ width }">
        <el-dialog v-model="creatureVisible" :width="width" style="margin-top: 75px" >
          <CreatureCard :source="creature" @save-creature="saveCreature(creature)" @open-drawer="openDrawer"></CreatureCard>
        </el-dialog>
      </template>
    </el-auto-resizer>

    <!-- DRAWER -->
    <el-drawer v-model="drawer" direction="rtl">
      <template #header> <h4>{{ encounter.name }}</h4> </template>
      <template #default>
        <div v-if="!encounter.name">
          <el-select v-model="campaign" @change="loadEncounters" filterable placeholder="Choose a Campaign" aria-label="Select Campaign">
            <el-option v-for="campaign in campaigns" :key="campaign.id" :label="campaign.name" :value="campaign" >
              {{ campaign.user.username }}'s {{ campaign.name }}
            </el-option>
          </el-select>
          <el-select v-model="encounter" filterable placeholder="Choose an Encounter" aria-label="Select Encounter">
            <el-option v-for="encounter in encounters" :key="encounter.id" :label="encounter.name" :value="encounter" />
          </el-select>
        </div>

        <div v-else>
          <div class="center-horz">
            <el-button @click="$router.push({ name: 'encounter-edit', params: { id: encounter.id } })" type="primary">
              <g-icon iconName="quill" iconSize="24px" iconColor="#CCC" /> Edit
            </el-button>
          </div>

          <el-collapse v-model="encounterCollapse">
            <!-- Encounter Notes -->
            <el-collapse-item name="1">
              <template #title>
                <el-divider style="max-width:75%"> <g-icon iconSize="20px" iconName="openScroll" /> Notes </el-divider>
              </template>
              <el-input
                v-for="(note, index) in encounter.notes" :key="index"
                v-model="encounter.notes[index]"
                :autosize="{ minRows: 2, maxRows: 5 }"
                type="textarea"
                aria-label="textAreaName" />
                <div class="center-horz">
                  <el-button @click="encounter.notes.push('')" size="large" type="primary">
                    Add Note
                    <g-icon iconName="createScroll" iconSize="24px" iconColor="#CCC" />
                  </el-button>
                </div>
            </el-collapse-item>

            <!-- Encounter NPCs -->
            <el-collapse-item name="2">
              <template #title>
                <el-divider style="max-width:75%"> <g-icon iconSize="20px" iconName="userList" /> NPCs </el-divider>
              </template>
              <el-table :data="this.encounter.npcs" stripe >
                <el-table-column label="Type" min-width="55">
                  <template #default="scope">
                    <g-icon :iconName="scope.row.type" iconSize="24px" />
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="Name" min-width="120" sortable />
                <el-table-column prop="alignment" label="Align" min-width="90" sortable />
                <el-table-column prop="hp" label="HP" sortable />
                <el-table-column label="Actions" fixed="right">
                  <template #default="scope">
                    <el-row class="row-bg" justify="space-between">
                      <el-button @click="loadCharacter(scope.row.id, scope.$index)" type="info" style="margin:0" circle>
                        <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                      </el-button>
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>

            <!-- Encounter Monsters -->
            <el-collapse-item name="3">
              <template #title>
                <el-divider style="max-width:75%"> <g-icon iconSize="20px" iconName="magical beast" /> Monsters </el-divider>
              </template>
              <el-table :data="this.encounter.monsters" stripe >
                <el-table-column label="Type" min-width="55">
                  <template #default="scope">
                    <g-icon :iconName="scope.row.type" iconSize="24px" />
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="Name" min-width="120" sortable />
                <el-table-column prop="alignment" label="Align" min-width="90" sortable />
                <el-table-column prop="hp" label="HP" sortable />
                <el-table-column label="Actions" fixed="right">
                  <template #default="scope">
                    <el-row class="row-bg" justify="space-between">
                      <el-button @click="viewCreature(scope.row, scope.$index)" type="info" style="margin:0" circle>
                        <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                      </el-button>
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>

            <!-- Encounter Extras -->
            <el-collapse-item name="4">
              <template #title>
                <el-divider style="max-width:75%"> <g-icon iconSize="20px" iconName="map" /> Extras </el-divider>
              </template>
              <el-row>
                <el-col :span="19">
                  <el-input v-model="encounter.extras.prev.name" disabled>
                    <template #prepend> Prev </template>
                  </el-input>
                </el-col>
                <el-col :span="5" class="center-horz">
                  <el-button @click="this.$router.push({ name: 'dm-screen', params: { campaign: campaign.id, encounter: encounter.extras.prev.id } });" type="info" style="margin:0" circle>
                    <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="19">
                  <el-input v-model="encounter.extras.next.name" disabled>
                    <template #prepend> Next </template>
                  </el-input>
                </el-col>
                <el-col :span="5" class="center-horz">
                  <el-button @click="this.$router.push({ name: 'dm-screen', params: { campaign: campaign.id, encounter: encounter.extras.next.id } });" type="info" style="margin:0" circle>
                    <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                  </el-button>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>

        </div>
      </template>
    </el-drawer>

  </div>
</template>

<script>
// import DataService from "@/services/data.service";
import CreatureCard from '@/components/template/CreatureCard.vue'
import CampaignService from "@/services/campaign.service";
import EncounterService from "@/services/encounter.service";
import CharacterService from "@/services/character.service";

export default {
  name: "DM Screen",
  components: { CreatureCard },
  computed: {
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    races() { return JSON.parse(localStorage.getItem('races')); },
    classes() { return JSON.parse(localStorage.getItem('classes')); },
    equipment() { return JSON.parse(localStorage.getItem('equipment')); },
    feats() { return JSON.parse(localStorage.getItem('feats')); },
    actions() { return JSON.parse(localStorage.getItem('actions')); },
    conditions() { return JSON.parse(localStorage.getItem('conditions')); },
  },
  data() {
    return {
      tempName: {},

      // MONSTER MODAL
      creatureVisible: false,
      creature: {},
      index: -1,

      // DRAWER
      drawer: false,
      campaigns: [],
      campaign: "",
      characters: [],
      encounters: [],
      encounter: "",
      encounterCollapse: [ '' ],

    }
  },
  mounted() {
    if (!this.rules.size) { this.$router.push("/"); }

    if (this.$route.params.campaign) {
      this.loadCampaign(this.$route.params.campaign);
      if (this.$route.params.encounter) {
        this.loadEncounter(this.$route.params.encounter);
      } else {
        this.loadEncounters();
      }
    } else {
      this.loadCampaigns();
    }

  },
  methods: {
    /***************************\
    *                           *
    *          HELPERS          *
    *                           *
    \***************************/
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },
    openDrawer() { this.drawer = true; },

    /***************************\
    *                           *
    *          CAMPAIGN         *
    *                           *
    \***************************/
    loadCampaigns() {
      CampaignService.getCampaignList(this.userID, 0, 100)
      .then(response => {
        let tmp = JSON.parse(response.campaigns);
        this.campaigns = tmp.rows;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },
    loadCampaign(id) {
      CampaignService.getCampaign(id)
      .then((response) => {
        this.campaign = response.campaign;
        let title = document.getElementsByClassName('jumbotron')[0];
        title.innerHTML = this.campaign.name;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    },
    saveCampaign() {
      CampaignService.updateCampaign(this.campaign)
      .then((response) => { this.$message({ message: `${response.campaign.name} updated`, type: 'success', }); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
      this.saveEncounter();
    },

    /***************************\
    *                           *
    *         ENCOUNTER         *
    *                           *
    \***************************/
    loadEncounters() {
      if (this.campaign.id) {
        let title = document.getElementsByClassName('jumbotron')[0];
        title.innerHTML = this.campaign.name;
        EncounterService.getEncounterList(this.campaign.id, 0, 100)
        .then(response => {
          let tmp = response.encounters;
          this.totalEncounters = tmp.count;
          this.encounters = tmp.rows;
        })
        .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
      }
    },
    loadEncounter(id) {
      EncounterService.getEncounter(id)
      .then((response) => {
        this.encounter = response.encounter;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    },
    saveEncounter() {
      EncounterService.updateEncounter(this.encounter)
      .then((response) => { this.$message({ message: `${response.encounter.name} updated`, type: 'success', }); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },

    /***************************\
    *                           *
    *          CREATURE         *
    *                           *
    \***************************/
    genRandomName() {
      let fNames, surnames, rand = 0;

      fNames = this.races[this.tempName.race][this.tempName.gender].names;
      rand = Math.floor(Math.random() * fNames.length);
      this.tempName.fName = fNames[rand];

      surnames = this.races[this.tempName.race].surnames;
      rand = Math.floor(Math.random() * Object.keys(surnames).length);
      this.tempName.surname = Object.keys(surnames)[rand];
    },

    loadCharacter(id, index) {
      console.log(id);
      this.index = index;

      CharacterService.getCharacter(id)
      .then((response) => {
        console.log('response', response);
        this.viewCreature(response.character);

        // this.character = response.character;
        // document.getElementsByClassName('title')[0].innerHTML = this.character.name;
        // this.spellTabs = Object.keys(this.character.spells)[0];
        //
        // this.loading = false;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })


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

    // End Methods
  }
};
</script>

<style>
.el-card .el-row,
.el-card .el-input,
.el-card .el-textarea {
  margin-bottom: 10px;
}
</style>
