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
    <CreatureCard :creatureName="creatureName" :source="creature"></CreatureCard>
    <!-- <CreatureCard :creatureName="creatureName" v-bind="creature"></CreatureCard> -->
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
      creature: {},
      creatureName: "",

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
    DataService.getRules().then( (response) => { this.rules = response; } );
    DataService.getRaces().then ( (response) => { this.races = response; } );
    DataService.getClasses().then ( (response) => { this.classes = response; } );
    DataService.getEquipment().then( (response) => { this.equipment = response; } );

    UserService.getAdminBoard().then(
      (response) => { this.content = response.data; },
      (error) => {
        this.content =
        (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString();
      }
    );
  },
  mounted() {
    this.monsterOpen("Skeletal Champion");
    // this.monsterOpen("Adult Red Dragon");
  },
  methods: {
    monsterOpen(name) {

      DataService.getMonster({"Name": name})
      .then(response => {
        console.log("Orig", response);
        let tempNum = 0;
        let creature = {
          "name": response.Name,
          "attributes": { "Str": response.Str, "Dex": response.Dex, "Con": (response.Con == "-" ? 0 : response.Con), "Int": response.Int, "Wis": response.Wis, "Cha": response.Cha },
          "basics": {
            "cr": response.CR,
            "alignment": response.Alignment,
            "environment": response.Environment,
            "size": response.Size.toLowerCase(),
            "speed": parseInt( response.Speed.replace(/\D+$/g, "") ),
            "type": {},
          },
          "skills": {},
          "classes": {},
          "equipment": {},
          "abilities": {},
          "bonuses": {},    // may remove to be built from equips & abils

          "actions": {
            "melee": {},
            "ranged": {},
            "special": {},
          },


          "feats": [],
          "health": { total: 0, bonus: 0 },
          "bab": 0,   // TODO: Remove
          "magic": [],
          "active": {}   // active bonuses
        };



        /***************************\
        *                           *
        *          BASICS           *
        *                           *
        \***************************/
        // Ability Score Modifiers
        creature.attributes.StrMod = Math.floor((creature.attributes.Str - 10) / 2);
        creature.attributes.DexMod = Math.floor((creature.attributes.Dex - 10) / 2);
        creature.attributes.ConMod = Math.floor(( (isNaN(creature.attributes.Con) ? creature.attributes.Cha : creature.attributes.Con) - 10) / 2);
        creature.attributes.IntMod = Math.floor((creature.attributes.Int - 10) / 2);
        creature.attributes.WisMod = Math.floor((creature.attributes.Wis - 10) / 2);
        creature.attributes.ChaMod = Math.floor((creature.attributes.Cha - 10) / 2);

        // Get total HD
        let racialHD = 0;
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

        // Subtract Class HD from total HD to find racialHD
        if (response.Class1) {
          creature.classes[response.Class1] = { "levels": response.Class1_Lvl };
          racialHD -= response.Class1_Lvl;
        }
        if (response.Class2) {
          creature.classes[response.Class2] = { "levels": response.Class2_Lvl };
          racialHD -= response.Class2_Lvl;
        }

        // Racial
        let type  = this.rules.creature_types[response.Type];
        creature.basics.type = {
          name: response.Type,
          levels: racialHD,
          hd: type.hd,
          subtypes: []
        }
        for (let [name, trait] of Object.entries(type.traits)) {
          creature.abilities[name] = trait;
        }
        if (response.Race) {
          creature.basics.type.subtypes.push(response.Race);
          if (Object.keys(this.races).includes(response.Race)) {
            for (let [name, trait] of Object.entries(this.races[response.Race].traits)) {
              creature.abilities[name] = trait;
            }
          }
        }
        // Subtypes
        for (let i = 1; i < 7; i++) {
          if (response[`subtype${i}`]) {
            creature.basics.type.subtypes.push(response[`subtype${i}`]);
          }
        }


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
          let i, extras = {};
          item = item.toLowerCase();
          // "With" abilities (poison, bleed, frost)
          i = item.indexOf('with');
          if (i > -1) {
            extras["abilities"] = item.slice(i);
            item = item.slice(0, i);
          }
          // +# Magic items (can't go over +5)
          i = item.indexOf('+');
          if (i > -1) {
            extras["enhancement"] = item.slice(i+1);
            item = item.slice(i+2);
          }
          // Masterwork items
          i = item.indexOf('masterwork');
          if (i > -1) {
            extras["masterwork"] = true;
            item = item.slice(i+10);
          }
          // Remove leading any whitespace & capitalize
          item = item[0] === " " ? item.slice(1) : item;
          item = item.replace(/(^\w|\s\w)/g, m => m.toUpperCase());

          // Add items to bonuses and equipment
          if ( Object.keys(this.equipment.Armor).includes(item) ) {
            creature.equipment[item] = this.equipment.Armor[item];
            creature.equipment[item].Extras = extras;
            creature.equipment[item].equiped = true;
            // creature.bonuses[item] = {};
            // creature.bonuses[item].type = "Armor";
            // creature.bonuses[item].targets = this.rules.bonuses.Armor.targets;
            // creature.bonuses[item].subtargets = this.rules.bonuses.Armor.subtargets;
            // creature.bonuses[item].bonus = this.equipment.Armor[item]["AC Bonus"];
            // creature.bonuses[item].active = false;
          }
          else if ( Object.keys(this.equipment.Shields).includes(item) ) {
            creature.equipment[item] = this.equipment.Shields[item];
            creature.equipment[item].Proficiency = "Shields";
            creature.equipment[item].Extras = extras;
            creature.equipment[item].equiped = true;
            if (this.equipment.Shields[item]["Critical"] > 0) {
              creature.actions.melee[item] = creature.equipment[item];
            }
            // creature.bonuses[item] = {};
            // creature.bonuses[item].type = "Shield";
            // creature.bonuses[item].targets = this.rules.bonuses.Shield.targets;
            // creature.bonuses[item].subtargets = this.rules.bonuses.Shield.subtargets;
            // creature.bonuses[item].bonus = this.equipment.Shields[item]["AC Bonus"];
            // creature.bonuses[item].active = false;
          }
          else if ( Object.keys(this.equipment.Weapons).includes(item) ) {
            creature.equipment[item] = this.equipment.Weapons[item];
            creature.equipment[item].Extras = extras;
            creature.actions.melee[item] = this.equipment.Weapons[item];
          }
          else {
            // Other Treasure
            creature.equipment[item] = item;
          }
        } // End items loop

        /***************************\
        *                           *
        *          BONUSES          *
        *                           *
        \***************************/
        // FEATS
        let tmpWpnFocus = {
          trigger: "Continuous",
          active: true,
          description: "+1 to hit w/ longswords",
          benefit: { target: "", text: "" },
          bonuses: {
            "Weapon Focus (longsword)": {
              bonus: 1,
              type: "Feat",
              targets: [ "atkBonus" ]
            }
          }
        };


        for (let feat of response.Feats.split(',')) {
          feat = feat[0] === " " ? feat.slice(1) : feat;
          creature.abilities[feat] = {};
          if (feat == "Weapon Focus (longsword)") {
            // console.log(feat);
            creature.abilities[feat] = tmpWpnFocus;
            // for (const [name, bonus] of Object.entries(tmpWpnFocus.bonuses)) {
            //   // console.log(name, bonus);
            //   creature.bonuses[name] = {};
            //   creature.bonuses[name].type = bonus.type;
            //   creature.bonuses[name].targets = bonus.targets;
            //   creature.bonuses[name].bonus = bonus.bonus;
            //   creature.bonuses[name].active = tmpWpnFocus.active;
            // }
          }
        }


        // Set up which bonuses are active, should be done after feats
        let add, actives = [];
        // for every bonus & for every name in actives array
        // check the type and bonus value of each
        // if we need to replace the active bonus,
        // set add to true, and remove the old active name
        for (const [name, bonus] of Object.entries(creature.bonuses)) {
          add = true;
          for (let i = 0; i < actives.length; i++) {
            if (bonus.type == creature.bonuses[actives[i]].type) {
              if (bonus.bonus > creature.bonuses[actives[i]].bonus) {
                actives.splice(i, 1);
              } else {
                add = false;
              }
            }
          }
          if (add) { actives.push(name); }
          bonus.active = add;
        }

        // NATURAL ARMOR
        tempNum = response.AC - 10;
        tempNum -= Math.floor((response.Dex - 10) / 2);
        tempNum -= this.rules.size[creature.basics.size]["ac / atk"];

        actives.forEach(active => {
          if ([ "Armor", "Shield", "Dodge", "Deflection" ].includes(creature.bonuses[active].type)) {
            tempNum -= creature.bonuses[active].bonus;
          }
        });
        creature.abilities["Natural Armor"] = {
          trigger: "Continuous",
          active: true,
          descripction: "This creature naturally tough, granting additional armor.",
          benefit: {},
          bonuses: {
            "Natural Armor": {
              type: "Natural Armor",
              value: tempNum,
              targets: [this.rules.bonuses["Natural Armor"].targets],
              // active: true,
              stacks: false
            }
          }
        };
        // creature.bonuses["Natural Armor"] = {
        //   type: "Natural Armor",
        //   targets: this.rules.bonuses["Natural Armor"].targets,
        //           subtargets: this.rules.bonuses["Natural Armor"].subtargets,
        //   bonus: tempNum,
        //   active: true,
        //   stacks: false
        // };
        // actives.push("Natural Armor");


        // OFFENSE
        for (let atk of response.Melee.split(',')) {
          let i, atkNum, extras = {};
          atk = atk.toLowerCase();
          // abilities (poison, bleed, frost)
          i = atk.indexOf('plus');
          if (i > -1) {
            extras["abilities"] = atk.slice(i);
            extras["abilities"] = extras.abilities.slice(0, -1); // remove trailing ')'
            atk = atk.slice(0, i);
          }
          // Dmg Die
          let dmg = atk.slice(atk.indexOf("(")+1);
          dmg = dmg.slice(0, dmg.indexOf('+'));
          // remove atk bonus from string
          atk = atk.slice(0, atk.indexOf('+')-1);

          // Strip off masterwork & leading whitespace
          atk = atk.replace(/(mwk|masterwork|Mwk|Masterwork)\s/gm, "");
          atk = atk.replace(/(^\w|\s\w)/g, m => m.toUpperCase());

          // Add only Natural Attacks
          if (Object.keys(creature.equipment).includes(atk)) { continue; }
          let NAs = this.rules.natural_attacks;

          // Number of Attacks (NAs)
          if (parseInt(atk[0]) > 1) {
            atkNum = atk[0];
            atk = atk.slice(2);
            atk = atk.slice(0, -1);
          }
          let atkName = atkNum ? atkNum+" "+atk : atk;
          if (Object.keys(NAs).includes(atk)) {
            creature.actions.melee[atkName] = NAs[atk];
            let tableDmg = NAs[atk].Damage[creature.basics.size];
            if (tableDmg != dmg) { creature.actions.melee[atkName].Damage[creature.basics.size] = dmg; }
          } else {
            creature.actions.melee[atkName] = NAs["Other"];
          }
        }


        // SPECIAL

        // MAGIC

        // Skills
        let classSkills = this.rules.creature_types[creature.basics.type.name].skills
        for (let cls of Object.keys(creature.classes)) {
          this.classes[cls].skills.forEach(skill => {
            if (!classSkills.includes(skill)) {
              classSkills.push(skill);
            }
          });
        }

        // set up all skills
        for (let [name, skill] of Object.entries(this.rules.skills)) {
          skill.class = classSkills.includes(name);
          creature.skills[name] = skill;
        }

        // Get skill ranks
        let skills = response.Skills.split(',');
        skills.forEach(skill => {
          let name = skill.slice(0, skill.search(/[+|-]/g)).trim();

          let bonus = skill.slice(skill.search(/[+|-]/g)-1);
          if (bonus.indexOf('(') > 0) { bonus = bonus.slice(0, bonus.indexOf('(')-1); }

          // total - ability mod
          let abil = this.rules.skills[name].ability;
          bonus -= creature.attributes[abil.concat("Mod")];
          //class skill: total -3;
          bonus += classSkills.includes(name) ? -3 : 0
          // total - Armor Penalty(s)
          if (this.rules.skills[name].armor_pen) {
            Object.values(creature.equipment).forEach(item => {
              if (item.Penalty) { bonus -= item.Penalty; }
            });
          }
          creature.skills[name].ranks = bonus;
        });




        // this.creatureSetup(response);
        this.creature = creature;
        console.table("SOURCE", creature);
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
