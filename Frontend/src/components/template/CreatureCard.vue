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
            <!-- <el-col :span="22" class="center"> {{ levels.class }} </el-col> -->
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
          <el-tooltip placement="top" effect="light">
            <el-tag size="small" effect="dark" type="danger">
              HP: {{ health.roll + health.bonus }}
            </el-tag>

            <template #content>
              <span v-for="hd in health.hd" :key="hd"> {{ hd }} + </span> {{ health.bonus }}
            </template>
          </el-tooltip>   <br>
          <el-tooltip placement="top" effect="light">
            AC: {{ ac.total.num }}
            <template #content>
              <span v-for="bonus in ac.total.sources" :key="bonus"> {{ bonus+" " }} </span>
            </template>
          </el-tooltip>   <br>
          <el-tooltip placement="top" effect="light">
            Touch: {{ ac.touch.num }}
            <template #content>
              <span v-for="bonus in ac.touch.sources" :key="bonus"> {{ bonus+" " }} </span>
            </template>
          </el-tooltip>   <br>
          <el-tooltip placement="top" effect="light">
            Flat Footed: {{ ac.flat.num }}
            <template #content>
              <span v-for="bonus in ac.flat.sources" :key="bonus"> {{ bonus+" " }} </span>
            </template>
          </el-tooltip>   <br>
        </el-col>


        <el-col :span="7" class="center">
          <el-tooltip placement="top" effect="light">
            CMD: {{ cmd.total }}
            <template #content>
              <span v-for="bonus in cmd.sources" :key="bonus"> {{ bonus+" " }} </span>
            </template>
          </el-tooltip>   <br>
          <el-tooltip placement="top" effect="light">
            Fort: +{{ saves.fort.total }}
            <template #content>
              <span v-for="bonus in saves.fort.sources" :key="bonus"> {{ bonus+" " }} </span>
            </template>
          </el-tooltip>   <br>
          <el-tooltip placement="top" effect="light">
            Ref: +{{ saves.ref.total }}
            <template #content>
              <span v-for="bonus in saves.ref.sources" :key="bonus"> {{ bonus+" " }} </span>
            </template>
          </el-tooltip>   <br>
          <el-tooltip placement="top" effect="light">
            Will: +{{ saves.will.total }}
            <template #content>
              <span v-for="bonus in saves.will.sources" :key="bonus"> {{ bonus+" " }} </span>
            </template>
          </el-tooltip>
        </el-col>

        <el-col :span="7" class="center">
          <el-tooltip placement="top" effect="light">
            Init: +{{ init.total }}
            <template #content>
              <span v-for="bonus in init.sources" :key="bonus"> {{ bonus+" " }} </span>
            </template>
          </el-tooltip>   <br>
          <el-tooltip placement="top" effect="light" v-if="speed.sources[0]">
            Speed: {{ speed.total }} ft.
            <template #content>
              <span v-for="bonus in speed.sources" :key="bonus"> {{ bonus+" " }} </span>
            </template>
          </el-tooltip>
          <span v-else>
            Speed: {{ speed.total }} ft.
          </span>         <br>
          Senses: {{ senses }} <br>
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

        <el-col :span="21" class="center">
          <div>Melee</div>
          <br>
          <div v-for="(item, name) in bonuses" :key="name">
            {{ name }} : {{ item }}
          </div>
          <br><br>

          BAB +{{ bab }}<br>
          CMB +{{ cmb.total }}
          <br><br><br>
          {{ actions.melee }}
          <br><br>

          name  hit   dmg(1d8+1) crit mult extras[]

          <div v-for="(action, name) in actions.melee" :key="name">
            {{ name }} +{{ action.atkBonus.total}} ({{ action.dmgDie }}+{{ action.dmgBonus.total }})


            <br><br>
            {{ action }}
          </div>

          <!-- {{ actions }} -->
          <br><br>

                    <span v-if="this.original.dr"> DR: {{ this.original.dr }} </span>
                    <br>
                    <span v-if="this.original.sr"> SR: {{ this.original.sr }} </span>


          Reach: {{ this.original.Reach }} ft.
          <div v-for="atk in creature.melee" :key="atk.id">
            <span v-if="atk.atkNum"> {{ atk.atkNum }} </span> {{ atk.atkName }} {{ atk.atkMod }} ({{ atk.dmgDie }}{{ atk.dmgMod }}<span v-if="atk.bonus"> {{ atk.bonus }}</span>)<br>
          </div>
          <el-divider />



          <div class="center-horz">Ranged</div>
          <div v-for="atk in creature.ranged" :key="atk.id">
            <span v-if="atk.atkNum"> {{ atk.atkNum }} </span> {{ atk.atkName }} {{ atk.atkMod }} ({{ atk.dmgDie }}<span v-if="atk.dmgMod">{{ atk.dmgMod }}</span><span v-if="atk.bonus"> {{ atk.bonus }}</span>)<br>
          </div>




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
    {{ skills.Stealth }}<br>
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
  },
  data() {
    return {
      rules: {},
      classes: {},
      equipment: {},

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

      // actives: [], // The creatures active bonuses
      // bonuses: this.source.abilities,

      supplement: supplementTables,
      tables: {}, // size & dmg types
      original: {}
    }
  },
  created() {
    DataService.getRules().then ( (response) => { this.rules = response; });
    DataService.getClasses().then ( (response) => { this.classes = response; });
    DataService.getEquipment().then ( (response) => { this.equipment = response; });
  },
  mounted() {
    this.updateActive();
    this.getCreature({Name: this.creatureName});
  },


  computed: {
    title() { return this.source.name ? this.source.name.concat(" CR ", this.source.basics.cr) : ""; },
    abilities() { return this.source.abilities; },
    inventory() { return this.source.equipment; },
    bonuses() {
      let bonuses = {};
      if (this.source.name) {
        // Add feats and other abilities to bonuses
        for (const ability in this.abilities) {
          if (this.abilities[ability].active) {
            for (const [name, bonus] of Object.entries(this.abilities[ability].bonuses)) {
              bonuses[name] = bonus;
            }
          }
        }

        // Armor, Shield
        for (const [name, item] of Object.entries(this.inventory)) {
          if (item.equiped) {
            let type = (["Light", "Medium", "Heavy"].includes(item.Proficiency)) ? "Armor" :
                       (item.Proficiency == "Shields") ? "Shield" : "";
            if (type != "") {
              bonuses[name] = {};
              bonuses[name].type = type;
              bonuses[name].targets = this.rules.bonuses ? this.rules.bonuses[type].targets : [];
              bonuses[name].value = item["AC Bonus"];
            }
            // Other Item based bonuses
            if (item.Extras.Bonuses) {
              for (const [name, bonus] of Object.entries(item.Extras.Bonuses)) {
                bonuses[name] = bonus;
              }
            }
          }
        }
      }
      return bonuses;
    },


    attributes() {
      // TODO: add bonus loop
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
      let health = { "bonus": 0, "roll": 0, "hd": [] };
      if (this.source.name) {
        let firstLevel = true;

        // Racial HD Check
        if (this.basics.type.levels) { health.hd.push( `${this.basics.type.levels}d${this.basics.type.hd}` ); }
        for (let i = 1; i < this.basics.type.levels+1; i++) {
          firstLevel = false;
          health.roll += this.basics.type.hd / 2 + 0.5;

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
          let levels = cClass.levels;
          cClass = this.classes[name] ? this.classes[name] : { "hd": 0 };
          health.hd.push( `${levels}d${cClass.hd}` );

          // Level Loop
          for (let i = 1; i < levels+1; i++) {
            health.roll += firstLevel ? cClass.hd : cClass.hd / 2 + 0.5;
            if (this.basics.type.name == "undead") {
              health.bonus += this.attributes.ChaMod;
            } else if (this.basics.type.name != "construct") {
              health.bonus += this.attributes.ConMod;
            }
          }
        }
      } // end if have source

      health.roll = Math.floor(health.roll);
      return health;
    },
    ac() {
      let ac = { "total": { "num": 10, "sources": [] }, "touch": { "num": 10, "sources": [] }, "flat": { "num": 10, "sources": [] } };
      if (this.source.name) {

        // TODO: max dex from armor

        // total = All
        ac.total.num += this.attributes.DexMod;
        ac.total.sources.push(`+${this.attributes.DexMod} Dex`);
        if (this.basics.size != "medium") {
          ac.total.num += this.basics.sizeStats["ac / atk"];
          ac.total.sources.push(`+${this.basics.sizeStats["ac / atk"]} Size`);
        }

        // touch = creature.ac.total - bonus.armor - bonus.shield - bonus.natural;
        ac.touch.num += this.attributes.DexMod;
        ac.touch.sources.push(`+${this.attributes.DexMod} Dex`);
        if (this.basics.size != "medium") {
          ac.touch.num += this.basics.sizeStats["ac / atk"];
          ac.touch.sources.push(`+${this.basics.sizeStats["ac / atk"]} Size`);
        }

        // flat = creature.ac.total - bonus.dex - bonus.dodge;
        if (this.basics.size != "medium") {
          ac.flat.num += this.basics.sizeStats["ac / atk"];
          ac.flat.sources.push(`+${this.basics.sizeStats["ac / atk"]} Size`);
        }

        // Bonuses Loop
        for (let [name, bonus] of Object.entries(this.source.bonuses)) {
          if (this.actives.includes(name)) {
            bonus.targets.forEach(target => {
              // TODO: check typs
              if (ac[target.slice(0, -2)]) {
                ac[target.slice(0, -2)].num += bonus.bonus;
                ac[target.slice(0, -2)].sources.push(`+${bonus.bonus} ${name}`);
              }
            });
          }
        }
      }
      return ac;
    },
    saves() {
      let saves = { "fort": { "total": 0, "sources": [] }, "ref": { "total": 0, "sources": [] }, "will": { "total": 0, "sources": [] } };
      if (this.source.name) {
        let total, bName = "";
        for (let [name, save] of Object.entries(saves)) {

          // Abilities
          total = 0;
          switch (name) {
            case "fort":
              total += (this.basics.type.name == "undead") ? this.attributes.ChaMod : this.attributes.ConMod;
              bName = (this.basics.type.name == "undead") ? "Cha" : "Con";
              break;
            case "ref":
              total += (name == "ref") ? this.attributes.DexMod : 0;
              bName = "Dex";
              break;
            case "will":
              total += (name == "will") ? this.attributes.WisMod : 0;
              bName = "Dex";
              break;
          }
          total = Math.floor(total);
          if (total > 0) {
            save.total += total;
            save.sources.push(`+${total} ${bName}`);
          }

          // Racial HD Check
          if (this.basics.type.levels && this.rules.creature_types) {
            bName = this.basics.type.name;
            total = 0;
            let saveMult = this.rules.creature_types[bName][name].mult;
            total += saveMult * this.basics.type.levels;
            total += this.rules.creature_types[bName][name].bonus;
            total = Math.floor(total);
            if (total > 0) {
              save.total += total;
              save.sources.push(`+${total} ${bName}`);
            }
          }

          // Class Loop
          for (let [cName, cClass] of Object.entries(this.source.classes)) {
            if (this.classes[cName]) {
              let levels = cClass.levels;
              cClass = this.classes[cName];
              total = 0;
              let saveMult = cClass[name].mult;
              total += saveMult * levels;
              total += cClass[name].bonus;
              total = Math.floor(total);
              if (total > 0) {
                save.total += total;
                save.sources.push(`+${total} ${cName}`);
              }
            }
          }

          // Bonus Loop
          // TODO: type check
          for (let [n, bonus] of Object.entries(this.source.active)) {
            bName = n;
            total = 0;
            if (bonus.targets.includes("Saves") && bonus.subtargets.includes(name) ) {
              save.total += bonus.bonus;
              save.sources.push(`+${bonus.bonus} ${bName}`);
            }
          }
        }

      }
      saves.fort.total = Math.floor(saves.fort.total);
      saves.ref.total = Math.floor(saves.ref.total);
      saves.will.total = Math.floor(saves.will.total);
      return saves;
    },
    cmd() {
      let cmd = { "total": 10, "sources": [] };
      if (this.source.name) {
        if (this.bab > 0) {
          cmd.sources.push(`+${this.bab} BAB`);
          cmd.total += this.bab;
        }
        if (this.attributes.StrMod > 0) {
          cmd.sources.push(`+${this.attributes.StrMod} Str`);
          cmd.total += this.attributes.StrMod;

        }
        if (this.attributes.DexMod) {
          cmd.sources.push(`+${this.attributes.DexMod} Dex`);
          cmd.total += this.attributes.DexMod;
        }
        if (this.basics.sizeStats["cmb / cmd"]) {
          cmd.sources.push(`+${this.basics.sizeStats["cmb / cmd"]} Size`);
          cmd.total += this.basics.sizeStats["cmb / cmd"];
        }

        // TODO: bonus loop & type check
        for (let [name, bonus] of Object.entries(this.source.active)) {
          if (bonus.targets.includes("CMD")) {
            cmd.total += bonus.bonus;
            cmd.sources.push(`+${bonus.bonus} ${name}`);
          }
        }
      }
      return cmd;
    },
    cmb() {
      let cmd = { "total": 0, "sources": [] };
      if (this.source.name) {
        if (this.bab > 0) {
          cmd.sources.push(`+${this.bab} BAB`);
          cmd.total += this.bab;
        }
        if (["fine", "diminuitive", "tiny"].includes(this.basics.size)) {
          if (this.attributes.DexMod > 0) {
            cmd.sources.push(`+${this.attributes.DexMod} Str`);
            cmd.total += this.attributes.DexMod;
          }
        } else {
          if (this.attributes.StrMod > 0) {
            cmd.sources.push(`+${this.attributes.StrMod} Str`);
            cmd.total += this.attributes.StrMod;
          }
        }
        if (this.basics.sizeStats["cmb / cmd"]) {
          cmd.sources.push(`+${this.basics.sizeStats["cmb / cmd"]} Size`);
          cmd.total += this.basics.sizeStats["cmb / cmd"];
        }
        // TODO: bonus loop & type check
        for (let [name, bonus] of Object.entries(this.source.active)) {
          if (bonus.targets.includes("CMB")) {
            cmd.total += bonus.bonus;
            cmd.sources.push(`+${bonus.bonus} ${name}`);
          }
        }
      }
      return cmd;
    },
    init() {
      let init = { "total": 0, "sources": [] };
      if (this.source.name) {
        if (this.attributes.DexMod > 0) {
          init.sources.push(`+${this.attributes.DexMod} Dex`);
          init.total += this.attributes.DexMod;
        }
        // TODO: bonus loop & type check
        for (let [name, bonus] of Object.entries(this.source.active)) {
          if (bonus.targets.includes("Checks") && bonus.subtargets.includes("dex")) {
            init.total += bonus.bonus;
            init.sources.push(`+${bonus.bonus} ${name}`);
          }
        }
      }
      return init;
    },
    senses() {
      let senses = [];
      if (this.source.name) {
        if (this.skills && this.skills.Perception) {
          senses.push(`Perception ${this.skills.Perception.bonus}`);
        }
        Object.values(this.abilities).forEach(abil => {
          if (abil.benefit && abil.benefit.target == "senses") {
            senses.push(abil.benefit.text);
          }
        });
      }
      return senses;
    },
    speed() {
      let speed = { "total": 0, "sources": [] };
      if (this.source.name) {
        speed.total += this.source.basics.speed;

        // TODO: bonus loop & type check
        for (let [name, bonus] of Object.entries(this.source.active)) {
          if (bonus.targets.includes("Speed")) {
            speed.total += bonus.bonus;
            speed.sources.push(`+${bonus.bonus} ${name}`);
          }
        }
      }
      return speed;
    },
    bab() {
      let bab = 0;
      if (this.source.name) {
        // Racial HD Check
        if (this.basics.type.levels) {
          let racialBAB = this.rules.creature_types ? this.rules.creature_types[this.basics.type.name].bab : 0;
          bab += racialBAB * this.basics.type.levels;
        }

        // Class Loop
        for (let [name, cClass] of Object.entries(this.source.classes)) {
          let classBAB = this.classes[name] ? this.classes[name].bab : 0;
          bab += classBAB * cClass.levels;
        }
      }
      bab = Math.floor(bab);
      return bab;
    },
    actions() {
      let actions = { melee: {}, ranged: {}, special: {} };
      if (this.source.name) {

        /***************************\
        *                           *
        *       MELEE ATTACKS       *
        *                           *
        \***************************/
        let NatAtkNum = 0;
        for (let [name, atk] of Object.entries(this.source.actions.melee)) {
          let newAtk = {
            dmgBonus: { "total": 0, "sources": [] },
            atkBonus: { "total": 0, "sources": [] }
          };

          newAtk.atkBonus.total += this.bab;
          newAtk.atkBonus.sources.push(`+${this.bab} BAB`);
          newAtk.atkBonus.total += this.basics.sizeStats["ac / atk"];
          newAtk.atkBonus.sources.push(`+${this.basics.sizeStats["ac / atk"]} Size`);

          // Add mwk or magic enhancements to atk bonus
          if (atk.Extras["enhancement"]) {
            newAtk.atkBonus.total += atk.Extras["enhancement"];
            newAtk.atkBonus.sources.push(`+${atk.Extras["enhancement"]} Magic Enhancement`);
            newAtk.dmgBonus.total += atk.Extras["enhancement"];
            newAtk.dmgBonus.sources.push(`+${atk.Extras["enhancement"]} Magic Enhancement`);
          } else if (atk.Extras["masterwork"]) {
            newAtk.atkBonus.total += 1;
            newAtk.atkBonus.sources.push(`+1 Masterwork`);
          }

          // Add StrMod
          NatAtkNum += (atk.Proficiency == "Natural") ? 1 : 0;
          if (atk.Category == "Two-Handed") {
            newAtk.dmgBonus.total += this.attributes.StrMod * 1.5;
            newAtk.dmgBonus.sources.push(`+${this.attributes.StrMod * 1.5} Str`);
          }
          else if (atk.Category == "Secondary") {
            newAtk.atkBonus.total += this.attributes.StrMod - 5;
            newAtk.atkBonus.sources.push(`+${this.attributes.StrMod - 5} Str`);
            newAtk.dmgBonus.total += this.attributes.StrMod / 2;
            newAtk.dmgBonus.sources.push(`+${this.attributes.StrMod / 2} Str`);
          }
          else {
            newAtk.atkBonus.total += this.attributes.StrMod;
            newAtk.atkBonus.sources.push(`+${this.attributes.StrMod} Str`);
            newAtk.dmgBonus.total += this.attributes.StrMod;
            newAtk.dmgBonus.sources.push(`+${this.attributes.StrMod} Str`);
          }


          // Add Active Bonuses
          let typedBonuses = {};
          for (let [name, bonus] of Object.entries(this.bonuses)) {
            // If the bonus type doesn't stack
            // If we have that type already && the current is higher, skip
            // Else, replace / add it
            if (this.rules.bonuses && Object.keys(this.rules.bonuses).includes(bonus.type)) {
              if (typedBonuses[bonus.type] && typedBonuses[bonus.type].value > bonus.value) {
                continue;
              } else {
                // remove previos values from either atk or dmg or both
                if (typedBonuses[bonus.type]) {
                  bonus.targets.forEach(target => {
                    if (newAtk[target]) {
                      newAtk[target].total -= typedBonuses[bonus.type].value;
                      // loop on sources looking for the one to remove
                      newAtk[target].sources.forEach((source, i) => {
                        if ( source.includes(typedBonuses[bonus.type].name) ) {
                          // console.log('this one', newAtk[target].sources[i]);
                          newAtk[target].sources.splice(i, 1);
                        }
                      });
                    }
                  });
                }

                typedBonuses[bonus.type] = { name: name, value: bonus.bonus };
              }
            }
            // If bonus.targets includes atk or dmg, apply it
            bonus.targets.forEach(target => {
              if (newAtk[target]) {
                newAtk[target].total += bonus.bonus;
                newAtk[target].sources.push(`+${bonus.bonus} ${name}`);
              }
            });
          }

          newAtk.dmgDie = atk.Damage[this.basics.size];
          console.log(`${NatAtkNum>1 ? NatAtkNum : ""} ${name} +${newAtk.atkBonus.total} (${newAtk.dmgDie}+${newAtk.dmgBonus.total} /${atk.Critical})`);
          actions.melee[name] = newAtk;
          if (NatAtkNum>1) { actions[name].natAtkNum = NatAtkNum; }
        }
        // actions = this.source.actions;
      }

      return actions;
    },



    skills() {
      // TODO: add + to start of bonus
      let skills = {};
      if (this.source.name && this.classes['bard'] && this.rules.skills) {
        this.updateActive();

        for (const [name, skill] of Object.entries(this.source.skills)) {
          let bonus = 0;
          if (skill.ranks) {
            bonus += skill.ranks;
            bonus += skill.class ? 3 : 0;
          }
          bonus += this.attributes[skill.ability.concat("Mod")];

          if (skill.armor_pen) {
            for (const name of Object.keys(this.bonuses)) {
              if (this.inventory[name] && this.inventory[name].Penalty) {
                bonus += this.inventory[name].Penalty;
              }
            }
          }
          skill.bonus = bonus;
          skills[name] = skill;
        }
      }

      return skills;
    },

    magic() { return "" },
    pets() { return "" },

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





  updated() {
    this.updateActive();
    if (this.creatureName != this.original.Name) {
      this.getCreature({Name: this.creatureName});
    }
  },
  defineExpose() { this.getCreature },
  methods: {
    updateActive() {
      this.actives = [];
    },



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
