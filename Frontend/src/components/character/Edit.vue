<template>
  <div class="container" v-loading="loading">

{{ character.basics }}

    <h2>{{ character.name }}</h2>
      <el-input v-model="character.name" />
      <el-input v-model="character.id" disabled />
      <!-- <el-row>
        <el-col :span="4" class="center-horz">
          Random Name Generator
          <el-select v-model="tempName.race" size="small" placeholder="Choose Race">
            <el-option v-for="(race, name) in races" :key="name" :label="name" :value="name" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <div v-if="tempName.race">
            Gender (♀, ♂, ⚨ First Names)
            <el-select v-model="tempName.gender" size="small" placeholder="Choose Gender">
              <el-option v-if="races[tempName.race].female" key="female" label="♀ female" value="female" />
              <el-option v-if="races[tempName.race].male" key="male" label="♂ male" value="male" />
              <el-option v-if="races[tempName.race].agender" key="agender" label="⚨ agender" value="agender" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="10">
          <div v-if="tempName.gender">
            <el-button type="primary" @click="genRandomName()"> Random Name! </el-button>
            {{ tempName.fName }} {{ tempName.surname }} ( {{ tempName.gender }} {{ tempName.race }} )
          </div>
        </el-col>
      </el-row> -->




      <!-- BASICS -->
      <el-row v-if="!loading">
        <el-col :span="12" class="center-horz">

          <el-select v-model="character.basics.alignment" size="small" placeholder="Choose Alignment">
            <el-option v-for="alignment in this.alignments" :key="alignment" :label="alignment" :value="alignment" />
          </el-select>

          <el-select v-model="character.basics.size" size="small">
            <el-option v-for="size in Object.keys(this.rules.size)" :key="size" :label="this.capFirsts(size)" :value="size" />
          </el-select>
          <el-tag size="large" effect="dark" type="primary">Space: {{ this.rules.size[character.basics.size].space }} </el-tag>




<!--


          <el-col :span="20">
            <el-row>
              <el-col :span="12">

              </el-col>
              <el-col :span="12">
                <el-tooltip placement="top" effect="light">
                  <el-tag size="small" effect="dark" type="primary">{{ capFirsts(basics.type.name) }}</el-tag>
                  <template #content>
                    {{ basics.type.levels }} HD (1d{{ basics.type.hd }})
                  </template>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row>
              <el-tooltip placement="top" effect="light" v-for="(cClass, name) in cClasses" :key="name">
                <el-tag size="small" effect="dark" type="primary" style="margin: 0 1px 0 0;">{{ capFirsts(name) }} {{ cClass.levels }}</el-tag>
                <template #content>
                  {{ cClass.levels }} HD (1d{{ cClass.hd }})
                </template>
              </el-tooltip>
              <el-tag size="small" effect="dark" type="info" v-for="subtype in basics.type.subtypes" :key="subtype" style="margin: 0 1px 0 2px;">
                {{ capFirsts(subtype) }}
              </el-tag>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center-vert center-horz"> <g-icon iconSize="24px" icon-name="forest"/> </el-col>
          <el-col :span="20" class="center-vert"> {{ basics.environment }} </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center-vert center-horz"> <g-icon iconSize="24px" icon-name="sparkle"/> </el-col>
          <el-col :span="20" class="center-vert"> XP : {{ basics.cr }} </el-col>
        </el-row>
      -->
      </el-col>

    </el-row>




    NE Medium (5 ft.)
