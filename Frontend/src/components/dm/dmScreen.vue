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
    width="600"
    v-model="monsterVisible"
    :title="monsterTitle"
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
            HP: {{ this.monster.HP }} ({{ this.monster.HD }})
            <br>
            HP: {{ this.monster.HP }} ({{ this.monster.HDNum }}{{ this.monster.HDType }} + {{this.monster.HDNum * this.monster.ConMod}})

            <br><br>
            AC:  {{ this.monster.AC }}
            <br>
            Touch: {{ this.monster.AC_Touch }}
            <br>
            Flat Footed: {{ this.monster["AC_Flat-footed"] }}
            <br>
            (+21 natural, –2 size)
          </el-col>

          <el-col :span="7" class="center">
            Fort: {{ this.monster.Fort }}
            <br>
            Ref: {{ this.monster.Ref }}
            <br>
            Will: {{ this.monster.Will }}
            <br>
            DR: ##
            <br>
            SR: ##
          </el-col>

          <el-col :span="7" class="center">
            Init: ##
            <br>
            Senses: XX
            <br>
            Speed: {{ this.monster.Speed }}
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="3" class="center">
          </el-col>
          <el-col :span="7" class="center">
            Immunities
          </el-col>
          <el-col :span="14" class="center">
            xx, xx, xx
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="center">
          </el-col>
          <el-col :span="7" class="center">
            Weaknesses
          </el-col>
          <el-col :span="14" class="center">
            xx, xx, xx
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
            <div v-for="atk in this.monster.Melee" :key="atk.id">
               {{ atk }}
             </div>
          </el-col>

          <el-col :span="7" class="center">
            <div class="center-horz">Ranged</div>
            <div v-for="atk in this.monster.Ranged" :key="atk.id">
              {{ atk }}
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
<br><br>


<br><br>


<br><br>
    {{ monster }}

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

export default {
  name: "DM Screen",
  components: {
    HexGraph
  },
  computed: {
    // a computed property for the creature's card title
    monsterTitle() {
      let title = "";
      title = this.original.Name.concat(" CR ", this.original.CR);
      return title;
    },
    // monster: {}
  },
  data() {
    return {
      content: "DM Screen",
      loading: false,
      icons: icons,

      monsterVisible: false,
      openSections: [ "defense", "offense", "special", "other" ],
      original: {
        /*
        Name: "Kobold"
        */
        Name: "Adult Red Dragon"
      },
      monster: {}

    };
  },
  mounted() {
    // console.log(this.icons);
    this.getMonster(this.original);

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
        this.original = response;
        this.monsterSetup(this.original);
        this.loading = false;
      })
      .catch(err => { console.error(err); });
    },
    monsterSetup(original){
      this.monster = original;

      // Ability Mods
      let abilities = [{ key: "StrMod", value: this.monster.Str }, { key: "DexMod", value: this.monster.Dex }, { key: "ConMod", value: this.monster.Con }, { key: "IntMod", value: this.monster.Int }, { key: "WisMod", value: this.monster.Wis }, { key: "ChaMod", value: this.monster.Cha }];
      abilities.map(({key, value}) => { this.monster[key] = Math.floor((value - 10) / 2) });


      this.monster.HDNum = parseInt(this.monster.HD.split('d')[0]);
      this.monster.HDType = "d" + this.monster.HD.split('d')[1].split('+')[0];



      // TODO: split atk strongs to use abil mods
      this.monster.Melee = this.monster.Melee ? this.monster.Melee.split(',') : null;
      this.monster.Ranged = this.monster.Ranged ? this.monster.Ranged.split(',') : null;


      console.log(this.monster);
    },
    monsterOpen() {
      this.monsterVisible = true;
    },
    monsterClose() {
      console.log("Closing modal");
      this.monsterVisible = false;
      // this.monster = {};
    },
    // updateStat(stat, ammount) {
    //   this.monster[stat] = this.monster[stat] + ammount;
    //
    //   console.log(typeof stat, stat);
    //
    // },
    sectionClose() {
      console.log('changed?');
    }
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
