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

      tableName: "equipmentTable",
      tableData: {},
      tableFilters: {},

      rules: {},
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

    DataService.getRules().then( (response) => { this.rules = response;
      console.log(this.rules);

     } );
    DataService.getEquipment().then( (response) => { this.equipment = response; } );


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
        console.log("Orig", response);
        let tempNum = 0;
        let creature = {
          "name": response.Name,
          "cr": response.CR,
          "type": response.type,
          "size": response.Size.toLowerCase(),
          "alignment": response.Alignment,
          "environment": response.environment,
          "treasure": response.Treasure,

          "health": { bonus: 0, HDString: "d".concat(response.HDType, "+") },
          "senses": [],
          "speed": response.Speed,

          "bab": 0,
          "melee": [],
          "ranged": [],
          "special": [],
          "magic": [],

          "attributes": { "Str": response.Str, "Dex": response.Dex, "Con": response.Con, "Int": response.Int, "Wis": response.Wis, "Cha": response.Cha },
          "abilities": {
            "fort": {  "type": "save",  "bonus": response.Fort,  "description": "",  "stacks": false  },
            "ref": {  "type": "save",  "bonus": response.Ref,  "description": "",  "stacks": false  },
            "will": {  "type": "save",  "bonus": response.Will,  "description": "",  "stacks": false  }
          },
          "equipment": {}
          // "temp": {}
        };

        /***************************\
        *                           *
        *         EQUIPMENT         *
        *                           *
        \***************************/
        let items = [];
        if (response.Treasure.includes("(")) {
          let equip = response.Treasure.split('(').pop().split(')')[0];
          items = items.concat(equip.split(','));
        }
        if (response.Gear) { items = items.concat(response.Gear.split(',')); }

        for (let item of items) {
          /*
            1. Remove "with" items then,
            2. Remove "+#" from magic items then,
            3. Remove "Masterwrk" then,
            4. Remove leading " " then, Capitalize first letter of words
          */
          let extras = item.indexOf('with');
          item = extras>-1 ? item.slice(0, extras) : item;
          extras = item.indexOf('+');
          item = extras>-1 ? item.slice(extras+2) : item;
          extras = item.indexOf('masterwork');
          item = extras>-1 ? item.slice(extras+10) : item;
          item = item[0] === " " ? item.slice(1) : item;
          item = item.replace(/(^\w|\s\w)/g, m => m.toUpperCase());

          // Add items to abilities and equipment
          if (  Object.keys(this.equipment.Shields).includes(item)  ) {
            creature.abilities[item] = {};
            creature.abilities[item].type = "Shield";
            creature.abilities[item].bonus = this.equipment.Shields[item]["AC Bonus"];
            creature.abilities[item].description = this.equipment.Shields[item]["Description"];
            creature.abilities[item].stacks = false;

            creature.equipment[item] = this.equipment.Shields[item];
          }
          if (  Object.keys(this.equipment.Armor).includes(item)  ) {
            creature.abilities[item] = {};
            creature.abilities[item].type = "Armor";
            creature.abilities[item].bonus = this.equipment.Armor[item]["AC Bonus"];
            creature.abilities[item].description = this.equipment.Armor[item]["Description"];
            creature.abilities[item].stacks = false;

            creature.equipment[item] = this.equipment.Armor[item];
          }
          if (  Object.keys(this.equipment.Weapons).includes(item)  ) {
            creature.equipment[item] = this.equipment.Weapons[item];
          }
        } // End items loop

        /***************************\
        *                           *
        *         ABILITIES         *
        *                           *
        \***************************/
        // FEATS
        for (let feat of response.Feats.split(',')) {
          feat = feat[0] === " " ? feat.slice(1) : feat;
          // TODO: feat table? in rules?
          // console.log(feat);
          // add ability ( type: dodge, bonus: # )
          // dodge: type = dodge, bonus = 1, descrip = ..., stacks = true;
        }

        // NATURAL ARMOR
        tempNum = response.AC - 10;
        tempNum -= Math.floor((response.Dex - 10) / 2);
        tempNum -= this.rules.size[creature.size]["ac / atk"];

        for (const ability in creature.abilities) {
          if ( this.rules["ac types"].includes(creature.abilities[ability].type) ) {
            tempNum -= creature.abilities[ability].bonus;
          }
        }
        creature.abilities["Natural Armor"] = {};
        creature.abilities["Natural Armor"].type = "Natural";
        creature.abilities["Natural Armor"].bonus = tempNum;
        creature.abilities["Natural Armor"].description = "";
        creature.abilities["Natural Armor"].stacks = false;

        // MELEE
        // TODO:
        /*
        Melee: "mwk longsword +7 (1d8+3/19-20)"

        grab the +2 from above for BAB
        */

        // RANGED

        // SPECIAL

        // MAGIC






        console.log("new", creature);
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
