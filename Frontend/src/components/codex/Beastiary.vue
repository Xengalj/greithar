<template>
  <div class="container">

    <!-- FILTERS -->
    <el-row :gutter="10">
      <el-col :xs="24" :sm="10" :md="6">
        <el-input v-model="tableSearch" @change="nameSearch" placeholder="Type to search names" aria-label="Search Monsters">
          <template #append>
            <el-button @click="nameSearch" text> Search </el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="3" :md="2" class="center-horz">
        <el-button @click="resetTable" type="warning" style="color: black;"> Reset </el-button>
      </el-col>
    </el-row>

    <!-- MONSTER TABLE -->
    <el-auto-resizer style="height: 600px">
      <template #default="{ height, width }">
        <el-table-v2
          :data="tableData"
          :columns="columns"
          @column-sort="onSort"
          :sort-state="sortState"
          :width="width"
          :height="height"
          ref="CreatureTable"
          fixed
        />
      </template>
    </el-auto-resizer>

    <!-- MONSTER MODAL -->
    <el-auto-resizer style="height: 600px">
      <template #default="{ width }">
        <el-dialog v-model="creatureVisible" :width="width" style="margin-top: 75px" >
          <CreatureCard :source="creature" @save-creature="openDrawer" @open-drawer="openDrawer"></CreatureCard>
        </el-dialog>
      </template>
    </el-auto-resizer>

    <!-- DRAWER -->
    <el-drawer v-model="drawer" :size="360" direction="rtl">
      <template #header> <h4> Add monster to encounter </h4> </template>
      <template #default>
        <el-select v-model="campaign" @change="loadEncounters" filterable placeholder="Choose a Campaign" aria-label="Select Campaign">
          <el-option v-for="campaign in campaigns" :key="campaign.id" :label="campaign.name" :value="campaign" >
            {{ campaign.user.username }}'s {{ campaign.name }}
          </el-option>
        </el-select>
        <el-select v-model="encounter" filterable placeholder="Choose an Encounter" aria-label="Select Encounter">
          <el-option v-for="encounter in encounters" :key="encounter.id" :label="encounter.name" :value="encounter" />
        </el-select>

        <div v-if="encounter.name">
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
                <el-divider style="max-width:75%"> <g-icon iconSize="20px" iconName="magical beast" /> Beasts </el-divider>
              </template>
              <el-table :data="encounter.monsters" stripe >
                <el-table-column label="Type" min-width="55">
                  <template #default="scope">
                    <g-icon :iconName="scope.row.type" iconSize="24px" />
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="Name" min-width="120" sortable />
                <el-table-column prop="alignment" label="Align" min-width="90" sortable />
                <el-table-column prop="hp" label="HP" sortable />
              </el-table>
            </el-collapse-item>

            <!-- Displayed Monster -->
            <el-collapse-item name="4">
              <template #title>
                <el-divider style="max-width:75%"> <g-icon iconSize="20px" iconName="dragon" /> </el-divider>
              </template>
              <div v-for="(section, name) in creatureJSON" :key="name">
                <span>{{ capFirsts(name) }}</span>
                <el-input type="textarea" v-model="creatureJSON[name]" :autosize="{ minRows: 5, maxRows: 20 }" :aria-label="`Admin ${name} JSON Input`" />
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </template>

      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false;"> Cancel </el-button>
          <el-button type="primary" @click="addCreature()" aria-label="Add creature and save encounter"> Confirm </el-button>
        </div>
      </template>
    </el-drawer>

  </div>
</template>

<script>
import DataService from "@/services/data.service";
import CreatureCard from "@/components/template/CreatureCard.vue";
import CampaignService from "@/services/campaign.service";
import EncounterService from "@/services/encounter.service";
import { h, resolveComponent, ref } from "vue";
import { TableV2SortOrder } from 'element-plus';

