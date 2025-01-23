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

  <el-dialog width="700" v-model="monsterVisible" :before-close="monsterClose">
    <CreatureCard :source="creature"></CreatureCard>
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
    DataService.getFeats().then( (response) => { this.feats = response; } );

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
    // this.monsterOpen("Skeletal Champion");
    // this.monsterOpen("Adult Red Dragon");
    this.monsterOpen("Death Worm");
  },
  methods: {
    monsterOpen(name) {

      DataService.getMonster({"Name": name})
      .then(response => {
        console.log("Orig", response);
        let tempNum = 0;
        let creature = {
          "name": response.Name,
          "basics": {
            "cr": response.CR,
            "alignment": response.Alignment,
            "environment": response.Environment,
            "size": response.Size.toLowerCase(),
            "speed": parseInt( response.Speed.replace(/\D+$/g, "") ),
            "type": {},
          },
          "abilities": {},
          "equipment": {},
          "attributes": {},
          "classes": {},
          "health": { total: 0, bonus: 0 },
          "actions": { melee: {}, ranged: {}, special: {} },
          "skills": {},
          "magic": {},

          // TODO: REMOVE DELETE KILL NULL
          "bonuses": {},    // may remove to be built from equips & abils
          "feats": [],  // in abliities
          "bab": 0,   // TODO: Remove
          "active": {}   // active bonuses
        };



        /***************************\
        *                           *
        *          BASICS           *
        *                           *
        \***************************/
        // Ability Score Modifiers
        creature.attributes = {
          Str: { total: response.Str, sources: [] }, StrMod: Math.floor((response.Str - 10) / 2),
          Dex: { total: response.Dex, sources: [] }, DexMod: Math.floor((response.Dex - 10) / 2),
          Con: { total: (response.Con == "-" ? 0 : response.Con), sources: [] }, ConMod: Math.floor(((response.Con == "-" ? 0 : response.Con) - 10) / 2),
          Int: { total: response.Int, sources: [] }, IntMod: Math.floor((response.Int - 10) / 2),
          Wis: { total: response.Wis, sources: [] }, WisMod: Math.floor((response.Wis - 10) / 2),
          Cha: { total: response.Cha, sources: [] }, ChaMod: Math.floor((response.Cha - 10) / 2)
        }

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
// TODO: change equiped to false, after iventory set up
          // Add items to bonuses and equipment
          if ( Object.keys(this.equipment.Armor).includes(item) ) {
            creature.equipment[item] = this.equipment.Armor[item];
            creature.equipment[item].Extras = extras;
            creature.equipment[item].equiped = true;
            creature.equipment[item].targets = this.rules.bonuses.Armor.targets;
          }
          else if ( Object.keys(this.equipment.Shields).includes(item) ) {
            creature.equipment[item] = this.equipment.Shields[item];
            creature.equipment[item].Proficiency = "Shields";
            creature.equipment[item].Extras = extras;
            creature.equipment[item].equiped = true;
            creature.equipment[item].targets = this.rules.bonuses.Shield.targets;
            if (this.equipment.Shields[item]["Critical"] > 0) {
              creature.actions.melee[item] = creature.equipment[item];
            }
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
        // console.log(this.rules.actions);
        let actions = {
          "Total Defense": {
            trigger: "Standard",
            description: "You get a +4 bonus to your AC but cannot make Attacks of Opportunity until your next turn.",
            benefit: "+4 to AC but no AoOs",
            extras: { duration: "1 Round" },
            bonuses: {
              "Total Defense": {
                targets: [ "totalAC", "touchAC", "flatAC" ],
                type: "Action",
                value: 4
              }
            }
          },
          "Aid Another": {
            trigger: "Standard",
            description: "Make an attack roll vs AC 10, if you hit, you assist an ally with an attack, their defense, or a particular skill.",
            benefit: "+2 to Attack Rolls, AC, or a specific skill check",
            extras: {},
            bonuses: {}
          },
          "Feint": {
            trigger: "Standard",
            description: "Make a Bluff check, on a success your opponent losses their Dex bonus to AC against your melee attack next turn.",
            benefit: "Opponent loses their Dex bonus to AC",
            extras: {},
            bonuses: {}
          },
        };
        creature.actions.special = actions;
        // FEATS
        for (let feat of response.Feats.split(',')) {
          feat = feat.trim();
          if (feat.indexOf('(') > 0) { feat = feat.slice(0, feat.indexOf('(')-1); }
          if (feat[feat.length-1] == 'B') { feat = feat.slice(0, -1); } // Remove 'B' from bonus feat names
          // if the feat is in the feats json
          if (this.feats[feat]) {
            creature.abilities[feat] = this.feats[feat];
            creature.feats.push(feat);
            if (this.feats[feat].trigger == "Continuous") {
              creature.abilities[feat].active = true;
            } else {
              creature.abilities[feat].active = false;
              creature.actions.special[feat] = this.feats[feat];
            }
          }
        }
        // TODO: Add Class Actions





        // NATURAL ARMOR
        tempNum = response.AC - 10;
        tempNum -= Math.floor((response.Dex - 10) / 2);
        tempNum -= this.rules.size[creature.basics.size]["ac / atk"];

        // Armor, Shield
        for (const item of Object.values(creature.equipment)) {
          if (item.equiped) {
            let type = (["Light", "Medium", "Heavy"].includes(item.Proficiency)) ? "Armor" :
                       (item.Proficiency == "Shields") ? "Shield" : "";
            if (type != "") {
              tempNum -= item["AC Bonus"];
            }
          }
        }

        creature.abilities["Natural Armor"] = {
          trigger: "Continuous",
          active: true,
          description: "This creature naturally tough, granting additional armor.",
          benefit: "",
          bonuses: {
            "Natural Armor": {
              value: tempNum,
              targets: this.rules.bonuses["Natural Armor"].targets,
              type: "Natural Armor",
            }
          }
        };


        // OFFENSE
        if (response.Melee) {
          for (let atk of response.Melee.split(',')) {
            let i, extras = {};
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
            atk = atk.replace(/(mwk|masterwork|Mwk|Masterwork)\s/gm, "").trim();
            atk = atk.replace(/(^\w|\s\w)/g, m => m.toUpperCase());

            // Add only Natural Attacks
            if (Object.keys(creature.equipment).includes(atk)) { continue; }
            let NAs = this.rules.natural_attacks;
            // get Nat Atk name, for searching (no #, no trailing 's')
            let atkName = atk;
            if (parseInt(atk[0]) > 1) {
              atk = atk.slice(2);
              atk = atk.slice(0, -1);
            }
            if (Object.keys(NAs).includes(atk)) {
              console.log(NAs[atk]);
              creature.actions.melee[atkName] = NAs[atk];
              extras["Natural Attack"] = NAs[atk].Category;
              creature.actions.melee[atkName].Extras = extras;
              let tableDmg = NAs[atk].Damage[creature.basics.size];
              if (tableDmg != dmg) { creature.actions.melee[atkName].Damage[creature.basics.size] = dmg; }
            } else {
              creature.actions.melee[atkName] = NAs["Other"];
            }
          }
        }

        // Ranged
        if (response.Ranged) {
          for (let atk of response.Ranged.split(',')) {
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
              creature.actions.ranged[atkName] = NAs[atk];
              extras["Natural Attack"] = NAs[atk].Category;
              creature.actions.ranged[atkName].Extras = extras;
              let tableDmg = NAs[atk].Damage[creature.basics.size];
              if (tableDmg != dmg) { creature.actions.ranged[atkName].Damage[creature.basics.size] = dmg; }
            } else {
              creature.actions.ranged[atkName] = NAs["Other"];
              extras["Natural Attack"] = NAs["Other"].Category;
              creature.actions.ranged[atkName].Extras = extras;
              let tableDmg = NAs["Other"].Damage[creature.basics.size];
              if (tableDmg != dmg) { creature.actions.ranged[atkName].Damage[creature.basics.size] = dmg; }
            }
          }
        }
        // SPECIAL actions done with feats


        /*

        move
      movement (or 5-foot step) (swim/climb at 1/4 or climb 1/2 with -5 to climb)
draw a weapon / stored item (3[part of movement], ready / drop shield)
load light / heavy crossbow
mount / dismount (Dc 20 Ride to do as free action)
stand up from prone (AoO)

full round atk
charge      (move 10' - double speed, directly to enemy(no blocks including allies) , then one attack) [+2 atkBonus && -2 all AC]
run (3x or 4x yor speed in straight line, lose dex bonus to AC)
withdraw (both actions to move, only starting square isn't threatened)
fight defensively

combat mans (type varies)
  Overrun                 AoO, (bowl someone over, pass through them and knock them prone, they can let you pass)
  bull rush               AoO, push 5 ft, +5 for every 5 past CMD
  drag                    AoO, opposite of bull rush
  reposition              move target 5 ft to new location, +5ft for every 5 past CMD, must end within 5 ft of reach
  dirty treick            AoO, apply condition (blinded, dazzled, deafened, entangled, shaken, or sickened) lasts 1 round, +1 round for every 5 past CMD
  disarm                  AoO, force an enemy to drop 1 (2 if check is 10 past CMD), +2 from weapon with disarm, -4 if unarmed(fail by 10 you lose item)  (steal for necklace)
  grapple                 AoO, can move, damage, pin, tie up
  sunder                  AoO, Deal damage directly to an item, granting the broken condition
  trip                    AoO, knock prone, fail by 10, you are prone

ready action


mounted copmbat
  free    - dc 5 ride
  atk smaller creature than mount   +1 to atk
  charge applies to both mount and rider
  lances deal double damage
  casting between 2 mount moves requires vigorous motion check (10+spell level) (quad move is 15+lvl)
  DC 15 ride to take no damage when mount falls in battle, 1d6 on fail
  unconcious -> 50% to stay in saddle, else 1d6 dmg (mount avoids combat)
        */



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
          name = name.replace("Knowl.", "Knowledge");

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
