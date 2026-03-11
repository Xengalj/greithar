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
    <el-select v-model="selectArray/Object, (startWith'')" value-key="objectKey" placeholder="placeholderName" aria-label="selectName" multiple>
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

    <el-collapse v-model="array">
      <el-collapse-item name="1">
        <template #title> title, could be html
        </template>
      </el-collapse-item>
    </el-collapse>

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


    - set up encounters to have characters
      + characters belongsTo encounters (many to many)

    - Beastiary -> change ability.extras.source to abil.ext.id

    */





    let combined = {
      // primaryKey of id is auto made
      // belongsTo ( user )
      // manyToMany ( campaign, encounter )
      name: "Tzirzhalir",
      basics: {
        cr: 20,
        size: "colossal",
        type: "undead",
        subtypes: [ "Behemoth" ],
        race: null, // or String
        speed: {
          base:     { total: 0, sources: [] },
          swim:     { total: 0, sources: [] },
          climb:    { total: 0, sources: [] },
          fly:      { total: 0, sources: [] },
          burrow:   { total: 0, sources: [] }
        },
        alignment: "NE",
        environment: "Any",
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
      classes:{
        total: {
          // tracks innate magic, level feats, abil increases
          levels: 17,
          abilites: [
            [], [ `ABILITY_ID` ], [], [ "Feat (REPLACE)" ], [ "Ability Score Increase" ]
          ],
        },
        undead: {
          levels: 17,
          hd: 12,
          bab: 1,
          saves: {
            fort: { mult: 0.5, bonus: 0 },
            ref: { mult: 0.5, bonus: 0 },
            will: { mult: 0.5, bonus: 0 }
          },
          abilites: [],
          magic: {
            style: "Spontaneous Arcane",
            castingAtr: "Cha",
            casterLevel: 17,
            spellsPerDay: [],
            remainingCasts: []
          }
        },
        barbarian: {
          levels: 0,
          hd: 12,
          bab: 1,
          saves: {
            fort: { mult: 0.5, bonus: 0 },
            ref: { mult: 0.5, bonus: 0 },
            will: { mult: 0.5, bonus: 0 }
          },
          abilites: []
        }
      },
      abilites: [
        {
          name: "Dodge",
          description: "+1 dodge bonus to AC",
          shortText: "",
          location: "",
          trigger: "Continuous",
          bonuses: {
            "Dodge 0": {
              type: "Dodge",
              value: 1,
              targets: [ "touchAC", "totalAC" ]
            }
          },
          extras: {
            id: 1,
            active: true,
            category: "Other",
            showMain: false,
            notes: []
          }
        }
      ],
      actions: {
        Bite: {
          Damage: { "fine": "1", "diminuitive": "1d2", "tiny": "1d3", "small": "1d4", "medium": "1d6", "large": "2d8", "huge": "2d6", "gargantuan": "2d8", "colossal": "4d6" },
          Critical: "20/x2",
          Range: 0,
          "Damage Type": [ "Piercing" ],
          Proficiency: "Natural",
          Category: "Primary",
          Extras: {
            notes: "plus poison"
          },
          style: "Melee" // used to sort [ Melee, Range, Special ]
        }
      },
      conditions: [
        {
          name: "Orb of Utter Chaos",
          description: "Bestows a neg level to lawful",
          bonuses: {
            "Orb of Utter Chaos 1": {
              value: -1,
              type: "Untyped",
              targets: [ "cmd", "fort", "ref", "will", "cmb", "meleeAtkBonus", "rangedAtkBonus", "skills" ]
            }
          },
          extras: { "notes": [] }
        }
      ],
      skills: {
        Acrobatics: {
          ranks: 0,
          class: false,
          extras: {}
        }
      },
      coins: { cp: 0, sp: 0, gp: 0, pp: 0 },
      inventory: [
        {
          label: "Magic Items",
          extras: { icon: "amulet" },
          children: [] // holds neck, rings, etc
        },
        {
          label: "Equipped",
          extras: { icon: "equipment" },
          children: [
            {
              label: "Armor",
              extras: { icon: "armor", capacity: 1 },
              children: []
            },
            {
              label: "Weapons",
              extras: { icon: "weapons" },
              children: [
                {
                  label: "Hands",
                  extras: { icon: "abilityPalm", capacity: 2 },
                  children: []
                },
                {
                  label: "Back",
                  extras: { icon: "swordShield", capacity: 2 },
                  children: []
                }
              ]
            }
          ]
        },
        {
          label: "Items",
          extras: { icon: "inventory", capacity: 100 },
          children: []
        }
      ],
      spells: {},
      settings: {
        isNPC: false,
        isMonster: true,
        cardTab: "Abilities",
        mainSections: [ "defense", "actions" ],
        expandInventory: [ "Equipped", "Armor", "Weapons", "Hands", "Back", "Items" ],

        favoredClass: null, // or Object
        appearance: null, // or Object
        backstory: "",
        deity: "",
      }
    }


    };
  },
};
</script>
