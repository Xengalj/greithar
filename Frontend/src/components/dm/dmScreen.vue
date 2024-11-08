<template>

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

    // DataService.getEquipment().then(
    //   (response) => {
    //     this.equipment = response.data;
    //     console.log(response.data);
    //   }
    // );
    // console.log(this.equipment.armor);


    // console.log(this.tableCols);

    // console.log(Object.keys(this.equipment.armor[0]));

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


      DataService.getMonster(name)
      .then(response => {
        console.log(response);
        let creature = {
          "attributes": { "Str": 10 },
          "abilities": {
            "name": {
              "type": "",
              "bonus": "",
              "description": "",
              "stacks": false
            },
            "Chainmail": {
              "type": "armor",
              "bonus": 5,
              "desc": "A shirt with metal loops",
              "stacks": false
          },
          "characteristics": {
            "age": 10
          }
        };

        // Get Monster's Equipment
        let items = orig.treasure.split(',');
        for (const shield of Object.keys(equipment.shields)) {
          if (items.includes(shield)) {
            abilities[shield].type = "shield";
            abilities[shield].bonus = equipement.shields[shield]["AC Bonus"];
            abilities[shield].description = equipement.shields[shield]["Description"];
            abilities[shield].stacks = false;

            monster.equipment[shield] = equipment.shields[shield];
          }
        }
        for (const armor of Object.keys(equipment.armors)) {
          if (items.includes(armor)) {
            abilities[armor].type = "armor";
            abilities[armor].bonus = equipment.armors[armor]["AC Bonus"];
            abilities[armor].description = equipment.armors[armor]["Description"];
            abilities[armor].stacks = false;

            monster.equipment[armor] = equipment.armors[armor];
          }
        }
        for (const weapon of Object.keys(equipment.weapons)) {
          monster.equipment[weapon] = equipment.weapons[weapon];
        }

        
        creture.ac = { "base": 10 };
        // orig.ac
        for item in abilities {
          let ac = orig.ac;
          ac = ac - dexMod - 10;
          ac = ac - size.AC;
          let acBonuses = [ "armor", "shield", "dodge", "deflection" ];
          if ( acBonuses.inlcudes(item.type)) {
            let curr = creature.ac[item.type].bonus;
            let stack = creature.ac[item.type].stacks;
            if (item.stacks) {
              stack = stack + item.bonus;
            } else {
              curr = Math.max(curr, item.bonus);
                  // TODO:  Move to ac computaion section
              // // if the bonus stacks, add it to the current bonus, otherwise use the higher value
              // curr = (item.stacks) ? curr + item.bonus : Math.max(curr, item.bonus);
            }
            // subtract armor, shields, dodge bouses
            ac = ac - curr;
            ac = ac - stacks;
          }
        }
        let natural = ac; // - dodge?
        let AC_TYPES = {
          "Base": 10,
          "Dex": 0,
          "Size": 0,
          "Armor" : 0,
          "Shield": 0,
          "Natural": 0,
          "Dodge": 0,
          "Deflection": 0,
          "Competence": 0,
          "Insight": 0,
          "Sacred/Profane": 0,
          "Luck": 0,
          "Morale": 0,
          "Circumstance": 0
        };
        
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
