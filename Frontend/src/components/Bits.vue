<template>
  <div class="container">
    <!--
      Splits:
      xs : Phone : 360px
      sm : Tablet : 800px
      md : Laptop : >
    -->
    <el-row :gutter="10" justify="center" align="middle">
      <el-col :xs="24" :sm="12" :md="6">
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
      </el-col>
    </el-row>

    <g-icon iconName="d20" iconSize="24px" iconColor="#CCC" />

    <el-tag size="small" effect="dark" type="primary" color="#FFAA00">
      CONTENT
    </el-tag>

    <el-divider style="max-width:50%">
      <h4> <g-icon iconSize="32px" iconName="magicSwirl" /> Classes </h4>
    </el-divider>

    <el-button @click="onClickEvent" size="large" type="primary" circle>
      CONTENT
    </el-button>

    <el-input v-model="inputString" @input="onChangeEvent" aria-label="inputName">
      <template #prepend>
        BEFORE BOX
      </template>
      <template #prefix>
        INSIDE START
      </template>
      <template #suffix>
        INSIDE END
      </template>
      <template #append>
        AFETR BOX
      </template>
    </el-input>

    <el-input type="textarea" v-model="inputString" :autosize="{ minRows: 1, maxRows: 4 }" aria-label="textAreaName" />

    <el-input-number v-model="inputNumber" :min="0" :max="10" @change="onChangeEvent" aria-label="inputNumberName" />

    <el-switch v-model="boolean" active-text="ON TEXT" inactive-text="OFF TEXT" inline-prompt />


    <!-- value-key needed for objects, not arrays -->
    <el-select v-model="selectArray/Object" value-key="objectKey" placeholder="placeholderName" aria-label="selectName" multiple>
      <template #tag>
        <el-tag v-for="(item, index) in selectArray/Object" :key="index" @close="closeEvent" effect="dark" closable>
          {{ selectArray/Object.name }}
        </el-tag>
      </template>
      <el-option v-for="item in optionsObject" :key="item.name" :label="item.name" :value="item" >
        OPTION TAG
      </el-option>
      <template #footer>
        FOOTER CONTENT
        <el-button v-if="!addingCondition" text bg size="small" @click="addNewContion()"> Add custom condition </el-button>
      </template>
    </el-select>

    <el-tooltip placement="top" effect="light">
      HOVER HERE
      <template #content>
        STUFF IN POP-UP
      </template>
    </el-tooltip>

    <el-popconfirm title="MAIN QUESTION / CONTENT" @confirm="onConfirmEvent" hide-icon>
      <template #reference>
        <el-button type="primary" size="small">
          OPEN POP BUTTON
        </el-button>
      </template>
      <template #actions="{ confirm }">
        POP CONTENT
        <el-button @click="confirm" type="primary" size="small" aria-label="buttonName">
          CONFIRM
        </el-button>
      </template>
    </el-popconfirm>

  </div>
</template>
<script>
const icons = require('@/components/template/svgPaths.json');

