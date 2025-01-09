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

      classes: {
        "warrior": {
          "skills": [ "Climb (Str)", "Craft (Int)", "Handle Animal (Cha)", "Intimidate (Cha)", "Profession (Wis)", "Ride (Dex)", "Swim (Str)" ],
          "proficiency": [ "simple weapons", "martial weapons", "light armor", "medium armor", "heavy armor", "shields" ],
          "alignment": [ "LG", "NG", "CG", "LN", "N", "CN", "LE", "NE", "CE" ],
          "hd": 10, "ranks": 2, "bab": 1,
          "fort": { "mult": 0.5, "bonus": 2 },
          "ref": { "mult": 0.33, "bonus": 0 },
          "will": { "mult": 0.33, "bonus": 0 }
        }
      },

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

    DataService.getRules().then( (response) => { this.rules = response; } );
    DataService.getEquipment().then( (response) => { this.equipment = response; } );


    UserService.getAdminBoard().then(
      (response) => { this.content = response.data; },
      (error) => {
        this.content =
          (error.response && error.response.data && error.response.data.message)
          || error.message || error.toString();
      }
    );


    // this.monsterOpen("Skeletal Champion");
    this.monsterOpen("Adult Red Dragon");
  },
  methods: {
    monsterOpen(name) {

      DataService.getMonster({"Name": name})
      .then(response => {
        console.log("Orig", response);
        let tempNum = 0;
let perm = {};
        let creature = {
          "name": response.Name,
          "attributes": { "Str": response.Str, "Dex": response.Dex, "Con": response.Con, "Int": response.Int, "Wis": response.Wis, "Cha": response.Cha },
          "characteristics": {
            "cr": response.CR,
            "size": response.Size.toLowerCase(),
            "alignment": response.Alignment,
            "environment": response.Environment,
          },
          "type": {},
          "feats": [],
          "skills": [],

          "health": { total: 0, bonus: 0 },
          "bab": 0,   // TODO: Remove
          "attacks": {
            "melee": {},
            "ranged": {},
            "special": {},
          },
          "magic": [],

          "abilities": {},
          "bonuses": {},
          "active": {},   // active bonuses
          "equipment": {}
        };


        /***************************\
        *                           *
        *          BASICS           *
        *                           *
        \***************************/
perm.name = creature.name;
perm.attributes = creature.attributes;
perm.characteristics = creature.characteristics;
perm.classes = {};
perm.defense = {};

        // Ability Score Modifiers
        creature.attributes.StrMod = Math.floor((creature.attributes.Str - 10) / 2);
        creature.attributes.DexMod = Math.floor((creature.attributes.Dex - 10) / 2);
        creature.attributes.ConMod = Math.floor(( (isNaN(creature.attributes.Con) ? creature.attributes.Cha : creature.attributes.Con) - 10) / 2);
        creature.attributes.IntMod = Math.floor((creature.attributes.Int - 10) / 2);
        creature.attributes.WisMod = Math.floor((creature.attributes.Wis - 10) / 2);
        creature.attributes.ChaMod = Math.floor((creature.attributes.Cha - 10) / 2);

        // Get total HD
        let [Class, bab, fort, ref, will, hp, hpBonus, racialHD ] = ["", 0, 0, 0, 0, 0, 0, 0];
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
        if (response.Class1) {
perm.classes[response.Class1] = { "levels": response.Class1_Lvl };
          // subtract class HD from total HD (racialHD)
          racialHD -= response.Class1_Lvl;
          Class = this.classes[response.Class1];
          creature.class1 = {
            name: response.Class1,
            levels: response.Class1_Lvl,
            hd: Class.hd
          }
          bab   = response.Class1_Lvl * Class.bab;
          fort  = (response.Class1_Lvl * Class.fort.mult) + Class.fort.bonus;
          ref   = (response.Class1_Lvl * Class.ref.mult) + Class.ref.bonus;
          will  = (response.Class1_Lvl * Class.will.mult) + Class.will.bonus;
          hp    = response.Class1_Lvl * (Class.hd/2 + 0.5 + creature.attributes.ConMod);
          hpBonus = response.Class1_Lvl * creature.attributes.ConMod;
        }

        // Class 2
        if (response.Class2) {
perm.classes[response.class2] = { "levels": response.Class2_Lvl };
          console.log("MULTICLASS!!");
          // subtract class HD from total HD (racialHD)
          racialHD -= response.Class2_Lvl;
          Class   = this.classes[response.Class2];
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
// Racial type & HD
        let type  = this.rules.creature_types[response.Type];
        creature.type = {
          name: response.Type,
          levels: racialHD,
          hd: type.hd,
          subtypes: []
        }
// Subtypes
        if (response.Race) { creature.type.subtypes.push(response.Race); }
        for (let i = 1; i < 7; i++) {
          if (response[`subtype${i}`]) {
            creature.type.subtypes.push(response[`subtype${i}`]);
          }
        }
perm.type = creature.type;
        bab       += racialHD * type.bab;
        fort      += (racialHD * type.fort.mult) + type.fort.bonus;
        ref       += (racialHD * type.ref.mult) + type.ref.bonus;
        will      += (racialHD * type.will.mult) + type.will.bonus;
        hp        += racialHD * (type.hd/2 + 0.5 + creature.attributes.ConMod);
        hpBonus   += racialHD * creature.attributes.ConMod;
        let senses = "Perception +#";
        senses    += type.traits["Darkvision"] ? " "+type.traits["Darkvision"] : "";
        senses    += type.traits["Low-Light Vision"] ? " "+type.traits["Low-Light Vision"] : "";
        senses    += type.traits["Scent"] ? " "+type.traits["Scent"] : "";

        // Totals
        creature.bab = Math.floor(bab);
        creature.defense = {
          "fort": Math.floor(fort + creature.attributes.ConMod),
          "ref": Math.floor(ref + creature.attributes.DexMod),
          "will": Math.floor(will + creature.attributes.WisMod),
          "senses": senses,
          "speed": response.Speed,
        }
        creature.health.total = Math.floor(hp);
        creature.health.max = Math.floor(hp);
        creature.health.bonus = Math.floor(hpBonus);
perm.defense.senses = senses;
perm.defense.speed = creature.defense.speed;

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
            creature.bonuses[item] = {};
            creature.bonuses[item].type = "Armor";
            creature.bonuses[item].target = "AC";
            creature.bonuses[item].bonus = this.equipment.Armor[item]["AC Bonus"];
            creature.equipment[item] = this.equipment.Armor[item];
            creature.equipment[item].Extras = extras;
          }
          else if ( Object.keys(this.equipment.Shields).includes(item) ) {
            creature.bonuses[item] = {};
            creature.bonuses[item].type = "Shield";
            creature.bonuses[item].target = "AC";
            creature.bonuses[item].bonus = this.equipment.Shields[item]["AC Bonus"];
            creature.equipment[item] = this.equipment.Shields[item];
            creature.equipment[item].Extras = extras;
            if (this.equipment.Shields[item]["Critical"] > 0) {
              creature.attacks.melee[item] = creature.equipment[item];
            }
          }
          else if ( Object.keys(this.equipment.Weapons).includes(item) ) {
            creature.equipment[item] = this.equipment.Weapons[item];
            creature.equipment[item].Extras = extras;
            creature.attacks.melee[item] = this.equipment.Weapons[item];
          }
          else {
            // Other Treasure
            creature.equipment[item] = item;
          }
        } // End items loop
perm.equipment = creature.equipment;

        /***************************\
        *                           *
        *          BONUSES          *
        *                           *
        \***************************/
        // FEATS
        for (let feat of response.Feats.split(',')) {
          feat = feat[0] === " " ? feat.slice(1) : feat;
          creature.feats.push(feat);
        }
perm.feats = creature.feats;

        // Set up which bonuses are active, should be done after feats
        let add = true;
        for (const [bName, bonus] of Object.entries(creature.bonuses)) {
          for (const prop in creature.active) {
            if ( creature.active[prop].type == bonus.type && creature.active[prop].bonus > bonus.bonus ) {
              add = false;
            }
          }
          if (add) { creature.active[bName] = bonus; }
        }

        // NATURAL ARMOR
        tempNum = response.AC - 10;
        tempNum -= Math.floor((response.Dex - 10) / 2);
        tempNum -= this.rules.size[creature.characteristics.size]["ac / atk"];
        for (const prop in creature.active) {
          if ([ "Armor", "Shield", "Dodge", "Deflection" ].includes(creature.active[prop].type)) {
            tempNum -= creature.active[prop].bonus;
          }
        }
        creature.bonuses["Natural Armor"] = {
          type: "Natural Armor",
          target: "AC",
          bonus: tempNum
        };
        creature.active["Natural Armor"] = creature.bonuses["Natural Armor"];


perm.bonuses = creature.bonuses;
perm.active = creature.active;


        // OFFENSE
        // console.log(response.Melee);
        // TODO:
        /*
        split melee str into atks
        loop each,
        if atk = wpn, skip

        repeat Ranged
        repeat magic
        */

        // Natural Attacks
        console.log(response.Melee);
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
          // remove atk bonus from str
          atk = atk.slice(0, atk.indexOf('+')-1);
          // Strip off masterwork
          if (atk.indexOf('Mwk') > -1) {
            atk = atk.slice(atk.indexOf('Mwk')+4);
          }
          // Remove leading any whitespace & capitalize
          atk = atk[0] === " " ? atk.slice(1) : atk;
          atk = atk.replace(/(^\w|\s\w)/g, m => m.toUpperCase());

          if (parseInt(atk[0]) > 1) {
            atkNum = atk[0];
            atk = atk.slice(2);
            atk = atk.slice(0, -1);
          }

          let NAs = {
            "Bite": {
              "Damage": {
                "fine": "1",
                "diminuitive": "1d2",
                "tiny": "1d3",
                "small": "1d4",
                "medium": "1d6",
                "large": "1d8",
                "huge": "2d6",
                "gargantuan": "2d8",
                "colossal": "4d6"
              },
              "Critical": "20/x2",
              "Range": 0,
              "Damage Type": [ "Bludgeoning", "Piercing", "Slashing" ],
              "Proficiency": "Natural",
              "Category": "Primary"
            },
            "Claw": {
              "Damage": {
                "fine": "0",
                "diminuitive": "1",
                "tiny": "1d2",
                "small": "1d3",
                "medium": "1d4",
                "large": "1d6",
                "huge": "1d8",
                "gargantuan": "2d6",
                "colossal": "2d8"
              },
              "Critical": "20/x2",
              "Range": 0,
              "Damage Type": [ "Bludgeoning", "Slashing" ],
              "Proficiency": "Natural",
              "Category": "Primary"
            },
            "Gore": "1 1d2 1d3 1d4 1d6 1d8 2d6 2d8 4d6 P Primary",
            "Hoof": "– 1 1d2 1d3 1d4 1d6 1d8 2d6 2d8 B Secondary",
            "Tentacle": "– 1 1d2 1d3 1d4 1d6 1d8 2d6 2d8 B Secondary",
            "Wing": {
              "Damage": {
                "fine": "0",
                "diminuitive": "1",
                "tiny": "1d2",
                "small": "1d3",
                "medium": "1d4",
                "large": "1d6",
                "huge": "1d8",
                "gargantuan": "2d6",
                "colossal": "2d8"
              },
              "Critical": "20/x2",
              "Range": 0,
              "Damage Type": [ "Bludgeoning" ],
              "Proficiency": "Natural",
              "Category": "Secondary"
            },
            "Pincers": "1 1d2 1d3 1d4 1d6 1d8 2d6 2d8 4d6 B Secondary",
            "Tail Slap": {
              "Damage": {
                "fine": "1",
                "diminuitive": "1d2",
                "tiny": "1d3",
                "small": "1d4",
                "medium": "1d6",
                "large": "1d8",
                "huge": "2d6",
                "gargantuan": "2d8",
                "colossal": "4d6"
              },
              "Critical": "20/x2",
              "Range": 0,
              "Damage Type": [ "Bludgeoning" ],
              "Proficiency": "Natural",
              "Category": "Secondary"
            },
            "Slam": "– 1 1d2 1d3 1d4 1d6 1d8 2d6 2d8 B Primary",
            "Sting": "– 1 1d2 1d3 1d4 1d6 1d8 2d6 2d8 P Primary",
            "Talons": "– 1 1d2 1d3 1d4 1d6 1d8 2d6 2d8 S Primary",
            "Other": "– 1 1d2 1d3 1d4 1d6 1d8 2d6 2d8 B, P, or S Secondary"
          };

          if (!Object.keys(creature.attacks.melee).includes(atk)) {
            let atkName = atkNum ? atkNum+" "+atk : atk;
            if (Object.keys(NAs).includes(atk)) {
              creature.attacks.melee[atkName] = NAs[atk];
            } else {
              creature.attacks.melee[atkName] = {
                "Critical": "20/x2",
                "Range": 0,
                "Damage Type": [ "Bludgeoning", "Piercing", "Slashing" ],
                "Proficiency": "Natural",
                "Category": "Secondary"
              };
              creature.attacks.melee[atkName].Damage = {};
            }
            let tableDmg = NAs[atk].Damage[creature.characteristics.size];
            if (tableDmg != dmg) {
              creature.attacks.melee[atkName].Damage[creature.characteristics.size] = dmg;
            }
            creature.attacks.melee[atkName].Extras = { extras };
          }
        }

        // console.log(creature.attacks.melee);

        // TODO: Set up as listAttack(type) {} ?
        let NatAtkNum = 0;
        for (let [name, atk] of Object.entries(creature.attacks.melee)) {
          let atkBonus = creature.bab;
          let dmgBonus = 0;
          atkBonus += this.rules.size[creature.characteristics.size]["ac / atk"];
          // Add mwk or magic enhancements to atk bonus
          if (atk.Extras["enhancement"]) {
            atkBonus += atk.Extras["enhancement"];
            dmgBonus += atk.Extras["enhancement"];
          } else if (atk.Extras["masterwork"]) {
            atkBonus += 1;
          }

          console.log(atk);
          NatAtkNum += (atk.Proficiency == "Natural") ? 1 : 0;
          if (atk.Category == "Two-Handed") {
            dmgBonus += creature.attributes.StrMod * 1.5
          }
          else if (atk.Category == "Secondary") {
            atkBonus += creature.attributes.StrMod - 5;
            dmgBonus += creature.attributes.StrMod / 2;
          }
          else {
            atkBonus += creature.attributes.StrMod;
            dmgBonus += creature.attributes.StrMod;
          }

          let size = creature.characteristics.size
          size =  ( size == "small" ) ? 0 :
                  ( size == "medium" ) ? 1 :
                  ( size == "large" ) ? 2 : 3;
          let dmgDie = atk.Damage[creature.characteristics.size];
          // console.log(atk.Damage);

          console.log(`${name} +${atkBonus} (${dmgDie}+${dmgBonus} /${atk.Critical})`);
        }

        // TODO:
        console.log(NatAtkNum);
        /*
        if (NatAtkNum = 1) {
          loop through atks
          find nat atk
          if (atk.Category == "Secondary") {
            atkBonus += 5;
            dmgBonus += creature.attributes.StrMod;
          } else {
            dmgBonus += creature.attributes.StrMod / 2;
          }
        }
        */


        // for (let [name, atk] of Object.entries(creature.attacks.ranged)) {
        //   console.log(name, atk);
        // }
        // for (let [name, atk] of Object.entries(creature.attacks.ranged)) {
        //   console.log(name, atk);
        // }

        // for (var [name, item] of Object.entries(creature.equipment)) {
        //   if (item.Damage) {
        //     console.log(name, item);
        //     let atkBonus = creature.bab;
        //     let dmgBonus = 0;
        //     atkBonus += this.rules.size[creature.characteristics.size]["ac / atk"];
        //     // Add mwk or magic enhancements to atk bonus
        //     if (item.Extras["enhancement"]) {
        //       atkBonus += item.Extras["enhancement"];
        //       dmgBonus += item.Extras["enhancement"];
        //     } else if (item.Extras["masterwork"]) {
        //       atkBonus += 1;
        //     }
        //     if (item.Category == "Ranged") {
        //       atkBonus += creature.attributes.DexMod;
        //     } else if (item.Category != "Ammunition") {
        //       atkBonus += creature.attributes.StrMod;
        //       dmgBonus += creature.attributes.StrMod;
        //       if (item.Category == "Two-Handed") {
        //         dmgBonus += creature.attributes.StrMod/2;
        //       }
        //     }
        //
        //     let size = creature.characteristics.size
        //     size =  ( size == "small" ) ? 0 :
        //             ( size == "medium" ) ? 1 :
        //             ( size == "large" ) ? 2 : 3;
        //     let dmgDie = item.Damage[size];
        //
        //     console.log(`${name} +${atkBonus} (${dmgDie}+${dmgBonus} /${item.Critical})`);
        //   }
        // }


        // SPECIAL

        // MAGIC

        // SKILLS
        for (let skill of response.Skills.split(',')) {
          skill = skill[0] === " " ? skill.slice(1) : skill;
          creature.skills.push(skill);
        }
perm.skills = creature.skills;




        console.table("new", creature);
        console.table("PERM", perm);
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
