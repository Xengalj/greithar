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
      // console.log(this.rules);
     } );
    DataService.getEquipment().then( (response) => { this.equipment = response; } );


    UserService.getAdminBoard().then(
      (response) => { this.content = response.data; },
      (error) => {
        this.content =
          (error.response && error.response.data && error.response.data.message)
          || error.message || error.toString();
      }
    );


    this.monsterOpen("Skeletal Champion");
  },
  methods: {
    monsterOpen(name) {

      DataService.getMonster({"Name": name})
      .then(response => {
        console.log("Orig", response);
        let tempNum = 0;
        let creature = {
          "name": response.Name,
          "attributes": { "Str": response.Str, "Dex": response.Dex, "Con": response.Con, "Int": response.Int, "Wis": response.Wis, "Cha": response.Cha },
          "characteristics": {
            "cr": response.CR,
            "size": response.Size.toLowerCase(),
            "alignment": response.Alignment,
            "environment": response.environment,
            "treasure": response.Treasure,
          },
          "health": { total: 0, bonus: 0 },



          "bab": 0,   // TODO: Remove
          "melee": [],
          "ranged": [],
          "special": [],
          "magic": [],

          "abilities": {},
          "equipment": {}
          // "temp": {}
        };

        let classes = {
          "warrior": {
            "hd": 10,
            "ranks": 2,
            "skills": [ "Climb (Str)", "Craft (Int)", "Handle Animal (Cha)", "Intimidate (Cha)", "Profession (Wis)", "Ride (Dex)", "Swim (Str)" ],
            "proficiency": [ "simple weapons", "martial weapons", "light armor", "medium armor", "heavy armor", "shields" ],
            "alignment": [ "LG", "NG", "CG", "LN", "N", "CN", "LE", "NE", "CE" ],
            "bab": 1, // Fast BAB: HD*1
            "fort": { "mult": 0.5, "bonus": 2 }, // Good Save: HD/2 +2
            "ref": { "mult": 0.33, "bonus": 0 }, // Poor Save: HD/3
            "will": { "mult": 0.33, "bonus": 0 }
          }
        };

        let types = {
          "undead": {
            "hd": 8,
            "ranks": 2,
            "bab": 0.75, // Med BAB: HD*0.75
            "fort": { "mult": 0.33, "bonus": 0 }, // Poor Save: HD/3
            "ref": { "mult": 0.33, "bonus": 0 },
            "will": { "mult": 0.5, "bonus": 2 } // Good Save: HD/2 +2
          }
        };


        /***************************\
        *                           *
        *          BASICS           *
        *                           *
        \***************************/

        // creature.subtype = [];  // TODO: loop check
        let racialHD = 0;
        creature.attributes.StrMod = Math.floor((creature.attributes.Str - 10) / 2);
        creature.attributes.DexMod = Math.floor((creature.attributes.Dex - 10) / 2);
        creature.attributes.ConMod = Math.floor(( (isNaN(creature.attributes.Con) ? creature.attributes.Cha : creature.attributes.Con) - 10) / 2);
        creature.attributes.IntMod = Math.floor((creature.attributes.Int - 10) / 2);
        creature.attributes.WisMod = Math.floor((creature.attributes.Wis - 10) / 2);
        creature.attributes.ChaMod = Math.floor((creature.attributes.Cha - 10) / 2);


        // "17d12+102"
        // Get total HD
        let strings = response.HD.split(";");
        strings = strings[1] ? strings[1] : strings[0];
        strings = strings.split("+");
        for (var str of strings) {
          str = str.trimStart();
          if (str.includes('d')) {
            str = str.split("d");
            racialHD += parseInt(str[0]);
          }
        }

        // Class 1
        racialHD -= response.Class1_Lvl;
        let Class = classes[response.Class1];
        creature.class1 = {
          name: response.Class1,
          levels: response.Class1_Lvl,
          hd: Class.hd
        }

        let bab   = response.Class1_Lvl * Class.bab;
        let fort  = (response.Class1_Lvl * Class.fort.mult) + Class.fort.bonus;
        let ref   = (response.Class1_Lvl * Class.ref.mult) + Class.ref.bonus;
        let will  = (response.Class1_Lvl * Class.will.mult) + Class.will.bonus;

        let hp    = response.Class1_Lvl * (Class.hd/2 + 0.5 + creature.attributes.ConMod);
        let hpBonus = response.Class1_Lvl * creature.attributes.ConMod;

        // Class 2
        if (response.Class2_Lvl) {
          console.log("MULTICLASS!!");
          racialHD -= response.Class2_Lvl;
          Class   = classes[response.Class2];
          creature.class2 = {
            name: response.Class2,
            levels: response.Class2_Lvl,
            hd: Class.hd
          }

          bab     += response.Class2_Lvl * Class.bab;
          fort    += (response.Class2_Lvl * Class.fort.mult) + Class.fort.bonus;
          ref     += (response.Class2_Lvl * Class.ref.mult) + Class.ref.bonus;
          will    += (response.Class2_Lvl * Class.will.mult) + Class.will.bonus;

          hp      += response.Class2_Lvl * (Class.hd/2 + 0.5 + creature.attributes.ConMod);
          hpBonus += response.Class2_Lvl * creature.attributes.ConMod;
        }

        // Racial
        let type  = types[response.Type];
        creature.type = {
          name: response.Type,
          levels: racialHD,
          hd: type.hd
        }

        bab       += racialHD * type.bab;
        fort      += (racialHD * type.fort.mult) + type.fort.bonus;
        ref       += (racialHD * type.ref.mult) + type.ref.bonus;
        will      += (racialHD * type.will.mult) + type.will.bonus;

        hp        += racialHD * (type.hd/2 + 0.5 + creature.attributes.ConMod);
        hpBonus   += racialHD * creature.attributes.ConMod;



        creature.bab = Math.floor(bab);
        creature.defense = {
          "fort": Math.floor(fort + creature.attributes.ConMod),
          "ref": Math.floor(ref + creature.attributes.DexMod),
          "will": Math.floor(will + creature.attributes.WisMod),

          "senses": [],
          "speed": response.Speed,

        }
        creature.health.max = Math.floor(hp);
        creature.health.bonus = Math.floor(hpBonus);


        // total HD
        //   hd types <- class & type
        //   hd num <- lvls & creature
        //







        // hd.undead.num = 2
        // hd.undead.type = d8



        // creature.health = health;

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

          let ability = {};
          ability.name = item;
          ability.stacks = false;


          // Add items to abilities and equipment
          if (  Object.keys(this.equipment.Shields).includes(item)  ) {
            ability.type         = "Shield";
            ability.targets      = [ "AC" ];
            ability.bonus        = this.equipment.Shields[item]["AC Bonus"];
            ability.description  = this.equipment.Shields[item]["Description"];
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

          // creature.abilities.push(ability);
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
        tempNum -= this.rules.size[creature.characteristics.size]["ac / atk"];

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
