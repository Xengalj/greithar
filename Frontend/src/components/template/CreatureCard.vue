<template lang="html">

  <h2>{{ creature.title }}</h2>


  <!-- Basics -->
  <el-row :gutter="20">
    <el-col :span="12" class="center-horz">
      <svg width="225" height="200">
        <HexGraph :abilities="[this.original.Str, this.original.Dex, this.original.Con, this.original.Int, this.original.Wis, this.original.Cha]"></HexGraph>
      </svg>
      <div class="stat-controls">
        <el-row :gutter="5">
          <el-col :span="3">Str:</el-col>
          <el-col :span="8">
            <el-input-number size="small" controls-position="right" v-model="this.original.Str" />
          </el-col>
          <el-col :span="3">Int:</el-col>
          <el-col :span="8">
            <el-input-number size="small" controls-position="right" v-model="this.original.Int" />
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="3">Dex:</el-col>
          <el-col :span="8">
            <el-input-number size="small" controls-position="right" v-model="this.original.Dex" />
          </el-col>
          <el-col :span="3">Wis:</el-col>
          <el-col :span="8">
            <el-input-number size="small" controls-position="right" v-model="this.original.Wis" />
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="3">Con:</el-col>
          <el-col :span="8">
            <el-input-number size="small" controls-position="right" v-model="this.original.Con" />
          </el-col>
          <el-col :span="3">Cha:</el-col>
          <el-col :span="8">
            <el-input-number size="small" controls-position="right" v-model="this.original.Cha" />
          </el-col>
        </el-row>
      </div>
    </el-col>

    <el-col :span="12">
      <div class="center-horz">
        <g-icon iconSize="128px" :icon-name="this.original.Type" :key="this.original.Type"/>
      </div>
      <el-row :gutter="5">
        <el-col :span="4" class="center center-vert">
          <g-icon iconSize="24px" icon-name="compass"/>
        </el-col>
        <el-col :span="20" class="center">
          <el-row>
            <el-col :span="22" class="center">
              {{ this.original.Alignment }}
              <el-select-v2
              v-model="this.original.Size"
              :options="this.sizeSelect"
              style="width: 120px"
              />
              ({{ creature.size.space }})
            </el-col>
          </el-row>
          <el-row>
            <el-col class="center">
              {{ this.original.Type }}
              <span v-if="this.original.subtype1"> ({{ this.original.subtype1 }}</span>
              <span v-if="this.original.subtype2">, {{ this.original.subtype2 }}</span>
              <span v-if="this.original.subtype1">)</span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="center">
          <g-icon iconSize="24px" icon-name="treasure"/>
        </el-col>
        <el-col :span="20" class="center">
          {{ this.original.Treasure }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="center">
          <g-icon iconSize="24px" icon-name="forest"/>
        </el-col>
        <el-col :span="20" class="center">
          {{ this.original.Environment }}
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <el-divider border-style="hidden"/>


  <!-- Defense -->
  <el-collapse v-model="openSections">
    <el-collapse-item title="Defense" name="defense">
      <el-row :gutter="20">
        <el-col :span="3" class="center center-vert">
          <g-icon iconSize="32px" iconName="Armor" />
        </el-col>

        <el-col :span="7" class="center">
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
  </el-row>

</template>

<script>
import DataService from "@/services/data.service";
import HexGraph from '@/components/template/HexGraph.vue'
const miscTables = require('@/components/codex/tables.json');
const supplementTables = require('@/components/codex/monsters.json');
const equipmentTables = require('@/components/codex/equipment.json');

export default {
  name: "CreatureCard",
  components: { HexGraph },
  props: {
    creatureName: { type: String, default: () => "Kobold" },
  },
  data() {
    return {
      tables: miscTables, // size & dmg types
      equipment: equipmentTables,
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
      creature.size = this.tables.size[creature.sizeLabel.toLowerCase()];

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
  mounted() {
    this.getCreature({Name: this.creatureName});
  },
  updated() {
    if (this.creatureName != this.original.Name) {
      this.getCreature({Name: this.creatureName});
    }
  },
  defineExpose() {
    this.getCreature
  },
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