Undead
Warrior 1Human Skeletal Champion
any
XP : 2


    <!-- ATTRIBUTES (ABILITIES) -->
    <el-row v-if="!loading">
      <el-col :span="12" class="center-horz">
        <svg width="225" height="200">
          <HexGraph :abilities="[attributes.Str.total, attributes.Dex.total, attributes.Con.total, attributes.Int.total, attributes.Wis.total, attributes.Cha.total]"></HexGraph>
        </svg>
      </el-col>

      <el-col :span="12" class="center-horz center-vert">
        <div class="stat-controls">

          <el-row style="justify-content:center">
            <el-col :span="2">Str:</el-col>
            <el-col :span="2">
              <el-tooltip placement="top" effect="light" v-if="attributes.Str.sources[0]">
                <el-tag size="large" effect="dark" type="primary">{{attributes.Str.total}}</el-tag>
                <template #content> <span v-for="bonus in attributes.Str.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
              </el-tooltip>
              <el-tag size="large" effect="dark" type="primary" v-else>{{attributes.Str.total}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="character.attributes.Str.base" :min="1" />
            </el-col>

            <el-col :span="2" :offset="4">Int:</el-col>
            <el-col :span="2">
              <el-tooltip placement="top" effect="light" v-if="attributes.Int.sources[0]">
                <el-tag size="large" effect="dark" type="primary">{{attributes.Int.total}}</el-tag>
                <template #content> <span v-for="bonus in attributes.Int.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
              </el-tooltip>
              <el-tag size="large" effect="dark" type="primary" v-else>{{attributes.Int.total}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="character.attributes.Int.base" :min="1" />
            </el-col>
          </el-row>

          <el-row style="justify-content:center">
            <el-col :span="2">Dex:</el-col>
            <el-col :span="2">
              <el-tooltip placement="top" effect="light" v-if="attributes.Dex.sources[0]">
                <el-tag size="large" effect="dark" type="primary">{{attributes.Dex.total}}</el-tag>
                <template #content> <span v-for="bonus in attributes.Dex.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
              </el-tooltip>
              <el-tag size="large" effect="dark" type="primary" v-else>{{attributes.Dex.total}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="character.attributes.Dex.base" :min="1" />
            </el-col>

            <el-col :span="2" :offset="4">Wis:</el-col>
            <el-col :span="2">
              <el-tooltip placement="top" effect="light" v-if="attributes.Wis.sources[0]">
                <el-tag size="large" effect="dark" type="primary">{{attributes.Wis.total}}</el-tag>
                <template #content> <span v-for="bonus in attributes.Wis.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
              </el-tooltip>
              <el-tag size="large" effect="dark" type="primary" v-else>{{attributes.Wis.total}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="character.attributes.Wis.base" :min="1" />
            </el-col>
          </el-row>

          <el-row style="justify-content:center">
            <el-col :span="2">Con:</el-col>
            <el-col :span="2">
              <el-tooltip placement="top" effect="light" v-if="attributes.Con.sources[0]">
                <el-tag size="large" effect="dark" type="primary">{{attributes.Con.total}}</el-tag>
                <template #content> <span v-for="bonus in attributes.Con.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
              </el-tooltip>
              <el-tag size="large" effect="dark" type="primary" v-else>{{attributes.Con.total}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="character.attributes.Con.base" :min="1" />
            </el-col>

            <el-col :span="2" :offset="4">Cha:</el-col>
            <el-col :span="2">
              <el-tooltip placement="top" effect="light" v-if="attributes.Cha.sources[0]">
                <el-tag size="large" effect="dark" type="primary">{{attributes.Cha.total}}</el-tag>
                <template #content> <span v-for="bonus in attributes.Cha.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
              </el-tooltip>
              <el-tag size="large" effect="dark" type="primary" v-else>{{attributes.Cha.total}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="character.attributes.Cha.base" :min="1" />
            </el-col>
          </el-row>

        </div>
      </el-col>
    </el-row>





    <!-- FOOTER -->
    <div style="text-align: right">
      <el-button type="primary" @click="saveMonster()"> Save Changes </el-button>
    </div>


{{this.tmpSource}}


    <div v-for="(item, name) in this.tmpSource" :key="name">
      {{ name }} : {{ item }}
      <br><br>
    </div>


  </div>
</template>

<script>
import CharacterService from "@/services/character.service";
import HexGraph from '@/components/template/HexGraph.vue'

export default {
  name: "Edit Character",
  components: { HexGraph },
  data() {
    return {
      loading: true,

      alignments: [ "LG", "NG", "CG", "LN", "N", "CN", "LE", "NE", "CE" ],

      character: {},

      tmpSource: {
        id : 0,
        name : "Smelborp",
        basics : { "cr": 0, "size": "medium", "type": {}, "diety": "", "speed": {}, "alignment": "N", "backstory": "When I was, a young boy...", "appearance": { "age": 21, "gender": "", "height": "", "weight": "" }, "environment": "Urban", "favoredClassBonus": { "bonus": "+1 HP, Skill, or Galdur per Level", "class_id": 0 } },
        classes : {},
        abilities : {
          "Racial Score Modifier": {
            "trigger": "Continuous",
            "description": "Humans get a +2 racial bonus to any one ability.",
            "benefit": "",
            "bonuses": {
              "+": { "value": 2, "targets": [ "Con" ], "type": "Racial" }
            },
            "extras": { "active": true, "showMain": false, "source": "Race" }
          }
        },
        attributes : {
          "Str": { "base": 15 },
          "Dex": { "base": 13 },
          "Con": { "base": 14 },
          "Int": { "base": 10 },
          "Wis": { "base": 12 },
          "Cha": { "base": 8 },
        },
        health : {},
        actions : { "melee": {}, "ranged": {}, "special": {} },
        skills : {},

        magic : {},
        inventory : [ { "label": "Magic Items", "extras": { "icon": "amulet" }, "children": [ { "label": "Head", "extras": { "capacity": 1 }, "children": [] }, { "label": "Headband", "extras": { "capacity": 1 }, "children": [] }, { "label": "Eyes", "extras": { "capacity": 1 }, "children": [] }, { "label": "Shoulders", "extras": { "capacity": 1 }, "children": [] }, { "label": "Neck", "extras": { "capacity": 1 }, "children": [] }, { "label": "Chest", "extras": { "capacity": 1 }, "children": [] }, { "label": "Body", "extras": { "capacity": 1 }, "children": [] }, { "label": "Belt", "extras": { "capacity": 1 }, "children": [] }, { "label": "Wrists", "extras": { "capacity": 1 }, "children": [] }, { "label": "Ring 1", "extras": { "capacity": 1 }, "children": [] }, { "label": "Ring 2", "extras": { "capacity": 1 }, "children": [] }, { "label": "Feet", "extras": { "capacity": 1 }, "children": [] }, { "label": "Slotless", "extras": { "capacity": 1 }, "children": [] } ] }, { "label": "Equipped", "extras": { "icon": "equipment" }, "children": [ { "label": "Armor", "extras": { "icon": "armor", "capacity": 1 }, "children": [] }, { "label": "Weapons", "extras": { "icon": "weapons" }, "children": [ { "label": "Hands", "extras": { "icon": "abilityPalm", "capacity": 2 }, "children": [] }, { "label": "Back", "extras": { "icon": "swordShield", "capacity": 2 }, "children": [] } ] } ] }, { "label": "Items", "extras": { "icon": "inventory" }, "children": [ { "label": "Backpack", "extras": { "icon": "backpack", "capacity": 50 }, "children": [] } ] } ],

        userSettings : { "cardTab": "main", "heroPoints": 1, "mainSections": [ "defense", "actions", "conditions" ], "expandInventory": [ "Equipped", "Armor", "Weapons", "Hands", "Back", "Items" ] },
        conditions : {},
        notes : {},
        userId : 2
      }

      ,
    };
  },
  computed: {
    rules() { return this.$store.state.data.rules; },
    classes() { return this.$store.state.data.classes; },
    equipment() { return this.$store.state.data.equipment; },
    conditions() { return this.$store.state.data.conditions; },

    inventory() { return this.character.inventory; },
    abilities() {
      if (this.loading) { return {}; }
      let abilities = this.character.abilities;
      for (let actions of Object.entries(this.character.actions)) {
        if (actions[0] == "special" || actions[0] == "basic") {
          actions = actions[1];
          for (var action in actions) {
            if (!Object.keys(abilities).includes(action)) {
              abilities[action] = actions[action];
            }
          }
        }
      }
      return abilities;
    },


    // USES: <data>activeConditions, inventory, abilities
    bonuses() {
      let bonuses = {};
      if (this.loading) { return bonuses; }

      // Add feats and other abilities to bonuses
      for (const ability in this.abilities) {
        if (this.abilities[ability].extras.active && this.abilities[ability].bonuses) {
          for (const [name, bonus] of Object.entries(this.abilities[ability].bonuses)) {
            bonuses[name] = bonus;
          }
        }
      }
      // Add conditions
      for (const condition in this.activeConditions) {
        if (this.activeConditions[condition].bonuses) {
          for (const [name, bonus] of Object.entries(this.activeConditions[condition].bonuses)) {
            bonuses[name] = bonus;
          }
        }
      }
      // Armor
      let item = this.inventory[1].children[0].children[0];
      if (item) {
        bonuses[item.label] = {};
        bonuses[item.label].type = "Armor";
        bonuses[item.label].targets = item.value.targets;
        bonuses[item.label].value = item.value["AC Bonus"];
      }
      // Shields          For items in equipment . equipped . hands
      for (const item of this.inventory[1].children[1].children[0].children) {
        if (item.value.Proficiency == "Shields") {
          bonuses[item.label] = {};
          bonuses[item.label].type = "Shield";
          bonuses[item.label].targets = item.value.targets;
          bonuses[item.label].value = item.value["AC Bonus"];
        }
      }
      // Magic Items        For items in equipment . (slotted) Magic Items
      for (const slot of this.inventory[0].children) {
        for (const item of slot.children) {
          if (item.bonuses) {
            for (const [name, bonus] of Object.entries(item.bonuses)) {
              bonuses[name] = {};
              bonuses[name].type = bonus.type;
              bonuses[name].targets = bonus.targets;
              bonuses[name].value = bonus.value;
            }
          }
        }
      } // end magic items
      // console.log("BONUSES", bonuses);
      return bonuses;
    },

    // USES: bonusLoop(bonuses)
    attributes() {
      let attributes = {
        Str: { total: 10, sources: [], mod: 0 },
        Dex: { total: 10, sources: [], mod: 0 },
        Con: { total: 10, sources: [], mod: 0 },
        Int: { total: 10, sources: [], mod: 0 },
        Wis: { total: 10, sources: [], mod: 0 },
        Cha: { total: 10, sources: [], mod: 0 }
      };
      if (this.loading) { return attributes; }
      for (let [name, attr] of Object.entries(this.character.attributes)) {
        attributes[name].total = attr.base;
        attributes[name].mod = Math.floor( (name == "-" ? 0 : attr.base - 10) / 2 );
        this.bonusLoop(attributes[name], name);
      }
      return attributes;
    },

  },
  mounted() {
    console.log(this.rules);
    CharacterService.getCharacter(this.$route.params.id).then(response => {
      console.log('response:', response);
      this.character = this.tmpSource;
      // this.character = response.character[0];
      this.loading = false;
      console.log('this.character:', this.character);
    })
    .catch(err => { console.error(err); });
  },
  methods: {
    capFirsts(string) {
      return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : "";
    },


    init() {
      console.log('init');
    },


    bonusLoop(object, tString) {
          // console.log(tString, object);
      // object = the bonus object we are adding to: { total: #, sources: [] }
      // tString = the target string we match to add to the bonus object: "atkBonus" || "Str" || "touchAC"
      // Add Active Bonuses
      let typedBonuses = {};
      let prefix = "";

      for (let [name, bonus] of Object.entries(this.bonuses)) {
            // console.log(name, bonus);
        prefix = (bonus.value > 0) ? "+" : "";
        if (Object.keys(this.rules.bonuses).includes(bonus.type)) {
          // If the bonus type doesn't stack
          if (typedBonuses[bonus.type]) {
            // If we have the type of bonus already
            if (typedBonuses[bonus.type].value > bonus.value) {
              // If the current is higher, skip
              continue;
            } else {
              // remove current bonus & value
              bonus.targets.forEach(target => {
                if (target == tString) {
                  object.total -= typedBonuses[bonus.type].value;
                  // loop on sources looking for the one to remove
                  object.sources.forEach((source, i) => {
                    if ( source.includes(typedBonuses[bonus.type].name) ) {
                      object.sources.splice(i, 1);
                    }
                  });
                }
              });
            }
          }
          typedBonuses[bonus.type] = { name: name, value: bonus.value };
        } // End typed bonus prep

        if (!object.sources.includes(`${prefix}${bonus.value} ${name}`)) {
          // if we dont already have that specific bonus applied, add it
          bonus.targets.forEach(target => {
            if (target == tString) {
              // If bonus.targets includes tString, apply it
              object.total += parseInt(bonus.value);
              object.sources.push(`${prefix}${bonus.value} ${name}`);
            }
          });
        }
      } // End Bonuses Loop
    },




  }
}
</script>

<style lang="css" scoped>
.stat-controls > :not(:last-child) {
  margin-bottom: 20px;
}
</style>
