<template>
  <div class="container">

    <header class="jumbotron">
      <h3>{{ user }}</h3>
    </header>

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
import DataService from "@/services/data.service";
import UserService from "@/services/user.service";
import CreatureCard from '@/components/template/CreatureCard.vue'
const icons = require('@/components/template/svgPaths.json');
// const miscTables = require('@/components/codex/tables.json');
// const supplementTables = require('@/components/codex/monsters.json');
// const equipmentTables = require('@/components/codex/equipment.json');

export default {
  name: "DM Screen",
  components: {
    CreatureCard
  },
  data() {
    return {
        content: "DM Screen",

      icons: icons,

      monsterVisible: false,
      creatureName: ""



    };
  },
  computed: {
    user() {
      let user = "Xen";
      user = localStorage.getItem('user');
      // console.log(user);

      // this.$store.state.auth.status.loggedIn
      console.log(this.$store.state.auth);
      return user;
    }
  },
  mounted() {
    // console.log(this.tables);
    // this.getMonster(this.monster);
    DataService.getEquipment().then(
      (response) => {
        console.log(response.data);
      }
    );

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
