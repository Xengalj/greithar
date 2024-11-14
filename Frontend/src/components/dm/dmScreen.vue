<template>

  <el-button type="primary" circle @click="monsterOpen('Death Worm')">
    <g-icon iconSize="24px" iconName="eye" />
  </el-button>
  <el-button type="primary" circle @click="monsterOpen('Adult Red Dragon')">
    <g-icon iconSize="24px" iconName="firebolt" />
  </el-button>
  <el-button type="primary" circle @click="monsterOpen('Skeletal Champion')">
    <g-icon iconSize="24px" iconName="undead" />
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


  <p v-for="(icon, name, index) in icons" :key="index">
    <strong>{{ name }}</strong>
    <g-icon :iconName="name" />
  </p>

</template>

<script>
import UserService from "@/services/user.service";
import DataService from "@/services/data.service";
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
      creatureName: "",

      // equipment: equipmentTables,
      tableName: "equipmentTable",
      tableData: {},
      tableFilters: {},

      equipment: {},


    }
  },
  computed: {
    user() {
      let user = "Xen";
      user = localStorage.getItem('user');

      // this.$store.state.auth.status.loggedIn
      // console.log(this.$store.state.auth);
      return user;
    }
  },
  created() {
    // this.tableData = this.equipment.armor;
    // let first = Object.values(this.tableData)[0];
    // this.tableCols = ["Name"].concat(Object.keys(first));

    this.tableFilters = {
      /*
      //   { value: '#E63415', label: 'red' },
      //   { value: '#FF6600', label: 'orange' },
      //   { value: '#FFDE0A', label: 'yellow' },
      //   { value: '#1EC79D', label: 'green' },
      //   { value: '#14CCCC', label: 'cyan' },
      //   { value: '#4167F0', label: 'blue' },
      //   { value: '#6222C9', label: 'purple' }
      */
      "Proficiency": {
        "Light": { label: 'Light', color: '#1EC79D' },
        "Medium": { label: 'Medium', color: '#FF6600' },
        "Heavy": { label: 'Heavy', color: '#E63415' },
      },
      "Category": {
        "Unarmed": { label: 'Unarmed', color: '#E63415' },
        "Light": { label: 'Light', color: '#FF6600' },
        "One-Handed": { label: 'One-Handed', color: '#FFDE0A' },
        "Two-Handed": { label: 'Two-Handed', color: '#1EC79D' },
        "Ranged": { label: 'Ranged', color: '#4167F0' },
        "Ammunition": { label: 'Ammunition', color: '#6222C9' }
      },
      "Group": {
        "Close": { label: 'Close', color: '#E63415' }
      },
      "Damage Type": {
        "Slashing": { label: 'Slashing', color: '#E63415' },
        "Piercing": { label: 'Piercing', color: '#FFDE0A' },
        "Bludgeoning": { label: 'Bludgeoning', color: '#4167F0' }
      }
    };

  },
  mounted() {

    DataService.getEquipment().then(
      (response) => {
        console.log(response);
        this.equipment = response;
      }
    );


    UserService.getAdminBoard().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content =
          (error.response && error.response.data && error.response.data.message)
          || error.message || error.toString();
      }
    );
  },
  methods: {
    monsterOpen(name) {


      DataService.getMonster({"Name": name})
      .then(response => {
        console.log(response);
        let creature = {
          "characteristics": {
            "age": 10
          },
          "attributes": { "Str": 10 },
          "abilities": {
            // "name": {
            //   "type": "",
            //   "bonus": "",
            //   "description": "",
            //   "stacks": false
            // }
          },
          "equipment": {}
        };


        // Get Monster's Equipment
        let items = response.Treasure.split('(').pop().split(')')[0];
        items = items.split(',');


        // TODO:

        /*

        1. loop on items,
        2. item = item. cap first, remove leading " "
        3. then equips.includes(item)
        */

        for (const shield of Object.keys(this.equipment.Shields)) {
          for (const item of items) {


            // if item's name / string contains the name of the shield
            if (item.includes(shield.toLowerCase())) {
              creature.abilities[shield] = {};
              creature.abilities[shield].type = "shield";
              creature.abilities[shield].bonus = this.equipment.Shields[shield]["AC Bonus"];
              creature.abilities[shield].description = this.equipment.Shields[shield]["Description"];
              creature.abilities[shield].stacks = false;

              creature.equipment[shield] = this.equipment.Shields[shield];
            }
          }
        }

        for (const armor of Object.keys(this.equipment.Armor)) {
          for (const item of items) {
            if (item.includes(armor.toLowerCase())) {
              creature.abilities[armor] = {};
              creature.abilities[armor].type = "armor";
              creature.abilities[armor].bonus = this.equipment.Armor[armor]["AC Bonus"];
              creature.abilities[armor].description = this.equipment.Armor[armor]["Description"];
              creature.abilities[armor].stacks = false;

              creature.equipment[armor] = this.equipment.Armor[armor];
            }
          }
        }
        for (const weapon of Object.keys(this.equipment.Weapons)) {
          for (const item of items) {
            if (item.includes(weapon.toLowerCase())) {
              creature.equipment[item] = this.equipment.Weapons[weapon];
            }
          }
        }
        console.log(creature);


        // creture.ac = { "base": 10 };
        // orig.ac
        // for (item in abilities) {
        //   let ac = orig.ac;
        //   ac = ac - dexMod - 10 - size.AC;
        //   let acBonuses = [ "armor", "shield", "dodge", "deflection" ];
        //   if ( acBonuses.inlcudes(item.type)) {
        //     let curr = creature.ac[item.type].bonus;
        //     let stack = creature.ac[item.type].stacks;
        //     if (item.stacks) {
        //       stack = stack + item.bonus;
        //     } else {
        //       curr = Math.max(curr, item.bonus);
        //           // TODO:  Move to ac computaion section
        //       // // if the bonus stacks, add it to the current bonus, otherwise use the higher value
        //       // curr = (item.stacks) ? curr + item.bonus : Math.max(curr, item.bonus);
        //     }
        //     // subtract armor, shields, dodge bouses
        //     ac = ac - curr;
        //     ac = ac - stacks;
        //   }
        // }
        // let natural = ac;
        // let AC_TYPES = {
        //   "Base": 10,
        //   "Dex": 0,
        //   "Size": 0,
        //   "Armor" : 0,
        //   "Shield": 0,
        //   "Natural": 0,
        //   "Dodge": 0,
        //   "Deflection": 0,
        //   "Competence": 0,
        //   "Insight": 0,
        //   "Sacred/Profane": 0,
        //   "Luck": 0,
        //   "Morale": 0,
        //   "Circumstance": 0
        // };

        // this.creatureSetup(response);
      })
      .catch(err => { console.error(err); });



      this.creatureName = name
      this.monsterVisible = true;
    },
    monsterClose() {
      this.monsterVisible = false;
    },


    // End Methods
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
