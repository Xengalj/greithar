<template>

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
          <el-tag color="#42d4f4" effect="dark"> AC </el-tag>
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








  <br><br>

  <el-button type="primary" circle @click="creatureWidth = 355; loadMonster('Skeletal Champion')">
    <g-icon iconSize="24px" iconName="undead" />
  </el-button>

  <el-button type="primary" circle @click="loadMonster('Skeletal Champion')">
    <g-icon iconSize="24px" iconName="undead" />
  </el-button>
  <el-button type="primary" circle @click="loadMonster('Death Worm')">
    <g-icon iconSize="24px" iconName="magical beast" />
  </el-button>
  <el-button type="primary" circle @click="loadMonster('Ochre Jelly')">
    <g-icon iconSize="24px" iconName="ooze" />
  </el-button>
  <el-button type="primary" circle @click="loadMonster('Giant Isopod')">
    <g-icon iconSize="24px" iconName="vermin" />
  </el-button>
  <el-button type="primary" circle @click="loadMonster('Bat')">
    <g-icon iconSize="24px" iconName="animal" />
  </el-button>
  <el-button type="primary" circle @click="loadMonster('Adult Red Dragon')">
    <g-icon iconSize="24px" iconName="dragon" />
  </el-button>
  <el-button type="primary" circle @click="loadMonster('Kobold')">
    <g-icon iconSize="24px" iconName="dragon" />
  </el-button>

  <br><br><br>

  <el-dialog :width="creatureWidth" v-model="monsterVisible" :before-close="monsterClose">
    <CreatureCard :source="creature"></CreatureCard>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="monsterClose()"> Close </el-button>
        <el-button type="primary" @click="addMonster()"> Add to Session </el-button>
      </div>
    </template>
  </el-dialog>


  <el-drawer v-model="drawer" direction="rtl">
    <template #header>
      <h4>{{ encounter.name }}</h4>
    </template>

    <template #default>
      <div v-if="encounter.name">
        <el-collapse v-model="encounterCollapse">

          <!-- Encounter Notes -->
          <el-collapse-item name="1">
            <template #title>
              <el-divider style="max-width:75%">
                <g-icon iconSize="20px" iconName="openScroll" /> Notes
              </el-divider>
            </template>

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
          </el-collapse-item>

          <!-- Encounter NPCs -->
          <el-collapse-item name="2">
            <template #title>
              <el-divider style="max-width:75%">
                <g-icon iconSize="20px" iconName="userList" /> NPCs
              </el-divider>
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
                    <el-button @click="loadCharacter(scope.row.id)" type="info" style="margin:0" circle>
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
              <el-divider style="max-width:75%">
                <g-icon iconSize="20px" iconName="magical beast" /> Monsters
              </el-divider>
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
                    <el-button @click="loadMonster(scope.row.name)" type="info" style="margin:0" circle>
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
              <el-divider style="max-width:75%">
                <g-icon iconSize="20px" iconName="map" /> Extras
              </el-divider>
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

      <div v-else>
        <el-select v-model="campaign" :change="loadEncounters()" filterable>
          <el-option v-for="cam in campaigns" :key="cam.id" :label="cam.name" :value="cam" />
        </el-select>
        <el-select v-model="encounter" filterable>
          <el-option v-for="enc in encounters" :key="enc.id" :label="enc.name" :value="enc" />
        </el-select>
      </div>

    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="console.log('nope')">cancel</el-button>
        <el-button type="primary" @click="console.log('yep')">confirm</el-button>
      </div>
    </template>
  </el-drawer>

</template>

<script>
import DataService from "@/services/data.service";
import CreatureCard from '@/components/template/CreatureCard.vue'
import CampaignService from "@/services/campaign.service";
import EncounterService from "@/services/encounter.service";