export default {
  name: "Beastiary",
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
      loading: false,

      sortState: ref({
        'Name': TableV2SortOrder.DESC,
        'CR': TableV2SortOrder.DESC,
        'HP': TableV2SortOrder.DESC,
        'AC': TableV2SortOrder.DESC
      }),
      typeFilter: [
        { label: 'Aberrations', value: 'aberration' },
        { label: 'Animals', value: 'animal' },
        { label: 'Constructs', value: 'construct' },
        { label: 'Dragons', value: 'dragon' },
        { label: 'Fey', value: 'fey' },
        { label: 'Humanoids', value: 'humanoid' },
        { label: 'Magical Beasts', value: 'magical beast' },
        { label: 'Monsterous Humanoids', value: 'monstrous humanoid' },
        { label: 'Oozes', value: 'ooze' },
        { label: 'Outsiders', value: 'outsider' },
        { label: 'Plants', value: 'plant' },
        { label: 'Undead', value: 'undead' },
        { label: 'Vermin', value: 'vermin' },
      ],
      alignmentFilter: [
        { label: 'LG', value: 'LG' },
        { label: 'NG', value: 'NG' },
        { label: 'CG', value: 'CG' },
        { label: 'LN', value: 'LN' },
        { label: 'N',  value: 'N' },
        { label: 'CN', value: 'CN' },
        { label: 'LE', value: 'LE' },
        { label: 'NE', value: 'NE' },
        { label: 'CE', value: 'CE' },
      ],
      environFilter: [
        { label: "Any", value: "any" },
        { label: "Cold", value: "cold" },
        { label: "Temperate", value: "temperate" },
        { label: "Warm", value: "warm" },
        { label: "Aquatic", value: "aquatic" },
        { label: "Coastline", value: "coastline" },
        { label: "Desert", value: "desert" },
        { label: "Forest", value: "forest" },
        { label: "Hills", value: "hills" },
        { label: "Jungle", value: "jungle" },
        { label: "Mountains", value: "mountains" },
        { label: "Ocean", value: "ocean" },
        { label: "Sea", value: "sea" },
        { label: "Plains", value: "plains" },
        { label: "River", value: "river" },
        { label: "Lakes", value: "lakes" },
        { label: "Swamp", value: "swamp" },
        { label: "Marsh", value: "marsh" },
        { label: "Urban", value: "urban" },
        { label: "Underground", value: "underground" }
      ],

      tableSearch: "",
      filterChoices: {
        Type: [],
        Alignment: [],
        Environment: []
      },

      columns: [
        { dataKey: "Name", title: 'Name', width: 180, sortable: true, fixed: true },
        { dataKey: "Type", title: 'Type', width: 180,
          cellRenderer: ({ cellData: Type }) => {
            const row = resolveComponent('ElRow');
            const icon = resolveComponent('g-icon');
            return h( row,
              { class: 'row-bg', justify: 'space-between', align: 'middle' },
              { default: () => [
                h( 'div',
                  { style: 'width: 50px' },
                  { default: () => [ h( icon, { iconSize: '32px', iconName: Type, key: Type } ) ]}
                ),
                h( 'div',
                  { style: 'width: 100px' },
                  { default: () => Type }
                )
              ]}
            );
          }, // end cell render
          // Filter
          headerCellRenderer: (props) => {
            const popover = resolveComponent('ElPopover');
            const checkboxGroup = resolveComponent('ElCheckboxGroup');
            const checkbox = resolveComponent('ElCheckbox');
            const icon = resolveComponent('g-icon');
            return h( 'div',
              { class: 'flex items-center justify-center' },
              { default: () => [
                h( 'span', null, { default: () => props.column.title } ),
                h( popover,
                  {  trigger: 'click', width: 200 },
                  { default: () => [
                    h(checkboxGroup,
                      { class: 'filter-list', modelValue: this.filterChoices.Type, 'onUpdate:modelValue': (val) => { this.filterChoices.Type = val; }, onChange: () => { this.handleFilter(); } },
                      { default: () =>
                        this.typeFilter.map(item => {
                          return h(checkbox, { label: item.label, value: item.value })
                        })
                      }
                    ),
                  ], // end popOver content (default)
                  reference: () => (
                    h( 'button',
                      { type: 'button', class: 'table-filter' },
                      { default: () => [
                        h( icon, { iconSize: '14px', iconName: 'filter' } )
                      ]}
                    )
                  ) } // end popOver reference (filter icon)
                )
              ]}
            );
          } // end header render (filter)
        },
        { dataKey: "Alignment", title: 'Align', width: 75,
          // Filter (see type for more readable version)
          headerCellRenderer: (props) => {
            const popover = resolveComponent('ElPopover');
            const checkboxGroup = resolveComponent('ElCheckboxGroup');
            const checkbox = resolveComponent('ElCheckbox');
            const icon = resolveComponent('g-icon');
            return h( 'div',
              null,
              { default: () => [
                h( 'span', null, { default: () => props.column.title } ),
                h( popover,
                  {  trigger: 'click', width: 236 }, // 236 and no flex gives 3x3
                  { default: () => [
                    h(checkboxGroup,
                      { class: 'filter-list', modelValue: this.filterChoices.Alignment, 'onUpdate:modelValue': (val) => { this.filterChoices.Alignment = val; }, onChange: () => { this.handleFilter(); } },
                      { default: () => this.alignmentFilter.map(item => { return h(checkbox, { label: item.label, value: item.value }) }) }
                    ),
                  ], // end popOver content (default)
                  reference: () => ( h( 'button', { type: 'button', class: 'table-filter' }, { default: () => [ h( icon, { iconSize: '14px', iconName: 'filter' } ) ]} ) ) }
                )
              ]}
            );
          } // end header render (filter)
        },
        { dataKey: "CR", title: 'CR', width: 50, sortable: true,
          cellRenderer: ({ cellData: Val }) => {
            const tag = resolveComponent('ElTag');
            return h( tag, { type: 'warning', effect: 'dark' },
              { default: () => [ h('span', {style: 'color: black;'}, Val) ]}
            )
          }
        },
        { dataKey: "HP", title: 'HP', width: 50, sortable: true,
          cellRenderer: ({ cellData: Val }) => {
            const tag = resolveComponent('ElTag');
            return h( tag, { type: 'danger', effect: 'dark' },
              { default: () => [ h('span', {style: 'color: black;'}, Val) ]}
            )
          }
        },
        { dataKey: "AC", title: 'AC', width: 50, sortable: true,
          cellRenderer: ({ cellData: Val }) => {
            const tag = resolveComponent('ElTag');
            return h( tag, { color: '#42d4f4', effect: 'dark', style: 'border: none;' },
              { default: () => [ h('span', {style: 'color: black;'}, Val) ]}
            )
          }
        },
        { dataKey: "Environment", title: 'Environment', width: 150,
          // Filter (see type for more readable version)
          headerCellRenderer: (props) => {
            const popover = resolveComponent('ElPopover');
            const checkboxGroup = resolveComponent('ElCheckboxGroup');
            const checkbox = resolveComponent('ElCheckbox');
            const icon = resolveComponent('g-icon');
            return h( 'div',
              { class: 'flex items-center justify-center' },
              { default: () => [
                h( 'span', null, { default: () => props.column.title } ),
                h( popover,
                  {  trigger: 'click', width: 200 }, // 236 and no flex gives 3x3
                  { default: () => [
                    h(checkboxGroup,
                      { class: 'filter-list', modelValue: this.filterChoices.Environment, 'onUpdate:modelValue': (val) => { this.filterChoices.Environment = val; }, onChange: () => { this.handleFilter(); } },
                      { default: () => this.environFilter.map(item => { return h(checkbox, { label: item.label, value: item.value }) }) }
                    ),
                  ], // end popOver content (default)
                  reference: () => ( h( 'button', { type: 'button', class: 'table-filter' }, { default: () => [ h( icon, { iconSize: '14px', iconName: 'filter' } ) ]} ) ) }
                )
              ]}
            );
          } // end header render (filter)
        },
        { title: 'Actions', width: 100,
          cellRenderer: ( val ) => {
            const row = resolveComponent('ElRow');
            const btn = resolveComponent('ElButton');
            const icon = resolveComponent('g-icon');
            return h( row,
              { class: 'row-bg', justify: 'space-between', align: 'middle' },
              { default: () => [
                h( btn,
                  { type: 'primary', circle: true, onClick: () => this.viewCreature(val.rowIndex) },
                  { default: () => [ h( icon, { iconSize: '24px', iconName: 'eye' } ) ]}
                )
                // h( btn,
                //   { type: 'info', circle: true, onClick: () => this.editCreature(val.rowIndex) },
                //   { default: () => [ h( icon, { iconSize: '24px', iconName: 'quill', iconColor: "#000" } ) ]}
                // )
              ]} // end row children
            );
          }, // end cell render
        }
      ],

      allMonsters: [],
      tableData: [],

      // MONSTER MODAL
      creatureVisible: false,
      creature: {},

      // DRAWER
      drawer: false,
      campaigns: [],
      campaign: "",
      characters: [],
      encounters: [],
      encounter: "",
      encounterCollapse: [ '' ],
      creatureJSON: {},

    };
  },

  mounted() {
    this.getBeastiary();
    this.loadCampaigns();
  },
  methods: {
    async getBeastiary() {
      this.loading = true;
      DataService.getBeastiary()
      .then(response => {
        this.allMonsters = response;
        this.tableData = this.allMonsters;
        this.loading = false;
      })
      .catch(err => { console.error(err); });
    },
    capFirsts(string) {
      if (Number.isInteger(string)) { string = string.toString(); }
      return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : "";
    },


    /***************************\
    *                           *
    *          FILTERS          *
    *                           *
    \***************************/
    // Sort the rows by key (column)
    onSort ({key, order}) {
      this.columns.forEach(col => {
        if (key == col.title) {
          this.sortState[key] = order; // swaps icon and order
          this.tableData.sort( (a, b) => {
            if ([ "Name" ].includes(key)) {
              return (order == 'asc') ? a[key] < b[key] : b[key] < a[key];
            } else if ([ "CR", "HP", "AC" ].includes(key)) {
              return (order == 'asc') ? a[key] - b[key] : b[key] - a[key];
            }
          });
        }
      });
    },
    // only searches on current (filtered) monsters in table
    nameSearch() {
      this.loading = true;
      let monName, searchStr, mons = this.tableData.map((mon)=>mon);
      searchStr = this.tableSearch.toLowerCase();
      if (searchStr == "") { return; }
      this.tableData = [];
      for (let i = 0; i < mons.length; i++) {
        monName = mons[i].Name.toLowerCase();
        if ( monName.includes( searchStr ) ) {
          this.tableData.push(mons[i]);
        }
      }
      this.loading = false;
    },
    // all other filters
    handleFilter() {
      this.loading = true;
      let mons = this.tableData.map((mon) => mon);
      this.tableData = [];
      for (let i = 0; i < mons.length; i++) {
        let hidden = true;
        for (let [prop, choices] of Object.entries(this.filterChoices)) {
          for (let choice of choices) {
            if ( mons[i][prop].includes(choice) ) {
              hidden = false;
            }
          }
        }
        if (!hidden) { this.tableData.push(mons[i]); }
      } // end mons loop
      this.loading = false;
    },
    resetTable() {
      this.tableSearch = "";
      this.tableData = this.allMonsters;
    },

    /***************************\
    *                           *
    *          CREATURE         *
    *                           *
    \***************************/
    loadCreature(monster) {
      // console.log('CSV', monster);
      /***************************\
      *                           *
      *          BASICS           *
      *                           *
      \***************************/
      let creature = {
        name: monster.Name,
        basics: {
          cr: monster.CR,
          size: monster.Size.toLowerCase(),
          type: monster.Type.toLowerCase(),
          subtypes: [],
          race: monster.Race,
          speed: {
            base:     { total: monster.Base_Speed, sources: [ `+${monster.Base_Speed} Racial Base` ] },
            swim:     { total: 0, sources: [] },
            climb:    { total: 0, sources: [] },
            fly:      { total: 0, sources: [] },
            burrow:   { total: 0, sources: [] }
          },
          alignment: monster.Alignment,
          environment: monster.Environment,
        },
        notes: "",
        health: { damage: 0, nonlethal: 0 },
        actions: {},
        classes: {},
        abilities: [],
        conditions: [],
        // resources: {},
        coins: { "cp": 0, "sp": 0, "gp": 0, "pp": 0 },
        skills: {},
        spells: {},
        settings: {
          isNPC: false,
          isMonster: true,
          cardTab: "Main",
          mainSections: [  "defense", "actions" ],
          expandInventory: [ "Equipped", "Armor", "Weapons", "Hands", "Back", "Items" ]
        },
      };
      // Subtypes
      for (let i = 1; i < 7; i++) {
        if (monster[`subtype${i}`]) {
          creature.basics.subtypes.push(monster[`subtype${i}`]);
        }
      }
      // Speeds
      if (monster.Swim_Speed) { creature.basics.speed.swim = { total: monster.Swim_Speed, sources: [ `+${monster.Swim_Speed} Racial Base` ] } }
      if (monster.Climb_Speed) { creature.basics.speed.climb = { total: monster.Climb_Speed, sources: [ `+${monster.Climb_Speed} Racial Base` ] } }
      if (monster.Fly_Speed) { creature.basics.speed.fly = { total: monster.Fly_Speed, sources: [ `+${monster.Fly_Speed} Racial Base` ] } }
      if (monster.Burrow_Speed) { creature.basics.speed.burrow = { total: monster.Burrow_Speed, sources: [ `+${monster.Burrow_Speed} Racial Base` ] } }

      /***************************\
      *                           *
      *          CLASSES          *
      *                           *
      \***************************/
      let innate = (monster.Type == 'humanoid') ? monster.Race : monster.Type;
      if (creature.classes) {
        // Prep Racial HD
        let racialHD = 0;
        let strings = monster.HD.split(";");
        strings = strings[1] ? strings[1] : strings[0];
        strings = strings.split("+");
        for (var str of strings) {
          str = str.trimStart();
          if (str.includes('d')) {
            str = str.split("d");
            racialHD += parseInt(str[0]);
          }
        }
        creature.classes[innate] = {
          levels: 0,
          magic: {
            style: "Spontaneous Arcane",
            castingAtr: "Cha",
            casterLevel: 0,
            spellsPerDay: [],
            remainingCasts: []
          },
          abilites: []
        };

        // Load Class 1
        if (monster.Class1) {
          creature.classes[monster.Class1] = {
            levels: monster.Class1_Lvl,
            bab: this.classes[monster.Class1].bab,
            hd: this.classes[monster.Class1].hd,
            saves: this.classes[monster.Class1].saves,
            abilites: []
          };
          if (this.classes[monster.Class1].magic) {
            creature.classes[monster.Class1].magic = {
              style: this.classes[monster.Class1].magic.style,
              castingAtr: this.classes[monster.Class1].magic.castingAtr,
              casterLevel: monster.Class1_Lvl,
              useGaldur: false,
              openTotal: Math.floor( this.classes[monster.Class1].magic.galdurTotal[monster.Class1_Lvl] / 2 ),
              openRemaining: Math.floor( this.classes[monster.Class1].magic.galdurTotal[monster.Class1_Lvl] / 2 ),
              reserveTotal: Math.ceil( this.classes[monster.Class1].magic.galdurTotal[monster.Class1_Lvl] / 2 ),
              reserveRemaining: Math.ceil( this.classes[monster.Class1].magic.galdurTotal[monster.Class1_Lvl] / 2 ),
            };
            if (creature.classes[monster.Class1].magic.style.includes('Spontaneous')) {
              creature.classes[monster.Class1].magic.spellsPerDay = this.classes[monster.Class1].magic.spellsPerDay[monster.Class1_Lvl];
              creature.classes[monster.Class1].magic.remainingCasts = this.classes[monster.Class1].magic.spellsPerDay[monster.Class1_Lvl]
            }
            else if (creature.classes[monster.Class1].magic.style.includes('Prepared')) {
              creature.classes[monster.Class1].magic.preparedSpells = [];
              this.classes[monster.Class1].magic.spellsPerDay[monster.Class1_Lvl].forEach((numOfSpells, lvl) => {
                creature.classes[monster.Class1].magic.preparedSpells[lvl] = [];
              });
            }
          } // end Class Has Magic
          // Subtract Class HD from total HD to find racialHD
          racialHD -= monster.Class1_Lvl;
        }

        // Load Class 2
        if (monster.Class2) {
          creature.classes[monster.Class2] = {
            levels: monster.Class2_Lvl,
            bab: this.classes[monster.Class2].bab,
            hd: this.classes[monster.Class2].hd,
            saves: this.classes[monster.Class2].saves,
            abilites: []
          };
          if (this.classes[monster.Class2].magic) {
            creature.classes[monster.Class2].magic = {
              style: this.classes[monster.Class2].magic.style,
              castingAtr: this.classes[monster.Class2].magic.castingAtr,
              casterLevel: monster.Class1_Lv2,
              useGaldur: false,
              openTotal: Math.floor( this.classes[monster.Class2].magic.galdurTotal[monster.Class2_Lvl] / 2 ),
              openRemaining: Math.floor( this.classes[monster.Class2].magic.galdurTotal[monster.Class2_Lvl] / 2 ),
              reserveTotal: Math.ceil( this.classes[monster.Class2].magic.galdurTotal[monster.Class2_Lvl] / 2 ),
              reserveRemaining: Math.ceil( this.classes[monster.Class2].magic.galdurTotal[monster.Class2_Lvl] / 2 ),
            };
            if (creature.classes[monster.Class2].magic.style.includes('Spontaneous')) {
              creature.classes[monster.Class2].magic.spellsPerDay = this.classes[monster.Class2].magic.spellsPerDay[monster.Class2_Lvl];
              creature.classes[monster.Class2].magic.remainingCasts = this.classes[monster.Class2].magic.spellsPerDay[monster.Class2_Lvl]
            }
            else if (creature.classes[monster.Class2].magic.style.includes('Prepared')) {
              creature.classes[monster.Class2].magic.preparedSpells = [];
              this.classes[monster.Class2].magic.spellsPerDay[monster.Class2_Lvl].forEach((numOfSpells, lvl) => {
                creature.classes[monster.Class2].magic.preparedSpells[lvl] = [];
              });
            }
          } // end Class Has Magic
          racialHD -= monster.Class2_Lvl;
        }

        // Load Class[race/type]

        // ABILITIES <- Creature Type Traits
        for (let [name, trait] of Object.entries(this.rules.creature_types[monster.Type.toLowerCase()].traits)) {
          trait.name = name;
          trait.extras = {
            showMain: false,
            active: true,
            category: "Race",
            source: { class: "", level: 0 },
            notes: []
          }
          creature.abilities.push(trait);
        }
        // ABILITIES <- Racial Traits
        if (Object.keys(this.races).includes(monster.Race)) {
          for (let [name, trait] of Object.entries(this.races[monster.Race].traits)) {
            trait.name = name;
            trait.extras = {
              showMain: false,
              active: true,
              category: "Race",
              source: { class: "", level: 0 },
              notes: []
            }
            creature.abilities.push(trait);
          }
        }

        let type = creature.classes[innate]
        if (racialHD > 0) {
          type.levels = racialHD;
          type.bab = this.rules.creature_types[monster.Type].bab;
          type.hd = this.rules.creature_types[monster.Type].hd;
          type.saves = this.rules.creature_types[monster.Type].saves;
          type.magic.casterLevel = racialHD;
        }
      }

      /***************************\
      *                           *
      *        ATTRIBUTES         *
      *                           *
      \***************************/
      creature.attributes = {
        Str: { base: (monster.Str == "-" ? 0 : monster.Str) },
        Dex: { base: (monster.Dex == "-" ? 0 : monster.Dex) },
        Con: { base: (monster.Con == "-" ? 0 : monster.Con) },
        Int: { base: (monster.Int == "-" ? 0 : monster.Int) },
        Wis: { base: (monster.Wis == "-" ? 0 : monster.Wis) },
        Cha: { base: (monster.Cha == "-" ? 0 : monster.Cha) }
      }

      /***************************\
      *                           *
      *         EQUIPMENT         *
      *                           *
      \***************************/
      creature.inventory = [
        { 'label': 'Magic Items',  'extras': { 'icon': "amulet" }, 'children': [] },
        { 'label': 'Equipped',     'extras': { 'icon': 'equipment' }, 'children': [
          { 'label': 'Armor',      'extras': { 'icon': 'armor', 'capacity': 1 }, 'children': [] },
          { 'label': 'Weapons',    'extras': { 'icon': 'weapons' }, 'children': [
            { 'label': 'Hands',    'extras': { 'icon': 'abilityPalm', 'capacity': 2 }, 'children': [] },
            { 'label': 'Back',     'extras': { 'icon': 'swordShield', 'capacity': 2 }, 'children': [] },
          ] }
        ] },
        { 'label': 'Items',        'extras': { 'icon': 'inventory', 'capacity': 100 }, 'children': [] },
      ];
      if (creature.inventory) {
        let items = [];
        // let treasure = monster.Treasure;
        if (monster.Treasure.includes("(")) {
          // treasure = treasure.split('(')[0];
          let equip = monster.Treasure.split('(').pop().split(')')[0];
          items = items.concat(equip.split(','));
        }
        if (monster.Gear) {
          monster.Gear.split(',').forEach(piece => {
            if (!items.includes(piece)) {
              items.push(piece);
            }
          });
        }
        if (monster.OtherGear) {
          monster.OtherGear.split(',').forEach(piece => {
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

          // Remove whitespace & capitalize
          item = item.trim();
          item = item.replace(/(^\w|\s\w)/g, m => m.toUpperCase());

          // Add items to equipment
          // Armor
          if ( Object.keys(this.equipment.Armor).includes(item) ) {
            // creature.inventory[equipped].children[armor].children
            let armor = creature.inventory[1].children[0].children;
            let newArmor = this.equipment.Armor[item];
            let notes = newArmor.Extras.Notes;
            if (notes.length) { extras.Notes.concat(notes); }
            newArmor.Amount = 1;
            newArmor.Extras = extras;
            newArmor.targets = this.rules.bonuses.Armor.targets;
            if (!armor.length) {
              armor.push({ label: item, value: newArmor });
            } else {
              // creature.inventory[loot].children
              creature.inventory[2].children.push({ label: item, value: newArmor });
            }
          }
          // Weapons
          else if ( Object.keys(this.equipment.Weapons).includes(item) ) {
            // creature.inventory[equipped].children[weapons]
            let weapons = creature.inventory[1].children[1].children;
            let newWpn = this.equipment.Weapons[item];
            let notes = newWpn.Extras.Notes;
            if (notes.length) { extras.Notes.push(notes); }
            newWpn.Amount = 1;
            newWpn.Extras = extras;
            if (weapons[0].children.length < 2) {
              // if weapons[hands].children < 2
              weapons[0].children.push({ label: item, value: newWpn });
            } else if (weapons[1].children.length < 2) {
              // if weapons[back].children < 2
              weapons[1].children.push({ label: item, value: newWpn });
            } else {
              // add weapon to creature.inventory[loot].children
              creature.inventory[2].children.push({ label: item, value: newWpn });
            }
          }

          // Shields
          else if ( Object.keys(this.equipment.Shields).includes(item) ) {
            // creature.inventory[equipped].children[weapons]
            let weapons = creature.inventory[1].children[1].children;
            let newWpn = this.equipment.Shields[item];
            let notes = newWpn.Extras.Notes;
            if (notes.length) { extras.Notes.push(notes); }
            newWpn.Amount = 1;
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
              creature.inventory[2].children.push({ label: item, value: newWpn });
            }
          }

          // Others
          else {
            creature.inventory[2].children.push({
              label: item,
              value: { "Cost": 1, "Weight": 0, "Description": "", "Amount": 1, "Extras": { "Notes": [] } }
            });
          }
        } // End items loop
      }

      /***************************\
      *                           *
      *         ABILITIES         *
      *                           *
      \***************************/
      if (creature.abilities) {
        // Feats
        if (monster.Feats) {
          for (let name of monster.Feats.split(',')) {
            let isBonus, feat = {
              description: "",
              shortText: "",
              location: "self",
              trigger: "Continuous",
              bonuses: {},
              extras: {
                showMain: false,
                active: false,
                category: "Feat",
                source: { class: "", level: 0 },
                notes: []
              }
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
                showMain: (this.feats[name].trigger == "Continuous") ? false : true,
                active: (this.feats[name].trigger == "Continuous") ? true : false,
                category: isBonus ? "Class" : "Feat",
                source: { class: "", level: 0 },
                notes: []
              };
            }
            feat.name = name;
            creature.abilities.push(feat);
          }
        }
        // Natural Armor
        let tempAC = monster.AC - 10;
        tempAC -= Math.floor((monster.Dex - 10) / 2);
        tempAC -= this.rules.size[creature.basics.size]["ac / atk"];
        let armor = creature.inventory[1].children[0].children[0];
        if (armor) { tempAC -= armor.value["AC Bonus"]; }
        for (const item of creature.inventory[1].children[1].children[0].children) {
          // Shields : for items in equipment . equipped . hands
          if (item.value["AC Bonus"]) { tempAC -= item.value["AC Bonus"]; }
        }
        if (tempAC > 0) {
          creature.abilities.push({
            name: "Natural Armor",
            description: "This creature is naturally tough, granting additional armor.",
            shortText: "",
            location: "self",
            trigger: "Continuous",
            bonuses: {
              "Natural Armor": { value: tempAC, type: "Natural Armor", targets: this.rules.bonuses["Natural Armor"].targets }
            },
            extras: {
              showMain: false,
              active: true,
              category: "Race",
              source: { class: "Innate", level: 0 },
              notes: []
            }
          });
        }
        // Special Qualities
        if (monster.SQ) {
          for (let abil of monster.SQ.split(',')) {
            creature.abilities.push({
              name: abil.trim(),
              description: "",
              shortText: "",
              location: "self",
              trigger: "Standard",
              bonuses: {},
              extras: {
                showMain: false,
                active: false,
                category: "Trait",
                source: { class: "Innate", level: 0 },
                notes: []
              }
            });
          }
        }
      }

      /***************************\
      *                           *
      *          ATTACKS          *
      *                           *
      \***************************/
      if (creature.actions) {
        // MELEE
        if (monster.Melee) {
          for (let atk of monster.Melee.split(',')) {
            atk = atk.toLowerCase();
            // abilities (poison, bleed, frost)
            let i, dmg, extras = {};
            i = atk.indexOf('plus');
            if (i > -1) {
              extras.notes = atk.slice(i);
              extras.notes = extras.notes.slice(0, -1); // remove trailing ')'
              atk = atk.slice(0, i);
            }
            // Dmg Die
            i = atk.indexOf("(");
            if (i > -1) {
              dmg = atk.slice(i+1);
              dmg = dmg.slice(0, dmg.indexOf('+'));
            }
            i = atk.indexOf("+");
            if (i > -1) { atk = atk.slice(0, i-1); }
            i = atk.indexOf("-");
            if (i > -1) { atk = atk.slice(0, i-1); }

            // Strip off masterwork & leading whitespace
            atk = atk.replace(/(mwk|masterwork|Mwk|Masterwork)\s/gm, "").trim();
            atk = atk.replace(/(^\w|\s\w)/g, m => m.toUpperCase()); // cap first letters
            // Add only Natural Attacks
            // item = equipment . equipped . hands . 'main hand'
            let item = creature.inventory[1].children[1].children[0].children[0];
            if (item && item.label == atk) { continue; }
            // item = equipment . equipped . hands . 'off hand'
            item = creature.inventory[1].children[1].children[0].children[1];
            if (item && item.label == atk) { continue; }

            let NAs = this.rules.natural_attacks;
            let atkName = atk;
            // get Nat Atk name, for searching (no #, no trailing 's')
            if (parseInt(atkName[0]) > 1) {
              extras['AtkNum'] = atk[0];
              atkName = atkName.slice(2);
              atkName = atkName.slice(0, -1);
            }
            let NAdmg, newAtk = {};
            if (Object.keys(NAs).includes(atkName)) {
              newAtk = NAs[atkName];
              NAdmg = NAs[atkName].Damage[creature.basics.size];
            } else {
              newAtk = NAs['Other'];
              NAdmg = NAs['Other'].Damage[creature.basics.size];
            }
            if (NAdmg != dmg) { newAtk.Damage[creature.basics.size] = dmg; }
            newAtk.Extras = extras;
            newAtk.Extras.naturalAtk = true;
            newAtk.style = "Melee";

            creature.actions[atkName] = newAtk;
          }
        }
        // RANGED
        if (monster.Ranged) {
          for (let atk of monster.Ranged.split(',')) {
            // Same as melee, see above section for comments
            atk = atk.toLowerCase();
            let extras = {};
            let i = atk.indexOf('plus');
            if (i > -1) {
              extras.notes = atk.slice(i);
              extras.notes = extras.notes.slice(0, -1);
              atk = atk.slice(0, i);
            }
            let dmg = atk.slice(atk.indexOf("(")+1);
            dmg = dmg.slice(0, dmg.indexOf('+'));
            atk = atk.slice(0, atk.indexOf('+')-1);
            atk = atk.replace(/(mwk|masterwork|Mwk|Masterwork)\s/gm, "");
            atk = atk.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
            let item = creature.inventory[1].children[1].children[0].children[0];
            if (item && item.label == atk) { continue; }
            item = creature.inventory[1].children[1].children[0].children[1];
            if (item && item.label == atk) { continue; }
            let NAs = this.rules.natural_attacks;
            let atkName = atk;
            if (parseInt(atk[0]) > 1) {
              extras['AtkNum'] = atk[0];
              atkName = atk.slice(2);
              atkName = atk.slice(0, -1);
            }
            let NAdmg, newAtk ={};
            if (Object.keys(NAs).includes(atkName)) {
              newAtk = NAs[atkName];
              NAdmg = NAs[atkName].Damage[creature.basics.size];
            } else {
              newAtk = NAs['Other'];
              NAdmg = NAs['Other'].Damage[creature.basics.size];
            }
            if (NAdmg != dmg) { newAtk.Damage[creature.basics.size] = dmg; }
            newAtk.Extras = extras;
            newAtk.Extras.naturalAtk = true;
            newAtk.style = "Ranged";
            creature.actions[atkName] = newAtk;
          }
        }
      }

      /***************************\
      *                           *
      *          SKILLS           *
      *                           *
      \***************************/
      if (creature.skills) {
        // set up class skills array
        let classSkills = [];
        for (let [cName, cls] of Object.entries(creature.classes)) {
          // Add type class skills
          if (cName == innate && cls.hd) {
            this.rules.creature_types[creature.basics.type].skills.forEach(skill => {
              classSkills.push(skill);
            });
          }
          // add class skills
          if (this.classes[cName]) {
            this.classes[cName].skills.forEach(skill => {
              if (!classSkills.includes(skill)) {
                classSkills.push(skill);
              }
            });
          }
        }
        // set up all skills
        for (let name of Object.keys(this.rules.skills)) {
          let skill = {
            ranks: 0,
            class: classSkills.includes(name),
            extras: {},
          };
          if (name == "Linguistics" && monster.Languages) {
            skill.extras.languages = monster.Languages.split(',');
          }
          if (name == "Fly" && monster.Maneuverability) {
            skill.extras.maneuverability = monster.Maneuverability;
              /*
              switch (monster.Maneuverability) {
              case 'Clumsy':
              skills -8
              break;
              }
              Clumsy –8
              Poor –4
              Average +0
              Good +4
              Perfect +8
              */
          }
          creature.skills[name] = skill;
        }
        // Get skill ranks
        let skills = monster.Skills.split(',');
        skills.forEach(skill => {
          let name = skill.slice(0, skill.search(/[+|-]/g)).trim();
          name = name.replace("Knowl.", "Knowledge");
          if (name.indexOf('(') > 0) {
            let tmpName = name.slice(0, name.indexOf('(')).trim();
            if ( tmpName == 'Knowledge' && name.slice(name.indexOf('(')).trim().includes('any') ) {
              name = 'Knowledge (arcana)';
            }
            if ( ['Artistry', 'Craft', 'Lore', 'Perform', 'Profession'].includes(tmpName) ) {
              name = tmpName;
            }
            creature.skills[name].extras.specialty = name.slice(name.indexOf('(')+1, name.indexOf(')'));
          }
          let bonus = skill.slice(skill.search(/[+|-]/g)-1);
          if (bonus.indexOf('(') > 0) { bonus = bonus.slice(0, bonus.indexOf('(')-1); }
          // total - ability mod
          let abil = this.rules.skills[name].ability;
          bonus -= Math.floor( (creature.attributes[abil].base -10) / 2);
          //class skill: total - 3;
          bonus += classSkills.includes(name) ? -3 : 0
          // total - Armor Penalty(s)
          if (this.rules.skills[name].armor_pen) {
            // creature.inventory[equipped].children[armor].children
            let armor = creature.inventory[1].children[0].children;
            if ( armor[0] ) { bonus -= armor[0].value.Penalty; }
            // creature.inventory[equipped].children[Weapons].children[Hands]
            for (let item of creature.inventory[1].children[1].children[0].children) {
              if ( Object.keys(this.equipment.Shields).includes(item.label) ) {
                bonus -= item.value.Penalty;
              }
            }
          }
          // total - Size Mod
          if (name == "Stealth" || name == "Fly") {
            bonus -= this.rules.size[creature.basics.size][name.toLowerCase()];
          }
          creature.skills[name].ranks = bonus;
        }); // End skill ranks for each
      }

      this.creature = creature; // update the val sent to CreatureCard AT THE END
    },
    viewCreature(index) {
      this.loadCreature(this.tableData[index]);
      this.creatureVisible = true;
    },
    // overwrite the creature with the JSON, then add the updated creature to the encounter
    addCreature() {
      for (const key of Object.keys(this.creature)) {
        this.creature[key] = JSON.parse(this.creatureJSON[key]);
      }
      this.encounter.monsters.push(this.creature);
      this.saveEncounter();
    },

    /***************************\
    *                           *
    *          DRAWER           *
    *                           *
    \***************************/
    openDrawer() {
      this.creatureJSON = {};
      for (const [key, value] of Object.entries(this.creature)) {
        this.creatureJSON[key] = JSON.stringify(value);
      }
      this.drawer = true;
    },
    loadCampaigns() {
      CampaignService.getCampaignList(this.userID, 0, 100)
      .then(response => {
        let tmp = JSON.parse(response.campaigns);
        this.campaigns = tmp.rows;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },
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
    saveEncounter() {
      EncounterService.updateEncounter(this.encounter)
      .then((response) => { this.$message({ message: `${response.encounter.name} updated`, type: 'success', }); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },

  }
};
</script>

<style media="screen">
.container { overflow: hidden; }

.el-table-v2__header-cell svg { margin: 0 0 0 5px; }
.table-filter {
  padding: 0;
  background-color: transparent;
  border: none;
}
.filter-list { display: grid; }
.dark table {
  background-color: light-dark( var(--white), var(--color-surface-100) );
}
</style>
