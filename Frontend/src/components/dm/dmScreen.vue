<template>
  <div class="container">
    <!--
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>
  -->
  </div>

  <el-button type="primary" circle @click="monsterOpen('Death Worm')">
    <g-icon iconSize="24px" iconName="eye" />
  </el-button>
  <el-button type="primary" circle @click="monsterOpen('Adult Red Dragon')">
    <g-icon iconSize="24px" iconName="firebolt" />
  </el-button>


  <el-dialog
    width="650"
    v-model="monsterVisible"
    :before-close="monsterClose"
  >
    <CreatureCard :creatureName="creatureName"></CreatureCard>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="monsterClose()"> Close </el-button>
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
// import DataService from "@/services/data.service";
import UserService from "@/services/user.service";
import CreatureCard from '@/components/template/CreatureCard.vue'
const icons = require('@/components/template/svgPaths.json');
// const miscTables = require('@/components/codex/tables.json');
// const supplementTables = require('@/components/codex/monsters.json');
// const equipmentTables = require('@/components/codex/equipment.json');

export default {
  name: "DM Screen",
  components: {
    // HexGraph,
    CreatureCard
  },

  data() {
    return {
        content: "DM Screen",
      icons: icons,

      // loading: false,
      // tables: miscTables,
      // equipment: equipmentTables,
      // supplement: supplementTables,
      // sizeSelect: [
      //   { value: "Fine", label: "Fine", },
      //   { value: "Diminuitive", label: "Diminuitive", },
      //   { value: "Tiny", label: "Tiny", },
      //   { value: "Small", label: "Small", },
      //   { value: "Medium", label: "Medium", },
      //   { value: "Large", label: "Large", },
      //   { value: "Huge", label: "Huge", },
      //   { value: "Gargantuan", label: "Gargantuan", },
      //   { value: "Colossal", label: "Colossal", } ],

      monsterVisible: false,
      // openSections: [ "defense", "offense" ],
      // monster: {
      //   // Name: "Death Worm",
      //   /*
      //   Name: "Adult Red Dragon",
      //   Name: "Kobold",
      //   */
      // },
      creatureName: ""

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
    // async getMonster(monster) {
    //   this.loading = true;
    //   DataService.getMonster(monster)
    //   .then(response => {
    //     this.monsterSetup(response);
    //     this.loading = false;
    //   })
    //   .catch(err => { console.error(err); });
    // },
    // monsterSetup(monster){
    //   // console.log(monster);
    //   this.monster = monster;
    //   let ac = this.monster.AC;
    //
    //   // Add supplemental stats
    //   let sup = this.supplement[this.monster.Name];
    //   for (const [key, value] of Object.entries(sup)) { this.monster[key] = value; }
    //
    //   // DEFENSE
    //   this.monster.AC.total = ac;
    //   this.monster.HDNum = parseInt(this.monster.HD.split('d')[0]);
    //   this.monster.HDType = this.monster.HD.split('d')[1].split('+')[0];
    //
    //   // OFFENSE
    //   this.monster.Melee = this.monster.Melee ? this.monster.Melee.split(',') : null;
    //   this.monster.Ranged = this.monster.Ranged ? this.monster.Ranged.split(',') : null;
    //   this.monster.Special = this.monster.Special ? this.monster.Special : null;
    //   // this.monster.Magic = this.monster.Magic ? this.monster.Magic : null;
    //
    //   this.creature.title = this.monster.Name.concat(" CR ", this.monster.CR);
    //
    //   // console.log(this.monster);
    // },
    monsterOpen(name) {
      this.creatureName = name

      // this.monster.Name = name;
      // this.getMonster(this.monster);
      this.monsterVisible = true;
    },
    monsterClose() {
      this.monsterVisible = false;
    },
  }
};
</script>

<style>
/* .center-vert {
  align-content: center;
}
.center-horz {
  text-align: center;
}
.stat-controls .el-input-number {
  width: 70px;
} */
</style>