export default {
  name: "DM Screen",
  components: {
    CreatureCard
  },
  data() {
    return {
      content: "DM Screen",
      drawer: false,
      tempName: {},

      campaigns: [],
      campaign: {},
      characters: [],

      encounters: [],
      encounter: {},
      encounterCollapse: [ '' ],

      monsterVisible: false,
      creatureWidth: 750,
      creature: {},
    }
  },
  computed: {
    // currentUser() { return this.$store.state.auth.user; },
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    races() { return JSON.parse(localStorage.getItem('races')); },
    classes() { return JSON.parse(localStorage.getItem('classes')); },
    equipment() { return JSON.parse(localStorage.getItem('equipment')); },
    feats() { return JSON.parse(localStorage.getItem('feats')); },
    actions() { return JSON.parse(localStorage.getItem('actions')); },
    conditions() { return JSON.parse(localStorage.getItem('conditions')); },
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
    // update weather, player notes
    saveCampaign() {
      CampaignService.updateCampaign(this.campaign)
      .then((response) => { this.$message({ message: `${response.campaign.name} updated`, type: 'success', }); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
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

    monsterOpen(name) { console.log(name); },
    loadCharacter(id) {
      console.log(id);
    },
    loadMonster(name) {
      DataService.getMonster({"Name": name})
      .then(response => {
        console.log("CSV", response);

        this.creature = {
            name: response.name,
            basics: {},
        conditions: [],
            attributes: {},
            health: {},
            classes: {},
        resources: {},
            abilities: {},
        attacks: {},
        spells: {},
        coins: {},
            inventory: [],
            skills: {},
            settings: {
              "cardTab": "Main",
              "mainSections": [  "defense", "actions" ],
              "expandInventory": [ "Equipped", "Armor", "Weapons", "Hands", "Back", "Items" ]
            },
            notes: []
        };

        /***************************\
        *                           *
        *          BASICS           *
        *                           *
        \***************************/
        this.creature.name = response.Name;
        this.creature.basics = {
          cr: response.CR,
          type: {},
          race: 0,
          size: response.Size.toLowerCase(),
          speed: {
            "base": { "total": response.Base_Speed, "sources": [ `+${response.Base_Speed} Racial Base` ] },
            "swim": { "total": 0, "sources": [] },
            "climb": { "total": 0, "sources": [] },
            "fly": { "total": 0, "sources": [] },
            "burrow": { "total": 0, "sources": [] }
          },
          alignment: response.Alignment,
          environment: response.Environment,
        };
        this.creature.settings = {
          isMonster: true,
          cardTab: "Main",
          mainSections: [  "defense", "actions" ],
          expandInventory: [ "Equipped", "Armor", "Weapons", "Hands", "Back", "Items" ]
        };
        this.creature.notes = [];

        /***************************\
        *                           *
        *        TYPE / RACE        *
        *                           *
        \***************************/
        // Prep Racial HD
        let racialHD = 0;
        let strings = response.HD.split(";");
        strings = strings[1] ? strings[1] : strings[0];
        strings = strings.split("+");
        for (var str of strings) {
          str = str.trimStart();
          if (str.includes('d')) {
            str = str.split("d");
            racialHD += parseInt(str[0]);
          }
        }

        // Load Class 1
        if (response.Class1) {
          this.creature.classes[response.Class1] = { levels: response.Class1_Lvl };
          // Subtract Class HD from total HD to find racialHD
          racialHD -= response.Class1_Lvl;
        }

        // Load Class 2
        if (response.Class2) {
          this.creature.classes[response.Class2] = { levels: response.Class2_Lvl };
          racialHD -= response.Class2_Lvl;
        }

        // Prep creature.basics
        let type  = this.rules.creature_types[response.Type];
        this.creature.basics.type = {
          name: response.Type,
          hd: type.hd,
          levels: racialHD,
          subtypes: []
        }
        // Creature Type Abilities
        for (let [name, trait] of Object.entries(type.traits)) {
          this.creature.abilities[name] = trait;
          this.creature.abilities[name].extras = { active: true, source: "Race", showMain: false };
        }
        if (response.Race) {
          this.creature.basics.race = response.Race;
          // Racial Abilities
          if (Object.keys(this.races).includes(response.Race)) {
            for (let [name, trait] of Object.entries(this.races[response.Race].traits)) {
              this.creature.abilities[name] = trait;
              this.creature.abilities[name].extras = { active: true, source: "Race", showMain: false };
            }
          }
        }
        // Subtypes
        for (let i = 1; i < 7; i++) {
          if (response[`subtype${i}`]) {
            this.creature.basics.type.subtypes.push(response[`subtype${i}`]);
          }
        }

        /***************************\
        *                           *
        *        ATTRIBUTES         *
        *                           *
        \***************************/
        this.creature.attributes = {
          Str: { base: (response.Str == "-" ? 0 : response.Str) },
          Dex: { base: (response.Dex == "-" ? 0 : response.Dex) },
          Con: { base: (response.Con == "-" ? 0 : response.Con) },
          Int: { base: (response.Int == "-" ? 0 : response.Int) },
          Wis: { base: (response.Wis == "-" ? 0 : response.Wis) },
          Cha: { base: (response.Cha == "-" ? 0 : response.Cha) }
        }

        /***************************\
        *                           *
        *          HEALTH           *
        *                           *
        \***************************/
        this.creature.health = { total: 0, damage: 0, nonlethal: 0, sources: [] };
        let cType = this.creature.basics.type;
        if (cType.hd) {
          let val = Math.floor(cType.levels * (cType.hd/2) );
          this.creature.health.total += val;
          this.creature.health.sources.push( `+${val} ${cType.name}` );
        }
        for (let [cName, cClass] of Object.entries(this.creature.classes)) {
          let val = Math.floor(cClass.levels * (this.classes[cName].hd/2) );
          this.creature.health.total += val;
          this.creature.health.sources.push( `+${val} ${cType.name}` );
        }

        /***************************\
        *                           *
        *          SKILLS           *
        *                           *
        \***************************/
        // set up class skills array
        let classSkills = this.rules.creature_types[this.creature.basics.type.name].skills
        for (let cls of Object.keys(this.creature.classes)) {
          this.classes[cls].skills.forEach(skill => {
            if (!classSkills.includes(skill)) {
              classSkills.push(skill);
            }
          });
        }
        // set up all skills
        for (let [name, skill] of Object.entries(this.rules.skills)) {
          // Languages
          if (name == "Linguistics" && response.Languages) {
            skill.extras = { languages: response.Languages.split(',') };
          }
          skill.ranks = 0
          skill.class = classSkills.includes(name);
          skill.extras = { notes: "" };
          this.creature.skills[name] = skill;
        }
        // Get skill ranks
        let skills = response.Skills.split(',');
        skills.forEach(skill => {
          let name = skill.slice(0, skill.search(/[+|-]/g)).trim();
          name = name.replace("Knowl.", "Knowledge");
          if (name.indexOf('(') > 0) {
            let tmpName = name.slice(0, name.indexOf('(')).trim();
            if ( ['Artistry', 'Craft', 'Lore', 'Perform', 'Profession'].includes(tmpName) ) {
              name = tmpName;
            }
            this.creature.skills[name].extras.specialty = name.slice(name.indexOf('(')+1, name.indexOf(')'));
          }
          let bonus = skill.slice(skill.search(/[+|-]/g)-1);
          if (bonus.indexOf('(') > 0) { bonus = bonus.slice(0, bonus.indexOf('(')-1); }
          // total - ability mod
          let abil = this.rules.skills[name].ability;
          bonus -= this.creature.attributes[abil.concat("Mod")];
          //class skill: total - 3;
          bonus += classSkills.includes(name) ? -3 : 0
          // total - Armor Penalty(s)
          // if (this.rules.skills[name].armor_pen) {
          //   for (let penalty of Object.entries(penalties)) {
          //     bonus -= penalty[1];
          //   }
          // }
          // total - Size Mod
          if (name == "Stealth" || name == "Fly") {
            bonus -= this.rules.size[this.creature.basics.size][name.toLowerCase()];
          }
          this.creature.skills[name].ranks = bonus;
        }); // End skill ranks for each

        /***************************\
        *                           *
        *         EQUIPMENT         *
        *                           *
        \***************************/
        this.creature.inventory = [
          {},
          { 'label': 'Equipped',     'extras': { 'icon': 'equipment' }, 'children': [
            { 'label': 'Armor',      'extras': { 'icon': 'armor', 'capacity': 1 }, 'children': [] },
            { 'label': 'Weapons',    'extras': { 'icon': 'weapons' }, 'children': [
              { 'label': 'Hands',    'extras': { 'icon': 'abilityPalm', 'capacity': 2 }, 'children': [] },
              { 'label': 'Back',     'extras': { 'icon': 'swordShield', 'capacity': 2 }, 'children': [] },
            ] }
          ] },
          { 'label': 'Items',        'extras': { 'icon': 'inventory', 'capacity': 100 }, 'children': [] },
        ];

        let items = [];
        // let treasure = response.Treasure;
        if (response.Treasure.includes("(")) {
          // treasure = treasure.split('(')[0];
          let equip = response.Treasure.split('(').pop().split(')')[0];
          items = items.concat(equip.split(','));
        }
        if (response.Gear) {
          response.Gear.split(',').forEach(piece => {
            if (!items.includes(piece)) {
              items.push(piece);
            }
          });
        }
        if (response.OtherGear) {
          response.OtherGear.split(',').forEach(piece => {
            if (!items.includes(piece)) {
              items.push(piece);
            }
          });
        }

        for (let item of items) {
          let i, extras = { "Masterwork": false, "Enhancement": 0, "Notes": [] };
          item = item.toLowerCase();
          // "With" abilities (poison, bleed, frost)
          i = item.indexOf('with');
          if (i > -1) { extras["Notes"].push(item.slice(i)); item = item.slice(0, i); }
          // +# Magic items (can't go over +5)
          i = item.indexOf('+');
          if (i > -1) { extras["Enhancement"] = item.slice(i+1); item = item.slice(i+2); }
          // Masterwork items
          i = item.indexOf('masterwork');
          if (i > -1) { extras["Masterwork"] = true; item = item.slice(i+10); }
          // Remove leading any whitespace & capitalize
          item = item[0] === " " ? item.slice(1) : item;
          item = item.replace(/(^\w|\s\w)/g, m => m.toUpperCase());

          // Add items to equipment
          // Armor
          if ( Object.keys(this.equipment.Armor).includes(item) ) {
            // creature.inventory[equipped].children[armor].children
            let armor = this.creature.inventory[1].children[0].children;
            let newArmor = this.equipment.Armor[item];
            let notes = newArmor.Extras.Notes;
            if (notes.length) { extras.Notes.concat(notes); }
            newArmor.Extras = extras;
            newArmor.targets = this.rules.bonuses.Armor.targets;
            if (!armor.length) {
              armor.push({ label: item, value: newArmor });
            } else {
              // creature.inventory[loot].children
              this.creature.inventory[2].children.push({ label: item, value: newArmor });
            }
          }

          // Weapons
          else if ( Object.keys(this.equipment.Weapons).includes(item) ) {
            // creature.inventory[equipped].children[weapons]
            let weapons = this.creature.inventory[1].children[1].children;
            let newWpn = this.equipment.Weapons[item];
            let notes = newWpn.Extras.Notes;
            if (notes.length) { extras.Notes.push(notes); }
            newWpn.Extras = extras;
            if (weapons[0].children.length < 2) {
              // if weapons[hands].children < 2
              weapons[0].children.push({ label: item, value: newWpn });
            } else if (weapons[1].children.length < 2) {
              // if weapons[back].children < 2
              weapons[1].children.push({ label: item, value: newWpn });
            } else {
              // add weapon to creature.inventory[loot].children
              this.creature.inventory[2].children.push({ label: item, value: newWpn });
            }
          }

          // Shields
          else if ( Object.keys(this.equipment.Shields).includes(item) ) {
            // creature.inventory[equipped].children[weapons]
            let weapons = this.creature.inventory[1].children[1].children;
            let newWpn = this.equipment.Shields[item];
            let notes = newWpn.Extras.Notes;
            if (notes.length) { extras.Notes.push(notes); }
            newWpn.Extras = extras;
            newWpn.targets = this.rules.bonuses.Shield.targets;
            if (weapons[0].children.length < 2) {
              // if weapons[hands].children
              weapons[0].children.push({ label: item, value: newWpn });
            } else if (weapons[1].children.length < 2) {
              // if weapons[back].children
              weapons[1].children.push({ label: item, value: newWpn });
            } else {
              // add shield to creature.inventory[loot].children
              this.creature.inventory[2].children.push({ label: item, value: newWpn });
            }
          }

          // Others
          else {
            this.creature.inventory[2].children.push({
              label: item,
              value: { "Cost": 1, "Weight": 0, "Description": "", "Extras": { "Notes": [] } }
            });
          }
        } // End items loop

        /***************************\
        *                           *
        *         ABILITIES         *
        *                           *
        \***************************/
        // Feats
        if (response.Feats) {
          for (let name of response.Feats.split(',')) {
            let isBonus, feat = {
              description: "",
              trigger: "Continuous",
              benefit: { text: "", target: "self" },
              bonuses: {},
              extras: { active: false, showMain: false, source: "Feat" }
            };
            name = name.trim();
            if (name.indexOf('(') > 0) { name = name.slice(0, name.indexOf('(')-1); }
            // Remove 'B' from bonus feat names
            if (name[name.length-1] == 'B') {
              isBonus = true;
              name = name.slice(0, -1);
            }
            // if the feat is in the feats json, load it's data
            if (this.feats[name]) {
              feat = this.feats[name];
              feat.extras = {
                active: (this.feats[name].trigger == "Continuous") ? true : false,
                showMain: (this.feats[name].trigger == "Continuous") ? false : true,
                source: isBonus ? "Class" : "Feat"
              };
            }
            this.creature.abilities[name] = feat;
          }
        }

        // Natural Armor
        let tempAC = response.AC - 10;
        tempAC -= Math.floor((response.Dex - 10) / 2);
        tempAC -= this.rules.size[this.creature.basics.size]["ac / atk"];
        let armor = this.creature.inventory[1].children[0].children[0];
        if (armor) { tempAC -= armor.value["AC Bonus"]; }
        for (const item of this.creature.inventory[1].children[1].children[0].children) {
          // Shields : for items in equipment . equipped . hands
          if (item.value["AC Bonus"]) { tempAC -= item.value["AC Bonus"]; }
        }
        if (tempAC > 0) {
          this.creature.abilities["Natural Armor"] = {
            trigger: "Continuous",
            description: "This creature is naturally tough, granting additional armor.",
            benefit: { target: "self", text: "" },
            bonuses: {
              "Natural Armor": { value: tempAC, type: "Natural Armor", targets: this.rules.bonuses["Natural Armor"].targets }
            },
            extras: { active: true, showMain: false, source: "Trait" }
          };
        }
        // Special Qualities
        if (response.SQ) {
          for (let abil of response.SQ.split(',')) {
            this.creature.abilities[abil] = {
              trigger: "Standard",
              description: "",
              benefit: { target: "self", text: "" },
              bonuses: {},
              extras: { active: false, showMain: false, source: "Race" }
            }
          }
        }

        /***************************\
        *                           *
        *          ATTACKS          *
        *                           *
        \***************************/
        // MELEE
        if (response.Melee) {
          for (let atk of response.Melee.split(',')) {
            let i, extras = {};
            atk = atk.toLowerCase();
            // abilities (poison, bleed, frost)
            i = atk.indexOf('plus');
            if (i > -1) {
              extras.notes = atk.slice(i);
              extras.notes = extras.notes.slice(0, -1); // remove trailing ')'
              atk = atk.slice(0, i);
            }
            // Dmg Die
            let dmg = atk.slice(atk.indexOf("(")+1);
            dmg = dmg.slice(0, dmg.indexOf('+'));
            // remove atk bonus from string
            atk = atk.slice(0, atk.indexOf('+')-1);

            // Strip off masterwork & leading whitespace
            atk = atk.replace(/(mwk|masterwork|Mwk|Masterwork)\s/gm, "").trim();
            atk = atk.replace(/(^\w|\s\w)/g, m => m.toUpperCase());

            // Add only Natural Attacks
            // item = equipment . equipped . hands . 'main hand'
            let item = this.creature.inventory[1].children[1].children[0].children[0];
            if (item && item.label == atk) { continue; }
            // item = equipment . equipped . hands . 'off hand'
            item = this.creature.inventory[1].children[1].children[0].children[1];
            if (item && item.label == atk) { continue; }

            let NAs = this.rules.natural_attacks;
            // get Nat Atk name, for searching (no #, no trailing 's')
            let atkName = atk;
            if (parseInt(atk[0]) > 1) {
              atk = atk.slice(2);
              atk = atk.slice(0, -1);
            }
            if (Object.keys(NAs).includes(atk)) {
              this.creature.attacks.melee[atkName] = NAs[atk];
              extras["Natural Attack"] = NAs[atk].Category;
              this.creature.actions.melee[atkName].Extras = extras;
              let tableDmg = NAs[atk].Damage[this.creature.basics.size];
              if (tableDmg != dmg) { this.creature.attacks.melee[atkName].Damage[this.creature.basics.size] = dmg; }
            } else {
              this.creature.actions.melee[atkName] = NAs["Other"];
            }
          }
        }

        // RANGED
        if (response.Ranged) {
          for (let atk of response.Ranged.split(',')) {
            let i, atkNum, extras = {};
            atk = atk.toLowerCase();
            // abilities (poison, bleed, frost)
            i = atk.indexOf('plus');
            if (i > -1) {
              extras.notes = atk.slice(i);
              extras.notes = extras.notes.slice(0, -1); // remove trailing ')'
              atk = atk.slice(0, i);
            }
            // Dmg Die
            let dmg = atk.slice(atk.indexOf("(")+1);
            dmg = dmg.slice(0, dmg.indexOf('+'));
            // remove atk bonus from string
            atk = atk.slice(0, atk.indexOf('+')-1);

            // Strip off masterwork & leading whitespace
            atk = atk.replace(/(mwk|masterwork|Mwk|Masterwork)\s/gm, "");
            atk = atk.replace(/(^\w|\s\w)/g, m => m.toUpperCase());

            // Add only Natural Attacks
            // item = equipment . equipped . hands . 'main hand'
            let item = this.creature.inventory[1].children[1].children[0].children[0];
            if (item && item.label == atk) { continue; }
            // item = equipment . equipped . hands . 'off hand'
            item = this.creature.inventory[1].children[1].children[0].children[1];
            if (item && item.label == atk) { continue; }


            let NAs = this.rules.natural_attacks;

            // Number of Attacks (NAs)
            if (parseInt(atk[0]) > 1) {
              atkNum = atk[0];
              atk = atk.slice(2);
              atk = atk.slice(0, -1);
            }
            let atkName = atkNum ? atkNum+" "+atk : atk;
            if (Object.keys(NAs).includes(atk)) {
              this.creature.actions.ranged[atkName] = NAs[atk];
              extras["Natural Attack"] = NAs[atk].Category;
              this.creature.actions.ranged[atkName].Extras = extras;
              let tableDmg = NAs[atk].Damage[this.creature.basics.size];
              if (tableDmg != dmg) { this.creature.actions.ranged[atkName].Damage[this.creature.basics.size] = dmg; }
            } else {
              this.creature.actions.ranged[atkName] = NAs["Other"];
              extras["Natural Attack"] = NAs["Other"].Category;
              this.creature.actions.ranged[atkName].Extras = extras;
              let tableDmg = NAs["Other"].Damage[this.creature.basics.size];
              if (tableDmg != dmg) { this.creature.actions.ranged[atkName].Damage[this.creature.basics.size] = dmg; }
            }
          }
        }

        this.monsterVisible = true;
      })
      .catch(err => { console.error(err); });



    },
    monsterClose() {
      this.monsterVisible = false;
    },


    // End Methods
  }
};
</script>

<style>
.el-row, .el-input, .el-textarea { margin-bottom: 10px; }
</style>
