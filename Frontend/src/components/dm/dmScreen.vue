<template>
  <el-button type="primary" circle @click="monsterOpen('Skeletal Champion')">
    <g-icon iconSize="24px" iconName="undead" />
  </el-button>
  <el-button type="primary" circle @click="monsterOpen('Death Worm')">
    <g-icon iconSize="24px" iconName="magical beast" />
  </el-button>
  <el-button type="primary" circle @click="monsterOpen('Ochre Jelly')">
    <g-icon iconSize="24px" iconName="ooze" />
  </el-button>
  <el-button type="primary" circle @click="monsterOpen('Giant Isopod')">
    <g-icon iconSize="24px" iconName="vermin" />
  </el-button>
  <el-button type="primary" circle @click="monsterOpen('Bat')">
    <g-icon iconSize="24px" iconName="animal" />
  </el-button>
  <el-button type="primary" circle @click="monsterOpen('Adult Red Dragon')">
    <g-icon iconSize="24px" iconName="dragon" />
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
    },
    rules() { return this.$store.state.data.rules; },
    races() { return this.$store.state.data.races; },
    classes() { return this.$store.state.data.classes; },
    equipment() { return this.$store.state.data.equipment; },
    feats() { return this.$store.state.data.feats; },
    actions() { return this.$store.state.data.actions; },
    conditions() { return this.$store.state.data.conditions; },
  },
  created() {
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
    if (this.equipment) {
      // this.monsterOpen("Skeletal Champion");
      this.monsterOpen("Adult Red Dragon");
      // this.monsterOpen("Death Worm");
      // this.monsterOpen("Ochre Jelly");

      // console.log(this.actions);
      // console.log(this.conditions);

    }
  },
  methods: {
    monsterOpen(name) {
      DataService.getMonster({"Name": name})
      .then(response => {
        console.log("CSV", response);
        let tempNum = 0;
        let creature = {
          "name": response.Name,
          "basics": {
            "cr": response.CR,
            "alignment": response.Alignment,
            "environment": response.Environment,
            "size": response.Size.toLowerCase(),
            "speed": {},
            "type": {},
          },
          "attributes": {},
          "health": { current: 0 },
          "actions": { melee: {}, ranged: {}, special: {} },
          "conditions": [],

          "equipment": [
            { label: 'Magic Items', extras: { icon: "amulet" }, children: [
              { label: 'Head', extras: { capacity: 1 }, children: [] },
              { label: 'Headband', extras: { capacity: 1 }, children: [] },
              { label: 'Eyes', extras: { capacity: 1 }, children: [] },
              { label: 'Shoulders', extras: { capacity: 1 }, children: [] },
              { label: 'Neck', extras: { capacity: 1 }, children: [] },
              { label: 'Chest', extras: { capacity: 1 }, children: [] },
              { label: 'Body', extras: { capacity: 1 }, children: [] },
              { label: 'Belt', extras: { capacity: 1 }, children: [] },
              { label: 'Wrists', extras: { capacity: 1 }, children: [] },
              { label: 'Ring 1', extras: { capacity: 1 }, children: [] },
              { label: 'Ring 2', extras: { capacity: 1 }, children: [] },
              { label: 'Feet', extras: { capacity: 1 }, children: [] },
              { label: 'Slotless', extras: { capacity: 1 }, children: [] },
            ] },
            { label: 'Equipped',  extras: { icon: "equipment" }, children: [
              { label: 'Armor',   extras: { icon: "armor", capacity: 1 }, children: [] },
              { label: 'Weapons', extras: { icon: "weapons" }, children: [
                { label: 'Hands', extras: { icon: "abilityPalm", capacity: 2 }, children: [] },
                { label: 'Back',  extras: { icon: "swordShield", capacity: 2 }, children: [] },
              ] }
            ] },
            { label: 'Items', extras: { icon: "inventory" }, children: [
              { label: 'Backpack', extras: { icon: "backpack", capacity: 50 }, children: [] }
            ] },
          ],
          "skills": {},
          "abilities": {},
          "classes": {},

          "magic": {
            "race1": {
              "style": "Spontaneous Arcane",
              "castingAtr": "Cha",
              "galdur": { "total": 195, "currOpen": 50, "currReserve": 50 },
              "casterLevel": 7,
              "concentration": "10 (CL [7] + Cast Abil [3])        CALC",
              "spellsPerDay": [ -1, 7, 7, 5 ],
              "spellsKnown": [
                [ "arcane mark", "light", "mage hand", "mending", "message", "prestidigitation", "read magic" ],
                [ "alarm", "grease", "magic missile", "shield", "true strike" ],
                [ "invisibility", "resist energy", "see invisibility" ],
                [ "dispel magic",
                 {
                   "Name": "Haste",
                   "Description": "",
                   "Casting Time": "1 standard action",
                   "Components": "V, S, M (a shaving of licorice root)",
                   "Range": "Close          CALC",
                   "Targets": "one creature/level, no two of which can be more than 30 ft. apart",
                   "Duration": "1 round/level",
                   "Saving Throw": "Fortitude negates (harmless)",
                   "Spell Resistance": "yes (harmless)"
                 }
                ]
              ],
            },
            "race2": {
              "style": "Spontaneous Arcane",
              "castingAtr": "Charisma",
              "casterLevel": 17,
              "concentration": "20 (CL [17] + Cast Abil [3])  REMOVE",
              "spellsPerDay": [ -1, -1, -1, -1 ],
              "spellsKnown": [
                [ "detect magic" ],
                [],
                [ "pyrotechnics" ],
                [ "suggestion" ]
              ]
            }

          },
          "userSettings": {
            expandInventory: ['Equipped', 'Armor', 'Weapons', 'Hands', 'Back', 'Items'],
            cardTab: "main",
            mainSections: [ "defense", "actions", "conditions" ]
          },

          // TODO: REMOVE DELETE KILL NULL
          // "bonuses": {},    // may remove to be built from equips & abils
          // "feats": [],  // in abliities
          // "bab": 0,   // TODO: Remove
          // "active": {}   // active bonuses
        };


        /***************************\
        *                           *
        *          BASICS           *
        *                           *
        \***************************/
        // Ability Score Modifiers
        creature.attributes = {
          Str: { total: (response.Str == "-" ? 0 : response.Str) }, StrMod: Math.floor( (response.Str == "-" ? 0 : response.Str - 10) / 2 ),
          Dex: { total: (response.Dex == "-" ? 0 : response.Dex) }, DexMod: Math.floor( (response.Dex == "-" ? 0 : response.Dex - 10) / 2 ),
          Con: { total: (response.Con == "-" ? 0 : response.Con) }, ConMod: Math.floor( (response.Con == "-" ? 0 : response.Con - 10) / 2 ),
          Int: { total: (response.Int == "-" ? 0 : response.Int) }, IntMod: Math.floor( (response.Int == "-" ? 0 : response.Int - 10) / 2 ),
          Wis: { total: (response.Wis == "-" ? 0 : response.Wis) }, WisMod: Math.floor( (response.Wis == "-" ? 0 : response.Wis - 10) / 2 ),
          Cha: { total: (response.Cha == "-" ? 0 : response.Cha) }, ChaMod: Math.floor( (response.Cha == "-" ? 0 : response.Cha - 10) / 2 )
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
          creature.abilities[name].extras = { active: true, source: "Trait" };
        }
        if (response.Race) {
          creature.basics.type.subtypes.push(response.Race);
          if (Object.keys(this.races).includes(response.Race)) {
            for (let [name, trait] of Object.entries(this.races[response.Race].traits)) {
              creature.abilities[name] = trait;
              creature.abilities[name].extras = { active: true, source: "Trait" };
            }
          }
        }
        // Subtypes
        for (let i = 1; i < 7; i++) {
          if (response[`subtype${i}`]) {
            creature.basics.type.subtypes.push(response[`subtype${i}`]);
          }
        }
        creature.health.current = response.HP;

        // Speed
        creature.basics.speed = {
          speed: { "total": 0, "sources": [] },
          swim: { "total": 0, "sources": [] },
          climb: { "total": 0, "sources": [] },
          fly: { "total": 0, "sources": [] },
          burrow: { "total": 0, "sources": [] }
        }
        response.Speed.split(',').forEach((speed, i) => {
          // Remove leading any whitespace & capitalize
          speed = speed.trim();
          speed = speed.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
          if (i == 0) {
            creature.basics.speed.speed.total = parseInt(speed);
            creature.basics.speed.speed.sources.push("Racial Base");

          } else if (speed.includes("Swim")) {
            creature.basics.speed.swim.total = parseInt(speed.slice(5));
            creature.basics.speed.swim.sources.push("Racial Swim");

          } else if (speed.includes("Climb")) {
            creature.basics.speed.climb.total = parseInt(speed.slice(6));
            creature.basics.speed.climb.sources.push("Racial Climb");

          } else if (speed.includes("Fly")) {
            creature.basics.speed.fly.total = parseInt(speed.slice(4));
            creature.basics.speed.fly.sources.push("Racial Fly");

          } else if (speed.includes("Burrow")) {
            console.log('burrowSpeed');
            creature.basics.speed.burrow.total = parseInt(speed.slice(7));
            creature.basics.speed.burrow.sources.push("Racial Burrow");
          }
        });


        /***************************\
        *                           *
        *         EQUIPMENT         *
        *                           *
        \***************************/
        let items = [];
        let treasure = response.Treasure;
        if (response.Treasure.includes("(")) {
          treasure = treasure.split('(')[0];
          let equip = response.Treasure.split('(').pop().split(')')[0];
          items = items.concat(equip.split(','));
        }
        if (response.Gear) { items = items.concat(response.Gear.split(',')); }


        for (let item of items) {
          let i, extras = {
            "Masterwork": false,
            "Enhancement": 0,
            "Notes": []
          };
          item = item.toLowerCase();
          // "With" abilities (poison, bleed, frost)
          i = item.indexOf('with');
          if (i > -1) {
            extras["Notes"].push(item.slice(i));
            item = item.slice(0, i);
          }
          // +# Magic items (can't go over +5)
          i = item.indexOf('+');
          if (i > -1) {
            extras["Enhancement"] = item.slice(i+1);
            item = item.slice(i+2);
          }
          // Masterwork items
          i = item.indexOf('masterwork');
          if (i > -1) {
            extras["Masterwork"] = true;
            item = item.slice(i+10);
          }
          // Remove leading any whitespace & capitalize
          item = item[0] === " " ? item.slice(1) : item;
          item = item.replace(/(^\w|\s\w)/g, m => m.toUpperCase());

          // Add items to equipment
          if ( Object.keys(this.equipment.Armor).includes(item) ) {
            // creature.equipment[equipped].children[armor].children
            let armor = creature.equipment[1].children[0].children;
            let tmpArmor = this.equipment.Armor[item];
            let notes = tmpArmor.Extras.Notes;
            if (notes.length) { extras.Notes.push(notes); }
            tmpArmor.Extras = extras;
            tmpArmor.targets = this.rules.bonuses.Armor.targets;
            if (!armor.length) {
              armor.push({ label: item, value: tmpArmor });
            } else {
              // creature.equipment[loot].children
              creature.equipment[2].children.push({ label: item, value: tmpArmor });
            }
          }

          else if ( Object.keys(this.equipment.Weapons).includes(item) ) {
            // creature.equipment[equipped].children[weapons]
            let weapons = creature.equipment[1].children[1].children;
            let tmpWpn = this.equipment.Weapons[item];
            let notes = tmpWpn.Extras.Notes;
            if (notes.length) { extras.notes.push(notes); }
            tmpWpn.Extras = extras;
            tmpWpn.Damage = this.equipment.Weapons[item].Damage;
            // // do not reset damage on rerender
            // if (typeof tmpWpn.Damage != 'string') {
            // }
            if (weapons[0].children.length < 2) {
              // if weapons[hands].children < 2
              weapons[0].children.push({ label: item, value: tmpWpn });
              // creature.actions.melee[item] = tmpWpn;
            } else if (weapons[1].children.length < 2) {
              // if weapons[back].children < 2
              weapons[1].children.push({ label: item, value: tmpWpn });
              // creature.actions.melee[item] = tmpWpn;
            } else {
              // add weapon to creature.equipment[loot].children
              creature.equipment[2].children.push({ label: item, value: tmpWpn });
            }
          }

          else if ( Object.keys(this.equipment.Shields).includes(item) ) {
            // creature.equipment[equipped].children[weapons]
            let weapons = creature.equipment[1].children[1].children;
            let tmpWpn = this.equipment.Shields[item];
            let notes = tmpWpn.Extras.Notes;
            if (notes.length) { extras.notes.push(notes); }
            tmpWpn.Extras = extras;
            tmpWpn.Proficiency = "Shields";
            tmpWpn.Damage = this.equipment.Shields[item].Damage;
            // // do not set damage on rerender
            // if (typeof tmpWpn.Damage != 'string') {
            // }


            tmpWpn.targets = this.rules.bonuses.Shield.targets;
            if (weapons[0].children.length < 2) {
              // if weapons[hands].children
              weapons[0].children.push({ label: item, value: tmpWpn });
            } else if (weapons[1].children.length < 2) {
              // if weapons[back].children
              weapons[1].children.push({ label: item, value: tmpWpn });
            } else {
              // add shield to creature.equipment[loot].children
              creature.equipment[2].children.push({ label: item, value: tmpWpn });
            }

          } else {
            // Other Treasure
            creature.equipment[2].children.push({
              "label": item,
              "extras": { "icon": "treasure", "capacity": 1 },
              "children": [
                { "label": treasure, "value": { "Extras": { "Notes": [] } } }
              ]
            });


          }
        } // End items loop

        /***************************\
        *                           *
        *         ABILITIES         *
        *             &             *
        *          BONUSES          *
        *                           *
        \***************************/
        // creature.actions.basic = this.actions;
        // for (let action of Object.entries(creature.actions.basic)) {
        //   action[1].extras["source"] = "Basic";
        // }
        // FEATS
        if (response.Feats) {
          for (let feat of response.Feats.split(',')) {
            feat = feat.trim();
            if (feat.indexOf('(') > 0) { feat = feat.slice(0, feat.indexOf('(')-1); }
            if (feat[feat.length-1] == 'B') { feat = feat.slice(0, -1); } // Remove 'B' from bonus feat names

            // if the feat is in the feats json
            if (this.feats[feat]) {
              creature.abilities[feat] = this.feats[feat];
              if (this.feats[feat].trigger == "Continuous") {
                creature.abilities[feat].extras = { active: true, showMain: false, source: "Feat" };
              } else {
                creature.abilities[feat].extras = { active: false, showMain: true, source: "Feat" };
                creature.actions.special[feat] = this.feats[feat];
              }
            } else {
              creature.abilities[feat] = {
                "type": "UNKNOWN",
                "prerequisites": [ "" ],
                "description": "PLEASE UPDATE THIS ENTRY",
                "benefit": "",
                "trigger": "Continuous",
                "bonuses": {},
                "extras": { "active": false, "showMain": false, "source": "Feat" }
              };
            }
          }
        }
        // TODO: Add Class Actions


        // NATURAL ARMOR
        tempNum = response.AC - 10;
        tempNum -= Math.floor((response.Dex - 10) / 2);
        tempNum -= this.rules.size[creature.basics.size]["ac / atk"];
        // Armor
        let item = creature.equipment[1].children[0].children[0];
        if (item) { tempNum -= item.value["AC Bonus"]; }

        // For items in equipment . equipped . hands
        for (const item of creature.equipment[1].children[1].children[0].children) {
          if (item.value.Proficiency == "Shields") {
            tempNum -= item.value["AC Bonus"];
          }
        }
        if (tempNum > 0) {
          creature.abilities["Natural Armor"] = {
            trigger: "Continuous",
            description: "This creature naturally tough, granting additional armor.",
            benefit: "",
            bonuses: {
              "Natural Armor": {
                value: tempNum,
                targets: this.rules.bonuses["Natural Armor"].targets,
                type: "Natural Armor",
              }
            },
            extras: { active: true, showMain: false, source: "Trait" }
          };
        }


        // MELEE
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
            // item = equipment . equipped . hands . 'main hand'
            let item = creature.equipment[1].children[1].children[0].children[0];
            if (item && item.label == atk) { continue; }
            // item = equipment . equipped . hands . 'off hand'
            item = creature.equipment[1].children[1].children[0].children[1];
            if (item && item.label == atk) { continue; }

            let NAs = this.rules.natural_attacks;
            // get Nat Atk name, for searching (no #, no trailing 's')
            let atkName = atk;
            if (parseInt(atk[0]) > 1) {
              atk = atk.slice(2);
              atk = atk.slice(0, -1);
            }
            if (Object.keys(NAs).includes(atk)) {
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

        // RANGED
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
            // item = equipment . equipped . hands . 'main hand'
            let item = creature.equipment[1].children[1].children[0].children[0];
            if (item && item.label == atk) { continue; }
            // item = equipment . equipped . hands . 'off hand'
            item = creature.equipment[1].children[1].children[0].children[1];
            if (item && item.label == atk) { continue; }


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



        /***************************\
        *                           *
        *           MAGIC           *
        *                           *
        \***************************/
        // TODO:

        /***************************\
        *                           *
        *          SKILLS           *
        *                           *
        \***************************/
        let armor = creature.equipment[1].children[0].children[0];
        let mainHand = creature.equipment[1].children[1].children[0].children[0];
        let offHand = creature.equipment[1].children[1].children[0].children[1];
        let penalties = {};
        if (armor?.value.Penalty < 0) { penalties[armor.label] = armor.value.Penalty; }
        if (mainHand?.value.Penalty < 0) { penalties[mainHand.label] = mainHand.value.Penalty; }
        if (offHand?.value.Penalty < 0) { penalties[offHand.label] = offHand.value.Penalty; }

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
          // Languages
          if (name == "Linguistics" && response.Languages) {
            skill.extras = { languages: response.Languages.split(',') };
          }
          skill.ranks = 0
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
            for (let penalty of Object.entries(penalties)) {
              bonus -= penalty[1];
            }
          }
          // total - Size Mod
          if (name == "Stealth" || name == "Fly") {
            bonus -= this.rules.size[creature.basics.size][name.toLowerCase()];
          }
          creature.skills[name].ranks = bonus;
        }); // End Skills for each


        console.log(this.rules);
        console.log(this.$store.getters.rules);



        this.creature = creature;
        console.table("SOURCE", creature);
        this.creatureName = name
        this.monsterVisible = true;
      })
      .catch(err => { console.error(err); });



    },
    monsterClose() {
      this.monsterVisible = false;
    },


    // End Methods
  }
};
</script>

<style>
</style>
