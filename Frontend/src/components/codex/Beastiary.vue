<template>
  <div class="container">

    <!-- FILTERS -->
    <el-row :gutter="10">
      <el-col :span="6">
        <el-input v-model="tableSearch" @change="nameSearch" placeholder="Type to search names" aria-label="Search Monsters">
          <template #append>
            <el-button @click="nameSearch" text> Search </el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="2">
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
        <el-dialog
          v-model="creatureVisible"
          :width="width"
          style="margin-top: 75px"
        >
        <!-- :before-close="closeMonster" -->
          <!-- <CreatureCard :creatureName="creatureName"></CreatureCard> -->

          <CreatureCard :source="creature" @save-creature="saveCreature(creature);" @open-drawer="console.log('open drawer')"></CreatureCard>

        </el-dialog>
      </template>
    </el-auto-resizer>




    <!--

    <el-dialog :width="creatureWidth" v-model="monsterVisible" :before-close="monsterClose">

      <el-row :gutter="10" justify="center">
        <el-col :xs="12" :sm="8">
          <el-select v-model="campaign" @change="loadEncounters" filterable placeholder="Choose a Campaign" aria-label="Select Campaign">
            <el-option v-for="campaign in campaigns" :key="campaign.id" :label="campaign.name" :value="campaign" >
              {{ campaign.user.username }}'s {{ campaign.name }} ({{ campaign.id }})
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="8">
          <el-select v-model="encounter" filterable placeholder="Choose an Encounter" aria-label="Select Encounter">
            <el-option v-for="encounter in encounters" :key="encounter.id" :label="encounter.name" :value="encounter" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" class="center-horz" style="margin:5px;">
          <el-button v-if="encounter.id" @click="encounter.monsters.push(creature); saveEncounter();" type="success" size="large" aria-label="Join Encounter"> Join </el-button>
        </el-col>
      </el-row>

      <CreatureCard :source="creature" @save-creature="saveCreature(creature);" @open-drawer="drawer = true;"></CreatureCard>
    </el-dialog>

    -->


  </div>
</template>

<script>
import DataService from "@/services/data.service";
import CreatureCard from "@/components/template/CreatureCard.vue";
import { h, resolveComponent, ref } from "vue";
import { TableV2SortOrder } from 'element-plus';

export default {
  name: "Beastiary",
  components: { CreatureCard },
  data() {
    return {
      loading: false,

      tableSearch: "",
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
      typeChoices: [],
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
      alignChoices: [],
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
      environChoices: [],

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
                      { class: 'filter-list', modelValue: this.typeChoices, 'onUpdate:modelValue': (val) => { this.typeChoices = val; }, onChange: (val) => { this.handleFilter('Type', val); } },
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
                      { class: 'filter-list', modelValue: this.alignChoices, 'onUpdate:modelValue': (val) => { this.alignChoices = val; }, onChange: (val) => { this.handleFilter('Alignment', val); } },
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
                      { class: 'filter-list', modelValue: this.environChoices, 'onUpdate:modelValue': (val) => { this.environChoices = val; }, onChange: (val) => { this.handleFilter('Environment', val); } },
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
                ),
                h( btn,
                  { type: 'info', circle: true, onClick: () => this.editCreature(val.rowIndex) },
                  { default: () => [ h( icon, { iconSize: '24px', iconName: 'quill', iconColor: "#000" } ) ]}
                )
              ]} // end row children
            );
          }, // end cell render
        }
      ],

      allMonsters: [],
      tableData: [],

      // MONSTER MODAL
      creatureVisible: false,
      creature: {}
    };
  },

  mounted() {
    this.getBeastiary();
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

    /***************************\
    *                           *
    *          FILTERS          *
    *                           *
    \***************************/
    nameSearch() {
      let monName, searchStr, mons = this.allMonsters;
      searchStr = this.tableSearch.toLowerCase();
      this.tableData = [];
      if (searchStr == "") {
        this.tableData = mons;
        return;
      }
      this.loading = true;
      for (let i = 0; i < mons.length; i++) {
        monName = mons[i].Name.toLowerCase();
        if ( monName.includes( searchStr ) ) {
          this.tableData.push(mons[i]);
        }
      }
      this.loading = false;
    },
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



    handleFilter(key, value) {
      console.log(key, value);
      this.loading = true;


      this.typeChoices


      let mons = document.getElementsByClassName('el-table-v2__row');
      console.log(mons);

      for (let i = 0; i < mons.length; i++) {
        console.log( mons[i] );
        if (mons[i].hidden) { continue; }

        switch (key) {
          case 'Type':
            console.log(mons[i].children[1]);

            // if (value.includes( mon[i][key] )) {
            //   // this.tableData.push(mons[i]);
            //   // mon[i] = not hidden
            // }

            break;
          case 'Align':
            console.log(mons[i][2]);
            break;
          case 'Environment':
            console.log(mons[i][6]);
            break;
        }
      }


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
    viewCreature(index) {
      console.log(`View ${this.allMonsters[index].Name}`);
      console.log(this.allMonsters[index]);

      /*
      this.creatureSetup(this.allMonsters[index]);
        console.log('setup complete');

      this.viewCreature = true;
      */
    },
    editCreature(index) {
      console.log(`Edit ${this.allMonsters[index].Name}`);
      console.log(this.allMonsters[index]);
    },






    saveCreature(creature) {
      console.log(creature);
    },








    closeMonster() {
      this.monsterVisible = false;
    }
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