export default {
  name: "Bits",
  data() {
    return {
      loading: true,

      colors: [
        { value: '#E63415', label: 'Red' },
        { value: '#FF6600', label: 'Orange' },
        { value: '#FFDE0A', label: 'Yellow' },

        { value: '#3cb44b', label: 'Green' },
        { value: '#4167F0', label: 'Blue' },
        { value: '#911eb4', label: 'Purple' },

        { value: '#800000', label: 'Maroon' },
        { value: '#bfef45', label: 'Lime' },
        { value: '#1EC79D', label: 'Teal' },

        { value: '#42d4f4', label: 'Cyan' },
        { value: '#000075', label: 'Navy' },
        { value: '#f032e6', label: 'Magenta' },

        { value: '#ffd8b1', label: 'Apricot' },
        { value: '#aaffc3', label: 'Mint' },
        { value: '#dcbeff', label: 'Lavender' }
      ],
    };
  },
  mounted() {
    this.$message({ message: "Resting for 8 hours", type: "success" });

    /***************************\
    *                           *
    *          HELPERS          *
    *                           *
    \***************************/
    // for (let [key, value] of Object.entries(OBJECT)) {}
    // capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },

    /***************************\
    *                           *
    *        ADMIN CHEAT        *
    *                           *
    \***************************/
    /*
    Items
      extras - Attack / Damage Ability Override       = atk/dmgAbilOverride

    */

    /***************************\
    *                           *
    *           IDEAS           *
    *                           *
    \***************************/

    // TODO:
    /*
    - add maneuverability to fly { extras: { maneuverability: "average" }}
        Clumsy –8
        Poor –4
        Average +0
        Good +4
        Perfect +8


    - set up character/view to update a toon to use new format
      - setup character/view to use CreatureCard

    - set up group loot


    */






    let toon = {
      // primaryKey of id is auto made
      // belongsTo ( user )
      // belongsTo ( campaign )
      id: 4,
      name: "Tarka",
      basics: {
        cr: 9,
        size: "small",
        type: "humanoid",
        subtypes: [ "Reptilian" ],
        race: "Kobold",
        speed: {
          base:     { total: 30, sources: [ `+Kobold Racial Base` ] },
          swim:     { total: 0, sources: [] },
          climb:    { total: 0, sources: [] },
          fly:      { total: 0, sources: [] },
          burrow:   { total: 0, sources: [] }
        },
        alignment: "LE",
        appearance: {
          age: "18",
          gender: "female",
          height: `2'8"`,
          weight: "24lbs."
        },
        environment: "Urban",
        backstory: "When I was, a young boy...",
        diety: "Tiamat",
        favoredClass: {
          name: "witch",
          bonus: "+1 Galdur per Level"
        }
      },
      notes: "",
      attributes: {
        Str: { base: 12 },
        Dex: { base: 13 },
        Con: { base: 14 },
        Int: { base: 15 },
        Wis: { base: 10 },
        Cha: { base: 8 }
      },
      health: {
        damage: 0,
        nonlethal: 0
      },
      classes: [
        {
          // tracks innate magic, feats, abil increases, total level
          name: "Kobold", // Race / Type
          levels: 0,
          magic: {
            // Innate is only Spontaneous
            style: "Spontaneous Arcane",
            castingAtr: "Cha",
            // Spontaneous Casters
            remainingCasts: [ ],
            spellsPerDay: [ ],
          },
          abilites: [
            [ "", "" ]
          ]
        },
        {
          witch: {
            levels: 9,
            // Galdur Casters
            useGaldur: true,
            openRemaining: 22,
            openTotal: 22,
            reserveRemaining: 22,
            reserveTotal: 22,
            // Spontaneous Casters
            remainingCasts: [ 1, 4, 4, 3, 2, 1 ],
            spellsPerDay: [ 4, 4, 4, 3, 2, 1 ],
            // Prepared Casters
            preparedSpells: [
              0: [ [], [], [], [] ],
              1: [ [], [], [], [] ],
              2: [ [], [], [], [] ],
              3: [ [], [], [] ],
              4: [ [], [] ],
              5: [ [] ],
            ],
          }
        }
      ],
      abilities: [
        {
          name: "Armor",
          description: "Kobolds' naturally scaly skin grants them a +1 natural armor bonus.",
          shortText: "",
          location: "",
          trigger: "Continuous",
          bonuses: {
            "Armor 0": { value: 1, type: "Natural Armor", targets: [ "flatAC", "totalAC" ] }
          },
          extras: {
            showMain: false,
            active: true,
            category: "Race",
            notes: []
          }
        },
        { Dodge: {…} },
        { Cackle: {…} },
      ],
      conditions: [ {…}, {…}, {…} ],
      actions: { // renamed from actions
        "Bite": {
          Damage: { "fine": "1", "diminuitive": "1d2", "tiny": "1d3", "small": "1d4", "medium": "1d6", "large": "2d8", "huge": "2d6", "gargantuan": "2d8", "colossal": "4d6" },
          Critical: "20/x2",
          Range: 0,
          "Damage Type": [ "Piercing" ],
          Proficiency: "Natural",
          Category: "Primary",
          Extras: {
            notes: "plus poison",
            // naturalAtk: true
          },
          style: "Melee" // used to sort [ Melee, Range, Special ]
        },
        "Electrical Jolt": {
          Damage: { "fine": "0", "diminuitive": "1", "tiny": "1d2", "small": "1d3", "medium": "1d4", "large": "4d6", "huge": "1d8", "gargantuan": "2d6", "colossal": "2d8" },
          Critical: "20/x2",
          Range: 0,
          "Damage Type": [ "Electricity", ],

          Proficiency: "Natural",
          Category: "Secondary",
          Extras: {},
          style: "Ranged"
        }
      },
      ​
      resources: {
        "Rage": {
          color: "#CCC", // New
          left: 1,
          total: 1,
          units: "rounds",
          notes: "Notes"
        }
      },

      skills: { Acrobatics: { ranks: 0, class: false, extras: { notes: "" } }, Heal: {}, Lore: {} },
      coins: { cp: 0, sp: 0, gp: 0, pp: 0 },
      inventory: [ {}, {}, {} ],

      spells: {
        innate: [],
        witch: […]
      },


      settings: {
        isNPC: true,
        heroPoints: 0,
        cardTab: "Main",
        mainSections: [ "defense", "actions", "resources" ],
        expandInventory: [ 'Equipped', 'Armor', 'Weapons', 'Hands', 'Back', 'Items' ],
      },




      userId: 2,

      // Loaded with character
      user: {
        id: 2,
        username: "Xengalj",
        usermeta: Object { hero: 1, darkmode: true, faveColor: "#1a8d8d" }
      }
    };








  },
};
</script>
