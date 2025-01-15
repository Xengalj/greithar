<template lang="html">

  <h2>{{ title }}</h2>

  <!-- Basics -->
  <el-row :gutter="20">
    <el-col :span="12" class="center-horz">
      <svg width="225" height="200">
        <HexGraph :abilities="[attributes.Str, attributes.Dex, attributes.Con, attributes.Int, attributes.Wis, attributes.Cha]"></HexGraph>
      </svg>
      <div class="stat-controls">
        <el-row :gutter="5">
          <el-col :span="3">  Str:</el-col>
          <el-col :span="3">  <el-tag size="small" effect="dark" type="primary">{{attributes.Str}}</el-tag>  </el-col>
          <el-col :span="3">  Int:</el-col>
          <el-col :span="3">  <el-tag size="small" effect="dark" type="primary">{{attributes.Int}}</el-tag>  </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="3">  Dex:</el-col>
          <el-col :span="3">  <el-tag size="small" effect="dark" type="primary">{{attributes.Dex}}</el-tag>  </el-col>
          <el-col :span="3">  Wis:</el-col>
          <el-col :span="3">  <el-tag size="small" effect="dark" type="primary">{{attributes.Wis}}</el-tag>  </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="3">  Con:</el-col>
          <el-col :span="3">  <el-tag size="small" effect="dark" type="primary">{{attributes.Con}}</el-tag>  </el-col>
          <el-col :span="3">  Cha:</el-col>
          <el-col :span="3">  <el-tag size="small" effect="dark" type="primary">{{attributes.Cha}}</el-tag>  </el-col>
        </el-row>
      </div>
    </el-col>

    <el-col :span="12">
      <div class="center-horz">
        <g-icon iconSize="128px" :icon-name="basics.type.name" :key="basics.type.name"/>
      </div>
      <el-row :gutter="5">
        <el-col :span="4" class="center center-vert">
          <g-icon iconSize="24px" icon-name="compass"/>
        </el-col>
        <el-col :span="20" class="center">
          <el-row>
            <el-col :span="22" class="center"> {{ basics.alignment }} {{ basics.size }} ({{ basics.sizeStats.space }}) </el-col>
          </el-row>
          <el-row>
            <el-col class="center">
              <el-tag size="small" effect="dark" type="primary">{{basics.type.name}}</el-tag>
              <el-tag v-for="subtype in basics.type.subtypes" :key="subtype" size="small" effect="dark" type="info">{{ subtype }}</el-tag>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="center"> <g-icon iconSize="24px" icon-name="treasure"/> </el-col>
        <el-col :span="20" class="center"> {{ this.original.Treasure }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="center"> <g-icon iconSize="24px" icon-name="forest"/> </el-col>
        <el-col :span="20" class="center"> {{ this.original.Environment }} </el-col>
      </el-row>
    </el-col>
  </el-row>
  <el-divider border-style="hidden"/>


  <!-- Defense -->
  <el-collapse v-model="openSections">
    <el-collapse-item title="Defense" name="defense">
      <el-row :gutter="20">
        <el-col :span="3" class="center center-vert"> <g-icon iconSize="32px" iconName="Armor" /> </el-col>

        <el-col :span="7" class="center">
          HP: {{ health }}
          <br><br>
          HP: {{ creature.health.total }} ({{ this.original.HDNum }}{{ creature.health.HDString }}{{ creature.health.bonus}} / {{ this.original.HP }})
          <br><br>
          AC: {{ creature.ac.total }} / {{ this.original.AC ? this.original.AC.total : 10 }}
          <br>
          Touch: {{ creature.ac.touch }}
          <br>
          Flat Footed: {{ creature.ac.flat }}
          <br>
          CMD: {{ 10 + this.original.BAB + creature.abilities.StrMod + creature.abilities.DexMod + (this.original.AC ? this.original.AC.dodge : 0) + creature.size["cmb / cmd"] }}
        </el-col>

        <el-col :span="7" class="center">
          <br><br>
          Fort: {{ creature.saves.fort }} / {{ this.original.Fort }}
          <br>
          Ref: {{ creature.saves.ref}} / {{ this.original.Ref }}
          <br>
          Will: {{ creature.saves.will}} / {{ this.original.Will }}
          <br>
          CMB: {{ this.original.BAB + creature.abilities.StrMod + creature.size["cmb / cmd"] }}
          <br>
          <span v-if="this.original.dr"> DR: {{ this.original.dr }} </span>
          <br>
          <span v-if="this.original.sr"> SR: {{ this.original.sr }} </span>
        </el-col>

        <el-col :span="7" class="center">
          Init: {{ creature.init }}
          <br>
          Senses: <span v-for="item in creature.senses" :key="item.id"> {{ item }}, </span>
          <br>
          Speed: {{ this.original.Speed }}
        </el-col>
      </el-row>

      <el-row v-if="this.original.Immunities">
        <el-col :span="3" class="center">
        </el-col>
        <el-col :span="7" class="center">
          Immunities
        </el-col>
        <el-col :span="14" class="center">
          <span v-for="item in this.original.Immunities" :key="item.id">
            {{ item }},
          </span>
        </el-col>
      </el-row>
      <el-row v-if="this.original.Weaknesses">
        <el-col :span="3" class="center">
        </el-col>
        <el-col :span="7" class="center">
          Weaknesses
        </el-col>
        <el-col :span="14" class="center">
          <span v-for="item in this.original.Weaknesses" :key="item.id">
            {{ item }},
          </span>
        </el-col>
      </el-row>
    </el-collapse-item>


    <!-- Offense -->
    <el-collapse-item title="Offense" name="offense">
      <el-row :gutter="20">
        <el-col :span="3" class="center">
          <g-icon iconSize="32px" iconName="swordShield" />
        </el-col>

        <el-col :span="7" class="center">
          <div class="center-horz">Melee</div>
          Reach: {{ this.original.Reach }} ft.
          <div v-for="atk in creature.melee" :key="atk.id">
            <span v-if="atk.atkNum"> {{ atk.atkNum }} </span> {{ atk.atkName }} {{ atk.atkMod }} ({{ atk.dmgDie }}{{ atk.dmgMod }}<span v-if="atk.bonus"> {{ atk.bonus }}</span>)<br>
          </div>
        </el-col>

        <el-col :span="7" class="center">
          <div class="center-horz">Ranged</div>
          <div v-for="atk in creature.ranged" :key="atk.id">
            <span v-if="atk.atkNum"> {{ atk.atkNum }} </span> {{ atk.atkName }} {{ atk.atkMod }} ({{ atk.dmgDie }}<span v-if="atk.dmgMod">{{ atk.dmgMod }}</span><span v-if="atk.bonus"> {{ atk.bonus }}</span>)<br>
          </div>
        </el-col>

        <el-col :span="7" class="center">
          <div class="center-horz">Special</div>
          <div v-for="atk in creature.special" :key="atk.id">
            {{ atk }}
          </div>
        </el-col>
      </el-row>
    </el-collapse-item>


    <!-- Magic -->
    <el-collapse-item title="Magic" name="magic" v-if="this.original.Magic">
      <el-row :gutter="20">
        <el-col :span="3" class="center">
          <g-icon iconSize="32px" iconName="rolledScroll" />
        </el-col>
        <el-col :span="21" class="center">
          {{ this.original.Magic }}
        </el-col>
      </el-row>
    </el-collapse-item>


    <!-- Specials -->
    <el-collapse-item title="Special" name="special" v-if="this.original.Extras">
      <el-row :gutter="20">
        <el-col :span="3" class="center">
          <g-icon iconSize="32px" iconName="Star" />
        </el-col>
        <el-col :span="21" class="center">
          <div v-for="(value, key) in this.original.Extras" :key="key">
            <strong>
              {{ key }}
            </strong>
            <br>
            {{ value }}
            <br><br>
          </div>
        </el-col>
      </el-row>
    </el-collapse-item>


    <!-- Others -->
    <el-collapse-item title="Others" name="other">
      <el-row :gutter="20">
        <el-col :span="3" class="center">
          <g-icon iconSize="32px" iconName="openBook" />
        </el-col>

        <el-col :span="7" class="center">
          Feats
          <br>
          {{ this.original.Feats }}
        </el-col>

        <el-col :span="7" class="center">
          Skills
          <br>
          {{ this.original.Skills }}
        </el-col>

        <el-col :span="7" class="center">
          <span v-if="this.original.Class1">
            Classes: {{ this.original.Class1}} ({{ this.original.Class1_Lvl }})
            <br><br>
          </span>
          Languages
          <br>
          {{ this.original.Languages }}
        </el-col>
      </el-row>
    </el-collapse-item>
  </el-collapse>

  <br>
  <el-row :gutter="20">
    <el-col :span="3" class="center">
      <el-button type="primary" @click="addMonster()"> Add to Session </el-button>
    </el-col>
    <el-select-v2 v-model="basics.size" :options="this.sizeSelect" size="small" style="width: 120px" />

  </el-row>

</template>

<script>
import DataService from "@/services/data.service";
import HexGraph from '@/components/template/HexGraph.vue'
// const miscTables = require('@/components/codex/tables.json');
const supplementTables = {};
// const supplementTables = require('@/components/codex/monsters.json');
// const equipmentTables = require('@/components/codex/equipment.json');

export default {
  name: "CreatureCard",
  components: { HexGraph },
  props: {
    creatureName: { type: String, default: () => "Kobold" },
    source: { type: Object },
    // , default: () => ({
      // "name": "",
      // "attributes": {
      //   "Str": 0, "StrMod": -5,
      //   "Dex": 0, "DexMod": -5,
      //   "Con": 0, "ConMod": -5,
      //   "Int": 0, "IntMod": -5,
      //   "Wis": 0, "WisMod": -5,
      //   "Cha": 0, "ChaMod": -5
      // },
      // "basics": {
      //   "cr": 0,
      //   "alignment": "N",
      //   "size": "medium",
      //   "sizeStats": {},
      //   "type": { "name": "", "levels": 0, "hd": 0, "subtypes": [] },
      //   "environment": "any"
      // },
      // "classes": {  },
      //
      // "defense": {  },
      // "equipment": {  },
      // "feats": {  },
      // "skills": {  },
      //
      // "active": {  },
      // "bonuses": {  }
    // }) }
  },
  data() {
    return {
      rules: {},
      classes: {},
      equipment: {},

      tables: {}, // size & dmg types

      supplement: supplementTables,
      openSections: [ "defense", "offense" ],
      sizeSelect: [
        { value: "Fine", label: "Fine", },
        { value: "Diminuitive", label: "Diminuitive", },
        { value: "Tiny", label: "Tiny", },
        { value: "Small", label: "Small", },
        { value: "Medium", label: "Medium", },
        { value: "Large", label: "Large", },
        { value: "Huge", label: "Huge", },
        { value: "Gargantuan", label: "Gargantuan", },
        { value: "Colossal", label: "Colossal", }
      ],
      original: {}
    }
  },

  computed: {
    title() { return this.source.name ? this.source.name.concat(" CR ", this.source.basics.cr) : ""; },
    attributes() {
      return this.source.attributes ? this.source.attributes : {
        "Str": 0, "StrMod": -5,
        "Dex": 0, "DexMod": -5,
        "Con": 0, "ConMod": -5,
        "Int": 0, "IntMod": -5,
        "Wis": 0, "WisMod": -5,
        "Cha": 0, "ChaMod": -5,
      };
    },
    basics() {
      let basics = this.source.basics ? this.source.basics : { "type": {}, "size": "medium"};
      basics.sizeStats = this.rules.size ? this.rules.size[basics.size] : { "space": "5 ft." };
      return basics;
    },
    health() {
      let health = { "bonus": 0, "total": 0, "hd": [] };

      if (this.source.classes) {
        let firstLevel = true;

        if (this.basics.type.levels) { health.hd.push( `${this.basics.type.levels}d${this.basics.type.hd}` ); }
        for (let i = 1; i < this.basics.type.levels+1; i++) {
          firstLevel = false;
          health.total += this.basics.type.hd / 2 + 0.5;

          if (this.basics.type.name == "undead") {
            health.bonus += this.attributes.ChaMod;

          } else if (this.basics.type.name == "construct") {
            switch (this.basics.size) {
              case "small": health.bonus += 10; break;
              case "medium": health.bonus += 20; break;
              case "large": health.bonus += 30; break;
              case "huge": health.bonus += 40; break;
              case "gargantuan": health.bonus += 60; break;
              case "colossal": health.bonus += 80; break;
              default: health.bonus += 0;
            }

          } else {
            health.bonus += this.attributes.ConMod;
          }
        }

        // Class Loop
        for (let [name, cClass] of Object.entries(this.source.classes)) {
          // get class info into class
          cClass = {
            "name": name,
            "levels": cClass.levels,
            "hd": 10,
            "ranks": 2,
            "skills": [ "Climb (Str)", "Craft (Int)", "Handle Animal (Cha)", "Intimidate (Cha)", "Profession (Wis)", "Ride (Dex)", "Swim (Str)" ],
            "proficiency": [ "simple weapons", "martial weapons", "light armor", "medium armor", "heavy armor", "shields" ],
            "alignment": [ "LG", "NG", "CG", "LN", "N", "CN", "LE", "NE", "CE" ],
            "bab": 1, // Fast BAB: HD*1
            "fort": { "mult": 0.5, "bonus": 2 }, // Good Save: HD/2 +2
            "ref": { "mult": 0.33, "bonus": 0 }, // Poor Save: HD/3
            "will": { "mult": 0.33, "bonus": 0 }
          };

          health.hd.push( `${cClass.levels}d${cClass.hd}` );

          // Level Loop
          for (let i = 1; i < cClass.levels+1; i++) {
            health.total += firstLevel ? cClass.hd : cClass.hd / 2 + 0.5;
            if (this.basics.type.name == "undead") {
              health.bonus += this.attributes.ChaMod;
            } else if (this.basics.type.name != "construct") {
              health.bonus += this.attributes.ConMod;
            }
          }
        }
      } // end if have source

      health.total = Math.floor(health.total);
      return health;
    },
    bab() {
      return 0;
    },


    creature() {
      let creature = {
        title: this.original.Name ? this.original.Name.concat(" CR ", this.original.CR) : "",
        abilities: {
          StrMod: Math.floor((this.original.Str - 10) / 2),
          DexMod: Math.floor((this.original.Dex - 10) / 2),
          ConMod: Math.floor((this.original.Con - 10) / 2),
          IntMod: Math.floor((this.original.Int - 10) / 2),
          WisMod: Math.floor((this.original.Wis - 10) / 2),
          ChaMod: Math.floor((this.original.Cha - 10) / 2),
        },
        sizeLabel: this.original.Size ? this.original.Size : "Medium",
        size: {},
        health: { total: 0, bonus: 0, HDString: "d".concat(this.original.HDType, "+") },
        ac: { total: 10, touch: 10, flat: 10 },
        saves: { fort: 0, ref: 0, will: 0 },
        init: 0,
        sneses: [],
        melee: [],
        ranged: [],
        special: this.original.Special,
        magic: this.original.Magic
      };

      // Ability Mods can only be accesed affter initialization

      // SET SIZE
      creature.size = this.rules.size ? this.rules.size[creature.sizeLabel.toLowerCase()] : 0;

      // SET DEFENSE
      creature.health.total = Math.floor( (Math.floor(this.original.HDType/2)+0.5) * this.original.HDNum ) + ( creature.abilities.ConMod * this.original.HDNum );
      creature.health.bonus = creature.abilities.ConMod * this.original.HDNum;
      // TODO: Toughness Feat ( 3 + Int((1 * Level) - 3) )

      let bonus = {
        size: creature.size ? creature.size["ac / atk"] : 0,
        armor: 0,
        shield: 0,
        natural: this.original.AC ? this.original.AC.natural : 0,
        dodge: this.original.AC ? this.original.AC.dodge : 0,
        dex: creature.abilities.DexMod
      };
      Object.values(bonus).forEach(item => { creature.ac.total = creature.ac.total + item; });
      creature.ac.touch = creature.ac.total - bonus.armor - bonus.shield - bonus.natural;
      creature.ac.flat = creature.ac.total - bonus.dex - bonus.dodge;

      if (this.original.Saves) {
        creature.saves.fort = this.original.Saves.fort + creature.abilities.ConMod;
        creature.saves.ref = this.original.Saves.ref + creature.abilities.DexMod;
        creature.saves.will = this.original.Saves.will + creature.abilities.WisMod;
      }

      creature.init = creature.abilities.DexMod;
      creature.senses = this.original.Senses;


      // SET OFFENSE
      if (this.original.Melee) {
        this.original.Melee.forEach((atk, i) => {
          let [atkNum, atkName, atkMod, dmgDie, dmgMod, crit, bonus] = [ 0, "", 0, "", 0, "", "" ];
          let atkArr = atk.split(" ");
          // console.log("original : ", atkArr);

          // Rremove leading empty index from extra attack types
          if (!atkArr[0]) { atkArr.shift(); }
          // Handle multi-attacks
          if (!isNaN(parseInt(atkArr[0])) ) {
            atkNum = atkArr[0];
            atkArr.shift();
          }

          let nameDone = false;
          while(atkArr.length > 0) {
            // Set atkName
            if (atkArr[0][0] == "+" || atkArr[0][0] == "-") { nameDone = true; }
            if (!nameDone) { atkName = atkName.concat(atkArr[0], " "); }
            // Set bonus (check if we are past the dmg die)
            if (dmgDie) {
              if (atkArr[0][atkArr[0].length-1] == ")") {
                atkArr[0] = atkArr[0].slice(0, -1);
              }
              bonus = bonus.concat(" ", atkArr[0]);
            }
            // Set dmgDie & crit
            if (atkArr[0][0] == "(") {
              dmgDie = atkArr[0];
              dmgDie = dmgDie.split("+")[0].substr(1); // substr removes leading (
              dmgDie = dmgDie.split("-")[0];
              dmgDie = dmgDie.split("–")[0];  // the - is sometimes not the same one
              crit = atkArr[0].split("x")[1]
              if (crit) {
                crit = crit.slice(0, 1);
                crit = "/x".concat(crit);
              }
            }
            atkArr.shift();
          }

          if (this.original.Melee.length == 1 && !atkNum && ["bite", "claw", "gore", "slam", "sting", "talons"].includes(atkName)) {
            // 1 Natural Attack
            atkMod = this.original.BAB + creature.abilities.StrMod + creature.size["ac / atk"];
            dmgMod = creature.abilities.StrMod + creature.abilities.StrMod/2;
          } else if (["hoof", "tentacle", "wing", "pincers", "tail slap"].includes(atkName)) {
            // Secondary Natural Attack
            atkMod = this.original.BAB - 5 + creature.abilities.StrMod + creature.size["ac / atk"];
            dmgMod = creature.abilities.StrMod / 2;
          } else {
            // Primary Natural Attack / Weapon Attack
            atkMod = this.original.BAB + creature.abilities.StrMod + creature.size["ac / atk"];
            dmgMod = creature.abilities.StrMod;
          }
          atkMod = atkMod>0 ? `+${atkMod}` : atkMod;
          dmgMod = dmgMod>0 ? `+${dmgMod}` : dmgMod;
          if (crit) { dmgMod = dmgMod.toString().concat(crit); }
          creature.melee[i] = { atkNum, atkName, atkMod, dmgDie, dmgMod, bonus };
          // console.log("final:", creature.melee[i]);
        });
      }

      if (this.original.Ranged) {
        this.original.Ranged.forEach((atk, i) => {
          let [atkType, atkNum, atkName, atkMod, dmgDie, dmgMod, crit, bonus] = [ "ranged", 0, "", "", "", 0, "", "" ];
          let atkArr = atk.split(" ");
          // console.log("original : ", atkArr);

          // Rremove leading empty index from extra attack types
          if (!atkArr[0]) { atkArr.shift(); }
          // Handle multi-attacks
          if (!isNaN(parseInt(atkArr[0])) ) {
            atkNum = atkArr[0];
            atkArr.shift();
          }

          // Set atkName, dmgDie, bonus & atkType
          let nameDone = false;
          while(atkArr.length > 0) {
            // Set atkName
            if (atkArr[0][0] == "+" || atkArr[0][0] == "-") { nameDone = true; }
            if (!nameDone) {
              atkName = atkName.concat(atkArr[0], " ");
              if (["sling", "shortbow", "longbow"].includes(atkArr[0])) {
                atkType = "thrown";
              }
            }
            // Set bonus (check if we are past the dmg die)
            if (dmgDie) {
              if (atkArr[0][atkArr[0].length-1] == ")") {
                atkArr[0] = atkArr[0].slice(0, -1);
              }
              bonus = bonus.concat(" ", atkArr[0]);
            }
            // Set dmgDie
            if (atkArr[0][0] == "(") {
              dmgDie = atkArr[0];
              dmgDie = dmgDie.split("+")[0].substr(1);
              dmgDie = dmgDie.split("-")[0];
              crit = atkArr[0].split("x")[1]
              if (crit) {
                crit = crit.slice(0, 1);
                crit = "/x".concat(crit);
              }
            }
            atkArr.shift();
          }

          // Set dmgMod based on attack type [ranged, thrown, etc]
          atkMod = this.original.BAB + creature.abilities.DexMod + creature.size["ac / atk"];
          if (atkType == "thrown") {
            dmgMod = creature.abilities.StrMod;
          }

          atkMod = atkMod>0 ? `+${atkMod}` : atkMod;
          dmgMod = dmgMod>0 ? `+${dmgMod}` : dmgMod;
          if (crit) { dmgMod = dmgMod.toString().concat(crit); }
          creature.ranged[i] = { atkNum, atkName, atkMod, dmgDie, dmgMod, bonus };
          // console.log("final:", creature.ranged[i]);
        });
      }

      // console.log(creature);
      return creature;
    }
  },
  created() {
    DataService.getRules().then ( (response) => { this.rules = response; });
    // DataService.getClasses().then ( (response) => { this.equipment = response; });
    DataService.getEquipment().then ( (response) => { this.equipment = response; });
  },





  mounted() {
    this.getCreature({Name: this.creatureName});
  },
  updated() {
    if (this.creatureName != this.original.Name) {
      this.getCreature({Name: this.creatureName});
    }
  },
  defineExpose() { this.getCreature },
  methods: {
    async getCreature(original) {
      DataService.getMonster(original)
      .then(response => {
        this.creatureSetup(response);
      })
      .catch(err => { console.error(err); });
    },

    creatureSetup(original) {
      this.original = original;
      this.original.Con = this.original.Con == "-" ? 0 : this.original.Con;
      let ac = this.original.AC;
      this.original.AC = { total: ac, natural: 0, dodge: 0};

      // Add supplemental stats
      let sup = this.supplement[this.original.Name];
      if (sup) {
        for (const [key, value] of Object.entries(sup)) { this.original[key] = value; }
      }

      // DEFENSE
      this.original.AC.total = ac;
      this.original.HDNum = parseInt(this.original.HD.split('d')[0]);
      this.original.HDType = this.original.HD.split('d')[1].split('+')[0];

      // OFFENSE
      this.original.Melee = this.original.Melee ? this.original.Melee.split(',') : null;
      this.original.Ranged = this.original.Ranged ? this.original.Ranged.split(',') : null;
      this.original.Special = this.original.Special ? this.original.Special : null;
    },







    addMonster() {
      let creatures = JSON.parse(localStorage.getItem("encounter"));
      if (!creatures) { creatures = {}; } // if no encounter monsters yet, make em

      creatures[this.creatureName] = this.creature;
      localStorage.setItem("encounter", JSON.stringify(creatures));
    }
  }
}
</script>

<style lang="css" scoped>
.center-vert {
  align-content: center;
}
.center-horz {
  text-align: center;
}
.stat-controls .el-input-number {
  width: 70px;
}
</style>
