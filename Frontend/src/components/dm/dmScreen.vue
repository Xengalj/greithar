<template>
  <div class="container">
    <!--
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>
  -->
  </div>


  <el-button type="primary" circle @click="monsterOpen()">
    <g-icon iconSize="24px" iconName="eye" />
  </el-button>






  <el-dialog
    width="650"
    v-model="monsterVisible"
    :title="creature.title"
    :before-close="monsterClose"
  >

    <!-- Basics -->
    <el-row :gutter="20">
      <el-col :span="12" class="center-horz">
        <svg width="225" height="200">
          <HexGraph :abilities="[this.monster.Str, this.monster.Dex, this.monster.Con, this.monster.Int, this.monster.Wis, this.monster.Cha]"></HexGraph>
        </svg>
        <div class="stat-controls">
          <el-row :gutter="5">
            <el-col :span="3">Str:</el-col>
            <el-col :span="8">
              <el-input-number size="small" controls-position="right" v-model="this.monster.Str" />
            </el-col>
            <el-col :span="3">Int:</el-col>
            <el-col :span="8">
              <el-input-number size="small" controls-position="right" v-model="this.monster.Int" />
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="3">Dex:</el-col>
            <el-col :span="8">
              <el-input-number size="small" controls-position="right" v-model="this.monster.Dex" />
            </el-col>
            <el-col :span="3">Wis:</el-col>
            <el-col :span="8">
              <el-input-number size="small" controls-position="right" v-model="this.monster.Wis" />
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="3">Con:</el-col>
            <el-col :span="8">
              <el-input-number size="small" controls-position="right" v-model="this.monster.Con" />
            </el-col>
            <el-col :span="3">Cha:</el-col>
            <el-col :span="8">
              <el-input-number size="small" controls-position="right" v-model="this.monster.Cha" />
            </el-col>
          </el-row>
        </div>
      </el-col>

      <el-col :span="12" class="center">
        <g-icon iconSize="128px" icon-name="runeStone"/>
        <!-- https://pathfinderwiki.com/wiki/File:Red_Kobold.jpg -->
        <br>
        <el-row :gutter="5">
          <el-col :span="4" class="center center-vert">
            <g-icon iconSize="24px" :icon-name="this.monster.Type"/>
          </el-col>
          <el-col :span="20" class="center">
            <el-row>
              <el-col :span="22" class="center">
                {{ this.monster.Alignment }}
                <el-select-v2
                  v-model="this.monster.Size"
                  :options="this.sizeSelect"
                  style="width: 120px"
                />
                ({{ creature.size.space }})
              </el-col>
            </el-row>
            <el-row>
              <el-col class="center">
                {{ this.monster.Type }}
                <span v-if="this.monster.subtype1"> ({{ this.monster.subtype1 }}</span>
                <span v-if="this.monster.subtype2">, {{ this.monster.subtype2 }}</span>
                <span v-if="this.monster.subtype1">)</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center">
            <g-icon iconSize="24px" icon-name="treasure"/>
          </el-col>
          <el-col :span="20" class="center">
            {{ this.monster.Treasure }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center">
            <g-icon iconSize="24px" icon-name="forest"/>
          </el-col>
          <el-col :span="20" class="center">
            {{ this.monster.Environment }}
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
            HP: {{ creature.health.total }} ({{ this.monster.HDNum }}{{ creature.health.HDString }}{{ creature.health.bonus}} / {{ this.monster.HP }})
            <br><br>
            AC: {{ creature.ac.total }} / {{ this.monster.AC ? this.monster.AC.total : 10 }}
            <br>
            Touch: {{ creature.ac.touch }}
            <br>
            Flat Footed: {{ creature.ac.flat }}
            <br>
            CMD: {{ 10 + this.monster.BAB + creature.abilities.StrMod + creature.abilities.DexMod + (this.monster.AC ? this.monster.AC.dodge : 0) + creature.size["cmb / cmd"] }}
          </el-col>

          <el-col :span="7" class="center">
            <br><br>
            Fort: {{ creature.saves.fort }} / {{ this.monster.Fort }}
            <br>
            Ref: {{ creature.saves.ref}} / {{ this.monster.Ref }}
            <br>
            Will: {{ creature.saves.will}} / {{ this.monster.Will }}
            <br>
            CMB: {{ this.monster.BAB + creature.abilities.StrMod + creature.size["cmb / cmd"] }}
            <br>
            <span v-if="this.monster.dr"> DR: {{ this.monster.dr }} </span>
            <br>
            <span v-if="this.monster.sr"> SR: {{ this.monster.sr }} </span>
          </el-col>

          <el-col :span="7" class="center">
            Init: {{ creature.init }}
            <br>
            Senses: <span v-for="item in creature.senses" :key="item.id"> {{ item }}, </span>
            <br>
            Speed: {{ this.monster.Speed }}
          </el-col>
        </el-row>

        <el-row v-if="this.monster.Immunities">
          <el-col :span="3" class="center">
          </el-col>
          <el-col :span="7" class="center">
            Immunities
          </el-col>
          <el-col :span="14" class="center">
            <span v-for="item in this.monster.Immunities" :key="item.id">
              {{ item }},
            </span>
          </el-col>
        </el-row>
        <el-row v-if="this.monster.Weaknesses">
          <el-col :span="3" class="center">
          </el-col>
          <el-col :span="7" class="center">
            Weaknesses
          </el-col>
          <el-col :span="14" class="center">
            <span v-for="item in this.monster.Weaknesses" :key="item.id">
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
            Reach: {{ this.monster.Reach }} ft.
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
      <el-collapse-item title="Magic" name="magic" v-if="this.monster.Magic">
        <el-row :gutter="20">
          <el-col :span="3" class="center">
            <g-icon iconSize="32px" iconName="rolledScroll" />
          </el-col>
          <el-col :span="21" class="center">
            {{ this.monster.Magic }}
          </el-col>
        </el-row>
      </el-collapse-item>


      <!-- Specials -->
      <el-collapse-item title="Special" name="special" v-if="this.monster.Extras">
        <el-row :gutter="20">
          <el-col :span="3" class="center">
            <g-icon iconSize="32px" iconName="Star" />
          </el-col>
          <el-col :span="21" class="center">
            <div v-for="(value, key) in this.monster.Extras" :key="key">
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
            {{ this.monster.Feats }}
          </el-col>

          <el-col :span="7" class="center">
            Skills
            <br>
            {{ this.monster.Skills }}
          </el-col>

          <el-col :span="7" class="center">
            <span v-if="this.monster.Class1">
              Classes: {{ this.monster.Class1}} ({{ this.monster.Class1_Lvl }})
            </span>
            <br><br>
            {{ this.monster.Languages }}
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogClose()"> Close </el-button>
        <el-button type="primary" @click="addMonster()"> Add to Session </el-button>
      </div>
    </template>
  </el-dialog>








  <div class="">
    <p v-for="(icon, name, index) in icons" :key="index">
      <strong>{{ name }}</strong>
      <g-icon :iconName="name" />

    </p>
  </div>

</template>

<script>
import DataService from "@/services/data.service";
import UserService from "@/services/user.service";
import HexGraph from '@/components/template/HexGraph.vue'
const icons = require('@/components/template/svgPaths.json');
const tables = require('@/components/codex/tables.json');
const supplement = require('@/components/codex/monsters.json');

export default {
  name: "DM Screen",
  components: {
    HexGraph
  },
  computed: {
    creature() {
      let creature = {
        title: this.monster.Name.concat(" CR ", this.monster.CR),
        abilities: {
          StrMod: Math.floor((this.monster.Str - 10) / 2),
          DexMod: Math.floor((this.monster.Dex - 10) / 2),
          ConMod: Math.floor((this.monster.Con - 10) / 2),
          IntMod: Math.floor((this.monster.Int - 10) / 2),
          WisMod: Math.floor((this.monster.Wis - 10) / 2),
          ChaMod: Math.floor((this.monster.Cha - 10) / 2),
        },
        sizeLabel: this.monster.Size ? this.monster.Size : "Medium",
        size: {},
        health: { total: 0, bonus: 0, HDString: "d".concat(this.monster.HDType, "+") },
        ac: { total: 10, touch: 10, flat: 10 },
        saves: { fort: 0, ref: 0, will: 0 },
        init: 0,
        sneses: [],
        melee: [],
        ranged: [],
        special: this.monster.Special,
        magic: this.monster.Magic
      };

      // Ability Mods can only be accesed affter initialization

      // SET SIZE
      creature.size = this.tables.size[creature.sizeLabel.toLowerCase()];

      // SET DEFENSE
      creature.health.total = Math.floor( (Math.floor(this.monster.HDType/2)+0.5) * this.monster.HDNum ) + ( creature.abilities.ConMod * this.monster.HDNum );
      creature.health.bonus = creature.abilities.ConMod * this.monster.HDNum;
      // TODO: Toughness Feat ( 3 + Int((1 * Level) - 3) )

      let bonus = {
        size: creature.size ? creature.size["ac / atk"] : 0,
        armor: this.equipment ? this.equipment.armor.bonus : 0,
        shield: this.equipment ? this.equipment.shield.bonus : 0,
        natural: this.monster.AC ? this.monster.AC.natural : 0,
        dodge: this.monster.AC ? this.monster.AC.dodge : 0,
        dex: creature.abilities.DexMod
      };
      Object.values(bonus).forEach(item => { creature.ac.total = creature.ac.total + item; });
      creature.ac.touch = creature.ac.total - bonus.armor - bonus.shield - bonus.natural;
      creature.ac.flat = creature.ac.total - bonus.dex - bonus.dodge;

      if (this.monster.Saves) {
        creature.saves.fort = this.monster.Saves.fort + creature.abilities.ConMod;
        creature.saves.ref = this.monster.Saves.ref + creature.abilities.DexMod;
        creature.saves.will = this.monster.Saves.will + creature.abilities.WisMod;
      }

      creature.init = creature.abilities.DexMod;
      creature.senses = this.monster.Senses;


      // SET OFFENSE
      if (this.monster.Melee) {
        this.monster.Melee.forEach((atk, i) => {
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

          if (this.monster.Melee.length == 1 && !atkNum && ["bite", "claw", "gore", "slam", "sting", "talons"].includes(atkName)) {
            // 1 Natural Attack
            atkMod = this.monster.BAB + creature.abilities.StrMod + creature.size["ac / atk"];
            dmgMod = creature.abilities.StrMod + creature.abilities.StrMod/2;
          } else if (["hoof", "tentacle", "wing", "pincers", "tail slap"].includes(atkName)) {
            // Secondary Natural Attack
            atkMod = this.monster.BAB - 5 + creature.abilities.StrMod + creature.size["ac / atk"];
            dmgMod = creature.abilities.StrMod / 2;
          } else {
            // Primary Natural Attack / Weapon Attack
            atkMod = this.monster.BAB + creature.abilities.StrMod + creature.size["ac / atk"];
            dmgMod = creature.abilities.StrMod;
          }
          atkMod = atkMod>0 ? `+${atkMod}` : atkMod;
          dmgMod = dmgMod>0 ? `+${dmgMod}` : dmgMod;
          if (crit) { dmgMod = dmgMod.toString().concat(crit); }
          creature.melee[i] = { atkNum, atkName, atkMod, dmgDie, dmgMod, bonus };
          // console.log("final:", creature.melee[i]);
        });
      }

      if (this.monster.Ranged) {
        this.monster.Ranged.forEach((atk, i) => {
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
          atkMod = this.monster.BAB + creature.abilities.DexMod + creature.size["ac / atk"];
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
    },

    equipment() {
      let equipment = {
        armor: {
          name: "temp",
          bonus: 0,
          type: "armor"
        },
        shield: {
          name: "temp",
          bonus: 0,
          type: "shield"
        }
      }
      return equipment;
    }
  },
  data() {
    return {
      content: "DM Screen",
      loading: false,
      icons: icons,
      tables: tables,
      sizeSelect: [
        { value: "Fine", label: "Fine", },
        { value: "Diminuitive", label: "Diminuitive", },
        { value: "Tiny", label: "Tiny", },
        { value: "Small", label: "Small", },
        { value: "Medium", label: "Medium", },
        { value: "Large", label: "Large", },
        { value: "Huge", label: "Huge", },
        { value: "Gargantuan", label: "Gargantuan", },
        { value: "Colossal", label: "Colossal", } ],
      supplement: supplement,

      monsterVisible: false,
      openSections: [ "defense", "offense" ],
      monster: {
        Name: "Death Worm",
        /*
        Name: "Adult Red Dragon",
        Name: "Kobold",
        */
      }

    };
  },
  mounted() {
    // console.log(this.tables);
    // this.getMonster(this.monster);

    UserService.getAdminBoard().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  },
  methods: {
    async getMonster(monster) {
      this.loading = true;
      DataService.getMonster(monster)
      .then(response => {
        this.monsterSetup(response);
        this.loading = false;
      })
      .catch(err => { console.error(err); });
    },
    monsterSetup(monster){
      // console.log(monster);
      this.monster = monster;
      let ac = this.monster.AC;

      // Add supplemental stats
      let sup = this.supplement[this.monster.Name];
      for (const [key, value] of Object.entries(sup)) { this.monster[key] = value; }

      // DEFENSE
      this.monster.AC.total = ac;
      this.monster.HDNum = parseInt(this.monster.HD.split('d')[0]);
      this.monster.HDType = this.monster.HD.split('d')[1].split('+')[0];

      // OFFENSE
      this.monster.Melee = this.monster.Melee ? this.monster.Melee.split(',') : null;
      this.monster.Ranged = this.monster.Ranged ? this.monster.Ranged.split(',') : null;
      this.monster.Special = this.monster.Special ? this.monster.Special : null;
      // this.monster.Magic = this.monster.Magic ? this.monster.Magic : null;


      console.log(this.monster);
    },
    monsterOpen() {
      this.getMonster(this.monster)
      this.monsterVisible = true;
    },
    monsterClose() {
      this.monsterVisible = false;
    },
  }
};
</script>

<style>
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
