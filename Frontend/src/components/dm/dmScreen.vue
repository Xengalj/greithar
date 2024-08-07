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
      <!-- Stats -->
      <el-col :span="12" class="center">
        <svg width="225" height="200">
          <HexGraph :abilities="[this.monster.Str, this.monster.Dex, this.monster.Con, this.monster.Int, this.monster.Wis, this.monster.Cha]"></HexGraph>
        </svg>
        <div class="stat-controls">
          <el-row :gutter="5">
            <el-col :span="4" class="center"> Str: <br> </el-col>
            <el-col :span="8" class="center">
              <el-input-number size="small" controls-position="right" v-model="this.monster.Str" />
            </el-col>
            <el-col :span="4" class="center"> Int: <br> </el-col>
            <el-col :span="8" class="center">
              <el-input-number size="small" controls-position="right" v-model="this.monster.Int" />
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="4" class="center"> Dex: <br> </el-col>
            <el-col :span="8" class="center">
              <el-input-number size="small" controls-position="right" v-model="this.monster.Dex" />
            </el-col>
            <el-col :span="4" class="center"> Wis: <br> </el-col>
            <el-col :span="8" class="center">
              <el-input-number size="small" controls-position="right" v-model="this.monster.Wis" />
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="4" class="center"> Con: <br> </el-col>
            <el-col :span="8" class="center">
              <el-input-number size="small" controls-position="right" v-model="this.monster.Con" />
            </el-col>
            <el-col :span="4" class="center"> Cha: <br> </el-col>
            <el-col :span="8" class="center">
              <el-input-number size="small" controls-position="right" v-model="this.monster.Cha" />
            </el-col>
          </el-row>
        </div>
      </el-col>

      <!-- Basics -->
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
              <el-col :span="4" class="center"> {{ this.monster.Alignment }} </el-col>
              <el-col :span="20" class="center"> {{ this.monster.Size }} ({{ this.monster.Space}} ft.) </el-col>
            </el-row>
            <el-row>
              <el-col class="center">
                {{ this.monster.Type }}
                <span v-if="this.monster.subtype1"> (</span>
                <span v-if="this.monster.subtype1">{{ this.monster.subtype1 }}</span>
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
      <!-- End Basics -->
    </el-row>
    <el-divider border-style="hidden"/>

    <el-collapse v-model="openSections">
      <!-- Defense -->
      <el-collapse-item title="Defense" name="defense">
        <el-row :gutter="20">
          <el-col :span="3" class="center center-vert">
            <g-icon iconSize="32px" iconName="Armor" />
          </el-col>

          <el-col :span="7" class="center">
            HP: {{ creature.health.total }} ({{ this.monster.HDNum }}{{ creature.health.HDString }}{{ creature.health.bonus}} / {{ this.monster.HP }})
            <br><br>

            AC: {{ creature.AC.total }} / {{ this.monster.AC }}
            <br>
            Touch: {{ creature.AC.touch }}
            <br>
            Flat Footed: {{ creature.AC.flat }}
          </el-col>

          <el-col :span="7" class="center">
            <br><br>

            Fort: {{ creature.saves.fort }} / {{ this.monster.Fort }}
            <br>
            Ref: {{ creature.saves.ref}} / {{ this.monster.Ref }}
            <br>
            Will: {{ creature.saves.will}} / {{ this.monster.Will }}
            <br>
            <span v-if="this.monster.dr">
            DR: {{ this.monster.dr }}
            </span>
            <br>
            <span v-if="this.monster.sr">
              SR: {{ this.monster.sr }}
            </span>
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
              <span v-if="atk.atkNum"> {{ atk.atkNum }} </span> {{ atk.atkName }} {{ atk.atkMod }} ({{ atk.dmgDie }}{{ atk.dmgMod }}<span v-if="atk.bonus"> plus {{ atk.bonus }}</span>)<br>
            </div>
          </el-col>

          <el-col :span="7" class="center">
            <div class="center-horz">Ranged</div>
            <div v-for="atk in creature.ranged" :key="atk.id">
              {{ atk.atkName }} {{ atk.atkMod }} <span v-if="atk.dmgType">{{ atk.atkType }}</span> ({{ atk.dmgDie }}<span v-if="atk.dmgMod">{{ atk.dmgMod }}</span> <span v-if="atk.dmgType">{{ atk.dmgType }}</span>)<br>
            </div>
          </el-col>

          <el-col :span="7" class="center">
            <div class="center-horz">Magic</div>
            <!-- <div v-for="atk in this.monster.Ranged" :key="atk.id">
              {{ atk }}
            </div> -->
            Breath / Spells
          </el-col>
        </el-row>
      </el-collapse-item>


      <!-- Specials -->
      <el-collapse-item title="Special" name="special">
        <el-row :gutter="20">
          <el-col :span="3" class="center">
            <g-icon iconSize="32px" iconName="Star" />
          </el-col>

          <el-col :span="7" class="center">
            {{ this.monster.SQ }}
            <br>
            Aura
          </el-col>

          <el-col :span="7" class="center">
            A
          </el-col>

          <el-col :span="7" class="center">
            B
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
            {{ this.monster.Languages }}
          </el-col>

          <el-col :span="7" class="center">
            Classes
            <br>
            {{ this.monster.Class1}} ({{ this.monster.Class1_Lvl }})
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
        health: { total: 0, bonus: 0, HDString: "d".concat(this.monster.HDType, "+") },
        AC: { total: 10, touch: 10, flat: 10 },
        saves: { fort: 0, ref: 0, will: 0 },
        init: 0,
        sneses: [],
        melee: [],
        ranged: [],
        magic: []
      };

      // Ability Mods can only be accesed affter initialization

      // SET DEFENSE
      // TODO: Toughness Feat
      creature.health.total = Math.floor( (Math.floor(this.monster.HDType/2)+0.5) * this.monster.HDNum ) + ( creature.abilities.ConMod * this.monster.HDNum );
      creature.health.bonus = creature.abilities.ConMod * this.monster.HDNum;

      let bonus = {
        size: this.monster.size ? this.monster.size["ac / atk"] : 0,
        armor: this.equipment.armor.bonus,    // not touch
        shield: this.equipment.shield.bonus,  // not touch
        natural: this.monster.ac.natural,     // not touch
        dex: creature.abilities.DexMod,       // not flat
        dodge: this.monster.ac.dodge          // not flat
      };
      Object.values(bonus).forEach(item => { creature.AC.total = creature.AC.total + item; });
      creature.AC.touch = creature.AC.total - bonus.armor - bonus.shield - bonus.natural;
      creature.AC.flat = creature.AC.total - bonus.dex - bonus.dodge;

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
          // console.log("original : ", atk);
          let atkArr = atk.split(" ");
          let atkNum = 0;
          if (!isNaN(parseInt(atkArr[0])) ) {
            atkNum = atkArr[0];
            atkArr.shift();
          }
          let [atkName, atkMod, dmgDie, dmgMod] = [ atkArr[0], atkArr[1], atkArr[2], 0 ];
          let bonus = atkArr[3] ? atkArr[4].slice(0, -1) : "";
          dmgDie = dmgDie.split("+")[0].substr(1);
          dmgDie = dmgDie.split("-")[0];
          if (this.monster.Melee.length == 1 && !atkNum && ["bite", "claw", "gore", "slam", "sting", "talons"].includes(atkName)) {
            // 1 Natural Attack
            atkMod = this.monster.BAB + creature.abilities.StrMod + this.monster.size["ac / atk"];
            dmgMod = creature.abilities.StrMod + creature.abilities.StrMod/2;
          } else if (["hoof", "tentacle", "wing", "pincers", "tail slap"].includes(atkName)) {
            // Secondary Natural Attack
            atkMod = this.monster.BAB - 5 + creature.abilities.StrMod + this.monster.size["ac / atk"];
            dmgMod = creature.abilities.StrMod / 2;
          } else {
            // Primary Natural Attack / Weapon Attack
            atkMod = this.monster.BAB + creature.abilities.StrMod + this.monster.size["ac / atk"];
            dmgMod = creature.abilities.StrMod;
          }
          atkMod = atkMod>0 ? `+${atkMod}` : atkMod;
          dmgMod = dmgMod>0 ? `+${dmgMod}` : dmgMod;
          creature.melee[i] = { atkNum, atkName, atkMod, dmgDie, dmgMod, bonus };
        });
      }

      if (this.monster.Ranged) {
        this.monster.Ranged.forEach((atk, i) => {
          // console.log("original : ", atk);
          let atkArr = atk.split("+");
          let [atkName, atkMod, atkType, dmgDie, dmgMod, dmgType] = [ atkArr[0].slice(0, -1), 0, "ranged", "d", 0, "slashing" ];

          atkMod = this.monster.BAB + creature.abilities.DexMod + this.monster.size["ac / atk"];
          atkMod = atkMod>0 ? `+${atkMod}` : atkMod;

          atkArr = atkArr[1].substring(2).split("(");
          atkType = atkArr[0].slice(0, -1);

          atkArr = atkArr[1].split(" ");
          dmgDie = atkArr[0];
          dmgMod = dmgMod>0 ? `+${dmgMod}` : dmgMod;
          dmgType = atkArr[1].slice(0 ,-1);

          creature.ranged[i] = { atkName, atkMod, atkType, dmgDie, dmgMod, dmgType };
        });
      }

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
      supplement: supplement,

      monsterVisible: true,
      openSections: [ "defense", "offense", "special", "other" ],
      monster: {
        /*
        Name: "Adult Red Dragon",
        Name: "Kobold",
        */
        Name: "Death Worm",
        ac: 10
      }

    };
  },
  mounted() {
    this.getMonster(this.monster);

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
      this.monster = monster;
      // Add supplemental base stats
      let sup = this.supplement[this.monster.Name];
      this.monster.Senses = sup.senses

      let temp = this.monster.Size ? this.monster.Size : 'medium';
      this.monster.size = this.tables.size[temp.toLowerCase()];

      // DEFENSE
      this.monster.HDNum = parseInt(this.monster.HD.split('d')[0]);
      this.monster.HDType = this.monster.HD.split('d')[1].split('+')[0];
      this.monster.ac = sup.ac;
      this.monster.DR = sup.dr;
      this.monster.SR = sup.sr;
      this.monster.Saves = sup.saves;
      this.monster.Immunities = sup.immunities;
      this.monster.Weaknesses = sup.weaknesses;

      // OFFENSE
      this.monster.BAB = sup.bab;
      this.monster.Melee = this.monster.Melee ? this.monster.Melee.split(',') : null;
      this.monster.Ranged = this.monster.Ranged ? this.monster.Ranged.split(',') : null;



      console.log(this.monster);
    },
    monsterOpen() {
      this.monsterVisible = true;
    },
    monsterClose() {
      this.monsterVisible = false;
    },
  }
};
</script>

<style>
.stat-controls .el-input-number {
  width: 70px;
}
.center-vert {
  align-content: center;
}
.center-horz {
  text-align: center;
}
</style>
