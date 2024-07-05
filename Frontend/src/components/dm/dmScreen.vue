<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>
  </div>
  DM SCREEN


  <el-button type="primary" circle @click="openMonster()">
    <g-icon iconSize="24px" iconName="eye" />
  </el-button>


  <el-dialog
    width="500"
    v-model="cardVisible"
    :title="cardTitle"
    :before-close="handleClose"
  >

    <el-row :gutter="20">
      <!-- Stats -->
      <el-col :span="12" class="center">
        <svg width="225" height="200">
          <HexGraph :abilities="[this.monster.Str, this.monster.Dex, this.monster.Con, this.monster.Int, this.monster.Wis, this.monster.Cha]"></HexGraph>
        </svg>

        <div class="stat-controls">
          <el-row :gutter="5">
            <el-col :span="4" class="center">
              Str: <br>
            </el-col>
            <el-col :span="8" class="center">
              <el-input-number
              v-model="this.monster.Str"
              size="small"
              controls-position="right"
              />
            </el-col>
            <el-col :span="4" class="center">
              Int: <br>
            </el-col>
            <el-col :span="8" class="center">
              <el-input-number
              v-model="this.monster.Int"
              size="small"
              controls-position="right"
              />
            </el-col>
          </el-row>

          <el-row :gutter="5">
            <el-col :span="4" class="center">
              Dex: <br>
            </el-col>
            <el-col :span="8" class="center">
              <el-input-number
              v-model="this.monster.Dex"
              size="small"
              controls-position="right"
              />
            </el-col>
            <el-col :span="4" class="center">
              Wis: <br>
            </el-col>
            <el-col :span="8" class="center">
              <el-input-number
              v-model="this.monster.Wis"
              size="small"
              controls-position="right"
              />
            </el-col>
          </el-row>

          <el-row :gutter="5">
            <el-col :span="4" class="center">
              Con: <br>
            </el-col>
            <el-col :span="8" class="center">
              <el-input-number
              v-model="this.monster.Con"
              size="small"
              controls-position="right"
              />
            </el-col>
            <el-col :span="4" class="center">
              Cha: <br>
            </el-col>
            <el-col :span="8" class="center">
              <el-input-number
              v-model="this.monster.Cha"
              size="small"
              controls-position="right"
              />
            </el-col>
          </el-row>
        </div>
      </el-col>
      <!-- End Stats -->

      <!-- Basics -->
      <el-col :span="12" class="center">
        <g-icon iconSize="128px" icon-name="runeStone"/>
        <!-- https://pathfinderwiki.com/wiki/File:Red_Kobold.jpg -->
        <br>

        <el-row :gutter="5">
          <el-col :span="4" class="center">
            <g-icon iconSize="24px" :icon-name="this.monster.Type"/>
          </el-col>
          <el-col :span="4" class="center">
            {{ this.monster.Alignment }}
          </el-col>
          <el-col :span="16" class="center">
            {{ this.monster.Size }} ({{ this.monster.Space}} ft.)
          </el-col>
        </el-row>

        <el-row>
          <el-col :offset="4" class="center">
            {{ this.monster.Type }}
            <span v-if="this.monster.subtype1"> (</span>
            <span v-if="this.monster.subtype1">{{ this.monster.subtype1 }}</span>
            <span v-if="this.monster.subtype2">, {{ this.monster.subtype2 }}</span>
            <span v-if="this.monster.subtype1">)</span>
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

    <el-divider />

    <!-- Defense -->
    <el-row :gutter="20">
      <el-col :span="3" class="center">
        <g-icon iconSize="32px" iconName="Armor" />
      </el-col>

      <el-col :span="7" class="center">
        HP: {{ this.monster.HP }} ({{ this.monster.HD }})
        <br>
        AC:  {{ this.monster.AC }}
        <br>
        Fort: {{ this.monster.Fort }}
      </el-col>

      <el-col :span="7" class="center">
        Init: {{ this.monster.Speed }}
        <br>
        Touch: {{ this.monster.AC_Touch }}
        <br>
        Ref: {{ this.monster.Ref }}
      </el-col>

      <el-col :span="7" class="center">
        Speed: {{ this.monster.Speed }}
        <br>
        Flat Footed: {{ this.monster["AC_Flat-footed"] }}
        <br>
        Will: {{ this.monster.Will }}
      </el-col>
    </el-row>
    Immunities

    <el-divider />

    <!-- Offense -->
    <el-row :gutter="20">
      <el-col :span="3" class="center">
        <g-icon iconSize="32px" iconName="swordShield" />
      </el-col>

      <el-col :span="7" class="center">
        Melee: {{ this.monster.Melee }}
        <br>
        ({{ this.monster.Reach }} ft. Reach)
      </el-col>

      <el-col :span="7" class="center">
        Ranged: {{ this.monster.Ranged }}
      </el-col>

      <el-col :span="7" class="center">
        Magic: Breath
      </el-col>
    </el-row>

    <el-divider />

    <!-- Specials -->
    <el-row :gutter="20">
      <el-col :span="3" class="center">
        <g-icon iconSize="32px" iconName="Star" />
      </el-col>

      <el-col :span="7" class="center">
        {{ this.monster.CR }}
      </el-col>

      <el-col :span="7" class="center">
        {{ this.monster.HP }}
      </el-col>

      <el-col :span="7" class="center">
        {{ this.monster.AC }}
      </el-col>
    </el-row>

<br><br>

{{ this.monster.Feats }}
{{ this.monster.Skills }}
{{ this.monster.Languages }}
{{ this.monster.SQ }}

<br><br>



    {{ monster }}

  <template #footer>
    <div class="dialog-footer">
      <el-button @click="handleClose()"> Close </el-button>
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
  name: "Admin",
  components: {
    HexGraph
  },
  computed: {
    // a computed property for the creature's card title
    cardTitle() {
      let title = "";
      title = this.monster.Name.concat(" ", this.monster.Class1, "(", this.monster.Class1_Lvl ,") CR ", this.monster.CR);
      return title;
    },
  },
  data() {
    return {
      content: "DM Screen",
      icons: icons,
      loading: false,
      monster: {
        Name: "Kobold"
      },
      cardVisible: false
    };
  },
  mounted() {
    // console.log(this.icons);
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
        this.monster = response;
        this.loading = false;
      })
      .catch(err => { console.error(err); });
    },
    openMonster() {
      // this.monster = monster;
      // console.log(monster);
      this.cardVisible = true;
    },
    handleClose() {
      console.log("Closing modal");
      this.cardVisible = false;
      // this.monster = {};
      // ElMessageBox.confirm('Are you sure to close this dialog?')
      // .then(() => {
      //   done()
      // })
      // .catch(() => {
      //   // catch error
    },
    updateStat(stat, ammount) {
      this.monster[stat] = this.monster[stat] + ammount;
    }
  }
};
</script>

<style>
.stat-controls .el-input-number {
  width: 70px;
}
/* .el-input-number.el-input-number--small.is-controls-right */
</style>
